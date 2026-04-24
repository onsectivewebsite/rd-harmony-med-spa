import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, CheckCircle2, Lock, Users, LayoutDashboard, DollarSign, Settings, Printer, Save, MessageSquare, ShieldCheck, KeyRound } from 'lucide-react';
import { SERVICES } from '../constants';
import { baseTestimonials } from '../data/testimonialData';

interface Appointment {
  id: string;
  bookingNumber?: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  type: string;
  date: string;
  time: string;
  message: string;
  status: string;
  createdAt: string;
  price?: string;
}

type AuthStep = 'password' | 'otp' | 'forgot' | 'reset';

const TOKEN_KEY = 'rd_harmony_admin_token';

function normalizeBooking(raw: any): Appointment {
  return {
    id: String(raw.id),
    bookingNumber: raw.booking_number || undefined,
    name: raw.name,
    email: raw.email,
    phone: raw.phone,
    service: raw.service,
    type: raw.service_type,
    date: raw.appointment_date,
    time: raw.appointment_time,
    message: raw.notes || '',
    status: raw.status || 'confirmed',
    createdAt: raw.created_at || new Date().toISOString(),
    price: raw.price || undefined,
  };
}

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState<string>('');
  const [authStep, setAuthStep] = useState<AuthStep>('password');
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authInfo, setAuthInfo] = useState('');
  const [loginCreds, setLoginCreds] = useState({ username: '', password: '' });
  const [otp, setOtp] = useState('');
  const [challengeId, setChallengeId] = useState<number | null>(null);
  const [emailHint, setEmailHint] = useState('');
  const [forgotUsername, setForgotUsername] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirm, setResetConfirm] = useState('');

  const [activeTab, setActiveTab] = useState<'appointments'|'clients'|'reviews'|'services'|'finances'>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [bookingsError, setBookingsError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [customPrices, setCustomPrices] = useState<Record<string, string>>({});
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const [allReviews, setAllReviews] = useState<any[]>([]);
  const [deletedReviewIds, setDeletedReviewIds] = useState<number[]>([]);

  const [allServices, setAllServices] = useState(SERVICES);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [newService, setNewService] = useState({ name: '', category: 'Treatment', price: '', duration: '', description: '' });

  const [selectedClientPhone, setSelectedClientPhone] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newAppt, setNewAppt] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    type: 'In-Clinic',
    date: '',
    time: '',
  });
  const [modalError, setModalError] = useState('');

  const loadBookings = useCallback(async (token: string) => {
    setBookingsError('');
    try {
      const res = await fetch('/api/admin-bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        sessionStorage.removeItem(TOKEN_KEY);
        setIsLoggedIn(false);
        setAuthToken('');
        return;
      }
      const data = await res.json();
      if (!data.success) {
        setBookingsError(data.message || 'Failed to load bookings');
        return;
      }
      const rows: Appointment[] = (data.bookings || []).map(normalizeBooking);
      setAppointments(rows);
    } catch {
      setBookingsError('Unable to reach the server.');
    }
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    const rt = url.searchParams.get('reset');
    if (rt) {
      setResetToken(rt);
      setAuthStep('reset');
      url.searchParams.delete('reset');
      window.history.replaceState({}, '', url.toString());
    }

    const token = sessionStorage.getItem(TOKEN_KEY);
    if (token) {
      setAuthToken(token);
      setIsLoggedIn(true);
      loadBookings(token);
    }

    setCustomPrices(JSON.parse(localStorage.getItem('rd_harmony_service_prices') || '{}'));
    const savedCustomServices = JSON.parse(localStorage.getItem('rd_harmony_custom_added_services') || '[]');
    setAllServices([...SERVICES, ...savedCustomServices]);

    const newReviews = JSON.parse(localStorage.getItem('rd_harmony_new_reviews') || '[]');
    setAllReviews([...newReviews, ...baseTestimonials]);
    setDeletedReviewIds(JSON.parse(localStorage.getItem('rd_harmony_deleted_reviews') || '[]'));
  }, [loadBookings]);

  const resetAuthMessages = () => { setAuthError(''); setAuthInfo(''); };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetAuthMessages();
    setAuthBusy(true);
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginCreds),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.message || 'Invalid credentials');
        return;
      }
      setChallengeId(data.challenge_id);
      setEmailHint(data.email_hint || '');
      setAuthStep('otp');
      setAuthInfo(`We emailed a 6-digit code to ${data.email_hint}. It expires in ${data.ttl_minutes} minutes.`);
    } catch {
      setAuthError('Unable to reach the server. Please try again.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetAuthMessages();
    setAuthBusy(true);
    try {
      const res = await fetch('/api/admin-verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challenge_id: challengeId, code: otp }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.message || 'Incorrect code');
        return;
      }
      sessionStorage.setItem(TOKEN_KEY, data.token);
      setAuthToken(data.token);
      setIsLoggedIn(true);
      setAuthStep('password');
      setLoginCreds({ username: '', password: '' });
      setOtp('');
      setChallengeId(null);
      loadBookings(data.token);
    } catch {
      setAuthError('Unable to reach the server. Please try again.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetAuthMessages();
    setAuthBusy(true);
    try {
      const res = await fetch('/api/admin-request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: forgotUsername }),
      });
      const data = await res.json();
      setAuthInfo(data.message || 'If that account exists, a reset link has been sent.');
    } catch {
      setAuthError('Unable to reach the server. Please try again.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetAuthMessages();
    if (resetPassword.length < 10) {
      setAuthError('Password must be at least 10 characters.');
      return;
    }
    if (resetPassword !== resetConfirm) {
      setAuthError('Passwords do not match.');
      return;
    }
    setAuthBusy(true);
    try {
      const res = await fetch('/api/admin-reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, password: resetPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setAuthError(data.message || 'Password reset failed.');
        return;
      }
      setAuthInfo('Password updated. You can now sign in with your new password.');
      setResetPassword(''); setResetConfirm(''); setResetToken('');
      setAuthStep('password');
    } catch {
      setAuthError('Unable to reach the server. Please try again.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSignOut = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setAuthToken('');
    setIsLoggedIn(false);
    setAppointments([]);
  };

  const handlePriceUpdate = (serviceId: string, newPrice: string) => {
    setCustomPrices({ ...customPrices, [serviceId]: newPrice });
  };

  const savePricing = () => {
    localStorage.setItem('rd_harmony_service_prices', JSON.stringify(customPrices));
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 2000);
  };

  const handleDelete = async (id: string) => {
    const prev = appointments;
    setAppointments(appointments.filter(a => a.id !== id));
    try {
      const res = await fetch(`/api/admin-bookings?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) {
        setAppointments(prev);
        setBookingsError('Could not delete that booking.');
      }
    } catch {
      setAppointments(prev);
      setBookingsError('Could not delete that booking.');
    }
  };

  const handleDeleteReview = (id: number) => {
    const updated = [...deletedReviewIds, id];
    setDeletedReviewIds(updated);
    localStorage.setItem('rd_harmony_deleted_reviews', JSON.stringify(updated));
  };

  const availableTimeSlots = useMemo(() => {
    const allSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    if (!newAppt.date) return allSlots;
    return allSlots.filter(t => !appointments.some(a => a.date === newAppt.date && a.time === t));
  }, [newAppt.date, appointments]);

  const handleCreateOffline = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');

    const chosenService = allServices.find(s => s.name === newAppt.service);
    const servicePrice = chosenService ? (customPrices[chosenService.id] || chosenService.price) : '0';

    try {
      const res = await fetch('/api/admin-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: newAppt.name,
          email: newAppt.email,
          phone: newAppt.phone,
          service: newAppt.service,
          service_type: newAppt.type,
          appointment_date: newAppt.date,
          appointment_time: newAppt.time,
          price: servicePrice,
          notes: 'Offline/Walk-in Booking',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setModalError(data.message || 'Failed to create booking.');
        return;
      }
      setShowAddModal(false);
      setNewAppt({ name: '', email: '', phone: '', service: '', type: 'In-Clinic', date: '', time: '' });
      loadBookings(authToken);
    } catch {
      setModalError('Unable to reach the server.');
    }
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    const id = 'custom-' + Date.now();
    const srv = { ...newService, id, isMobileAvailable: false };
    const savedCustomServices = JSON.parse(localStorage.getItem('rd_harmony_custom_added_services') || '[]');
    const updatedCustom = [...savedCustomServices, srv];
    localStorage.setItem('rd_harmony_custom_added_services', JSON.stringify(updatedCustom));
    setAllServices([...SERVICES, ...updatedCustom]);

    handlePriceUpdate(id, newService.price);

    setShowAddServiceModal(false);
    setNewService({ name: '', category: 'Treatment', price: '', duration: '', description: '' });
  };

  const printInvoice = (appt: Appointment) => {
    const win = window.open('', '_blank');
    if (!win) return;
    const invoiceNumber = appt.bookingNumber || `INV-${appt.id}`;
    win.document.write(`
      <html><head><title>Invoice - ${invoiceNumber}</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #1a1a1a; }
        .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); }
        h1 { color: #119C47; font-size: 32px; margin-bottom: 5px; }
        .tagline { color: #666; font-size: 14px; margin-bottom: 40px; }
        .details { margin-top: 30px; display: flex; justify-content: space-between; gap: 40px; }
        .details h3 { margin-bottom: 10px; font-size: 16px; color: #333; }
        table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; margin-top: 40px; }
        table td { padding: 12px; vertical-align: top; }
        table tr.heading td { background: #119C47; color: white; font-weight: bold; }
        table tr.item td { border-bottom: 1px solid #eee; }
        table tr.total td:nth-child(2) { border-top: 2px solid #eee; font-weight: bold; font-size: 24px; color: #119C47; }
        .footer { margin-top: 60px; text-align: center; color: #888; font-size: 12px; }
      </style>
      </head><body>
        <div class="invoice-box">
          <h1>RD Harmony Med Spa</h1>
          <div class="tagline">Premium Medical Aesthetics & Wellness</div>
          <div class="details">
            <div>
              <h3>Invoice To:</h3>
              ${appt.name}<br>
              ${appt.phone}<br>
              ${appt.email}
            </div>
            <div style="text-align: right;">
              <h3>Invoice Details:</h3>
              Invoice #: ${invoiceNumber}<br>
              Date: ${appt.date}<br>
              Time: ${appt.time}
            </div>
          </div>
          <table>
            <tr class="heading"><td>Treatment Description</td><td style="text-align: right;">Amount Paid</td></tr>
            <tr class="item"><td>${appt.service}<br><small style="color: #666">${appt.type}</small></td><td style="text-align: right;">${appt.price || '$0.00'}</td></tr>
            <tr class="total"><td></td><td style="text-align: right;">Total: ${appt.price || '$0.00'}</td></tr>
          </table>
          <div class="footer">
            Thank you for choosing RD Harmony Med Spa.<br>
            For any questions, contact us at bookings@rdharmonymedspa.com or (647) 819-1892.
          </div>
        </div>
        <script>window.print(); setTimeout(() => window.close(), 500);</script>
      </body></html>
    `);
    win.document.close();
  };

  const filteredAppointments = appointments.filter(a =>
    a.phone.includes(searchQuery) ||
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.bookingNumber || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
  const clientHistory = appointments.filter(a => a.phone === selectedClientPhone);

  const parsePrice = (priceStr?: string) => parseFloat((priceStr || '0').replace(/[^0-9.]/g, '')) || 0;

  const finances = useMemo(() => {
    const totalRev = appointments.reduce((sum, appt) => sum + parsePrice(appt.price), 0);
    const completed = appointments.filter(a => a.status === 'confirmed').length;
    return { totalRevenue: totalRev, completedAppointments: completed, averageTicket: completed ? (totalRev / completed) : 0 };
  }, [appointments]);

  const clients = useMemo(() => {
    const map = new Map();
    appointments.forEach(a => {
      if (!map.has(a.phone)) {
        map.set(a.phone, { name: a.name, phone: a.phone, email: a.email, totalSpent: 0, visits: 0, lastVisit: a.createdAt });
      }
      const c = map.get(a.phone);
      c.totalSpent += parsePrice(a.price);
      c.visits += 1;
      if (new Date(a.createdAt) > new Date(c.lastVisit)) c.lastVisit = a.createdAt;
    });
    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [appointments]);

  if (!isLoggedIn) {
    const showBanner = authInfo || authError;
    return (
      <div className="min-h-screen bg-spa-bg flex items-center justify-center px-4 pt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111111] border border-spa-border p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600">
              {authStep === 'reset' ? <KeyRound size={32} /> : authStep === 'otp' ? <ShieldCheck size={32} /> : <Lock size={32} />}
            </div>
          </div>

          <h2 className="text-3xl font-serif text-spa-ink text-center mb-2">
            {authStep === 'reset' ? 'Set a New Password' : authStep === 'otp' ? 'Two-Factor Verification' : authStep === 'forgot' ? 'Forgot Password' : 'Admin Portal'}
          </h2>
          <p className="text-center text-xs text-spa-ink/50 mb-4">
            {authStep === 'otp' && `Code sent to ${emailHint}`}
            {authStep === 'forgot' && 'Enter your username to receive a reset link.'}
            {authStep === 'reset' && 'Choose a strong password (min. 10 characters).'}
            {authStep === 'password' && 'Secured with two-step verification.'}
          </p>

          {showBanner && (
            <div className={`text-center text-xs font-bold p-3 mb-4 rounded-xl border ${authError ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
              {authError || authInfo}
            </div>
          )}

          {authStep === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-6">
              <input required type="text" placeholder="Username" autoComplete="username" className="w-full bg-[#1A1A1A] border border-spa-border rounded-2xl py-4 px-6 focus:border-emerald-500 outline-none text-spa-ink" value={loginCreds.username} onChange={e => setLoginCreds({ ...loginCreds, username: e.target.value })} />
              <input required type="password" placeholder="Password" autoComplete="current-password" className="w-full bg-[#1A1A1A] border border-spa-border rounded-2xl py-4 px-6 focus:border-emerald-500 outline-none text-spa-ink" value={loginCreds.password} onChange={e => setLoginCreds({ ...loginCreds, password: e.target.value })} />
              <button type="submit" disabled={authBusy} className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/40 text-white py-4 rounded-2xl text-xs uppercase tracking-widest font-bold">
                {authBusy ? 'Sending code…' : 'Continue'}
              </button>
              <button type="button" onClick={() => { resetAuthMessages(); setAuthStep('forgot'); }} className="w-full text-xs uppercase tracking-widest font-bold text-spa-ink/50 hover:text-emerald-400">
                Forgot password?
              </button>
            </form>
          )}

          {authStep === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-4 mt-6">
              <input required type="text" inputMode="numeric" pattern="\d{6}" maxLength={6} placeholder="123456" className="w-full bg-[#1A1A1A] border border-spa-border rounded-2xl py-4 px-6 text-center font-mono text-2xl tracking-[0.5em] focus:border-emerald-500 outline-none text-spa-ink" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} />
              <button type="submit" disabled={authBusy || otp.length !== 6} className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/40 text-white py-4 rounded-2xl text-xs uppercase tracking-widest font-bold">
                {authBusy ? 'Verifying…' : 'Verify & Sign In'}
              </button>
              <button type="button" onClick={() => { resetAuthMessages(); setAuthStep('password'); setOtp(''); setChallengeId(null); }} className="w-full text-xs uppercase tracking-widest font-bold text-spa-ink/50 hover:text-emerald-400">
                Back
              </button>
            </form>
          )}

          {authStep === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4 mt-6">
              <input required type="text" placeholder="Username" className="w-full bg-[#1A1A1A] border border-spa-border rounded-2xl py-4 px-6 focus:border-emerald-500 outline-none text-spa-ink" value={forgotUsername} onChange={e => setForgotUsername(e.target.value)} />
              <button type="submit" disabled={authBusy} className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/40 text-white py-4 rounded-2xl text-xs uppercase tracking-widest font-bold">
                {authBusy ? 'Sending…' : 'Email me a reset link'}
              </button>
              <button type="button" onClick={() => { resetAuthMessages(); setAuthStep('password'); }} className="w-full text-xs uppercase tracking-widest font-bold text-spa-ink/50 hover:text-emerald-400">
                Back to sign in
              </button>
            </form>
          )}

          {authStep === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-4 mt-6">
              <input required type="password" placeholder="New password" autoComplete="new-password" className="w-full bg-[#1A1A1A] border border-spa-border rounded-2xl py-4 px-6 focus:border-emerald-500 outline-none text-spa-ink" value={resetPassword} onChange={e => setResetPassword(e.target.value)} />
              <input required type="password" placeholder="Confirm new password" autoComplete="new-password" className="w-full bg-[#1A1A1A] border border-spa-border rounded-2xl py-4 px-6 focus:border-emerald-500 outline-none text-spa-ink" value={resetConfirm} onChange={e => setResetConfirm(e.target.value)} />
              <button type="submit" disabled={authBusy} className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/40 text-white py-4 rounded-2xl text-xs uppercase tracking-widest font-bold">
                {authBusy ? 'Updating…' : 'Update password'}
              </button>
              <button type="button" onClick={() => { resetAuthMessages(); setAuthStep('password'); setResetToken(''); setResetPassword(''); setResetConfirm(''); }} className="w-full text-xs uppercase tracking-widest font-bold text-spa-ink/50 hover:text-emerald-400">
                Back to sign in
              </button>
            </form>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-spa-bg min-h-screen pt-32 pb-20 flex">
      <div className="w-64 fixed left-0 top-24 bottom-0 bg-[#111111] border-r border-spa-border p-6 flex flex-col gap-2 z-20">
        <h3 className="text-[10px] uppercase tracking-widest font-bold text-spa-ink/40 mb-4 px-4">Menu</h3>
        <button onClick={() => setActiveTab('appointments')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'appointments' ? 'bg-emerald-900/20 text-emerald-600' : 'text-spa-ink/60 hover:bg-[#1A1A1A]'}`}><LayoutDashboard size={18} /> Appointments</button>
        <button onClick={() => setActiveTab('clients')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'clients' ? 'bg-emerald-900/20 text-emerald-600' : 'text-spa-ink/60 hover:bg-[#1A1A1A]'}`}><Users size={18} /> Client Manager</button>
        <button onClick={() => setActiveTab('finances')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'finances' ? 'bg-emerald-900/20 text-emerald-600' : 'text-spa-ink/60 hover:bg-[#1A1A1A]'}`}><DollarSign size={18} /> Cash Manager</button>
        <button onClick={() => setActiveTab('reviews')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'reviews' ? 'bg-emerald-900/20 text-emerald-600' : 'text-spa-ink/60 hover:bg-[#1A1A1A]'}`}><MessageSquare size={18} /> Review Manager</button>
        <button onClick={() => setActiveTab('services')} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === 'services' ? 'bg-emerald-900/20 text-emerald-600' : 'text-spa-ink/60 hover:bg-[#1A1A1A]'}`}><Settings size={18} /> Pricing Config</button>

        <div className="mt-auto">
          <button onClick={handleSignOut} className="w-full flex justify-center py-3 border border-spa-border rounded-xl text-xs font-bold text-spa-ink/50 hover:text-spa-ink transition-all">SIGN OUT</button>
        </div>
      </div>

      <div className="ml-64 flex-1 px-8 lg:px-12">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-serif text-spa-ink mb-2 capitalize">{activeTab.replace('-', ' ')}</h1>
            <p className="text-spa-ink/50">Manage your med-spa platform seamlessly.</p>
          </div>
          {activeTab === 'appointments' && (
             <button onClick={() => setShowAddModal(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 shadow-lg">
               <Plus size={16} /> New Booking
             </button>
          )}
        </div>

        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111111] border border-spa-border rounded-3xl shadow-xl overflow-hidden min-h-[500px]">

          {activeTab === 'appointments' && (
            <div className="p-6">
              {bookingsError && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center">{bookingsError}</div>}
              <input type="text" placeholder="Search by name, phone, or booking #..." className="w-full max-w-sm bg-[#1A1A1A] border border-spa-border rounded-xl py-3 px-4 mb-6" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead><tr className="border-b border-spa-border text-xs uppercase text-spa-ink/50">
                    <th className="pb-3 px-4">Booking #</th>
                    <th className="pb-3 px-4">Client</th>
                    <th className="pb-3 px-4">Service & Time</th>
                    <th className="pb-3 px-4">Price</th>
                    <th className="pb-3 px-4 text-right">Actions</th>
                  </tr></thead>
                  <tbody className="divide-y divide-spa-border">
                    {filteredAppointments.map(appt => (
                      <tr key={appt.id} className="hover:bg-[#1A1A1A]">
                        <td className="py-4 px-4 font-mono text-xs text-emerald-600">{appt.bookingNumber || '-'}</td>
                        <td className="py-4 px-4"><div className="font-medium text-spa-ink">{appt.name}</div><div className="text-xs text-spa-ink/40">{appt.phone}</div></td>
                        <td className="py-4 px-4"><div className="font-medium text-emerald-600">{appt.service}</div><div className="text-xs text-spa-ink/40">{appt.date} at {appt.time}</div></td>
                        <td className="py-4 px-4 font-medium">{appt.price || '-'}</td>
                        <td className="py-4 px-4 text-right">
                          <button onClick={() => handleDelete(appt.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                    {filteredAppointments.length === 0 && (
                      <tr><td colSpan={5} className="py-10 px-4 text-center text-spa-ink/40 italic">No bookings yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="p-6">
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                  <thead><tr className="border-b border-spa-border text-xs uppercase text-spa-ink/50"><th className="pb-3 px-4">Name</th><th className="pb-3 px-4">Contact</th><th className="pb-3 px-4">Visits</th><th className="pb-3 px-4">Total Value</th><th className="pb-3 px-4 text-right">History</th></tr></thead>
                  <tbody className="divide-y divide-spa-border">
                    {clients.map((c, i) => (
                      <tr key={i} className="hover:bg-[#1A1A1A]">
                        <td className="py-4 px-4 font-medium text-spa-ink">{c.name}</td>
                        <td className="py-4 px-4 text-sm text-spa-ink/60">{c.phone}<br/>{c.email}</td>
                        <td className="py-4 px-4 text-spa-ink/80">{c.visits}</td>
                        <td className="py-4 px-4 font-medium text-emerald-600">${c.totalSpent.toFixed(2)}</td>
                        <td className="py-4 px-4 text-right">
                           <button onClick={() => setSelectedClientPhone(c.phone)} className="px-4 py-2 bg-emerald-900/20 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100">View Data</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="p-6">
              <h3 className="text-xl font-serif text-spa-ink mb-6">Manage Client Reviews</h3>
              <div className="overflow-y-auto max-h-[600px] custom-scrollbar space-y-4 pr-2">
                {allReviews.filter(r => !deletedReviewIds.includes(r.id)).map((rev) => (
                  <div key={rev.id} className="border border-spa-border p-6 rounded-2xl bg-[#1A1A1A] flex justify-between gap-6 group">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold">{rev.name}</span>
                        <span className="text-xs px-2 py-1 bg-[#111111] border border-spa-border rounded-full text-spa-ink/50">{rev.service}</span>
                        <span className="text-emerald-500 font-bold ml-2">★ {rev.rating}/5</span>
                      </div>
                      <p className="text-spa-ink/80 text-sm leading-relaxed mb-2">"{rev.text}"</p>
                      <p className="text-xs text-spa-ink/40 uppercase tracking-widest font-bold">{rev.date}</p>
                    </div>
                    <button onClick={() => handleDeleteReview(rev.id)} className="h-10 w-10 shrink-0 bg-red-50 text-red-500 border border-red-100 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {allReviews.filter(r => !deletedReviewIds.includes(r.id)).length === 0 && (
                   <p className="text-spa-ink/40 italic p-4 text-center">No active reviews exist.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'finances' && (
            <div className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-emerald-600 text-white rounded-3xl p-8 shadow-xl">
                  <div className="text-emerald-100 text-sm font-bold uppercase tracking-widest mb-2">Total Revenue</div>
                  <div className="text-5xl font-serif">${finances.totalRevenue.toFixed(2)}</div>
                </div>
                <div className="border border-spa-border rounded-3xl p-8 bg-[#1A1A1A]">
                  <div className="text-spa-ink/50 text-sm font-bold uppercase tracking-widest mb-2">Completed Bookings</div>
                  <div className="text-5xl font-serif text-spa-ink">{finances.completedAppointments}</div>
                </div>
                <div className="border border-spa-border rounded-3xl p-8 bg-[#1A1A1A]">
                  <div className="text-spa-ink/50 text-sm font-bold uppercase tracking-widest mb-2">Average Ticket</div>
                  <div className="text-5xl font-serif text-spa-ink">${finances.averageTicket.toFixed(2)}</div>
                </div>
              </div>
              <h3 className="text-xl font-serif mb-6">Recent Transactions</h3>
              <div className="space-y-4">
                 {appointments.slice(0, 5).map(a => (
                   <div key={a.id} className="flex justify-between items-center p-4 border border-spa-border rounded-xl">
                     <div><div className="font-medium text-emerald-600">{a.service}</div><div className="text-xs text-spa-ink/50">{a.name} • {a.date} {a.bookingNumber ? `• ${a.bookingNumber}` : ''}</div></div>
                     <div className="font-bold text-lg">{a.price || '$0.00'}</div>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="p-8">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h3 className="text-xl font-serif text-spa-ink mb-1">Services & Pricing</h3>
                  <p className="text-spa-ink/50">Update base pricing, or add entirely new custom services to your booking engine.</p>
                </div>
                <div className="flex gap-4">
                  <button onClick={savePricing} className="bg-emerald-600 text-white hover:bg-emerald-500 px-6 py-2 rounded-xl text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 transition-all shadow-md">
                    {showSaveSuccess ? <><CheckCircle2 size={14} /> Saved!</> : <><Save size={14} /> Save Pricing</>}
                  </button>
                  <button onClick={() => setShowAddServiceModal(true)} className="bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600 hover:text-white px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 transition-all">
                    <Plus size={14} /> Add Service
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {allServices.map(s => (
                   <div key={s.id} className="border border-spa-border rounded-2xl p-6 bg-[#1A1A1A] flex justify-between items-center">
                     <div><h4 className="font-medium text-lg">{s.name}</h4><p className="text-xs text-spa-ink/40">Default: {s.price}</p></div>
                     <div className="relative w-32">
                        <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-spa-ink/40" />
                        <input
                          type="text"
                          className="w-full bg-[#111111] border border-spa-border rounded-lg py-2 pl-8 pr-3 outline-none focus:border-emerald-500 font-medium"
                          value={customPrices[s.id] || s.price}
                          onChange={(e) => handlePriceUpdate(s.id, e.target.value)}
                        />
                     </div>
                   </div>
                 ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-[#111111] p-10 rounded-3xl w-full max-w-2xl border border-spa-border">
              <h2 className="text-2xl font-serif mb-6">New Booking</h2>
              {modalError && <div className="text-red-500 mb-4 font-bold text-sm bg-red-500/10 p-3 rounded-lg">{modalError}</div>}
              <form onSubmit={handleCreateOffline} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input required placeholder="Client Name" className="border py-3 px-4 rounded-xl" value={newAppt.name} onChange={e=>setNewAppt({...newAppt, name: e.target.value})}/>
                  <input required placeholder="Phone Number" className="border py-3 px-4 rounded-xl" value={newAppt.phone} onChange={e=>setNewAppt({...newAppt, phone: e.target.value})}/>
                </div>
                <input placeholder="Email (optional)" type="email" className="border w-full py-3 px-4 rounded-xl" value={newAppt.email} onChange={e=>setNewAppt({...newAppt, email: e.target.value})} />
                <select required className="border w-full py-3 px-4 rounded-xl" value={newAppt.service} onChange={e=>setNewAppt({...newAppt, service: e.target.value})}>
                  <option value="" disabled>Select Service</option>
                  {allServices.map(s => <option key={s.id} value={s.name}>{s.name} ({customPrices[s.id]||s.price})</option>)}
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <input required type="date" className="border py-3 px-4 rounded-xl" value={newAppt.date} onChange={e=>setNewAppt({...newAppt, date: e.target.value})}/>
                  <select required className="border py-3 px-4 rounded-xl" value={newAppt.time} onChange={e=>setNewAppt({...newAppt, time: e.target.value})}>
                    <option value="" disabled>Available Slots</option>
                    {availableTimeSlots.length === 0 && <option disabled>No slots left this day</option>}
                    {availableTimeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex gap-4 pt-4">
                   <button type="button" onClick={()=>setShowAddModal(false)} className="flex-1 border py-3 rounded-xl font-bold text-spa-ink/50">Cancel</button>
                   <button type="submit" className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold">Confirm Booking</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddServiceModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-[#111111] p-10 rounded-3xl w-full max-w-xl border border-spa-border">
              <h2 className="text-2xl font-serif mb-6">Create New Service</h2>
              <form onSubmit={handleAddService} className="space-y-4">
                <input required placeholder="Service Name (e.g. Signature Facial)" className="border w-full py-3 px-4 rounded-xl" value={newService.name} onChange={e=>setNewService({...newService, name: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <input required placeholder="Base Price (e.g. $150)" className="border py-3 px-4 rounded-xl" value={newService.price} onChange={e=>setNewService({...newService, price: e.target.value})} />
                  <input required placeholder="Duration (e.g. 45 mins)" className="border py-3 px-4 rounded-xl" value={newService.duration} onChange={e=>setNewService({...newService, duration: e.target.value})} />
                </div>
                <select required className="border w-full py-3 px-4 rounded-xl" value={newService.category} onChange={e=>setNewService({...newService, category: e.target.value as any})}>
                  <option value="Treatment">Treatment</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Injection">Injection</option>
                  <option value="Skincare">Skincare</option>
                  <option value="Other">Other</option>
                </select>
                <textarea placeholder="Short Description" className="border w-full py-3 px-4 rounded-xl resize-none" rows={3} value={newService.description} onChange={e=>setNewService({...newService, description: e.target.value})} />
                <div className="flex gap-4 pt-4">
                   <button type="button" onClick={()=>setShowAddServiceModal(false)} className="flex-1 border py-3 rounded-xl font-bold text-spa-ink/50">Cancel</button>
                   <button type="submit" className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold">Save Service</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedClientPhone && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#111111] p-8 rounded-3xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
               <div className="flex justify-between items-center mb-6">
                 <div>
                   <h2 className="text-3xl font-serif">{clientHistory[0]?.name || 'Client History'}</h2>
                   <p className="text-spa-ink/50 text-sm">{selectedClientPhone}</p>
                 </div>
                 <button onClick={()=>setSelectedClientPhone(null)} className="font-bold text-spa-ink/40 hover:text-spa-ink">Close</button>
               </div>
               <div className="overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                  {clientHistory.map(appt => (
                    <div key={appt.id} className="border border-spa-border bg-[#1A1A1A] rounded-2xl p-6 flex justify-between items-center">
                       <div>
                         <h4 className="text-xl font-serif text-emerald-600 mb-1">{appt.service}</h4>
                         {appt.bookingNumber && <p className="text-[10px] font-mono text-emerald-400/80 mb-1">{appt.bookingNumber}</p>}
                         <p className="text-xs font-bold text-spa-ink/40 tracking-widest uppercase">{appt.date} • {appt.time}</p>
                         <p className="font-medium mt-2">Paid: {appt.price || 'N/A'}</p>
                       </div>
                       <button onClick={() => printInvoice(appt)} className="border border-emerald-600/30 text-emerald-600 bg-[#111111] hover:bg-emerald-900/20 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all">
                         <Printer size={14} /> Print PDF
                       </button>
                    </div>
                  ))}
               </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Admin;
