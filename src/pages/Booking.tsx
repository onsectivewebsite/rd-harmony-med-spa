import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { SERVICES } from '../constants';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CheckCircle2 } from 'lucide-react';

const Booking = () => {
  const location = useLocation();
  const [submitted, setSubmitted] = useState(false);
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
  const [customPrices, setCustomPrices] = useState<Record<string, string>>({});
  const [allServices, setAllServices] = useState(SERVICES);

  useEffect(() => {
    const customAdded = JSON.parse(localStorage.getItem('rd_harmony_custom_added_services') || '[]');
    const combined = [...SERVICES, ...customAdded];
    setAllServices(combined);

    setCustomPrices(JSON.parse(localStorage.getItem('rd_harmony_service_prices') || '{}'));
    const state = location.state as { serviceId?: string } | null;
    if (state?.serviceId) {
      const service = combined.find(s => s.id === state.serviceId);
      if (service) {
        setFormData(prev => ({ ...prev, service: service.name }));
      }
    } else {
      const params = new URLSearchParams(location.search);
      const serviceId = params.get('service');
      if (serviceId) {
        const service = combined.find(s => s.id === serviceId);
        if (service) {
          setFormData(prev => ({ ...prev, service: service.name }));
        }
      }
    }
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Availability Check Logic (Mock)
    const existingBookings = JSON.parse(localStorage.getItem('rd_harmony_appointments') || '[]');
    const isConflict = existingBookings.some((b: any) => b.date === formData.date && b.time === formData.time);

    if (isConflict) {
      setError('Sorry, this time slot is already taken. Please choose another time.');
      return;
    }

    const chosenService = allServices.find(s => s.name === formData.service);
    const servicePrice = chosenService ? (customPrices[chosenService.id] || chosenService.price) : '0';

    // Save to LocalStorage for Admin Panel
    const newAppointment = {
      ...formData,
      id: Date.now().toString(),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      price: servicePrice
    };
    localStorage.setItem('rd_harmony_appointments', JSON.stringify([...existingBookings, newAppointment]));
    
    // Simulate Email Confirmation
    console.log(`Sending confirmation email to ${formData.email}...`);
    
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-spa-bg flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-spa-border p-12 rounded-3xl max-w-md text-center shadow-lg"
        >
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-serif text-spa-ink mb-4">Reservation Confirmed!</h2>
          <p className="text-spa-ink/50 mb-8 leading-relaxed">
            Thank you, {formData.name}. Your appointment for {formData.service} on {formData.date} at {formData.time} has been confirmed. A confirmation email has been sent to {formData.email}.
          </p>
          <button
            onClick={() => setSubmitted(false)}
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
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0">
                  <Calendar size={20} />
                </div>
                <div>
                  <h4 className="text-spa-ink font-medium mb-1">Flexible Scheduling</h4>
                  <p className="text-spa-ink/40 text-sm">Available Monday to Saturday, 9 AM - 7 PM.</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h4 className="text-spa-ink font-medium mb-1">Instant Confirmation</h4>
                  <p className="text-spa-ink/40 text-sm">Receive a text or email confirmation within minutes.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-spa-border p-8 md:p-12 rounded-[2rem] shadow-sm">
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
                      className="w-full bg-stone-50 border border-spa-border rounded-2xl py-4 pl-12 pr-4 text-spa-ink focus:outline-none focus:border-emerald-500 transition-colors"
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
                      className="w-full bg-stone-50 border border-spa-border rounded-2xl py-4 pl-12 pr-4 text-spa-ink focus:outline-none focus:border-emerald-500 transition-colors"
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
                    className="w-full bg-stone-50 border border-spa-border rounded-2xl py-4 pl-12 pr-4 text-spa-ink focus:outline-none focus:border-emerald-500 transition-colors"
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
                  className="w-full bg-stone-50 border border-spa-border rounded-2xl py-4 px-4 text-spa-ink focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                  value={formData.service}
                  onChange={e => setFormData({...formData, service: e.target.value})}
                >
                  <option value="" disabled className="bg-white">Choose a treatment</option>
                  {allServices.map(s => {
                    const price = customPrices[s.id] || s.price;
                    return (
                      <option key={s.id} value={s.name} className="bg-white">{s.name} - {price}</option>
                    );
                  })}
                </select>
              </div>

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
                      className="w-full bg-stone-50 border border-spa-border rounded-2xl py-4 pl-12 pr-4 text-spa-ink focus:outline-none focus:border-emerald-500 transition-colors"
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-spa-ink/50 font-bold ml-4">Preferred Time</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-spa-ink/20" size={16} />
                    <input
                      required
                      type="time"
                      className="w-full bg-stone-50 border border-spa-border rounded-2xl py-4 pl-12 pr-4 text-spa-ink focus:outline-none focus:border-emerald-500 transition-colors"
                      value={formData.time}
                      onChange={e => setFormData({...formData, time: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-spa-ink/50 font-bold ml-4">Additional Notes</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-6 text-spa-ink/20" size={16} />
                  <textarea
                    rows={4}
                    className="w-full bg-stone-50 border border-spa-border rounded-2xl py-4 pl-12 pr-4 text-spa-ink focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                    placeholder="Tell us about your skin goals or specify mobile location..."
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-5 rounded-2xl text-sm uppercase tracking-widest font-bold transition-all transform hover:scale-[1.02]"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
