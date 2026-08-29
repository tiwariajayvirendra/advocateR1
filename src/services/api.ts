import {
  AdvocateProfile,
  CaseMetrics,
  Testimonial,
  ClientDocument,
  SecureMessage,
  ConsultationBooking,
  PaymentRecord,
  LegalInsightResult,
  ClauseDraftResult,
  DocumentAiSummary,
  UserAuth
} from '../types';

export const api = {
  // Health
  async getHealth() {
    const res = await fetch('/api/health');
    return res.json();
  },

  // Profile & Practice Areas
  async getProfile(): Promise<AdvocateProfile> {
    const res = await fetch('/api/profile');
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  async updateProfile(profileData: Partial<AdvocateProfile>): Promise<AdvocateProfile> {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    if (!res.ok) throw new Error('Failed to update advocate profile');
    return res.json();
  },

  async getPracticeAreas(): Promise<import('../types').PracticeArea[]> {
    const profile = await this.getProfile();
    return profile.specializations || [];
  },

  // Metrics
  async getMetrics(): Promise<CaseMetrics> {
    const res = await fetch('/api/metrics');
    if (!res.ok) throw new Error('Failed to fetch metrics');
    return res.json();
  },

  // Published Works & Landmark Case Showcase
  async getWorks(): Promise<import('../types').AdvocateWork[]> {
    const res = await fetch('/api/works');
    if (!res.ok) throw new Error('Failed to fetch published works');
    return res.json();
  },

  async submitWork(work: Partial<import('../types').AdvocateWork>): Promise<import('../types').AdvocateWork> {
    const res = await fetch('/api/works', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(work),
    });
    if (!res.ok) throw new Error('Failed to submit legal work');
    return res.json();
  },

  async updateWork(id: string, work: Partial<import('../types').AdvocateWork>): Promise<import('../types').AdvocateWork> {
    const res = await fetch(`/api/works/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(work),
    });
    if (!res.ok) throw new Error('Failed to update legal work');
    return res.json();
  },

  async deleteWork(id: string): Promise<boolean> {
    const res = await fetch(`/api/works/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete published work');
    return true;
  },

  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    const res = await fetch('/api/testimonials');
    if (!res.ok) throw new Error('Failed to fetch testimonials');
    return res.json();
  },

  async submitTestimonial(testimonial: Partial<Testimonial>): Promise<Testimonial> {
    const res = await fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testimonial),
    });
    if (!res.ok) throw new Error('Failed to submit testimonial');
    return res.json();
  },

  // Consultations & Bookings
  async getConsultations(): Promise<ConsultationBooking[]> {
    const res = await fetch('/api/consultations');
    if (!res.ok) throw new Error('Failed to fetch consultations');
    return res.json();
  },

  async bookConsultation(booking: Partial<ConsultationBooking>): Promise<{ booking: ConsultationBooking; payment: PaymentRecord }> {
    const res = await fetch('/api/consultations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
    if (!res.ok) throw new Error('Failed to book consultation');
    return res.json();
  },

  async processCheckout(payload: { consultationData: Partial<ConsultationBooking>; paymentMethod: string }): Promise<{ success: boolean; booking: ConsultationBooking; payment: PaymentRecord }> {
    const res = await fetch('/api/checkout/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to process payment');
    return res.json();
  },

  async updateConsultationStatus(id: string, status: string): Promise<ConsultationBooking> {
    const res = await fetch(`/api/consultations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update consultation status');
    return res.json();
  },

  // Payments Ledger
  async getPayments(): Promise<PaymentRecord[]> {
    const res = await fetch('/api/payments');
    if (!res.ok) throw new Error('Failed to fetch payments');
    return res.json();
  },

  // Documents
  async getDocuments(): Promise<ClientDocument[]> {
    const res = await fetch('/api/documents');
    if (!res.ok) throw new Error('Failed to fetch documents');
    return res.json();
  },

  async uploadDocument(doc: Partial<ClientDocument>): Promise<ClientDocument> {
    const res = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc),
    });
    if (!res.ok) throw new Error('Failed to upload document');
    return res.json();
  },

  async deleteDocument(id: string): Promise<boolean> {
    const res = await fetch(`/api/documents/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete document');
    return true;
  },

  // Messages
  async getMessages(): Promise<SecureMessage[]> {
    const res = await fetch('/api/messages');
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  async sendMessage(msg: Partial<SecureMessage>): Promise<SecureMessage> {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  // AI Legal Intelligence (Google Gemini API via Server)
  async summarizeDocument(text: string, category: string): Promise<DocumentAiSummary> {
    const res = await fetch('/api/ai/summarize-document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, category }),
    });
    if (!res.ok) throw new Error('Document summarization failed');
    return res.json();
  },

  async getLegalInsight(params: { facts: string; practiceArea: string; jurisdiction?: string; clientGoal?: string }): Promise<LegalInsightResult> {
    const res = await fetch('/api/ai/legal-insight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Legal insight evaluation failed');
    return res.json();
  },

  async draftClause(params: { clauseType: string; requirements: string; jurisdiction?: string; partyRole?: string }): Promise<ClauseDraftResult> {
    const res = await fetch('/api/ai/draft-clause', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Clause drafting failed');
    return res.json();
  },

  async chatLegalAI(messages: { role: 'user' | 'model'; text: string }[]): Promise<string> {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    if (!res.ok) throw new Error('AI chat failed');
    const data = await res.json();
    return data.reply;
  },

  // Auth & OTP Operations
  async sendOtp(phone: string): Promise<{ success: boolean; message: string; simulatedOtp?: string }> {
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to send OTP');
    }
    return res.json();
  },

  async verifyOtp(phone: string, otp: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to verify OTP');
    }
    return res.json();
  },

  async clientSignup(data: {
    name: string;
    email: string;
    phone: string;
    age?: number;
    gender?: string;
    city?: string;
    state?: string;
    password?: string;
    otp?: string;
  }): Promise<{ success: boolean; user: UserAuth }> {
    const res = await fetch('/api/auth/client-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Client registration failed');
    }
    return res.json();
  },

  async clientLogin(data: { identifier: string; password?: string; otp?: string }): Promise<{ success: boolean; user: UserAuth }> {
    const res = await fetch('/api/auth/client-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Client login failed');
    }
    return res.json();
  },

  async forgotPassword(data: { phone: string; otp: string; newPassword: string }): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Password reset failed');
    }
    return res.json();
  },

  async adminSignup(data: {
    name: string;
    email: string;
    phone: string;
    barRegistration: string;
    secretKey?: string;
    password: string;
  }): Promise<{ success: boolean; user: UserAuth }> {
    const res = await fetch('/api/auth/admin-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Admin signup failed');
    }
    return res.json();
  },

  async adminLogin(data: { identifier: string; password: string }): Promise<{ success: boolean; user: UserAuth }> {
    const res = await fetch('/api/auth/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Admin login failed');
    }
    return res.json();
  },

  // Auth Context
  async getCurrentUser(): Promise<UserAuth> {
    const res = await fetch('/api/auth/me');
    if (!res.ok) throw new Error('Failed to get auth');
    const data = await res.json();
    return data.user;
  }
};
