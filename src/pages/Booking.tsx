import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { SERVICES } from '../constants';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CheckCircle2, ShieldCheck, CalendarPlus } from 'lucide-react';

const TIME_SLOTS: { value: string; label: string }[] = (() => {
  const slots: { value: string; label: string }[] = [];
  for (let h = 9; h <= 18; h++) {
    for (const m of [0, 30]) {
      const value = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      const period = h >= 12 ? 'PM' : 'AM';
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      slots.push({ value, label: `${hour12}:${String(m).padStart(2, '0')} ${period}` });
    }
  }
  return slots;
})();

const THREADING_UMBRELLA_VALUE = '__threading_waxing__';
const THREADING_UMBRELLA_LABEL = 'Threading & Waxing — Starting from $10';

const DEPOSIT_POLICY = {
  title: 'Booking Deposit & Cancellation Policy',
  points: [
    'A 20% deposit is required at the time of booking to secure your appointment.',
    "If you need to cancel or reschedule your appointment with less than 24 hours' notice for the first time, your deposit will be credited toward your next appointment and can be used when you reschedule.",
    "If a second appointment is cancelled or rescheduled with less than 24 hours' notice, the 20% deposit will be forfeited and is non-refundable.",
  ],
  note: 'We appreciate your understanding and cooperation, as last-minute cancellations impact our ability to accommodate other clients.',
};

const DepositPolicy = () => (
  <div className="bg-[#111111] border border-emerald-500/20 rounded-2xl p-6 text-left">
    <div className="flex items-center gap-3 mb-4">
      <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
      <h4 className="text-spa-ink font-medium text-sm">{DEPOSIT_POLICY.title}</h4>
    </div>
    <ul className="space-y-3">
      {DEPOSIT_POLICY.points.map((point, i) => (
        <li key={i} className="flex items-start gap-2 text-spa-ink/50 text-xs leading-relaxed">
          <span className="text-emerald-400 mt-0.5">&bull;</span>
          <span>{point}</span>
        </li>
      ))}
    </ul>
    <p className="text-spa-ink/40 text-xs italic leading-relaxed mt-4 pt-4 border-t border-spa-border">
      {DEPOSIT_POLICY.note}
    </p>
  </div>
);

const BIZ_ADDRESS = '78 Jones St, Oakville, ON L6L 6C5';

function parseDurationMinutes(d?: string): number {
  if (!d) return 60;
  const m = /(\d+)/.exec(d);
  return m ? Number(m[1]) : 60;
}

const pad = (n: number) => String(n).padStart(2, '0');

function toCalStamp(date: Date): string {
  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    'T' + pad(date.getHours()) + pad(date.getMinutes()) + '00'
  );
}

// Builds a prefilled Google Calendar event link (no sign-in / OAuth required).
function buildGoogleCalendarUrl(opts: {
  title: string; date: string; time: string; durationMinutes: number; details?: string; location?: string;
}): string {
  const [y, mo, d] = opts.date.split('-').map(Number);
  const [h, mi] = opts.time.split(':').map(Number);
  const start = new Date(y, mo - 1, d, h, mi);
  const end = new Date(start.getTime() + opts.durationMinutes * 60000);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: opts.title,
    dates: `${toCalStamp(start)}/${toCalStamp(end)}`,
  });
  if (opts.details) params.set('details', opts.details);
  if (opts.location) params.set('location', opts.location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

const Booking = () => {
  const location = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [bookingNumber, setBookingNumber] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    type: 'In-Clinic',
    date: '',
    time: '',
    message: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [customPrices, setCustomPrices] = useState<Record<string, string>>({});
  const [allServices, setAllServices] = useState(SERVICES);
  // Whether the umbrella "Threading & Waxing" entry has been chosen in the
  // main dropdown. Tracked separately because the actual `formData.service`
  // holds the specific sub-service (e.g. "Brazilian Waxing") that goes to the
  // backend.
  const [threadingMode, setThreadingMode] = useState(false);

  const threadingServices = React.useMemo(
    () => allServices.filter(s => s.category === 'Threading & Waxing'),
    [allServices],
  );
  const nonThreadingServices = React.useMemo(
    () => allServices.filter(s => s.category !== 'Threading & Waxing'),
    [allServices],
  );
  const isThreadingService = (name: string) =>
    threadingServices.some(s => s.name === name);

  // Flattened list of bookable entries. A service with `options` (e.g. Hydrafacial
  // tiers) expands into one entry per option; every other service stays a single
  // entry. The `value` is what gets stored in formData.service and sent to the API.
  const bookableItems = React.useMemo(() => {
    const items: { value: string; label: string; price: string; duration?: string }[] = [];
    for (const s of nonThreadingServices) {
      if (s.options && s.options.length > 0) {
        for (const opt of s.options) {
          items.push({
            value: opt.name,
            label: `${opt.name} - ${opt.price}`,
            price: opt.price,
            duration: opt.duration || s.duration,
          });
        }
      } else {
        const price = customPrices[s.id] || s.price;
        items.push({ value: s.name, label: `${s.name} - ${price}`, price, duration: s.duration });
      }
    }
    return items;
  }, [nonThreadingServices, customPrices]);

  useEffect(() => {
    const customAdded = JSON.parse(localStorage.getItem('rd_harmony_custom_added_services') || '[]');
    const combined = [...SERVICES, ...customAdded];
    setAllServices(combined);

    fetch('/api/service-prices')
      .then(r => r.json())
      .then(d => { if (d?.success && d.prices) setCustomPrices(d.prices); })
      .catch(() => {});
    const state = location.state as { serviceId?: string; optionId?: string } | null;
    let preselected: typeof combined[number] | undefined;
    let optionId: string | null = null;
    if (state?.serviceId) {
      preselected = combined.find(s => s.id === state.serviceId);
      optionId = state.optionId ?? null;
    } else {
      const params = new URLSearchParams(location.search);
      const serviceId = params.get('service');
      if (serviceId) preselected = combined.find(s => s.id === serviceId);
      optionId = params.get('option');
    }
    if (preselected) {
      if (preselected.category === 'Threading & Waxing') setThreadingMode(true);
      // For a tiered service, preselect the chosen option (or the first one).
      const opt = preselected.options
        ? (optionId && preselected.options.find(o => o.id === optionId)) || preselected.options[0]
        : undefined;
      setFormData(prev => ({ ...prev, service: opt ? opt.name : preselected!.name }));
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (threadingMode && !isThreadingService(formData.service)) {
      setError('Please choose which threading or waxing service you\'d like.');
      return;
    }

    setLoading(true);

    const chosenItem = bookableItems.find(i => i.value === formData.service);
    let servicePrice = '0';
    let durationStr: string | undefined;
    if (chosenItem) {
      servicePrice = chosenItem.price;
      durationStr = chosenItem.duration;
    } else {
      const chosenService = allServices.find(s => s.name === formData.service);
      servicePrice = chosenService ? (customPrices[chosenService.id] || chosenService.price) : '0';
      durationStr = chosenService?.duration;
    }
    const durationMinutes = parseDurationMinutes(durationStr);

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, price: servicePrice, durationMinutes }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.message || 'Failed to book appointment. Please try again.');
        setLoading(false);
        return;
      }

      setBookingNumber(result.booking_number || '');
      setSubmitted(true);
    } catch {
      setError('Unable to connect to the server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    const selectedItem = bookableItems.find(i => i.value === formData.service);
    const selectedService = allServices.find(s => s.name === formData.service);
    const durationMinutes = parseDurationMinutes(selectedItem?.duration || selectedService?.duration);
    const calendarUrl = buildGoogleCalendarUrl({
      title: `${formData.service} — RD Harmony Med Spa`,
      date: formData.date,
      time: formData.time,
      durationMinutes,
      details: `Your ${formData.service} appointment at RD Harmony Med Spa.${bookingNumber ? ` Booking #${bookingNumber}.` : ''}`,
      location: BIZ_ADDRESS,
    });
    return (
      <div className="min-h-screen bg-spa-bg flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#111111] border border-spa-border p-12 rounded-3xl max-w-md text-center shadow-lg"
        >
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-serif text-spa-ink mb-4">Reservation Confirmed!</h2>
          {bookingNumber && (
            <div className="mb-6 inline-block px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs uppercase tracking-widest font-bold">
              Booking # {bookingNumber}
            </div>
          )}
          <p className="text-spa-ink/50 mb-8 leading-relaxed">
            Thank you, {formData.name}. Your appointment for {formData.service} on {formData.date} at {formData.time} has been confirmed. A confirmation email has been sent to {formData.email}.
          </p>
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl text-xs uppercase tracking-widest font-bold transition-all mb-8"
          >
            <CalendarPlus size={16} /> Add to Google Calendar
          </a>
          <div className="mb-8">
            <DepositPolicy />
          </div>
          <button
            onClick={() => { setSubmitted(false); setBookingNumber(''); }}
            className="text-emerald-600 text-xs uppercase tracking-widest font-bold hover:text-spa-ink transition-colors"
          >
            Book another service
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-spa-bg min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div>
            <span className="text-emerald-600 text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block">Reservation</span>
            <h1 className="text-5xl md:text-7xl font-serif text-spa-ink mb-8">Book Your <br /><span className="italic text-emerald-600">Experience</span></h1>
            <p className="text-spa-ink/50 text-lg font-light leading-relaxed mb-12">
              Select your desired treatment and preferred time. For mobile services, please specify your location in the notes.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-[#111111]/5 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0">
                  <Calendar size={20} />
                </div>
                <div>
                  <h4 className="text-spa-ink font-medium mb-1">Flexible Scheduling</h4>
                  <p className="text-spa-ink/40 text-sm">Available Mon - Fri 10 AM - 7 PM, Sat &amp; Sun 9 AM - 4 PM.</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-[#111111] rounded-2xl flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className="text-spa-ink font-medium mb-1">Instant Confirmation</h4>
                  <p className="text-spa-ink/40 text-sm">Receive a text or email confirmation within minutes.</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <DepositPolicy />
            </div>
          </div>

          <div className="bg-[#111111] border border-spa-border p-8 md:p-12 rounded-[2rem] shadow-sm">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl mb-6 text-xs uppercase tracking-widest font-bold text-center">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-spa-ink/50 font-bold ml-4">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-spa-ink/20" size={16} />
                    <input
                      required
                      type="text"
                      className="w-full bg-[#1A1A1A] border border-spa-border rounded-2xl py-4 pl-12 pr-4 text-spa-ink focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-spa-ink/50 font-bold ml-4">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-spa-ink/20" size={16} />
                    <input
                      required
                      type="tel"
                      className="w-full bg-[#1A1A1A] border border-spa-border rounded-2xl py-4 pl-12 pr-4 text-spa-ink focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="(905) 000-0000"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-spa-ink/50 font-bold ml-4">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-spa-ink/20" size={16} />
                  <input
                    required
                    type="email"
                    className="w-full bg-[#1A1A1A] border border-spa-border rounded-2xl py-4 pl-12 pr-4 text-spa-ink focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-spa-ink/50 font-bold ml-4">Select Service</label>
                <select
                  required
                  className="w-full bg-[#1A1A1A] border border-spa-border rounded-2xl py-4 px-4 text-spa-ink focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                  value={threadingMode ? THREADING_UMBRELLA_VALUE : formData.service}
                  onChange={e => {
                    const v = e.target.value;
                    if (v === THREADING_UMBRELLA_VALUE) {
                      setThreadingMode(true);
                      setFormData(prev => ({ ...prev, service: '' }));
                    } else {
                      setThreadingMode(false);
                      setFormData(prev => ({ ...prev, service: v }));
                    }
                  }}
                >
                  <option value="" disabled className="bg-[#111111]">Choose a treatment</option>
                  {bookableItems.map(item => (
                    <option key={item.value} value={item.value} className="bg-[#111111]">{item.label}</option>
                  ))}
                  {threadingServices.length > 0 && (
                    <option value={THREADING_UMBRELLA_VALUE} className="bg-[#111111]">{THREADING_UMBRELLA_LABEL}</option>
                  )}
                </select>
              </div>

              {threadingMode && (
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-spa-ink/50 font-bold ml-4">Choose Threading or Waxing Area</label>
                  <select
                    required
                    className="w-full bg-[#1A1A1A] border border-spa-border rounded-2xl py-4 px-4 text-spa-ink focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                    value={isThreadingService(formData.service) ? formData.service : ''}
                    onChange={e => setFormData(prev => ({ ...prev, service: e.target.value }))}
                  >
                    <option value="" disabled className="bg-[#111111]">Pick an area</option>
                    {threadingServices.map(s => {
                      const price = customPrices[s.id] || s.price;
                      return (
                        <option key={s.id} value={s.name} className="bg-[#111111]">{s.name} - {price}</option>
                      );
                    })}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'In-Clinic'})}
                  className={`py-4 rounded-2xl text-xs uppercase tracking-widest font-bold border transition-all ${
                    formData.type === 'In-Clinic' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-spa-border text-spa-ink/50'
                  }`}
                >
                  In-Clinic
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'Mobile'})}
                  className={`py-4 rounded-2xl text-xs uppercase tracking-widest font-bold border transition-all ${
                    formData.type === 'Mobile' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-spa-border text-spa-ink/50'
                  }`}
                >
                  Mobile
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-spa-ink/50 font-bold ml-4">Preferred Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-spa-ink/20" size={16} />
                    <input
                      required
                      type="date"
                      className="w-full bg-[#1A1A1A] border border-spa-border rounded-2xl py-4 pl-12 pr-4 text-spa-ink focus:outline-none focus:border-emerald-500 transition-colors"
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-spa-ink/50 font-bold ml-4">Preferred Time</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-spa-ink/20 pointer-events-none" size={16} />
                    <select
                      required
                      className="w-full bg-[#1A1A1A] border border-spa-border rounded-2xl py-4 pl-12 pr-4 text-spa-ink focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                      value={formData.time}
                      onChange={e => setFormData({...formData, time: e.target.value})}
                    >
                      <option value="" disabled className="bg-[#111111]">Choose a time</option>
                      {TIME_SLOTS.map(slot => (
                        <option key={slot.value} value={slot.value} className="bg-[#111111]">{slot.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-spa-ink/50 font-bold ml-4">Additional Notes</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-6 text-spa-ink/20" size={16} />
                  <textarea
                    rows={4}
                    className="w-full bg-[#1A1A1A] border border-spa-border rounded-2xl py-4 pl-12 pr-4 text-spa-ink focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                    placeholder="Tell us about your skin goals or specify mobile location..."
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 disabled:cursor-not-allowed text-white py-5 rounded-2xl text-sm uppercase tracking-widest font-bold transition-all transform hover:scale-[1.02] disabled:hover:scale-100"
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
