import React from 'react';
import { Scale, Shield, Lock, Sparkles, Calendar, UserCheck, CheckCircle2, Briefcase, LogIn, LogOut } from 'lucide-react';
import { UserAuth } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab?: (tab: string) => void;
  onSelectTab?: (tab: string) => void;
  profile?: import('../types').AdvocateProfile | null;
  user: UserAuth | null;
  isChambersAdmin?: boolean;
  setIsChambersAdmin?: (val: boolean) => void;
  onOpenBooking: () => void;
  onOpenAuth?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onSelectTab,
  profile,
  user,
  isChambersAdmin = false,
  setIsChambersAdmin,
  onOpenBooking,
  onOpenAuth,
  onLogout
}) => {
  const advocateName = profile?.name || 'Adv. Utkarsh Pandey';

  const handleTabClick = (tab: string) => {
    if (onSelectTab) {
      onSelectTab(tab);
    } else if (setActiveTab) {
      setActiveTab(tab);
    }
  };

  const isTabActive = (tab: string) => {
    if (activeTab === tab) return true;
    if (tab === 'overview' && activeTab === 'home') return true;
    if (tab === 'home' && activeTab === 'overview') return true;
    if (tab === 'expertise' && activeTab === 'practice') return true;
    if (tab === 'practice' && activeTab === 'expertise') return true;
    return false;
  };
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80 transition-all">
      {/* Top Compliance & Status Bar */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border-b border-amber-500/15 px-4 py-1 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-amber-300 font-medium">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              Bar Council Enrolment: D/2481/2012
            </span>
            <span className="hidden sm:inline-block text-slate-600">•</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-slate-300">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Supreme Court Bar Association (SCBA #2184)
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <span className="hidden md:inline-flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Chambers Open • Accepting Case Inquiries
            </span>
            <button
              onClick={() => setIsChambersAdmin?.(!isChambersAdmin)}
              className={`text-xs px-2.5 py-0.5 rounded border transition-colors flex items-center gap-1 font-medium ${
                isChambersAdmin
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-slate-800/90 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
              title="Toggle Advocate Chambers Administration View"
            >
              <Briefcase className="w-3 h-3 text-amber-400" />
              {isChambersAdmin ? 'Chambers Admin Active' : 'Client Mode'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <div
            onClick={() => handleTabClick('overview')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 p-0.5 shadow-lg shadow-amber-500/10 group-hover:shadow-amber-500/20 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                <Scale className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                {advocateName}
                <span className="text-[10px] uppercase font-sans tracking-widest px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Advocate
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans tracking-wide">
                Supreme Court of India & High Courts of Judicature
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => handleTabClick('overview')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isTabActive('overview')
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-850'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => handleTabClick('expertise')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isTabActive('expertise')
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-850'
              }`}
            >
              Practice Areas
            </button>
            <button
              onClick={() => handleTabClick('works')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                isTabActive('works')
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-sm shadow-amber-500/10'
                  : 'text-slate-200 hover:text-amber-300 hover:bg-slate-850'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
              <span>Legal Works & Orders</span>
            </button>
            <button
              onClick={() => handleTabClick('metrics')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isTabActive('metrics')
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-850'
              }`}
            >
              Resolution Metrics
            </button>
            <button
              onClick={() => handleTabClick('ai-lab')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                isTabActive('ai-lab')
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-sm shadow-amber-500/20'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-amber-950/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>AI Legal Lab</span>
            </button>
            <button
              onClick={() => handleTabClick('portal')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                isTabActive('portal')
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Client Vault</span>
            </button>
            <button
              onClick={() => handleTabClick('admin-portal')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'admin-portal'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/15'
                  : isChambersAdmin
                  ? 'text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Chambers</span>
            </button>
            <button
              onClick={() => handleTabClick('testimonials')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isTabActive('testimonials')
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-850'
              }`}
            >
              Testimonials
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {/* User Auth Pill or Sign In Button */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-5 h-5 rounded-full object-cover border border-emerald-500"
                  />
                  <span className="max-w-[100px] truncate font-medium text-slate-200">{user.name}</span>
                  <span className="text-[10px] px-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    OAuth 2.0
                  </span>
                </div>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-800 text-xs transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : onOpenAuth ? (
              <button
                onClick={onOpenAuth}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-medium transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span>Client Sign In</span>
              </button>
            ) : null}

            <button
              onClick={onOpenBooking}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 flex items-center gap-1.5 transition-all transform active:scale-95 cursor-pointer font-sans"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Consultation</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-800/60 no-scrollbar">
          <button
            onClick={() => handleTabClick('overview')}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded font-medium ${
              isTabActive('overview') ? 'bg-amber-500 text-slate-950' : 'text-slate-300 bg-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => handleTabClick('expertise')}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded font-medium ${
              isTabActive('expertise') ? 'bg-amber-500 text-slate-950' : 'text-slate-300 bg-slate-900'
            }`}
          >
            Practice Areas
          </button>
          <button
            onClick={() => handleTabClick('works')}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded font-medium flex items-center gap-1 ${
              isTabActive('works') ? 'bg-amber-500 text-slate-950' : 'text-amber-300 bg-slate-900'
            }`}
          >
            <Briefcase className="w-3 h-3" />
            Legal Works
          </button>
          <button
            onClick={() => handleTabClick('metrics')}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded font-medium ${
              isTabActive('metrics') ? 'bg-amber-500 text-slate-950' : 'text-slate-300 bg-slate-900'
            }`}
          >
            Resolution Metrics
          </button>
          <button
            onClick={() => handleTabClick('ai-lab')}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded font-medium flex items-center gap-1 ${
              isTabActive('ai-lab') ? 'bg-amber-500 text-slate-950' : 'text-amber-400 bg-amber-950/40'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            AI Legal Lab
          </button>
          <button
            onClick={() => handleTabClick('portal')}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded font-medium flex items-center gap-1 ${
              isTabActive('portal') ? 'bg-amber-500 text-slate-950' : 'text-slate-300 bg-slate-900'
            }`}
          >
            <Lock className="w-3 h-3" />
            Client Portal
          </button>
          <button
            onClick={() => handleTabClick('testimonials')}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded font-medium ${
              isTabActive('testimonials') ? 'bg-amber-500 text-slate-950' : 'text-slate-300 bg-slate-900'
            }`}
          >
            Testimonials
          </button>
        </div>
      </div>
    </header>
  );
};
