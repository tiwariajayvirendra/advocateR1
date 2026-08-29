export interface PracticeArea {
  id: string;
  title: string;
  description: string;
  icon: string;
  winRate: number;
  casesHandled: number;
  settlementRecovered: string;
}

export interface AdvocateProfile {
  name: string;
  title: string;
  firm: string;
  barRegistration: string;
  experienceYears: number;
  courts: string[];
  bio: string;
  contact: {
    email: string;
    phone: string;
    chambersAddress: string;
    secondaryOffice: string;
  };
  consultationFee: number;
  currency: string;
  specializations: PracticeArea[];
}

export interface MetricBreakdown {
  area: string;
  resolved: number;
  winRate: number;
  avgDays: number;
}

export interface CaseMetrics {
  totalCasesResolved: number;
  overallSuccessRate: number;
  damagesRecoveredProtected: string;
  averageResolutionDays: number;
  activeMattersInChambers: number;
  clientSatisfactionScore: number;
  courtAppearances: number;
  yearsOfPractice: number;
  breakdown: MetricBreakdown[];
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  caseType: string;
  rating: number;
  date: string;
  feedback: string;
  verified: boolean;
  outcome: string;
}

export interface AdvocateWork {
  id: string;
  title: string;
  category: string;
  court: string;
  citationOrMatter: string;
  date: string;
  keyRuling: string;
  synopsis: string;
  fullContent?: string;
  tags: string[];
  docUrl?: string;
  fileSize?: string;
  viewsCount?: number;
  publishedBy: string;
  images?: string[]; // Up to 10 images for case study / thought gallery
  featured?: boolean;
}

export interface DocumentAiSummary {
  summary: string;
  keyObligations: string[];
  riskFactors: string[];
  governingLaw: string;
  riskScore: number;
  recommendedClausesToAmend?: string[];
}

export interface ClientDocument {
  id: string;
  title: string;
  category: string;
  confidentiality: string;
  uploadedBy: string;
  fileSize: string;
  createdAt: string;
  tags: string[];
  content?: string;
  aiSummary?: DocumentAiSummary;
}

export interface SecureMessage {
  id: string;
  sender: 'client' | 'advocate';
  senderName: string;
  recipient: 'client' | 'advocate';
  text: string;
  timestamp: string;
  read?: boolean;
  attachments?: string[];
}

export interface ConsultationBooking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAge?: number;
  clientGender?: string;
  clientCity?: string;
  clientState?: string;
  practiceArea: string;
  consultationType: 'Google Meet Video Conference' | 'In-Person Supreme Court Chambers' | 'Urgent Phone Briefing' | 'Written Legal Opinion';
  date: string;
  timeSlot: string;
  matterBrief: string;
  fee: number;
  status: 'Confirmed' | 'Pending Review' | 'Completed' | 'Rescheduled' | 'Cancelled';
  paymentStatus: string;
  paymentMethod?: string;
  meetLink?: string;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  consultationId: string;
  clientName: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId: string;
  timestamp: string;
  status: string;
  receiptNumber: string;
}

export interface LegalInsightResult {
  caseTitle: string;
  viabilityScore: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  proceduralRoadmap: string[];
  applicableStatutesAndPrecedents: string[];
  strategicRecommendations: string[];
  estimatedTimeline: string;
  attorneyNotes: string;
}

export interface ClauseDraftResult {
  clauseTitle: string;
  clauseText: string;
  plainEnglishExplanation: string;
  advocateNotes: string;
}

export interface UserAuth {
  id: string;
  email: string;
  name: string;
  phone?: string;
  age?: number;
  gender?: string;
  city?: string;
  state?: string;
  avatar?: string;
  role: 'client' | 'advocate' | 'admin';
  authProvider?: string;
  provider?: string;
  token?: string;
  chambersAccess?: boolean;
}
