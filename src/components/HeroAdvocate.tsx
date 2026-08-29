import React from 'react';
import { Scale, Award, ShieldCheck, Sparkles, CheckCircle2, ArrowRight, Gavel, FileCheck, Lock, ExternalLink, Calendar } from 'lucide-react';
import { AdvocateProfile, CaseMetrics } from '../types';

interface HeroAdvocateProps {
  profile: AdvocateProfile | null;
  metrics: CaseMetrics | null;
  onBookConsultation: () => void;
  onOpenAiLab: () => void;
  onOpenPortal: () => void;
}

export const HeroAdvocate: React.FC<HeroAdvocateProps> = ({
  profile,
  metrics,
  onBookConsultation,
  onOpenAiLab,
  onOpenPortal
}) => {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-800/60">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Bio & Core Credentials */}
          <div className="lg:col-span-7 space-y-6">
            {/* Judicial Accreditations */}
            <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 text-xs text-amber-300 shadow-sm">
              <span className="flex items-center gap-1 font-semibold">
                <Award className="w-4 h-4 text-amber-400" />
                Senior Advocate & Legal Counsel
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">Supreme Court of India & High Courts</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-medium">Free Tier Consultation Assessment</span>
            </div>

            {/* Headline */}
            <div className="space-y-3">
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
                Advocacy with <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">Uncompromising</span> Precision.
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-2xl">
                <strong className="text-amber-300 font-semibold">{profile?.name || "Adv. Utkarsh Pandey"}</strong> delivers master courtroom advocacy, complex commercial dispute resolution, constitutional writ litigation, and strategic arbitration. Backed by 14+ years of Supreme Court & High Court jurisprudence, verified client vault security, and legal AI intelligence.
              </p>
            </div>

            {/* Core Stats Bento Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-bold font-serif text-amber-400">
                  {metrics?.overallSuccessRate || 98.2}%
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Favorable Resolution</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-bold font-serif text-white">
                  {metrics?.totalCasesResolved || 650}+
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Matters Concluded</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-bold font-serif text-amber-300">
                  {metrics?.damagesRecoveredProtected || "₹1,490+ Cr"}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Protected & Recovered</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-bold font-serif text-white">
                  {metrics?.yearsOfPractice || 14} Yrs
                </div>
                <div className="text-xs text-slate-400 mt-0.5">Courtroom Practice</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onBookConsultation}
                className="px-6 py-3.5 text-base font-semibold rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-all transform active:scale-95 font-sans"
              >
                <Calendar className="w-5 h-5" />
                <span>Schedule Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenAiLab}
                className="px-5 py-3.5 text-sm font-semibold rounded-xl bg-slate-900 hover:bg-slate-850 text-amber-300 border border-amber-500/40 hover:border-amber-500/60 shadow-sm flex items-center gap-2 cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>AI Legal Intelligence Lab</span>
              </button>

              <button
                onClick={onOpenPortal}
                className="px-4 py-3.5 text-sm font-medium rounded-xl text-slate-300 hover:text-white hover:bg-slate-900/60 flex items-center gap-1.5 transition-colors"
              >
                <Lock className="w-4 h-4 text-slate-400" />
                <span>Client Vault</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400 pt-3 border-t border-slate-800/60">
              <span className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Attorney-Client Privileged Transmission
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Secure Encrypted Document Vault
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Zero-Fee Assessment Sandbox
              </span>
            </div>
          </div>

          {/* Right Column: Advocate Profile & Judicial Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 p-6 border border-slate-800 shadow-2xl overflow-hidden group">
              {/* Gold Accent Corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/15 to-transparent rounded-bl-full pointer-events-none"></div>

              <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-800">
                <div>
                  <span className="text-xs uppercase tracking-widest font-semibold text-amber-400">
                    Lead Litigation Counsel
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white mt-1">
                    {profile?.name || "Adv. Utkarsh Pandey"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Advocate • Supreme Court of India & High Courts
                  </p>
                </div>
                <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-amber-500/40 overflow-hidden flex-shrink-0 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80"
                    alt={profile?.name || "Adv. Utkarsh Pandey"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Court Admissions List */}
              <div className="py-4 space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Admitted Forums & Practice Roster
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-slate-950/80 border border-slate-850">
                    <span className="text-slate-200 font-medium flex items-center gap-2">
                      <Gavel className="w-3.5 h-3.5 text-amber-400" />
                      Supreme Court of India
                    </span>
                    <span className="text-emerald-400 font-semibold">Special Writs & SLP</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-slate-950/80 border border-slate-850">
                    <span className="text-slate-200 font-medium flex items-center gap-2">
                      <Scale className="w-3.5 h-3.5 text-amber-400" />
                      High Court of Delhi & Allahabad
                    </span>
                    <span className="text-emerald-400 font-semibold">Original & Appellate</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-slate-950/80 border border-slate-850">
                    <span className="text-slate-200 font-medium flex items-center gap-2">
                      <FileCheck className="w-3.5 h-3.5 text-amber-400" />
                      NCLAT & Debt Recovery Tribunals
                    </span>
                    <span className="text-emerald-400 font-semibold">IBC & Corporate Lead</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-slate-950/80 border border-slate-850">
                    <span className="text-slate-200 font-medium flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      Arbitral Tribunals & Fast-Track ADR
                    </span>
                    <span className="text-emerald-400 font-semibold">Lead Counsel</span>
                  </div>
                </div>
              </div>

              {/* Chambers Address Quick Card */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/25 text-xs text-slate-300 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    Supreme Court Chambers
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">SCBA #2184</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Chamber 318, Lawyers' Chambers Block, Supreme Court Complex, Bhagwan Das Road, New Delhi
                </p>
                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Chambers Line: +91 98108 54321</span>
                  <span className="text-amber-400 hover:underline cursor-pointer" onClick={onBookConsultation}>
                    Book Slot →
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
