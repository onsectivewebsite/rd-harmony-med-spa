# Admin Content CMS — Phase 2a (Data-Safe Activation + Services CRUD) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Let the admin create/edit/delete/reorder services (plain fields + image upload) from the admin panel, backed by the DB — WITHOUT ever blanking or losing site content.

**Architecture:** A one-time, idempotent "Activate content editing" step seeds the full current content into the DB before any editing is possible, so the DB always contains the complete set (the site only switches to DB data when it has ≥1 service — already guarded in `ContentContext`). Service CRUD is added to the existing auth-gated `api/admin.ts`. Deletes are soft (`active=false`) by default. Images upload to a Vercel Blob PUBLIC store via a new admin endpoint.

**Tech Stack:** Vercel serverless (`api/*.ts`), Neon Postgres (`sql` from `api/_db.ts`), Vercel Blob (`api/_blob.ts`), React 19 + Vite, Vitest.

## Global Constraints (DATA SAFETY IS PARAMOUNT)

- **Never destructive:** no `TRUNCATE`, no `DROP`, no unconditional `DELETE`. Schema changes use `ADD COLUMN IF NOT EXISTS`. Migrations idempotent.
- **No partial content:** editing is unavailable until the DB is seeded with the full content set. The admin UI must gate CRUD behind an "Activate" (seed) action and show clear status.
- **Soft delete by default:** "Delete" sets `active=false` (service hidden from site, still in DB). A separate explicit "Permanently delete" with confirmation may hard-delete a single row.
- All admin actions reuse `requireAuth(req)` in `api/admin.ts` (401 if unauthorized).
- Image uploads: validate content-type (jpeg/png/webp) and size (≤5 MB); reject otherwise. Public Blob store, separate from the private consent store.
- Reuse `ensureContentSchema()` / row types / `seedContent()` from `api/_content.ts`.
- Frequent commits; run `npm test` + `tsc` + `vite build` before marking a task done.

---

### Task 1: Public image-upload endpoint (Vercel Blob)

**Files:**
- Modify: `api/_blob.ts` (add a public-upload helper if the existing one is private-only)
- Modify: `api/admin.ts` (add `image-upload` action)

**Interfaces:**
- Consumes: `requireAuth`, `parseBody`, existing blob client.
- Produces: `POST /api/admin?action=image-upload` with JSON `{ filename, contentType, dataBase64 }` → `{ success, url }` (public URL). Auth required.

- [ ] **Step 1: Inspect `api/_blob.ts`** to see how `uploadBytes` works and whether it sets `access: 'private'`. Determine how to request a PUBLIC blob (Vercel Blob: `put(path, bytes, { access: 'public', contentType })`). If the existing helper hardcodes private, add a new exported `uploadPublicImage(filename: string, bytes: Buffer, contentType: string): Promise<string>` that returns the public URL. Do NOT change the private consent path.

- [ ] **Step 2: Add the `image-upload` handler in `api/admin.ts`**

```ts
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
async function handleImageUpload(req: VercelRequest, res: VercelResponse) {
  if (!requireAuth(req)) return res.status(401).json({ success: false, message: 'Unauthorized' });
  const body = parseBody(req);
  const filename = typeof body.filename === 'string' ? body.filename : '';
  const contentType = typeof body.contentType === 'string' ? body.contentType : '';
  const dataBase64 = typeof body.dataBase64 === 'string' ? body.dataBase64 : '';
  if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
    return res.status(400).json({ success: false, message: 'Only JPEG, PNG, or WebP images are allowed.' });
  }
  const bytes = Buffer.from(dataBase64, 'base64');
  if (bytes.length === 0) return res.status(400).json({ success: false, message: 'Empty image.' });
  if (bytes.length > 5 * 1024 * 1024) return res.status(400).json({ success: false, message: 'Image exceeds 5 MB.' });
  const safeName = (filename || 'image').replace(/[^a-zA-Z0-9._-]/g, '_').slice(-60);
  const key = `service-images/${Date.now()}-${safeName}`;
  const url = await uploadPublicImage(key, bytes, contentType);
  return res.status(200).json({ success: true, url });
}
```
Wire `case 'image-upload': return handleImageUpload(req, res);` into the action switch. Import `uploadPublicImage` from `./_blob.js`.

- [ ] **Step 3: Typecheck** `npx tsc --noEmit --module esnext --moduleResolution bundler --target es2020 --skipLibCheck --types node api/admin.ts api/_blob.ts` → exit 0.
- [ ] **Step 4: Commit** `git commit -m "feat: add admin image-upload endpoint (public Blob)"`

Note: `Date.now()` is fine in serverless runtime (this is NOT a workflow script).

---

### Task 2: Service CRUD API (list/save/delete)

**Files:**
- Modify: `api/_content.ts` (add `listAllServices`, `upsertService`, `setServiceActive`, `deleteService`)
- Modify: `api/admin.ts` (actions `service-list`, `service-save`, `service-delete`)

**Interfaces:**
- Produces:
  - `async function listAllServices(): Promise<ServiceRow[]>` — ALL services incl. inactive, ordered by `sort_order, name`.
  - `async function upsertService(input: ServiceInput): Promise<ServiceRow>` — INSERT ... ON CONFLICT (id) DO UPDATE across all columns; `updated_at = now()`.
  - `async function setServiceActive(id: string, active: boolean): Promise<void>`.
  - `async function deleteService(id: string): Promise<void>` — hard delete of one row by id.
  - `ServiceInput` type mirroring the editable fields (id, name, category, price, duration, image, description, longDescription, benefits[], options[], etc.).
  - Admin actions: `service-list` (auth) → `{ success, services }`; `service-save` (auth, body = service) → `{ success, service }`; `service-delete` (auth, body `{ id, hard? }`) → soft by default (`setServiceActive(id,false)`), hard only when `hard === true`.

- [ ] **Step 1: Add CRUD helpers to `api/_content.ts`** (place after `seedContent`). Implement `upsertService` with the SAME column set as the seed INSERT, using `ON CONFLICT (id) DO UPDATE SET ... , updated_at = now()`. Generate a slug id from the name when the input id is empty: `id = name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')` plus a numeric suffix if it collides. Coerce array/jsonb fields with `JSON.stringify(...)::jsonb`. `deleteService` = `DELETE FROM services WHERE id = ${id}`; `setServiceActive` = `UPDATE services SET active = ${active}, updated_at = now() WHERE id = ${id}`.

- [ ] **Step 2: Add admin actions in `api/admin.ts`** — each calls `requireAuth`, returns 401 if not authed. `service-save` validates `name` non-empty; on success returns the saved row. `service-delete` reads `{ id, hard }`; default soft (`setServiceActive(id, false)`), `hard === true` → `deleteService(id)`. Wire all three into the switch.

- [ ] **Step 3: Typecheck** both files → exit 0.
- [ ] **Step 4: Commit** `git commit -m "feat: add service CRUD API (list/save/soft+hard delete)"`

---

### Task 3: Admin content-manager data layer (frontend hook)

**Files:**
- Create: `src/pages/admin/useAdminContent.ts`

**Interfaces:**
- Produces a hook `useAdminContent(token)` exposing: `seeded: boolean | null` (null=unknown), `services: Service[]`, `loading`, `error`, and async actions `activate()` (POST seed-content, then refetch), `refresh()`, `saveService(s)`, `setActive(id, active)`, `remove(id, hard)`, `uploadImage(file) => Promise<string>`. All calls send `Authorization: Bearer ${token}`.
- "seeded" is derived: after `refresh()` (GET service-list), `seeded = services.length > 0`.

- [ ] **Step 1: Implement the hook.** `uploadImage` reads the File as base64 (FileReader), POSTs to `?action=image-upload`, returns the URL. `saveService` POSTs `?action=service-save`. `refresh` GETs `?action=service-list`. `activate` POSTs `?action=seed-content` then calls `refresh`.
- [ ] **Step 2: Typecheck + build** → pass.
- [ ] **Step 3: Commit** `git commit -m "feat: add admin content-manager data hook"`

---

### Task 4: Admin "Content" tab — activation gate + services list

**Files:**
- Modify: `src/pages/Admin.tsx` (add a new "Content" tab)

- [ ] **Step 1: Add a "Content" nav tab** (`activeTab === 'content'`) alongside the existing tabs, using the existing tab styling. It uses `useAdminContent(authToken)`.
- [ ] **Step 2: Activation gate.** If `seeded === false`, render a panel: heading "Content editing is not active", body "Your site is currently showing its built-in content. Click Activate to copy all current services, offers, and products into the database so you can edit them. Nothing is lost, and this is safe to run once.", and an **Activate content editing** button (calls `activate()`, shows progress + result). If `seeded === true`, render the services list (Step 3). While `seeded === null`, show a loader.
- [ ] **Step 3: Services list.** Table/cards of all services (incl. inactive, visually dimmed with an "Hidden" badge) showing name, category, price, active toggle, Edit and Delete buttons. "Delete" triggers a confirm and calls `remove(id, false)` (soft). Provide a separate small "Permanently delete" affordance guarded by a typed confirmation that calls `remove(id, true)`.
- [ ] **Step 4: Typecheck + build** → pass.
- [ ] **Step 5: Commit** `git commit -m "feat: admin Content tab with activation gate + services list"`

---

### Task 5: Service editor form (plain fields + image upload)

**Files:**
- Create: `src/pages/admin/ServiceEditor.tsx`
- Modify: `src/pages/Admin.tsx` (open the editor from the Content tab)

- [ ] **Step 1: Build the editor** — a modal/panel with fields: name, category (select of existing categories), price, duration, short description (textarea), long description (textarea for now — WYSIWYG comes in Phase 2b), hero title/subtitle, benefits (repeater), options/tiers (repeater: name/price/duration/description), image (file input → `uploadImage`, shows preview + the returned URL), active toggle, sort order, SEO meta fields. Calls `saveService`. New service = empty id (backend generates slug).
- [ ] **Step 2: Wire create + edit** from the Content tab list.
- [ ] **Step 3: Typecheck + build** → pass.
- [ ] **Step 4: Commit** `git commit -m "feat: service editor form with image upload"`

---

### Task 6: Data-safety verification + acceptance

- [ ] **Step 1:** `npm test && npx tsc --noEmit -p tsconfig.json && npx vite build` → all pass.
- [ ] **Step 2: Manual acceptance script (document expected results in the report):**
  - Before activation: public site shows built-in content; admin Content tab shows the activation gate.
  - Click Activate → seed runs → services list appears with the full set → public site now reads DB, content unchanged.
  - Edit a service's price → save → reflected on the public Services page and detail page.
  - Soft-delete a service → hidden from public site, still listed (dimmed) in admin, recoverable via active toggle.
  - Create a new service with an uploaded image → appears on the public site.
  - Simulate empty `/api/content` (unseeded) → site still shows built-in content (guard from Phase 1 fix).
- [ ] **Step 3:** Merge to main + push. **Do NOT auto-run "Activate"/seed against production** — leave that to the user's deliberate click.

## Self-Review
- Data safety: activation gate (T4) + soft delete default (T2, T4) + non-destructive migrations (Global) + empty-DB guard (Phase 1) together ensure the site cannot be blanked or lose rows. ✓
- No placeholders; backend code shown; admin UI tasks give exact fields + actions.
- Types: `ServiceInput`/`ServiceRow` (T2) consumed by the hook (T3) and editor (T5); `uploadPublicImage` (T1) consumed by `image-upload` (T1) and the hook (T3).

## Follow-on
- **Phase 2b:** replace long-description textarea with TipTap WYSIWYG (+ sanitize on save/render via DOMPurify) and inline image upload.
- **Phase 2c:** Filerobot full photo editor in the image field.
- **Phase 3:** offers admin. **Phase 4:** products admin. **Phase 5:** review-request emails.
