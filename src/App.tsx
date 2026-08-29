import React, { useState, useEffect } from 'react';
import {
  Navbar,
  HeroAdvocate,
  PracticeAreas,
  CaseMetricsVisualizer,
  PublishedWorks,
  AdminChambersPortal,
  AiLegalLab,
  ConsultationScheduler,
  SecureClientPortal,
  ClientTestimonials,
  AuthModal,
  Footer
} from './components';
import { api } from './services/api';
import {
  AdvocateProfile,
  PracticeArea,
  CaseMetrics,
  AdvocateWork,
  Testimonial,
  ClientDocument,
  SecureMessage,
  ConsultationBooking,
  PaymentRecord,
  UserAuth
} from './types';
import { Sparkles, Calendar, Lock, CheckCircle2 } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'practice' | 'works' | 'metrics' | 'ai-lab' | 'portal' | 'testimonials' | 'admin-portal'>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedPracticeForLab, setSelectedPracticeForLab] = useState<string>('');
  const [isChambersAdmin, setIsChambersAdmin] = useState<boolean>(false);

  // App Data States
  const [profile, setProfile] = useState<AdvocateProfile | null>(null);
  const [practiceAreas, setPracticeAreas] = useState<PracticeArea[]>([]);
  const [metrics, setMetrics] = useState<CaseMetrics | null>(null);
  const [works, setWorks] = useState<AdvocateWork[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [messages, setMessages] = useState<SecureMessage[]>([]);
  const [consultations, setConsultations] = useState<ConsultationBooking[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  // Authenticated User state
  const [user, setUser] = useState<UserAuth | null>({
    id: "usr_client_821",
    email: "ajaytripathi821@gmail.com",
    name: "Ajay Tripathi",
    role: "client",
    provider: "google",
    token: "oauth2_gsi_token_verified",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadAllData = async () => {
    try {
      const [
        profData,
        pracData,
        metData,
        worksData,
        testData,
        docData,
        msgData,
        consData,
        payData
      ] = await Promise.all([
        api.getProfile(),
        api.getPracticeAreas(),
        api.getMetrics(),
        api.getWorks(),
        api.getTestimonials(),
        api.getDocuments(),
        api.getMessages(),
        api.getConsultations(),
        api.getPayments()
      ]);

      setProfile(profData);
      setPracticeAreas(pracData);
      setMetrics(metData);
      setWorks(worksData);
      setTestimonials(testData);
      setDocuments(docData);
      setMessages(msgData);
      setConsultations(consData);
      setPayments(payData);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleUploadWork = async (workData: Partial<AdvocateWork>) => {
    try {
      await api.submitWork(workData);
      const updatedWorks = await api.getWorks();
      setWorks(updatedWorks);
      showToast('Legal work & case order published to public showcase successfully!');
    } catch (err) {
      console.error('Failed to post work:', err);
      showToast('Failed to publish work. Please try again.');
    }
  };

  const handleDeleteWork = async (id: string) => {
    try {
      await api.deleteWork(id);
      const updatedWorks = await api.getWorks();
      setWorks(updatedWorks);
      showToast('Legal work removed from archive.');
    } catch (err) {
      console.error('Failed to delete work:', err);
    }
  };

  const handleSaveDocToVault = async (doc: any) => {
    try {
      await api.uploadDocument({
        title: doc.title,
        category: doc.category,
        content: doc.content,
        fileSize: doc.fileSize,
        uploadedBy: user?.name || 'Client',
        tags: doc.tags || ['AI-Analyzed'],
        aiSummary: doc.aiSummary
      });
      loadAllData();
      showToast('Document and Gemini AI Summary saved to your Privileged Client Vault!');
    } catch (err) {
      console.error('Failed to save to vault:', err);
    }
  };

  const handleBookingCompleted = (booking: ConsultationBooking) => {
    loadAllData();
    showToast(`Consultation confirmed for ${booking.date} at ${booking.timeSlot}! Video conferencing room initiated.`);
  };

  const handlePracticeSelect = (practice: PracticeArea) => {
    setSelectedPracticeForLab(practice.title);
    setActiveTab('ai-lab');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-950 border border-emerald-700 text-emerald-200 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        profile={profile}
        onSelectTab={(tab) => {
          if (tab === 'overview') setActiveTab('home');
          else if (tab === 'expertise') setActiveTab('practice');
          else setActiveTab(tab as any);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenBooking={() => setIsBookingModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        user={user}
        isChambersAdmin={isChambersAdmin}
        setIsChambersAdmin={setIsChambersAdmin}
        onLogout={() => {
          setUser(null);
          setIsChambersAdmin(false);
          showToast('Signed out of Privileged Portal.');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Full Comprehensive Landing / Home View */}
        {activeTab === 'home' && (
          <div>
            <HeroAdvocate
              profile={profile}
              metrics={metrics}
              onBookConsultation={() => setIsBookingModalOpen(true)}
              onOpenAiLab={() => {
                setActiveTab('ai-lab');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenPortal={() => {
                setActiveTab('portal');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <PublishedWorks
              works={works}
              isChambersAdmin={isChambersAdmin}
              onOpenAdminPortal={() => {
                setActiveTab('admin-portal');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <CaseMetricsVisualizer
              metrics={metrics}
              onBookConsultation={() => setIsBookingModalOpen(true)}
            />

            <PracticeAreas
              practiceAreas={practiceAreas}
              onSelectPractice={handlePracticeSelect}
              onBookConsultation={() => setIsBookingModalOpen(true)}
            />

            <AiLegalLab
              initialPracticeArea={selectedPracticeForLab}
              onSaveToVault={handleSaveDocToVault}
              onBookConsultation={() => setIsBookingModalOpen(true)}
            />

            <ClientTestimonials
              testimonials={testimonials}
              onRefresh={loadAllData}
              onBookConsultation={() => setIsBookingModalOpen(true)}
            />
          </div>
        )}

        {/* Practice Areas Specific Tab */}
        {activeTab === 'practice' && (
          <div className="pt-8">
            <PracticeAreas
              practiceAreas={practiceAreas}
              onSelectPractice={handlePracticeSelect}
              onBookConsultation={() => setIsBookingModalOpen(true)}
            />
          </div>
        )}

        {/* Landmark Works & Orders Specific Tab */}
        {activeTab === 'works' && (
          <div className="pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PublishedWorks
              works={works}
              isChambersAdmin={isChambersAdmin}
              onOpenAdminPortal={() => {
                setActiveTab('admin-portal');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* Admin Chambers Portal Tab */}
        {activeTab === 'admin-portal' && (
          <div className="pt-8">
            <AdminChambersPortal
              profile={profile}
              consultations={consultations}
              works={works}
              onUpdateProfile={(newProfile) => {
                setProfile(newProfile);
                showToast(`Advocate details updated live! Website title is now "${newProfile.name}".`);
              }}
              onUpdateConsultations={(updatedCons) => {
                setConsultations(updatedCons);
                showToast('Consultation requests roster updated.');
              }}
              onUpdateWorks={(updatedWorks) => {
                setWorks(updatedWorks);
                showToast('Published legal thoughts & landmark rulings refreshed.');
              }}
            />
          </div>
        )}

        {/* Case Metrics Specific Tab */}
        {activeTab === 'metrics' && (
          <div className="pt-8">
            <CaseMetricsVisualizer
              metrics={metrics}
              onBookConsultation={() => setIsBookingModalOpen(true)}
            />
          </div>
        )}

        {/* Gemini AI Legal Intelligence Lab Tab */}
        {activeTab === 'ai-lab' && (
          <div className="pt-8">
            <AiLegalLab
              initialPracticeArea={selectedPracticeForLab}
              onSaveToVault={handleSaveDocToVault}
              onBookConsultation={() => setIsBookingModalOpen(true)}
            />
          </div>
        )}

        {/* Secure Client Portal & Vault Tab */}
        {activeTab === 'portal' && (
          <div className="pt-8">
            <SecureClientPortal
              documents={documents}
              messages={messages}
              consultations={consultations}
              payments={payments}
              user={user}
              onRefreshData={loadAllData}
              onOpenBooking={() => setIsBookingModalOpen(true)}
            />
          </div>
        )}

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <div className="pt-8">
            <ClientTestimonials
              testimonials={testimonials}
              onRefresh={loadAllData}
              onBookConsultation={() => setIsBookingModalOpen(true)}
            />
          </div>
        )}

      </main>

      {/* Booking Modal Overlay */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full my-8 shadow-2xl relative">
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white text-xs px-3 py-1.5 rounded-lg bg-slate-800 z-10"
            >
              Close ✕
            </button>
            <ConsultationScheduler
              initialPracticeArea={selectedPracticeForLab}
              onBookingComplete={handleBookingCompleted}
              onClose={() => setIsBookingModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(auth) => {
          setUser(auth);
          if (auth.role === 'admin' || auth.chambersAccess) {
            setIsChambersAdmin(true);
            setActiveTab('admin-portal');
            showToast(`Welcome Advocate Counsel! Signed in as ${auth.name}.`);
          } else {
            showToast(`Welcome ${auth.name}! Signed in via Mobile / OAuth.`);
          }
        }}
      />

      {/* Footer */}
      <Footer
        profile={profile}
        onSelectNav={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenBooking={() => setIsBookingModalOpen(true)}
      />

    </div>
  );
}
export default App;
