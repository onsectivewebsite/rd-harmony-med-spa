import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, MessageSquare, Plus, CheckCircle2, User } from 'lucide-react';
import { baseTestimonials } from '../data/testimonialData';

const Testimonials = () => {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const newReviews = JSON.parse(localStorage.getItem('rd_harmony_new_reviews') || '[]');
    const deletedReviewIds = JSON.parse(localStorage.getItem('rd_harmony_deleted_reviews') || '[]');
    const combined = [...newReviews, ...baseTestimonials].filter(r => !deletedReviewIds.includes(r.id));
    setReviews(combined);
  }, []);

  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', text: '', rating: 5, service: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const submitPayload = { id: Date.now(), ...newReview, date: "Today", rating: Number(newReview.rating) };
    const existingNew = JSON.parse(localStorage.getItem('rd_harmony_new_reviews') || '[]');
    localStorage.setItem('rd_harmony_new_reviews', JSON.stringify([submitPayload, ...existingNew]));
    
    setReviews(prev => [submitPayload, ...prev]);

    setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
      setNewReview({ name: '', text: '', rating: 5, service: '' });
    }, 1500);
  };

  return (
    <div className="bg-spa-bg min-h-screen pt-32 pb-40 text-spa-ink">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header content section */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <div className="md:w-2/3">
             <span className="text-emerald-600 text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block">Client Success</span>
             <h1 className="text-4xl md:text-7xl font-serif text-spa-ink">Our Clinical <br /><span className="italic text-emerald-600">Transformations</span></h1>
             <p className="text-spa-ink/50 mt-6 max-w-lg text-lg leading-relaxed italic">"Our commitment to your beauty is reflected in every review. We take pride in delivering medical grade results."</p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="px-10 py-5 bg-emerald-500 text-white rounded-2xl text-[10px] uppercase tracking-[0.2em] font-black hover:bg-emerald-400 transition-all flex items-center gap-2 group whitespace-nowrap shadow-lg shadow-emerald-500/10"
          >
            <Plus size={16} /> Write Review
          </button>
        </div>

        {/* Testimonials Grid content section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((rev, i) => (
            <motion.div 
              key={rev.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-[#111111] p-10 rounded-[2.5rem] border border-spa-border relative group hover:border-emerald-500/20 transition-all shadow-sm"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform">
                <Quote size={80} className="text-emerald-600" />
              </div>
              
              <div className="flex gap-1 text-emerald-600 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < rev.rating ? "currentColor" : "none"} strokeWidth={1} />
                ))}
              </div>

              <p className="text-spa-ink/70 leading-relaxed mb-8 text-sm italic">
                "{rev.text}"
              </p>

              <div className="h-px bg-spa-border mb-8" />

              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full border border-spa-border flex items-center justify-center text-emerald-600 bg-emerald-500/5 group-hover:scale-110 transition-transform shadow-sm">
                   <User size={20} />
                </div>
                <div>
                  <h4 className="text-spa-ink font-medium text-sm">{rev.name}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-spa-ink/30 font-bold uppercase tracking-widest mt-1">
                    <span>{rev.date}</span>
                    <span className="w-1 h-1 rounded-full bg-emerald-500" />
                    <span className="text-emerald-600/60">{rev.service}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Submission Form Modal */}
        <AnimatePresence>
          {showForm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-spa-bg/80 backdrop-blur-xl">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-[#111111] border border-spa-border p-12 rounded-[2.5rem] max-w-xl w-full shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-800" />
                
                {submitted ? (
                  <div className="py-20 text-center space-y-6">
                    <motion.div 
                       initial={{ scale: 0 }} 
                       animate={{ scale: 1 }}
                        className="w-20 h-20 bg-emerald-500/5 rounded-full flex items-center justify-center text-emerald-600 mx-auto shadow-sm"
                    >
                      <CheckCircle2 size={40} />
                    </motion.div>
                     <h2 className="text-3xl font-serif text-spa-ink">Review Submitted!</h2>
                     <p className="text-spa-ink/50 text-sm">Thank you for sharing your experience. We value your feedback.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-10">
                      <div>
                         <span className="text-emerald-600 text-[10px] uppercase tracking-[0.5em] font-bold mb-2 block">Client Experience</span>
                         <h2 className="text-3xl font-serif text-spa-ink">Share Your Transformation</h2>
                      </div>
                       <button onClick={() => setShowForm(false)} className="text-spa-ink/40 hover:text-spa-ink transition-colors uppercase tracking-widest text-[10px] font-bold">Close Window</button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase tracking-widest text-spa-ink/40 font-bold ml-4">Your Name</label>
                          <input 
                            required 
                            placeholder="e.g. Mary Jane" 
                            className="w-full bg-[#1A1A1A] border border-spa-border rounded-xl px-6 py-4 text-spa-ink text-sm focus:border-emerald-500 transition-colors outline-none"
                            value={newReview.name}
                            onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase tracking-widest text-spa-ink/40 font-bold ml-4">Service Experienced</label>
                          <input 
                            required 
                            placeholder="e.g. PRP Facial" 
                            className="w-full bg-[#1A1A1A] border border-spa-border rounded-xl px-6 py-4 text-spa-ink text-sm focus:border-emerald-500 transition-colors outline-none"
                            value={newReview.service}
                            onChange={(e) => setNewReview({...newReview, service: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] uppercase tracking-widest text-spa-ink/40 font-bold ml-4">Overall Satisfaction</label>
                        <select                           className="w-full bg-[#1A1A1A] border border-spa-border rounded-xl px-6 py-4 text-spa-ink hover:text-emerald-600 text-sm focus:border-emerald-500 transition-colors outline-none appearance-none"
                          value={newReview.rating}
                          onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}
                        >
                          <option value="5">5 - Excellent Experience</option>
                          <option value="4">4 - Very Good</option>
                          <option value="3">3 - Satisfactory</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] uppercase tracking-widest text-spa-ink/40 font-bold ml-4">Tell Us About Your Results</label>
                        <textarea 
                          required 
                          rows={4} 
                          placeholder="Describe your transformation..."                           className="w-full bg-[#1A1A1A] border border-spa-border rounded-xl px-6 py-4 text-spa-ink text-sm focus:border-emerald-500 transition-colors outline-none resize-none"
                          value={newReview.text}
                          onChange={(e) => setNewReview({...newReview, text: e.target.value})}
                        />
                      </div>

                      <button 
                        type="submit"                         className="w-full py-5 bg-emerald-500 text-white rounded-xl text-[10px] uppercase tracking-[0.2em] font-black hover:bg-emerald-400 transition-all mt-4 shadow-lg shadow-emerald-500/10"
                      >
                        Publish Your Experience
                      </button>
                    </form>
                  </>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Testimonials;
