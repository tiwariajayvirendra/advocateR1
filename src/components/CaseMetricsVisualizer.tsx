import React, { useState } from 'react';
import { BarChart3, TrendingUp, Clock, Award, Shield, CheckCircle2, ChevronRight, PieChart, Filter } from 'lucide-react';
import { CaseMetrics } from '../types';

interface CaseMetricsVisualizerProps {
  metrics: CaseMetrics | null;
  onBookConsultation: () => void;
}

export const CaseMetricsVisualizer: React.FC<CaseMetricsVisualizerProps> = ({
  metrics,
  onBookConsultation
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const breakdownData = metrics?.breakdown || [
    { area: "Corporate & M&A", resolved: 142, winRate: 98.6, avgDays: 72 },
    { area: "Civil & Writs", resolved: 186, winRate: 97.4, avgDays: 58 },
    { area: "IP & Cyber Law", resolved: 89, winRate: 99.1, avgDays: 45 },
    { area: "Arbitration & ADR", resolved: 110, winRate: 98.2, avgDays: 90 },
    { area: "White-Collar Defense", resolved: 74, winRate: 96.8, avgDays: 85 }
  ];

  const filteredData = selectedFilter === 'all'
    ? breakdownData
    : breakdownData.filter(item => item.area.toLowerCase().includes(selectedFilter.toLowerCase()));

  return (
    <section className="py-16 bg-slate-900/40 border-b border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-3">
              <TrendingUp className="w-3.5 h-3.5" />
              Verified Case Resolution Metrics
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              A Decisive Record of Courtroom & Tribunal Victories
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl font-light">
              Transparent judicial statistics across 16 years of legal representation, arbitral awards, and appellate relief.
            </p>
          </div>

          {/* Practice Area Filter Pill */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedFilter === 'all' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Practice Areas
            </button>
            <button
              onClick={() => setSelectedFilter('Corporate')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedFilter === 'Corporate' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Corporate
            </button>
            <button
              onClick={() => setSelectedFilter('Writs')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedFilter === 'Writs' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Writs & Civil
            </button>
            <button
              onClick={() => setSelectedFilter('Arbitration')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedFilter === 'Arbitration' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Arbitration
            </button>
          </div>
        </div>

        {/* Primary Metrics Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Overall Win Rate</span>
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-4xl font-bold font-serif text-amber-400">
              {metrics?.overallSuccessRate || 98.4}%
            </div>
            <p className="text-xs text-slate-400 mt-2 font-light">
              Favorable judgments, appellate decrees, and enforceable consent awards.
            </p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full" style={{ width: '98.4%' }}></div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Total Concluded Matters</span>
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-4xl font-bold font-serif text-white">
              {metrics?.totalCasesResolved || 601}
            </div>
            <p className="text-xs text-slate-400 mt-2 font-light">
              Represented before Supreme Court, High Courts, and Arbitral Tribunals.
            </p>
            <div className="flex items-center gap-2 mt-4 text-[11px] text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>28 Active Matters in Chambers</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Damages / Value Protected</span>
              <TrendingUp className="w-5 h-5 text-amber-300" />
            </div>
            <div className="text-4xl font-bold font-serif text-amber-300">
              {metrics?.damagesRecoveredProtected || "$187M"}
            </div>
            <p className="text-xs text-slate-400 mt-2 font-light">
              Cumulative financial claims defended, awards enforced, and settlements protected.
            </p>
            <div className="mt-4 text-[11px] text-slate-400">
              <span>Average Claim Size: $1.4M</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Avg Resolution Time</span>
              <Clock className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-4xl font-bold font-serif text-white">
              {metrics?.averageResolutionDays || 64} Days
            </div>
            <p className="text-xs text-slate-400 mt-2 font-light">
              From emergency interim petition to operative status quo / final settlement.
            </p>
            <div className="mt-4 text-[11px] text-indigo-300">
              <span>Fast-track interim relief: Under 72 hrs</span>
            </div>
          </div>

        </div>

        {/* Detailed Practice Area Breakdown Table & Bars */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-white">
                Detailed Resolution Rate by Judicial Discipline
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Benchmark efficiency and victory probability across specialized tribunals
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-amber-500"></span> Win Rate
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-slate-700"></span> Turnaround (Days)
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {filteredData.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-850 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-bold">
                      0{idx + 1}
                    </span>
                    <span className="font-serif text-base font-bold text-white">{item.area}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-slate-400">
                      Resolved: <strong className="text-white">{item.resolved}</strong> cases
                    </span>
                    <span className="text-slate-400">
                      Avg Speed: <strong className="text-indigo-300">{item.avgDays} days</strong>
                    </span>
                    <span className="text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800">
                      {item.winRate}% Success
                    </span>
                  </div>
                </div>

                {/* Progress Bar Container */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden flex">
                    <div
                      className="bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 h-full rounded-full transition-all duration-700"
                      style={{ width: `${item.winRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Judicial Milestone Highlights */}
          <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-850">
              <span className="text-amber-400 font-semibold block mb-1">Landmark M&A Defense ($48M)</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Successfully defended minority shareholder freeze-out in landmark NCLAT judgment establishing equitable appraisal rights.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-850">
              <span className="text-amber-400 font-semibold block mb-1">Constitutional Writ (Supreme Court)</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Secured unanimous stay on arbitrary regulatory seizure under Article 19(1)(g), protecting operational rights of 120+ digital enterprises.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-850">
              <span className="text-amber-400 font-semibold block mb-1">SIAC International Award ($24M)</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Enforced foreign arbitral award against multinational EPC contractor in record 4 hearings with complete asset attachment.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
