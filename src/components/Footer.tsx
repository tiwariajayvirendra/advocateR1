import React from 'react';
import { Scale, Shield, MapPin, Phone, Mail, Award, Lock, ExternalLink } from 'lucide-react';

interface FooterProps {
  profile?: import('../types').AdvocateProfile | null;
  onSelectNav: (tab: any) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ profile, onSelectNav, onOpenBooking }) => {
  const advocateName = profile?.name || 'Adv. Utkarsh Pandey';
  const chambersAddress = profile?.contact?.chambersAddress || "Chamber No. 318, Lawyers' Chambers Block, Supreme Court Complex, Bhagwan Das Road, New Delhi 110001";
  const secondaryAddress = profile?.contact?.secondaryOffice || "Lawyers' Enclave, High Court of Delhi, Sher Shah Road, New Delhi 110003";

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-850">
          
          {/* Col 1 & 2: Chambers Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-md">
                <Scale className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="font-serif text-lg font-bold text-white tracking-wide block uppercase">
                  CHAMBERS OF {advocateName}
                </span>
                <span className="text-[10px] tracking-widest uppercase text-amber-400 block -mt-0.5">
                  Advocate • Supreme Court & High Courts
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-light max-w-sm">
              Providing strategic courtroom counsel, constitutional writ representation, commercial dispute advocacy, and AI-accelerated legal analysis across Indian and appellate forums.
            </p>

            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>{profile?.barRegistration || 'Bar Council No: D/2481/2012'}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Encrypted Vault</span>
              </div>
            </div>
          </div>

          {/* Col 3: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Chambers Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectNav('home')} className="hover:text-amber-400 transition-colors">
                  Chambers Overview & Bio
                </button>
              </li>
              <li>
                <button onClick={() => onSelectNav('practice')} className="hover:text-amber-400 transition-colors">
                  Practice Areas & Disciplines
                </button>
              </li>
              <li>
                <button onClick={() => onSelectNav('works')} className="hover:text-amber-400 transition-colors text-amber-300 font-medium">
                  Landmark Works & Case Orders
                </button>
              </li>
              <li>
                <button onClick={() => onSelectNav('metrics')} className="hover:text-amber-400 transition-colors">
                  Case Resolution Statistics
                </button>
              </li>
              <li>
                <button onClick={() => onSelectNav('ai-lab')} className="hover:text-amber-400 transition-colors flex items-center gap-1 text-amber-300 font-medium">
                  <span>Gemini AI Legal Lab</span>
                  <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-400">Free</span>
                </button>
              </li>
              <li>
                <button onClick={() => onSelectNav('portal')} className="hover:text-amber-400 transition-colors">
                  Secure Client Document Vault
                </button>
              </li>
              <li>
                <button onClick={() => onSelectNav('admin-portal')} className="hover:text-amber-400 transition-colors text-amber-300 font-medium">
                  Advocate Admin Chambers
                </button>
              </li>
              <li>
                <button onClick={() => onSelectNav('testimonials')} className="hover:text-amber-400 transition-colors">
                  Verified Client Testimonials
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Chambers Offices */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Chambers Locations
            </h4>
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="font-medium text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  Supreme Court Chambers:
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed pl-5">
                  {chambersAddress}
                </p>
              </div>

              <div className="space-y-1">
                <div className="font-medium text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  High Court Chambers:
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed pl-5">
                  {secondaryAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Col 5: Contact & Emergency */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Direct Contact
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>adv.utkarsh@supremecourtlaw.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>+91 98108 54321</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={onOpenBooking}
                  className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md cursor-pointer"
                >
                  Schedule Consultation
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bar Council Compliance Disclaimer */}
        <div className="pt-8 space-y-3 text-[11px] text-slate-500 font-light leading-relaxed">
          <p className="italic">
            <strong>Statutory Disclaimer & Bar Council Compliance:</strong> As per the rules of the Bar Council of India (BCI Rule 36), advocates are not permitted to solicit work or advertise. By accessing this platform (singhanialaw.com) or using the integrated Gemini AI Legal Lab and Client Portal, the user acknowledges that they are voluntarily seeking information regarding Senior Advocate Rajeshwar V. Singhania’s legal practice solely for their own information and benefit.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-500 gap-2 border-t border-slate-900 pt-4">
            <div>
              © 2026 Chambers of Senior Advocate Rajeshwar V. Singhania. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Encrypted via TLS 1.3</span>
              <span>•</span>
              <span>MongoDB Atlas Cloud Secured</span>
              <span>•</span>
              <span>Google OAuth 2.0</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
