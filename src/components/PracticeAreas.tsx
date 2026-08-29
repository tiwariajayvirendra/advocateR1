import React, { useState } from 'react';
import { Briefcase, Scale, ShieldAlert, Gavel, ShieldCheck, ArrowRight, CheckCircle2, Award, Sparkles, TrendingUp } from 'lucide-react';
import { PracticeArea } from '../types';

interface PracticeAreasProps {
  specializations?: PracticeArea[];
  practiceAreas?: PracticeArea[];
  onSelectPractice?: (practice: PracticeArea) => void;
  onSelectAreaForBooking?: (areaTitle: string) => void;
  onRunAiCaseScan?: (areaTitle: string) => void;
  onBookConsultation?: () => void;
}

const iconMap: Record<string, any> = {
  Briefcase,
  Scale,
  ShieldAlert,
  Gavel,
  ShieldCheck
};

export const PracticeAreas: React.FC<PracticeAreasProps> = ({
  specializations,
  practiceAreas,
  onSelectPractice,
  onSelectAreaForBooking,
  onRunAiCaseScan,
  onBookConsultation
}) => {
  const items = specializations || practiceAreas || [];
  const [activeAreaId, setActiveAreaId] = useState<string>(items[0]?.id || 'commercial-disputes');

  const selectedArea = items.find(a => a.id === activeAreaId) || items[0] || null;

  const handleBooking = (title: string) => {
    if (onSelectAreaForBooking) {
      onSelectAreaForBooking(title);
    } else if (onBookConsultation) {
      onBookConsultation();
    }
  };

  const handleAiScan = (area: PracticeArea) => {
    if (onSelectPractice) {
      onSelectPractice(area);
    } else if (onRunAiCaseScan) {
      onRunAiCaseScan(area.title);
    }
  };

  return (
    <section className="py-16 bg-slate-950/80 border-b border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400 mb-3">
              <Award className="w-3.5 h-3.5" />
              Professional Aptitude & Practice Areas
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Specialized Legal Counsel & Representation
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl font-light">
              High-stakes advocacy spanning constitutional appellate courts, complex corporate arbitrations, and regulatory defense tribunals.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Total Practice Areas:</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300">
              {items.length} Disciplines
            </span>
          </div>
        </div>

        {/* Practice Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((area) => {
            const IconComponent = iconMap[area.icon] || Scale;
            const isSelected = area.id === activeAreaId;

            return (
              <div
                key={area.id}
                onClick={() => setActiveAreaId(area.id)}
                className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between relative group ${
                  isSelected
                    ? 'bg-slate-900/95 border-amber-500/50 shadow-xl shadow-amber-500/10'
                    : 'bg-slate-900/40 hover:bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-amber-400 group-hover:bg-slate-700'
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 justify-end">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {area.winRate}% Win Rate
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {area.casesHandled} Matters Handled
                      </div>
                    </div>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                    {area.title}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm mt-2.5 leading-relaxed font-light line-clamp-3">
                    {area.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-500">Settlements/Protected:</span>
                    <div className="font-bold text-amber-300 font-serif">{area.settlementRecovered}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAiScan(area);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium flex items-center gap-1 border border-amber-500/20"
                      title="Run Gemini AI Statutory Assessment"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      AI Scan
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBooking(area.title);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1 shadow-sm"
                    >
                      <span>Book</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Discipline Deep-Dive Banner */}
        {selectedArea && (
          <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/30 border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-amber-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Featured Focus: {selectedArea.title}
              </div>
              <h4 className="font-serif text-lg font-bold text-white">
                Need urgent legal counsel or emergency interim restraining injunction in {selectedArea.title}?
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl font-light">
                Our chambers provide 24-hour expedited motion drafting, statutory risk audits, and immediate appearances before Supreme Court and High Court vacation/regular benches.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => handleAiScan(selectedArea)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-amber-500/30 flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                Assess Viability With AI
              </button>
              <button
                onClick={() => handleBooking(selectedArea.title)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <span>Consult Senior Counsel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
