import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, ShieldCheck, Eraser } from 'lucide-react';

interface FieldDef {
  type: 'text' | 'date' | 'textarea' | 'yesno' | 'checklist' | 'note';
  key?: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  text?: string;
}

interface Template {
  id: string;
  title: string;
  intro: string;
  fields: FieldDef[];
  acknowledgment: string;
}

interface BookingInfo {
  name: string;
  email: string;
  phone: string;
  service: string;
  booking_number: string | null;
  appointment_date: string;
  appointment_time: string;
}

type AnswerValue = string | boolean | string[];

function formatDateLabel(ymd: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return ymd;
  const d = new Date(`${ymd}T00:00:00`);
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function formatTimeLabel(hm: string): string {
  const m = /^(\d{2}):(\d{2})$/.exec(hm);
  if (!m) return hm;
  const h = Number(m[1]);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m[2]} ${period}`;
}

const Consent = () => {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [fatalError, setFatalError] = useState('');
  const [template, setTemplate] = useState<Template | null>(null);
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [status, setStatus] = useState<string>('pending');
  const [filledFileUrl, setFilledFileUrl] = useState<string | null>(null);

  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    if (!token) {
      setFatalError('Missing consent token');
      setLoading(false);
      return;
    }
    fetch(`/api/consent?token=${encodeURIComponent(token)}`)
      .then(r => r.json())
      .then(d => {
        if (!d.success) throw new Error(d.message || 'This link is invalid or has expired.');
        setTemplate(d.template);
        setBooking(d.booking);
        setStatus(d.status);
        setFilledFileUrl(d.file_url ? `/api/consent?token=${encodeURIComponent(token)}&file=1` : null);
        if (d.template && d.booking) {
          setAnswers({
            full_name: d.booking.name || '',
            phone: d.booking.phone || '',
            email: d.booking.email || '',
          });
        }
      })
      .catch(e => setFatalError(e.message || 'Could not load consent form'))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const setSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = c.getBoundingClientRect();
      c.width = Math.round(rect.width * dpr);
      c.height = Math.round(rect.height * dpr);
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, rect.width, rect.height);
      }
    };
    setSize();
    window.addEventListener('resize', setSize);
    return () => window.removeEventListener('resize', setSize);
  }, [template]);

  const posFromEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    lastRef.current = posFromEvent(e);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const p = posFromEvent(e);
    const ctx = canvasRef.current!.getContext('2d');
    if (!ctx || !lastRef.current) return;
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lastRef.current.x, lastRef.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastRef.current = p;
    setHasSignature(true);
  };

  const onPointerUp = () => {
    drawingRef.current = false;
    lastRef.current = null;
  };

  const clearSignature = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const rect = c.getBoundingClientRect();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const dpr = window.devicePixelRatio || 1;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, rect.height);
    setHasSignature(false);
  };

  const handleSubmit = async () => {
    if (!template || !booking || !canvasRef.current || !token) return;
    setFormError('');

    for (const f of template.fields) {
      if (f.type === 'note' || !f.required || !f.key) continue;
      const v = answers[f.key];
      if (v == null) {
        setFormError(`Missing required field: ${f.label}`);
        return;
      }
      if (f.type === 'yesno' && typeof v !== 'boolean') {
        setFormError(`Please answer: ${f.label}`);
        return;
      }
      if (typeof v === 'string' && !v.trim()) {
        setFormError(`Missing required field: ${f.label}`);
        return;
      }
    }
    if (!hasSignature) {
      setFormError('Please sign in the signature box before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const signaturePng = canvasRef.current.toDataURL('image/png');
      const res = await fetch(`/api/consent?token=${encodeURIComponent(token)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, signature: signaturePng }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.message || 'Submission failed. Please try again.');
        setSubmitting(false);
        return;
      }
      setFilledFileUrl(data.file_url ? `/api/consent?token=${encodeURIComponent(token)}&file=1` : null);
      setDone(true);
    } catch {
      setFormError('Could not reach the server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-spa-bg flex items-center justify-center text-spa-ink/60">
        <div className="animate-pulse text-xl">Loading consent form…</div>
      </div>
    );
  }

  if (fatalError) {
    return (
      <div className="min-h-screen bg-spa-bg flex items-center justify-center px-4">
        <div className="bg-[#111111] border border-spa-border p-10 rounded-3xl max-w-md text-center">
          <h2 className="text-2xl font-serif text-spa-ink mb-3">Link Unavailable</h2>
          <p className="text-spa-ink/60">{fatalError}</p>
          <p className="text-spa-ink/40 text-sm mt-6">If you believe this is an error, please contact us.</p>
        </div>
      </div>
    );
  }

  if (status !== 'pending' || done) {
    return (
      <div className="min-h-screen bg-spa-bg flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#111111] border border-spa-border p-12 rounded-3xl max-w-md text-center"
        >
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-serif text-spa-ink mb-4">Consent Received</h2>
          <p className="text-spa-ink/60 mb-6 leading-relaxed">
            Thank you. Your consent form has been recorded and securely attached to your booking.
          </p>
          {filledFileUrl && (
            <a
              href={filledFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-emerald-500 hover:text-emerald-400 text-xs uppercase tracking-widest font-bold"
            >
              Download a copy
            </a>
          )}
        </motion.div>
      </div>
    );
  }

  if (!template || !booking) {
    return (
      <div className="min-h-screen bg-spa-bg flex items-center justify-center px-4">
        <div className="bg-[#111111] border border-spa-border p-10 rounded-3xl max-w-md text-center">
          <h2 className="text-2xl font-serif text-spa-ink mb-3">No consent required</h2>
          <p className="text-spa-ink/60">This booking does not require a consent form. We&rsquo;ll see you at your appointment.</p>
        </div>
      </div>
    );
  }

  const set = (key: string, v: AnswerValue) => setAnswers(a => ({ ...a, [key]: v }));

  return (
    <div className="bg-spa-bg min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <span className="text-emerald-600 text-[10px] uppercase tracking-[0.5em] font-bold mb-2 block">Treatment Consent</span>
          <h1 className="text-4xl md:text-5xl font-serif text-spa-ink mb-4">{template.title}</h1>
          <p className="text-spa-ink/50 text-base font-light leading-relaxed">{template.intro}</p>
        </div>

        <div className="bg-[#111111] border border-spa-border rounded-2xl p-6 mb-8 text-sm text-spa-ink/70 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          <div><span className="text-spa-ink/40 uppercase text-[10px] tracking-widest mr-2">Booking</span>{booking.booking_number || '—'}</div>
          <div><span className="text-spa-ink/40 uppercase text-[10px] tracking-widest mr-2">Service</span>{booking.service}</div>
          <div><span className="text-spa-ink/40 uppercase text-[10px] tracking-widest mr-2">Date</span>{formatDateLabel(booking.appointment_date)}</div>
          <div><span className="text-spa-ink/40 uppercase text-[10px] tracking-widest mr-2">Time</span>{formatTimeLabel(booking.appointment_time)}</div>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
          className="bg-[#111111] border border-spa-border rounded-3xl p-6 md:p-10 space-y-6"
        >
          {template.fields.map((f, idx) => {
            if (f.type === 'note') {
              return <p key={`note-${idx}`} className="text-spa-ink/50 text-sm italic">{f.text}</p>;
            }
            const k = f.key!;
            const v = answers[k];
            const labelEl = (
              <label className="text-[10px] uppercase tracking-widest text-spa-ink/50 font-bold block mb-2">
                {f.label}{f.required && <span className="text-emerald-500"> *</span>}
              </label>
            );
            if (f.type === 'text') {
              return (
                <div key={k}>
                  {labelEl}
                  <input
                    type="text"
                    placeholder={f.placeholder}
                    value={typeof v === 'string' ? v : ''}
                    onChange={e => set(k, e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-spa-border rounded-2xl py-3 px-4 text-spa-ink focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              );
            }
            if (f.type === 'date') {
              return (
                <div key={k}>
                  {labelEl}
                  <input
                    type="date"
                    value={typeof v === 'string' ? v : ''}
                    onChange={e => set(k, e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-spa-border rounded-2xl py-3 px-4 text-spa-ink focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              );
            }
            if (f.type === 'textarea') {
              return (
                <div key={k}>
                  {labelEl}
                  <textarea
                    rows={3}
                    placeholder={f.placeholder}
                    value={typeof v === 'string' ? v : ''}
                    onChange={e => set(k, e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-spa-border rounded-2xl py-3 px-4 text-spa-ink focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                  />
                </div>
              );
            }
            if (f.type === 'yesno') {
              const yes = v === true;
              const no = v === false;
              return (
                <div key={k}>
                  {labelEl}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => set(k, true)}
                      className={`py-3 rounded-2xl text-xs uppercase tracking-widest font-bold border transition-all ${yes ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-spa-border text-spa-ink/60'}`}
                    >Yes</button>
                    <button
                      type="button"
                      onClick={() => set(k, false)}
                      className={`py-3 rounded-2xl text-xs uppercase tracking-widest font-bold border transition-all ${no ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-spa-border text-spa-ink/60'}`}
                    >No</button>
                  </div>
                </div>
              );
            }
            if (f.type === 'checklist') {
              const arr: string[] = Array.isArray(v) ? v : [];
              const toggle = (opt: string) => {
                const next = arr.includes(opt) ? arr.filter(x => x !== opt) : [...arr, opt];
                set(k, next);
              };
              return (
                <div key={k}>
                  {labelEl}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(f.options || []).map(opt => {
                      const on = arr.includes(opt);
                      return (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => toggle(opt)}
                          className={`py-3 px-4 rounded-2xl text-sm border text-left transition-all ${on ? 'bg-emerald-500/15 border-emerald-500 text-emerald-200' : 'border-spa-border text-spa-ink/60'}`}
                        >
                          <span className={`inline-block w-4 h-4 rounded mr-3 align-middle border ${on ? 'bg-emerald-500 border-emerald-500' : 'border-spa-border'}`} />
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            }
            return null;
          })}

          <div className="border-t border-spa-border pt-6">
            <h3 className="text-spa-ink font-serif text-xl mb-3 flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-500" /> Acknowledgment
            </h3>
            <p className="text-spa-ink/60 text-sm leading-relaxed mb-6">{template.acknowledgment}</p>

            <label className="text-[10px] uppercase tracking-widest text-spa-ink/50 font-bold block mb-2">
              Signature <span className="text-emerald-500">*</span>
            </label>
            <div className="rounded-2xl overflow-hidden border border-spa-border">
              <canvas
                ref={canvasRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onPointerLeave={onPointerUp}
                style={{ touchAction: 'none', display: 'block', width: '100%', height: '180px', background: '#ffffff', cursor: 'crosshair' }}
              />
            </div>
            <div className="flex justify-between items-center mt-3">
              <span className="text-[10px] uppercase tracking-widest text-spa-ink/40">
                Sign with finger, stylus, or mouse
              </span>
              <button
                type="button"
                onClick={clearSignature}
                className="text-spa-ink/60 text-xs uppercase tracking-widest font-bold flex items-center gap-1 hover:text-spa-ink"
              >
                <Eraser size={14} /> Clear
              </button>
            </div>
          </div>

          {formError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-2xl text-sm">{formError}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 disabled:cursor-not-allowed text-white py-4 rounded-2xl text-sm uppercase tracking-widest font-bold transition-all"
          >
            {submitting ? 'Submitting…' : 'Sign & Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Consent;
