import React, { useState } from 'react';
import {
  Building,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  Video,
  CheckCircle2,
  AlertCircle,
  FileText,
  Plus,
  Trash2,
  Edit3,
  Image as ImageIcon,
  Upload,
  Save,
  Shield,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  Award,
  BookOpen
} from 'lucide-react';
import { AdvocateProfile, ConsultationBooking, AdvocateWork } from '../types';
import { api } from '../services/api';

interface AdminChambersPortalProps {
  profile: AdvocateProfile | null;
  consultations: ConsultationBooking[];
  works: AdvocateWork[];
  onUpdateProfile: (newProfile: AdvocateProfile) => void;
  onUpdateConsultations: (consultations: ConsultationBooking[]) => void;
  onUpdateWorks: (works: AdvocateWork[]) => void;
  onClose?: () => void;
}

export const AdminChambersPortal: React.FC<AdminChambersPortalProps> = ({
  profile,
  consultations,
  works,
  onUpdateProfile,
  onUpdateConsultations,
  onUpdateWorks,
  onClose
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'consultations' | 'profile-editor' | 'thoughts-manager'>('consultations');

  // Status Filter for Consultations
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Editable Profile State
  const [editProfile, setEditProfile] = useState<Partial<AdvocateProfile>>({
    name: profile?.name || 'Adv. Utkarsh Pandey',
    title: profile?.title || 'Advocate • Supreme Court of India & High Courts',
    firm: profile?.firm || 'Chambers of Adv. Utkarsh Pandey & Legal Counsel',
    barRegistration: profile?.barRegistration || 'D/2481/2012 • Supreme Court Bar Association (SCBA #2184)',
    experienceYears: profile?.experienceYears || 14,
    consultationFee: profile?.consultationFee || 0,
    currency: profile?.currency || 'INR',
    bio: profile?.bio || '',
    contact: {
      email: profile?.contact?.email || 'adv.utkarsh.pandey.chambers@gmail.com',
      phone: profile?.contact?.phone || '+91 98108 54321',
      chambersAddress: profile?.contact?.chambersAddress || 'Chamber No. 318, Lawyers\' Chambers Block, Supreme Court Complex, Bhagwan Das Road, New Delhi 110001',
      secondaryOffice: profile?.contact?.secondaryOffice || 'Lawyers\' Enclave, High Court of Delhi, Sher Shah Road, New Delhi 110003'
    }
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Thoughts / Works Manager State
  const [editingWorkId, setEditingWorkId] = useState<string | null>(null);
  const [isCreatingWork, setIsCreatingWork] = useState(false);

  // New / Edit Work Form
  const [workTitle, setWorkTitle] = useState('');
  const [workCategory, setWorkCategory] = useState('Supreme Court Judgment');
  const [workCourt, setWorkCourt] = useState('Supreme Court of India');
  const [workCitation, setWorkCitation] = useState('');
  const [workKeyRuling, setWorkKeyRuling] = useState('');
  const [workSynopsis, setWorkSynopsis] = useState('');
  const [workFullContent, setWorkFullContent] = useState('');
  const [workTags, setWorkTags] = useState('Constitutional Law, SLP');
  const [workImages, setWorkImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Word count calculation for 2000 words limit
  const countWords = (str: string) => {
    return str.trim() ? str.trim().split(/\s+/).length : 0;
  };
  const currentWordCount = countWords(workFullContent);
  const isWordLimitExceeded = currentWordCount > 2000;

  // Handle Consultation Status Update
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/consultations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updated = consultations.map(c => c.id === id ? { ...c, status: newStatus as any } : c);
        onUpdateConsultations(updated);
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  // Handle Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const updated = await api.updateProfile(editProfile as any);
      onUpdateProfile(updated);
      setProfileSaveSuccess(true);
      setTimeout(() => setProfileSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle Image Add to Thought / Work (Up to 10 images)
  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    if (workImages.length >= 10) {
      alert('Maximum 10 images allowed per thought / post.');
      return;
    }
    setWorkImages([...workImages, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  // Handle Image Remove
  const handleRemoveImage = (index: number) => {
    setWorkImages(workImages.filter((_, i) => i !== index));
  };

  // Start Edit Existing Work
  const handleStartEditWork = (work: AdvocateWork) => {
    setEditingWorkId(work.id);
    setIsCreatingWork(true);
    setWorkTitle(work.title);
    setWorkCategory(work.category);
    setWorkCourt(work.court);
    setWorkCitation(work.citationOrMatter);
    setWorkKeyRuling(work.keyRuling);
    setWorkSynopsis(work.synopsis);
    setWorkFullContent(work.fullContent || '');
    setWorkTags(work.tags?.join(', ') || '');
    setWorkImages(work.images || []);
  };

  // Reset Work Form
  const resetWorkForm = () => {
    setEditingWorkId(null);
    setIsCreatingWork(false);
    setWorkTitle('');
    setWorkCategory('Supreme Court Judgment');
    setWorkCourt('Supreme Court of India');
    setWorkCitation('');
    setWorkKeyRuling('');
    setWorkSynopsis('');
    setWorkFullContent('');
    setWorkTags('Constitutional Law, SLP');
    setWorkImages([]);
    setNewImageUrl('');
  };

  // Submit Work (Create or Edit)
  const handleSubmitWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isWordLimitExceeded) {
      alert('Content exceeds the 2,000 words restriction. Please condense your thoughts.');
      return;
    }
    if (workImages.length > 10) {
      alert('Maximum 10 images permitted.');
      return;
    }

    const payload: Partial<AdvocateWork> = {
      title: workTitle,
      category: workCategory,
      court: workCourt,
      citationOrMatter: workCitation,
      keyRuling: workKeyRuling,
      synopsis: workSynopsis,
      fullContent: workFullContent,
      tags: workTags.split(',').map(t => t.trim()).filter(Boolean),
      images: workImages,
      publishedBy: profile?.name || 'Adv. Utkarsh Pandey'
    };

    try {
      if (editingWorkId) {
        await api.updateWork(editingWorkId, payload);
      } else {
        await api.submitWork(payload);
      }
      const updatedWorks = await api.getWorks();
      onUpdateWorks(updatedWorks);
      resetWorkForm();
    } catch (err) {
      console.error('Failed to submit thought/work:', err);
    }
  };

  // Handle Delete Work
  const handleDeleteWork = async (id: string) => {
    if (!confirm('Are you sure you want to permanently remove this thought/judgment?')) return;
    try {
      await api.deleteWork(id);
      const updatedWorks = await api.getWorks();
      onUpdateWorks(updatedWorks);
    } catch (err) {
      console.error('Failed to delete work', err);
    }
  };

  // Filter Consultations
  const filteredConsultations = consultations.filter(c => {
    const matchesStatus = statusFilter === 'all' || c.status.toLowerCase().includes(statusFilter.toLowerCase());
    const matchesSearch =
      c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.practiceArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.clientPhone && c.clientPhone.includes(searchTerm));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>Advocate Chambers Administration Portal</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-white tracking-tight">
            Chambers Control & Practice Management
          </h2>
          <p className="text-slate-400 text-xs max-w-2xl">
            Review client consultation requests, update website naming, bio & chamber addresses, and publish legal thoughts & court rulings with infinite scroll support.
          </p>
        </div>

        {/* Quick Nav Tabs */}
        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <button
            onClick={() => setActiveAdminTab('consultations')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeAdminTab === 'consultations'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/15'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Consultation Requests ({consultations.length})</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('profile-editor')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeAdminTab === 'profile-editor'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/15'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Website & Profile</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('thoughts-manager')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeAdminTab === 'thoughts-manager'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/15'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Thoughts & Case Showcase ({works.length})</span>
          </button>
        </div>
      </div>

      {/* --- TAB 1: CONSULTATION REQUESTS --- */}
      {activeAdminTab === 'consultations' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by client name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              {['all', 'confirmed', 'pending review', 'completed', 'rescheduled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap capitalize transition-colors ${
                    statusFilter === st
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Consultations List */}
          <div className="space-y-4">
            {filteredConsultations.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800">
                <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-slate-300">No consultation requests found</h4>
                <p className="text-xs text-slate-500">Incoming bookings from clients will appear here automatically.</p>
              </div>
            ) : (
              filteredConsultations.map((cons) => (
                <div
                  key={cons.id}
                  className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-lg"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-serif text-lg font-bold text-white">{cons.clientName}</h3>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            cons.status === 'Confirmed'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : cons.status === 'Completed'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                              : cons.status === 'Rescheduled'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {cons.status}
                        </span>
                        <span className="text-xs text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {cons.practiceArea}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Booked on {new Date(cons.createdAt).toLocaleDateString()} • Fee:{' '}
                        <strong className="text-white">
                          {cons.fee === 0 ? 'Complimentary Assessment' : `₹${cons.fee}`}
                        </strong>
                      </p>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {cons.status !== 'Confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(cons.id, 'Confirmed')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold"
                        >
                          ✓ Confirm
                        </button>
                      )}
                      {cons.status !== 'Completed' && (
                        <button
                          onClick={() => handleUpdateStatus(cons.id, 'Completed')}
                          className="px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-xs font-semibold"
                        >
                          Mark Completed
                        </button>
                      )}
                      {cons.status !== 'Rescheduled' && (
                        <button
                          onClick={() => handleUpdateStatus(cons.id, 'Rescheduled')}
                          className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-semibold"
                        >
                          Reschedule
                        </button>
                      )}
                      {cons.meetLink && (
                        <a
                          href={cons.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/10"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Join Video Room</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Client Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-850">
                    <div className="space-y-1">
                      <span className="text-slate-500 block">Contact Email</span>
                      <a href={`mailto:${cons.clientEmail}`} className="text-slate-200 hover:text-amber-400 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-500" />
                        <span className="truncate">{cons.clientEmail}</span>
                      </a>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-500 block">Mobile Phone</span>
                      <a href={`tel:${cons.clientPhone}`} className="text-slate-200 hover:text-amber-400 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>{cons.clientPhone}</span>
                      </a>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-500 block">Schedule Date & Slot</span>
                      <span className="text-amber-300 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{cons.date} at {cons.timeSlot}</span>
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-500 block">Client Demographics</span>
                      <span className="text-slate-300">
                        {cons.clientAge ? `${cons.clientAge} yrs • ` : ''}
                        {cons.clientGender || 'Individual'}
                        {cons.clientCity ? ` • ${cons.clientCity}, ${cons.clientState || ''}` : ''}
                      </span>
                    </div>
                  </div>

                  {/* Matter Brief */}
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 font-semibold block">Case Facts & Matter Brief:</span>
                    <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                      {cons.matterBrief || 'No preliminary facts provided. Initial discussion required.'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* --- TAB 2: PROFILE & WEBSITE INFORMATION EDITOR --- */}
      {activeAdminTab === 'profile-editor' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-white">Chambers & Website Information</h3>
                <p className="text-xs text-slate-400">
                  Editing these details will dynamically update the Advocate Name, Hero branding, Footer, and Chamber addresses across the website.
                </p>
              </div>
              {profileSaveSuccess && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/40">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Profile Updated Live!</span>
                </div>
              )}
            </div>

            {/* Advocate Name & Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Advocate Full Name (Website Title)</label>
                <input
                  type="text"
                  required
                  value={editProfile.name}
                  onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Official Legal Designation & Courts</label>
                <input
                  type="text"
                  required
                  value={editProfile.title}
                  onChange={(e) => setEditProfile({ ...editProfile, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Law Firm / Chambers Name & Bar Enrolment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Chambers / Firm Name</label>
                <input
                  type="text"
                  required
                  value={editProfile.firm}
                  onChange={(e) => setEditProfile({ ...editProfile, firm: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Bar Council Enrolment & SCBA No.</label>
                <input
                  type="text"
                  value={editProfile.barRegistration}
                  onChange={(e) => setEditProfile({ ...editProfile, barRegistration: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Chambers Phone Numbers</label>
                <input
                  type="text"
                  value={editProfile.contact?.phone}
                  onChange={(e) =>
                    setEditProfile({
                      ...editProfile,
                      contact: { ...editProfile.contact!, phone: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Official Inquiries Email</label>
                <input
                  type="email"
                  value={editProfile.contact?.email}
                  onChange={(e) =>
                    setEditProfile({
                      ...editProfile,
                      contact: { ...editProfile.contact!, email: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Supreme Court Chamber Address */}
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Primary Supreme Court Chamber Address</label>
              <textarea
                rows={2}
                value={editProfile.contact?.chambersAddress}
                onChange={(e) =>
                  setEditProfile({
                    ...editProfile,
                    contact: { ...editProfile.contact!, chambersAddress: e.target.value }
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* High Court / Secondary Address */}
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">High Court / Secondary Office Address</label>
              <textarea
                rows={2}
                value={editProfile.contact?.secondaryOffice}
                onChange={(e) =>
                  setEditProfile({
                    ...editProfile,
                    contact: { ...editProfile.contact!, secondaryOffice: e.target.value }
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Strategic Bio */}
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Advocate Biography & Practice Philosophy</label>
              <textarea
                rows={4}
                value={editProfile.bio}
                onChange={(e) => setEditProfile({ ...editProfile, bio: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSavingProfile ? 'Saving Changes...' : 'Save & Publish Website Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* --- TAB 3: THOUGHTS, ARTICLES & CASE SHOWCASE MANAGER --- */}
      {activeAdminTab === 'thoughts-manager' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-white">Legal Thoughts & Case Showcase Repository</h3>
              <p className="text-xs text-slate-400">
                Publish articles and landmark court orders with up to 2,000 words text and up to 10 images.
              </p>
            </div>
            {!isCreatingWork && (
              <button
                onClick={() => setIsCreatingWork(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/10"
              >
                <Plus className="w-4 h-4" />
                <span>Post New Thought / Case Study</span>
              </button>
            )}
          </div>

          {/* Form for Creating / Editing Work */}
          {isCreatingWork && (
            <form onSubmit={handleSubmitWork} className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h4 className="font-serif text-lg font-bold text-amber-300">
                  {editingWorkId ? 'Edit Thought / Case Study' : 'Compose New Legal Thought & Ruling'}
                </h4>
                <button
                  type="button"
                  onClick={resetWorkForm}
                  className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Critical Analysis on IBC Insolvency Stay Relief"
                    value={workTitle}
                    onChange={(e) => setWorkTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Category</label>
                  <select
                    value={workCategory}
                    onChange={(e) => setWorkCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Supreme Court Judgment">Supreme Court Judgment</option>
                    <option value="High Court Order">High Court Order</option>
                    <option value="Arbitral Award">Arbitral Award</option>
                    <option value="Legal Thought & Commentary">Legal Thought & Commentary</option>
                    <option value="Statutory Analysis">Statutory Analysis</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Court / Forum Seat</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Supreme Court of India / Delhi High Court"
                    value={workCourt}
                    onChange={(e) => setWorkCourt(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Case Citation / Matter Reference</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SLP (C) No. 14280/2025 • 2025 SCC OnLine SC 4182"
                    value={workCitation}
                    onChange={(e) => setWorkCitation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Key Ratio Decidendi / Core Ruling (1-2 sentences)</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Key principle of law established or defended in the courtroom..."
                  value={workKeyRuling}
                  onChange={(e) => setWorkKeyRuling(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Brief Synopsis</label>
                <textarea
                  rows={2}
                  placeholder="Executive summary of facts and legal advocacy..."
                  value={workSynopsis}
                  onChange={(e) => setWorkSynopsis(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Full Content with 2000 Word Counter */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-slate-300 font-medium">
                    Full Legal Content / Pleading Text / Comprehensive Thought
                  </label>
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded ${
                      isWordLimitExceeded
                        ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40'
                        : 'text-slate-400 bg-slate-950 border border-slate-800'
                    }`}
                  >
                    Words: {currentWordCount} / 2000 max
                  </span>
                </div>
                <textarea
                  rows={8}
                  placeholder="Write the complete legal thought, ratio, statutory references, and courtroom argument (up to 2,000 words)..."
                  value={workFullContent}
                  onChange={(e) => setWorkFullContent(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-xs text-white focus:outline-none font-sans leading-relaxed ${
                    isWordLimitExceeded ? 'border-rose-500' : 'border-slate-800 focus:border-amber-500'
                  }`}
                />
                {isWordLimitExceeded && (
                  <p className="text-[11px] text-rose-400 mt-1">
                    ⚠️ Word count exceeded! Please reduce by {currentWordCount - 2000} words to adhere to the 2,000-word limit.
                  </p>
                )}
              </div>

              {/* Image Gallery Manager (Up to 10 images) */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-850">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>Case Evidence & Thought Images (Max 10 Images)</span>
                  </label>
                  <span className="text-xs text-slate-400 font-mono">
                    {workImages.length}/10 uploaded
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Enter image URL (https://images.unsplash.com/...)"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    disabled={workImages.length >= 10 || !newImageUrl.trim()}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs disabled:opacity-50 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Image</span>
                  </button>
                </div>

                {/* Previews */}
                {workImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                    {workImages.map((img, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-800 aspect-video bg-slate-900">
                        <img
                          src={img}
                          alt={`Upload ${idx + 1}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-rose-600/90 hover:bg-rose-600 text-white p-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <span className="absolute bottom-1 left-1 bg-slate-950/80 text-[10px] text-slate-300 px-1.5 py-0.5 rounded">
                          #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="Arbitration, Supreme Court, Section 9, PMLA"
                  value={workTags}
                  onChange={(e) => setWorkTags(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetWorkForm}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isWordLimitExceeded}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/10 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingWorkId ? 'Update & Save Work' : 'Publish to Public Showcase'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Existing Works List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {works.map((w) => (
              <div
                key={w.id}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300">
                      {w.category}
                    </span>
                    <span className="text-[11px] text-slate-500">{w.date}</span>
                  </div>
                  <h4 className="font-serif text-sm font-bold text-white leading-snug line-clamp-2">
                    {w.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {w.keyRuling}
                  </p>
                  {w.images && w.images.length > 0 && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span>{w.images.length} Attached Gallery Images</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-xs">
                  <span className="text-slate-500 truncate max-w-[200px]">{w.citationOrMatter}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartEditWork(w)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 text-[11px]"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteWork(w.id)}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 flex items-center gap-1 text-[11px]"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
