# OnsecBoard — Complete Product Roadmap

## Current State Audit

### BUILT & WORKING
- [x] Platform admin panel (law firm CRUD, billing, analytics, security)
- [x] Token-based account setup (72h expiry)
- [x] 2FA (Microsoft Authenticator + Email OTP fallback)
- [x] Passkey authentication
- [x] Password policy (lawyer-grade, 12+ chars)
- [x] Account lockout (5 attempts / 30 min)
- [x] Security alert emails
- [x] Password reset (token-based, 15 min)
- [x] Role-based permissions (9 roles, 20 resources)
- [x] Per-user permission overrides
- [x] Permission-aware sidebar
- [x] Package/plan management with feature flags
- [x] Basic CRM (leads, contacts, campaigns, call logs)
- [x] Appointments
- [x] Consultations
- [x] Cases management
- [x] Documents upload/management
- [x] Billing/invoices
- [x] Compliance module
- [x] Client portal (basic)
- [x] Client intake forms
- [x] Branch management
- [x] User management
- [x] Branded email templates

### NEEDS TO BE BUILT — Prioritized

## Phase 1: Core Workflow (Critical Path)

### 1.1 Law Firm Onboarding Wizard
After admin creates firm + user sets password, first login triggers setup wizard:
- Step 1: RCIC/License verification (RCIC number, license number, province, expiry)
- Step 2: Firm details (name, address, phone, email, specialty areas)
- Step 3: Branding (logo upload, choose from 50 themes OR custom colors, font selection)
- Step 4: Email config (firm's SMTP for client emails — only security emails from Onsective)
- Step 5: Tax settings (HST/GST/PST rates by province, default tax)
- Step 6: Complete → redirect to dashboard

### 1.2 Role-Specific Dashboards
Each user type sees a different dashboard:
- **Firm Admin**: Full KPIs, revenue, cases, employees, all branches
- **Branch Manager**: Branch-level KPIs, staff performance, cases in branch
- **Lawyer/Consultant**: My cases, my appointments today, pending consultations, upcoming deadlines
- **Case Manager/Filler**: My assigned files, document collection status, pending submissions, to-do list
- **Telecaller**: Call queue, lead list, follow-ups due, call stats
- **Receptionist**: Today's appointments, walk-in check-in, client search
- **Accountant**: Revenue, outstanding invoices, payment collection, tax reports

### 1.3 Client Lifecycle Workflow
```
Lead Source → CRM → Telecaller Call → Book Appointment → 
Consultation → Retain/Follow-up → File Allocation → 
Document Collection → Filing → Decision → Case Complete
```

## Phase 2: Lead & CRM Enhancements

### 2.1 Lead Sources Integration
- Facebook Ads API integration (pull leads automatically)
- Google Ads integration
- Website form leads
- Referral tracking
- Walk-in registration
- Campaign-wise lead tracking
- Auto-assign telecaller (round-robin or manual)

### 2.2 Telecaller Module
- Call queue with priority
- Lead assignment (multiple telecallers, balanced distribution)
- Call from software (Twilio VoIP integration)
- Call recording & duration tracking
- Call notes & outcomes
- Follow-up scheduler with reminders
- Past consultation history & remarks visible
- Daily/weekly call targets & KPIs

## Phase 3: Appointment & Consultation

### 3.1 Enhanced Appointments
- Paid/free appointment types
- Payment collection at booking (Stripe/PayPal)
- Auto-invoice generation with HST/tax
- Professional PDF invoice
- Virtual (Zoom integration) or in-person
- Assign to specific lawyer/consultant
- Client notification (email + portal)
- Reschedule/cancel with refund handling
- Calendar sync

### 3.2 Walk-in & Check-in System
- Receptionist check-in button
- Real-time notification to assigned lawyer/consultant
- "Ready" button for lawyer to call client in
- Queue management
- Wait time tracking

### 3.3 Consultation Flow
- View client intake data during consultation
- Search client by internal ID / phone
- Past appointment & consultation history
- Consultation notes (private + shared)
- Outcome: Retained / Follow-up / Declined
- If follow-up → back to CRM/telecaller queue
- If retained → allocate to filing department

## Phase 4: Client Intake & Portal

### 4.1 Comprehensive Intake Form
Fields: Personal info, DOB, gender, immigration status, expiry date, 
residence country, citizenship, education history, employment history, 
family details, background info, passport info, address history, 
travel history, English proficiency, French proficiency

- Shareable link with expiry
- Reactivate link button (branch manager / firm admin)
- Pre-fill from existing client data
- Save progress
- Mobile-friendly

### 4.2 Client Portal Enhancements
- Welcome email from firm's own email
- View current case status & stage
- See assigned team member
- View & download invoices
- Payment history
- Upload requested documents
- View filing status & timeline
- View appointment history
- Limited view-only access (no editing)
- Case-specific document requirements shown

## Phase 5: Filing & Document Management

### 5.1 Filing Department Workflow
- Case allocation to filler
- Document checklist per case type (admin configurable)
- Default document list by case type + custom additions
- Document collection tracking (received / pending / follow-up)
- Client follow-up reminders (to-do list with dates)
- Email client for missing documents
- Portal document upload requests
- File processing status tracking
- Submission tracking
- Decision tracking (Approved / Refused / Additional docs needed)
- If refused → book follow-up action plan

### 5.2 Case-Type Document Templates
- Admin creates document requirement lists per case type
- Work Permit: [passport, job offer, LMIA, education creds, ...]
- Study Permit: [acceptance letter, proof of funds, passport, ...]
- PR Application: [police clearance, medical, language test, ...]
- Filler can add additional docs per case
- Track completion percentage

## Phase 6: Finance & Tax

### 6.1 Tax Configuration
- Province-based tax rates (HST/GST/PST)
- Default tax rate per branch location
- Tax-inclusive / tax-exclusive pricing
- Multi-tax support

### 6.2 Professional Invoices
- PDF generation with firm branding
- Line items with tax breakdown
- Payment terms
- Partial payment tracking
- Recurring billing
- Email invoice to client
- Client portal invoice download

### 6.3 Platform Billing (Onsective)
- Per-user monthly billing
- Client capping per plan
- Usage tracking
- Auto-invoice generation
- PayPal subscription management

## Phase 7: Communication & Collaboration

### 7.1 Team Chat
- Real-time messaging (WebSocket)
- Direct messages
- Group/channel chat (per branch, per team)
- File sharing in chat
- Mention users (@user)
- Search messages

### 7.2 In-App Calling
- Twilio VoIP integration
- Click-to-call from client record
- Call recording
- Call notes auto-save
- Call log auto-creation
- No call button visible to clients (portal)

### 7.3 Notification System
- In-app notifications (bell icon)
- Email notifications (configurable per event)
- Client notifications (status updates, appointments, documents needed)
- Push notifications (future: mobile app)

## Phase 8: Analytics & KPIs

### 8.1 Employee KPIs
- Cases handled / month
- Consultation conversion rate
- Average case processing time
- Documents collected on time
- Call metrics (telecallers)
- Appointment attendance rate
- Revenue generated per employee

### 8.2 Firm Analytics
- Revenue trends
- Case type distribution
- Lead source effectiveness
- Appointment conversion rates
- Client retention rate
- Branch comparison
- Employee performance ranking

## Phase 9: Advanced Features

### 9.1 AI Features
- AI form filling (auto-populate forms from uploaded documents)
- Document OCR & data extraction
- Smart case assessment
- Deadline prediction
- Template generation

### 9.2 Time Tracking
- Per-case time logging
- Billable vs non-billable hours
- Timer widget
- Timesheet reports
- Automatic billing from time entries

### 9.3 Theme & Customization
- 50 pre-made themes (color combinations)
- Custom color picker (primary, secondary, accent)
- Font selection (10+ professional fonts)
- Logo placement
- Email template customization
- Login page branding
- Client portal branding

### 9.4 PDF Viewer & Document Tools
- In-app PDF viewer
- Annotation tools
- Document comparison
- Digital signatures
- Template-based document generation

### 9.5 Zoom Integration
- Auto-create Zoom meeting for virtual appointments
- Meeting link in appointment notification
- Join meeting button in app
- Meeting recording link

## Phase 10: Settings & Configuration

### 10.1 Per-Role Settings Pages
- Firm Admin: Full settings access
- Branch Manager: Branch settings, team settings
- Lawyer/Consultant: Personal settings, notification preferences
- Other roles: Personal settings only

### 10.2 Password & Security Settings
- Change password (with policy enforcement)
- Change email (with verification)
- 2FA management
- Passkey management
- Active sessions view
- Login history

---

## Implementation Priority

| Priority | Feature | Effort | Impact |
|----------|---------|--------|--------|
| P0 | Law firm onboarding wizard | 2 days | Critical |
| P0 | Role-specific dashboards | 2 days | Critical |
| P0 | Client lifecycle workflow | 3 days | Critical |
| P1 | Enhanced intake form | 1 day | High |
| P1 | Tax settings & invoice PDF | 1 day | High |
| P1 | Client portal enhancements | 2 days | High |
| P1 | Filing workflow & document checklists | 2 days | High |
| P2 | Telecaller module & VoIP | 2 days | Medium |
| P2 | Team chat | 3 days | Medium |
| P2 | Theme system (50 themes) | 1 day | Medium |
| P2 | Walk-in check-in system | 1 day | Medium |
| P3 | Facebook/Google Ads integration | 2 days | Medium |
| P3 | Zoom integration | 1 day | Medium |
| P3 | Time tracking | 1 day | Medium |
| P3 | AI form filling | 3 days | Medium |
| P3 | Employee KPIs | 2 days | Medium |
| P4 | PDF viewer & annotations | 2 days | Low |
| P4 | Digital signatures | 2 days | Low |
