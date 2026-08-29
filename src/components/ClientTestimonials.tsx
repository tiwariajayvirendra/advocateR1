import React, { useState } from 'react';
import { Star, CheckCircle2, Award, MessageSquarePlus, Quote, ThumbsUp, ShieldCheck } from 'lucide-react';
import { Testimonial } from '../types';
import { api } from '../services/api';

interface ClientTestimonialsProps {
  testimonials: Testimonial[];
  onRefresh: () => void;
  onBookConsultation: () => void;
}

export const ClientTestimonials: React.FC<ClientTestimonialsProps> = ({
  testimonials,
  onRefresh,
  onBookConsultation
}) => {
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientRole, setClientRole] = useState('');
  const [caseType, setCaseType] = useState('Commercial Dispute / M&A');
  const [rating, setRating] = useState(5);
  const [outcome, setOutcome] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !feedback || !outcome) return;
    setIsSubmitting(true);
    try {
      await api.submitTestimonial({
        clientName,
        clientRole,
        caseType,
        rating,
        outcome,
        feedback
      });
      setIsSubmitOpen(false);
      setClientName('');
      setClientRole('');
      setOutcome('');
      setFeedback('');
      onRefresh();
    } catch (err) {
      console.error('Testimonial submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-slate-950/90 border-b border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Client Outcomes & Testimonials
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Trusted by Corporate Leaders, Innovators & Litigants
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl font-light">
              Real-world accounts of crisis management, courtroom advocacy, and high-value dispute settlements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSubmitOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <MessageSquarePlus className="w-4 h-4 text-amber-400" />
              <span>Submit Case Review</span>
            </button>

            <button
              onClick={onBookConsultation}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md"
            >
              <span>Consult Counsel</span>
            </button>
          </div>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-amber-500/30 transition-all shadow-lg relative group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(test.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {test.verified && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified Outcome
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed italic">
                  "{test.feedback}"
                </p>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-850 text-xs text-amber-300 font-medium">
                  ⚖️ Outcome: <span className="text-slate-200 font-normal">{test.outcome}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="font-serif font-bold text-sm text-white">{test.clientName}</div>
                  <div className="text-[11px] text-slate-400">{test.clientRole}</div>
                </div>
                <div className="text-[10px] text-slate-500">
                  {test.date}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial Submission Modal */}
        {isSubmitOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquarePlus className="w-4 h-4 text-amber-400" />
                  Submit Verified Client Testimonial
                </h4>
                <button
                  onClick={() => setIsSubmitOpen(false)}
                  className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Your Name / Corporation</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Vikramaditya Sengupta"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Designation & Company</label>
                  <input
                    type="text"
                    value={clientRole}
                    onChange={(e) => setClientRole(e.target.value)}
                    placeholder="e.g. Chief Risk Officer, Solaris Energy"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Practice Area / Case Category</label>
                  <input
                    type="text"
                    value={caseType}
                    onChange={(e) => setCaseType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Judicial / Settlement Outcome</label>
                  <input
                    type="text"
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    placeholder="e.g. Ex-Parte Restraining Order Granted & Claim Fully Settled"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Testimonial Commentary</label>
                  <textarea
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Describe Advocate Singhania's courtroom strategy, turnaround speed, and result..."
                    className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 resize-none"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSubmitOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold"
                  >
                    {isSubmitting ? 'Posting Review...' : 'Publish Testimonial'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
