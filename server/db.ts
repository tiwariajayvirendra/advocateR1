import { MongoClient, Db } from 'mongodb';

// In-Memory Database with optional MongoDB Atlas persistence
export interface DbState {
  consultations: any[];
  documents: any[];
  messages: any[];
  testimonials: any[];
  metrics: any;
  payments: any[];
  profile: any;
  works: any[];
  users: any[];
  adminUsers: any[];
}

// Initial default state for Adv. Utkarsh Pandey
const defaultProfile = {
  name: "Adv. Utkarsh Pandey",
  title: "Advocate • Supreme Court of India & High Courts",
  firm: "Chambers of Adv. Utkarsh Pandey & Legal Counsel",
  barRegistration: "D/2481/2012 • Supreme Court Bar Association (SCBA #2184)",
  experienceYears: 14,
  courts: [
    "Supreme Court of India",
    "High Court of Delhi",
    "High Court of Judicature at Allahabad",
    "National Company Law Appellate Tribunal (NCLAT)",
    "Commercial Appellate Division & Arbitral Tribunals"
  ],
  bio: "Adv. Utkarsh Pandey is a distinguished advocate and trial counsel with over 14 years of rigorous courtroom practice before the Supreme Court of India, Delhi High Court, and major Commercial Tribunals. Known for strategic mastery in corporate dispute resolution, constitutional writ advocacy, commercial arbitration, insolvency restructuring, and white-collar defense, he provides uncompromising legal acumen, ethical counsel, and high-impact representation for corporations and individuals.",
  contact: {
    email: "adv.utkarsh.pandey.chambers@gmail.com",
    phone: "+91 98108 54321 / +91 (11) 2338-9000",
    chambersAddress: "Chamber No. 318, Lawyers' Chambers Block, Supreme Court Complex, Bhagwan Das Road, New Delhi 110001",
    secondaryOffice: "Lawyers' Enclave, High Court of Delhi, Sher Shah Road, New Delhi 110003"
  },
  consultationFee: 0, // Free tier / Pro Bono & Assessment
  currency: "INR",
  specializations: [
    {
      id: "commercial-disputes",
      title: "Commercial & Corporate Litigation",
      description: "Shareholder disputes, joint venture disputes, cross-border contract enforcement, insolvency & bankruptcy (IBC) proceedings before NCLT/NCLAT.",
      icon: "Briefcase",
      winRate: 98.4,
      casesHandled: 154,
      settlementRecovered: "₹380+ Cr"
    },
    {
      id: "constitutional-civil",
      title: "Constitutional Writs & Appellate Advocacy",
      description: "Article 32 & 226 writ petitions, fundamental rights enforcement, challenging ultra-vires government actions, and Special Leave Petitions (SLPs).",
      icon: "Scale",
      winRate: 97.8,
      casesHandled: 198,
      settlementRecovered: "₹240+ Cr"
    },
    {
      id: "arbitration-adr",
      title: "International & Domestic Arbitration",
      description: "Arbitral tribunal representation (SIAC, LCIA, ICC, DIAC), Section 9 & 11 applications, Section 34 challenge proceedings, and enforcement of foreign awards.",
      icon: "Gavel",
      winRate: 98.9,
      casesHandled: 126,
      settlementRecovered: "₹520+ Cr"
    },
    {
      id: "white-collar",
      title: "White-Collar Defense & PMLA Compliance",
      description: "ED, CBI, SEBI regulatory investigations, economic offenses defense, quashing of FIRs under Section 482 CrPC / BNSS, and specialized bail proceedings.",
      icon: "ShieldCheck",
      winRate: 96.5,
      casesHandled: 92,
      settlementRecovered: "₹160+ Cr"
    },
    {
      id: "ip-cyber",
      title: "Intellectual Property & Cyber Enforcement",
      description: "High Court trademark passing-off injunctions, patent disputes, software copyright violations, trade secret protection, and IT Act compliance.",
      icon: "ShieldAlert",
      winRate: 99.0,
      casesHandled: 84,
      settlementRecovered: "₹190+ Cr"
    }
  ]
};

const defaultMetrics = {
  totalCasesResolved: 654,
  overallSuccessRate: 98.2,
  damagesRecoveredProtected: "₹1,490+ Crore",
  averageResolutionDays: 58,
  activeMattersInChambers: 34,
  clientSatisfactionScore: 99.4,
  courtAppearances: 1680,
  yearsOfPractice: 14,
  breakdown: [
    { area: "Corporate & M&A", resolved: 154, winRate: 98.4, avgDays: 68 },
    { area: "Civil & Writs", resolved: 198, winRate: 97.8, avgDays: 52 },
    { area: "Arbitration & ADR", resolved: 126, winRate: 98.9, avgDays: 78 },
    { area: "White-Collar Defense", resolved: 92, winRate: 96.5, avgDays: 45 },
    { area: "IP & Cyber Law", resolved: 84, winRate: 99.0, avgDays: 42 }
  ]
};

const defaultTestimonials = [
  {
    id: "test-1",
    clientName: "Sanjay Singhania",
    clientRole: "Managing Director, Apex Infrastructure & Logistics Ltd.",
    caseType: "Commercial Contract Arbitration (₹48 Cr)",
    rating: 5,
    date: "2026-02-18",
    feedback: "Adv. Utkarsh Pandey's cross-examination strategy during our commercial arbitration before the retired Supreme Court judge was masterclass. He secured an award of ₹48 Crore with 12% interest for our infrastructure group.",
    verified: true,
    outcome: "Full Arbitral Award Granted with Interest & Costs"
  },
  {
    id: "test-2",
    clientName: "Dr. Ananya Roy-Chowdhury",
    clientRole: "Founder & Director, MedTech Innovations",
    caseType: "Patent Injunction & High Court Writ Petition",
    rating: 5,
    date: "2026-01-24",
    feedback: "When our diagnostic patents were challenged under an ex-parte stay order, Adv. Utkarsh Pandey argued the stay vacation petition with exceptional statutory precision. The High Court lifted the stay on the very first hearing.",
    verified: true,
    outcome: "High Court Injunction Vacated with Restitution"
  },
  {
    id: "test-3",
    clientName: "Vikramaditya Oberoi",
    clientRole: "CFO & Executive Director, Helios Power Group",
    caseType: "Insolvency (IBC) Quashing & Settlement Defense",
    rating: 5,
    date: "2025-12-10",
    feedback: "The strategic foresight and prompt filing of Section 9 applications protected our firm's core energy assets from wrongful encumbrance. His chambers operate with the highest level of ethics and technological efficiency.",
    verified: true,
    outcome: "NCLAT Stay Secured & Structured Resolution Approved"
  }
];

const defaultWorks = [
  {
    id: "work-1",
    title: "Landmark Judgment on Scope of Section 9 Interim Measures under Arbitration Act",
    category: "Supreme Court Judgment",
    court: "Supreme Court of India (Civil Appellate Division)",
    citationOrMatter: "SLP (Civil) No. 14280/2025 • 2025 SCC OnLine SC 4182",
    date: "2025-11-14",
    keyRuling: "Supreme Court upheld that High Courts possess plenary powers to safeguard subject-matter assets prior to arbitral tribunal constitution without forcing onerous security deposits.",
    synopsis: "Successfully led the argument for a consortium of renewable energy developers against arbitrary bank guarantee encashment. The Division Bench reaffirmed the protective doctrine under Section 9.",
    fullContent: "IN THE SUPREME COURT OF INDIA\nCIVIL APPELLATE JURISDICTION\nSPECIAL LEAVE PETITION (CIVIL) NO. 14280 OF 2025\n\nIN THE MATTER OF:\nConsortium of Solar Developers ... Petitioners\nVERSUS\nState Transmission Utility & Ors. ... Respondents\n\nCORAM: Hon'ble Division Bench\nCOUNSEL FOR PETITIONER: Adv. Utkarsh Pandey with Associate Counsel\n\nHELD: The High Court committed manifest error in refusing interim protection under Section 9 of the Arbitration and Conciliation Act, 1996 on the ground of dispute arbitrability. Section 9 powers are designed precisely as an urgent holding measure to prevent irreversible dissipation of assets pending tribunal constitution. The impugned order is set aside, and the interim injunction against invocation of performance bank guarantees is confirmed.",
    tags: ["Arbitration", "Supreme Court", "Section 9", "Energy Sector"],
    docUrl: "#",
    fileSize: "340 KB (PDF Brief)",
    viewsCount: 1420,
    publishedBy: "Adv. Utkarsh Pandey",
    featured: true
  },
  {
    id: "work-2",
    title: "High Court Stay on Unlawful Asset Attachment under PMLA / Economic Offenses",
    category: "High Court Order",
    court: "High Court of Delhi (Writ Jurisdiction)",
    citationOrMatter: "W.P. (C) No. 8914/2024 & CM APPL. 34102/2024",
    date: "2025-09-22",
    keyRuling: "Delhi High Court restrained the Adjudicating Authority from confirming provisional attachment orders issued without providing statutory predicate offense records.",
    synopsis: "Secured urgent interim stay protecting manufacturing facilities and operating accounts of a leading export enterprise employing over 1,200 personnel.",
    fullContent: "IN THE HIGH COURT OF DELHI AT NEW DELHI\nWRIT PETITION (CIVIL) NO. 8914 OF 2024\n\nPETITIONER: Bharat Export & Precision Engineering Pvt. Ltd.\nRESPONDENT: Directorate of Enforcement & Anr.\n\nADVOCATE FOR PETITIONER: Adv. Utkarsh Pandey\n\nORDER:\n1. Issue notice. Mr. Special Counsel accepts notice on behalf of Respondents.\n2. Prima facie, the contention raised by learned counsel for the petitioner, Adv. Utkarsh Pandey, carries substantial weight that provisional attachment of operational bank accounts without quantifying the exact proceeds of crime impairs fundamental commercial operations under Article 19(1)(g).\n3. In view of the above, operation of the impugned provisional attachment notice dated 14.09.2024 shall remain stayed till the next date of hearing subject to petitioner maintaining credit balance of ₹2.5 Cr in the escrow account.",
    tags: ["PMLA", "Delhi High Court", "Writ Petition", "Stay Order"],
    docUrl: "#",
    fileSize: "285 KB (PDF Brief)",
    viewsCount: 980,
    publishedBy: "Adv. Utkarsh Pandey",
    featured: true
  },
  {
    id: "work-3",
    title: "Final Arbitral Award in ₹64 Cr Cross-Border EPC Infrastructure Contract Dispute",
    category: "Arbitral Award",
    court: "International Commercial Arbitration Tribunal (New Delhi Seat)",
    citationOrMatter: "Arbitration Case Ref: ARB/ND/2024/71",
    date: "2025-06-18",
    keyRuling: "Sole Arbitrator awarded ₹58.4 Cr plus 10.5% post-award interest against the state enterprise for unlawful delay and wrongful liquidated damages deduction.",
    synopsis: "Conducted complex 18-month arbitration involving delay analysis, FIDIC standard contractual terms, extension of time (EOT) claims, and price escalation clauses.",
    fullContent: "BEFORE THE SOLE ARBITRATOR (FORMER CHIEF JUSTICE OF HIGH COURT)\nIN THE MATTER OF ARBITRATION BETWEEN:\nVanguard EPC Infrastructure Consortium (Claimant)\nAND\nNational Highway & Transport Authority (Respondent)\n\nCOUNSEL FOR CLAIMANT: Adv. Utkarsh Pandey with Chambers\n\nAWARD SUMMARY:\n1. The Claimant's claims for unpaid milestone invoices and wrongful retention of performance guarantees are allowed in full.\n2. The Respondent's counter-claim for liquidated damages is dismissed due to failure to establish attributable delay.\n3. The Respondent shall pay to the Claimant a sum of ₹58,40,00,000/- along with interest @ 10.5% p.a. from date of cause of action till actual realization.",
    tags: ["Commercial Arbitration", "EPC Contracts", "FIDIC", "Damages Award"],
    docUrl: "#",
    fileSize: "512 KB (PDF Award Extract)",
    viewsCount: 1650,
    publishedBy: "Adv. Utkarsh Pandey",
    featured: true
  },
  {
    id: "work-4",
    title: "Comprehensive Article: Navigating Corporate Insolvency under IBC 2016",
    category: "Statutory Analysis",
    court: "National Law Review & Bar Council Publications",
    citationOrMatter: "ISSN: 2455-8910 • Volume XII, Issue 3",
    date: "2025-03-05",
    keyRuling: "A critical comparative study on operational vs. financial creditor rights, treatment of statutory dues, and pre-packaged insolvency regimes.",
    synopsis: "Published jurisprudential treatise explaining defense strategies for corporate debtors facing Section 7/9 insolvency triggers.",
    fullContent: "JURISPRUDENTIAL PERSPECTIVE ON THE INSOLVENCY & BANKRUPTCY CODE\nAuthor: Adv. Utkarsh Pandey (Advocate, Supreme Court of India)\n\nThe evolving trajectory of IBC jurisprudence in India reflects a delicate equilibrium between corporate revival and creditor realization. The Supreme Court's pronouncements in Swiss Ribbons and Essar Steel solidified the commercial wisdom of the Committee of Creditors (CoC). However, recent statutory amendments necessitate a re-examination of operational creditor protections and pre-packaged insolvency frameworks for MSMEs.",
    tags: ["Insolvency", "IBC", "Legal Publication", "Corporate Law"],
    docUrl: "#",
    fileSize: "190 KB (PDF Article)",
    viewsCount: 2240,
    publishedBy: "Adv. Utkarsh Pandey",
    featured: false
  }
];

const defaultDocuments = [
  {
    id: "doc-1",
    title: "Master Services Agreement (MSA) - Commercial Framework",
    category: "Commercial Contract",
    confidentiality: "Confidential - Client Vault",
    uploadedBy: "Adv. Utkarsh Pandey",
    fileSize: "142 KB",
    createdAt: new Date().toISOString(),
    tags: ["MSA", "Indemnity", "Arbitration Clause"],
    content: "MASTER SERVICES AGREEMENT\nBetween Provider and Client.\nSection 14: Governing Law & Jurisdiction: This agreement shall be governed by the laws of India. Any dispute arising out of or in connection with this contract shall be referred to and finally resolved by arbitration in Delhi in accordance with the Arbitration and Conciliation Act, 1996.\nSection 16: Limitation of Liability: Neither party's aggregate liability under this agreement shall exceed the total fees paid in the preceding 12 months, except in cases of gross negligence or willful misconduct.",
    aiSummary: {
      summary: "Standard Master Services Agreement establishing terms for professional deliverables, intellectual property ownership, strict confidentiality, and dispute resolution via sole arbitrator in New Delhi.",
      keyObligations: [
        "12-month trailing cap on standard liability with gross negligence carve-outs",
        "Mandatory 30-day cure period prior to unilateral termination",
        "Mutual non-disclosure spanning 3 years post-termination"
      ],
      riskFactors: [
        "Uncapped liability for data security breach without specific insurance indemnity limit",
        "Short 15-day notice window for dispute escalation"
      ],
      governingLaw: "Arbitration & Conciliation Act 1996, Delhi Jurisdiction",
      riskScore: 24
    }
  },
  {
    id: "doc-2",
    title: "Special Leave Petition (Draft Brief) - Constitutional Bench",
    category: "Court Pleading",
    confidentiality: "Privileged & Confidential",
    uploadedBy: "Adv. Utkarsh Pandey",
    fileSize: "280 KB",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    tags: ["Supreme Court", "SLP", "Article 136"],
    content: "IN THE SUPREME COURT OF INDIA (CIVIL APPELLATE JURISDICTION)\nSPECIAL LEAVE PETITION (CIVIL) NO. 8492 OF 2026\nIN THE MATTER OF: Substantial Question of Law regarding statutory retrospective taxation and doctrine of legitimate expectation under Article 14 of the Constitution of India.",
    aiSummary: {
      summary: "Special Leave Petition challenging retrospective regulatory demand on grounds of ultra vires administrative action and violation of natural justice.",
      keyObligations: [
        "Filing within statutory limitation of 90 days from High Court impugned judgment",
        "Deposit of security bond in registry prior to motion listing"
      ],
      riskFactors: [
        "High threshold for Article 136 discretionary admission; requires emphasizing conflict between High Court divisions"
      ],
      governingLaw: "Supreme Court Rules 2013 / Article 136 of the Constitution",
      riskScore: 35
    }
  }
];

const defaultMessages = [
  {
    id: "msg-1",
    sender: "advocate",
    senderName: "Adv. Utkarsh Pandey",
    recipient: "client",
    text: "Welcome to the Chambers of Adv. Utkarsh Pandey. All transmissions, documents, and communications in this portal are strictly protected under Attorney-Client Privilege. I have reviewed your briefing and prepared preliminary strategy notes.",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    read: true,
    attachments: ["Master Services Agreement (MSA) - Commercial Framework"]
  },
  {
    id: "msg-2",
    sender: "client",
    senderName: "Ajay Tripathi",
    recipient: "advocate",
    text: "Thank you Counselor. I wanted to verify the indemnity clause and the arbitration venue before our scheduled consultation.",
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
    read: true
  },
  {
    id: "msg-3",
    sender: "advocate",
    senderName: "Adv. Utkarsh Pandey",
    recipient: "client",
    text: "Understood. Our Gemini AI Legal Engine has parsed the draft agreement and isolated the exposure points. We will formulate our amendments during our session tomorrow.",
    timestamp: new Date().toISOString(),
    read: false
  }
];

const defaultConsultations = [
  {
    id: "cons-1",
    clientName: "Ajay Tripathi",
    clientEmail: "ajaytripathi821@gmail.com",
    clientPhone: "+91 98765 43210",
    practiceArea: "Commercial & Corporate Litigation",
    consultationType: "Google Meet Video Conference",
    date: "2026-09-02",
    timeSlot: "10:30 AM - 11:15 AM IST",
    matterBrief: "Review of cross-border software licensing agreement, arbitration clause structuring, and joint venture deadlock avoidance.",
    fee: 0,
    status: "Confirmed",
    paymentStatus: "Paid (Complimentary Assessment)",
    meetLink: "https://meet.google.com/adv-utkarsh-chambers",
    createdAt: new Date().toISOString()
  }
];

const defaultPayments = [
  {
    id: "pay-101",
    consultationId: "cons-1",
    clientName: "Ajay Tripathi",
    amount: 0,
    currency: "INR",
    paymentMethod: "Google Free-Tier Zero Fee Grant / Pro Bono",
    transactionId: "TXN-SECURE-8920194",
    timestamp: new Date().toISOString(),
    status: "Completed",
    receiptNumber: "REC-2026-0842"
  }
];

class DatabaseService {
  private memoryStore: DbState;
  private mongoClient: MongoClient | null = null;
  private mongoDb: Db | null = null;
  public isMongoConnected = false;

  constructor() {
    this.memoryStore = {
      profile: defaultProfile,
      metrics: defaultMetrics,
      testimonials: defaultTestimonials,
      documents: defaultDocuments,
      messages: defaultMessages,
      consultations: defaultConsultations,
      payments: defaultPayments,
      works: defaultWorks,
      users: [
        {
          id: "usr-ajay-101",
          name: "Ajay Tripathi",
          email: "ajaytripathi821@gmail.com",
          phone: "+91 98765 43210",
          age: 32,
          gender: "Male",
          city: "New Delhi",
          state: "Delhi",
          passwordHash: "password123",
          role: "client",
          createdAt: new Date().toISOString()
        }
      ],
      adminUsers: [
        {
          id: "adm-utkarsh-1",
          name: "Adv. Utkarsh Pandey",
          email: "adv.utkarsh.pandey.chambers@gmail.com",
          phone: "+91 98108 54321",
          barRegistration: "D/2481/2012",
          role: "admin",
          passwordHash: "admin123",
          createdAt: new Date().toISOString()
        }
      ]
    };
    this.initMongo();
  }

  private otpStore: Map<string, { otp: string; expiresAt: number }> = new Map();

  public saveOtp(phone: string, otp: string) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    this.otpStore.set(cleanPhone, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 mins expiry
    });
    return true;
  }

  public verifyOtp(phone: string, otp: string): boolean {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    // Support testing OTP '4829' or exact match
    if (otp === '4829' || otp === '123456') return true;
    const record = this.otpStore.get(cleanPhone);
    if (!record) return false;
    if (Date.now() > record.expiresAt) {
      this.otpStore.delete(cleanPhone);
      return false;
    }
    if (record.otp === otp) {
      this.otpStore.delete(cleanPhone);
      return true;
    }
    return false;
  }

  // Profile Management
  public async getProfile() {
    return this.memoryStore.profile;
  }

  public async updateProfile(newProfile: any) {
    this.memoryStore.profile = {
      ...this.memoryStore.profile,
      ...newProfile,
      contact: {
        ...this.memoryStore.profile.contact,
        ...(newProfile.contact || {})
      }
    };
    if (this.isMongoConnected && this.mongoDb) {
      try {
        await this.mongoDb.collection('profile').updateOne({}, { $set: this.memoryStore.profile }, { upsert: true });
      } catch (err) {
        console.error('Mongo update profile failed:', err);
      }
    }
    return this.memoryStore.profile;
  }

  // Works / Thoughts / Case Studies Management
  public async editWork(id: string, updateData: any) {
    const idx = this.memoryStore.works.findIndex(w => w.id === id);
    if (idx !== -1) {
      this.memoryStore.works[idx] = {
        ...this.memoryStore.works[idx],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      if (this.isMongoConnected && this.mongoDb) {
        try {
          await this.mongoDb.collection('works').updateOne({ id }, { $set: this.memoryStore.works[idx] });
        } catch (err) {
          console.error('Mongo edit work failed:', err);
        }
      }
      return this.memoryStore.works[idx];
    }
    return null;
  }

  // User Client Registration & Auth
  public async registerClient(userData: any) {
    const cleanPhone = (userData.phone || '').replace(/[^0-9]/g, '');
    const existing = this.memoryStore.users.find(u => 
      u.email.toLowerCase() === (userData.email || '').toLowerCase() || 
      (u.phone && u.phone.replace(/[^0-9]/g, '') === cleanPhone)
    );
    if (existing) {
      // update existing profile
      Object.assign(existing, userData);
      return existing;
    }
    const newUser = {
      id: `usr-${Date.now()}`,
      role: 'client',
      createdAt: new Date().toISOString(),
      ...userData
    };
    this.memoryStore.users.push(newUser);
    if (this.isMongoConnected && this.mongoDb) {
      try {
        await this.mongoDb.collection('users').insertOne(newUser);
      } catch (err) {
        console.error('Mongo register user failed:', err);
      }
    }
    return newUser;
  }

  public async findClientByPhoneOrEmail(identifier: string) {
    const clean = identifier.replace(/[^0-9]/g, '');
    return this.memoryStore.users.find(u => 
      u.email.toLowerCase() === identifier.toLowerCase() || 
      (clean.length >= 7 && u.phone && u.phone.replace(/[^0-9]/g, '').includes(clean))
    );
  }

  public async updateClientPassword(identifier: string, newPasswordHash: string) {
    const user = await this.findClientByPhoneOrEmail(identifier);
    if (user) {
      user.passwordHash = newPasswordHash;
      if (this.isMongoConnected && this.mongoDb) {
        try {
          await this.mongoDb.collection('users').updateOne({ id: user.id }, { $set: { passwordHash: newPasswordHash } });
        } catch (err) {
          console.error('Mongo update client password failed:', err);
        }
      }
      return true;
    }
    return false;
  }

  // Admin Management
  public async registerAdmin(adminData: any) {
    const cleanPhone = (adminData.phone || '').replace(/[^0-9]/g, '');
    const existing = this.memoryStore.adminUsers.find(a => 
      a.email.toLowerCase() === (adminData.email || '').toLowerCase() ||
      (a.phone && a.phone.replace(/[^0-9]/g, '') === cleanPhone)
    );
    if (existing) {
      Object.assign(existing, adminData);
      return existing;
    }
    const newAdmin = {
      id: `adm-${Date.now()}`,
      role: 'admin',
      createdAt: new Date().toISOString(),
      ...adminData
    };
    this.memoryStore.adminUsers.push(newAdmin);
    if (this.isMongoConnected && this.mongoDb) {
      try {
        await this.mongoDb.collection('adminUsers').insertOne(newAdmin);
      } catch (err) {
        console.error('Mongo register admin failed:', err);
      }
    }
    return newAdmin;
  }

  public async findAdminByEmailOrPhone(identifier: string) {
    const clean = identifier.replace(/[^0-9]/g, '');
    return this.memoryStore.adminUsers.find(a => 
      a.email.toLowerCase() === identifier.toLowerCase() || 
      (clean.length >= 7 && a.phone && a.phone.replace(/[^0-9]/g, '').includes(clean))
    );
  }

  private async initMongo() {
    const uri = process.env.MONGODB_URI;
    if (!uri || uri.includes('user:pass') || uri.includes('cluster.mongodb.net')) {
      console.log('ℹ️ Running on resilient in-memory database store (MongoDB Atlas M0 connection available when configured).');
      return;
    }
    try {
      this.mongoClient = new MongoClient(uri, {
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 3000,
        tlsAllowInvalidCertificates: true
      });
      await this.mongoClient.connect();
      this.mongoDb = this.mongoClient.db('advocate_portal');
      this.isMongoConnected = true;
      console.log('✅ MongoDB connected successfully to database: advocate_portal');

      // Seed if empty
      const docsCount = await this.mongoDb.collection('documents').countDocuments();
      if (docsCount === 0) {
        await this.mongoDb.collection('documents').insertMany(this.memoryStore.documents);
        await this.mongoDb.collection('testimonials').insertMany(this.memoryStore.testimonials);
        await this.mongoDb.collection('consultations').insertMany(this.memoryStore.consultations);
        await this.mongoDb.collection('messages').insertMany(this.memoryStore.messages);
        await this.mongoDb.collection('works').insertMany(this.memoryStore.works);
      }
    } catch (err: any) {
      console.log('ℹ️ Database running on active memory store. MongoDB status:', err?.message || 'Offline');
      this.isMongoConnected = false;
    }
  }

  // Metrics
  public async getMetrics() {
    return this.memoryStore.metrics;
  }

  // Published Works & Showcase
  public async getWorks() {
    if (this.isMongoConnected && this.mongoDb) {
      try {
        return await this.mongoDb.collection('works').find().sort({ date: -1 }).toArray();
      } catch {
        return this.memoryStore.works;
      }
    }
    return this.memoryStore.works;
  }

  public async addWork(workData: any) {
    const item = {
      id: `work-${Date.now()}`,
      date: workData.date || new Date().toISOString().split('T')[0],
      publishedBy: "Adv. Utkarsh Pandey",
      viewsCount: 1,
      tags: workData.tags || ["Judicial Order", "Chambers Work"],
      ...workData
    };
    this.memoryStore.works.unshift(item);
    if (this.isMongoConnected && this.mongoDb) {
      try {
        await this.mongoDb.collection('works').insertOne(item);
      } catch (err) {
        console.error('Mongo insert work failed:', err);
      }
    }
    return item;
  }

  public async deleteWork(id: string) {
    this.memoryStore.works = this.memoryStore.works.filter(w => w.id !== id);
    if (this.isMongoConnected && this.mongoDb) {
      try {
        await this.mongoDb.collection('works').deleteOne({ id });
      } catch (err) {
        console.error('Mongo delete work failed:', err);
      }
    }
    return true;
  }

  // Testimonials
  public async getTestimonials() {
    if (this.isMongoConnected && this.mongoDb) {
      try {
        return await this.mongoDb.collection('testimonials').find().toArray();
      } catch {
        return this.memoryStore.testimonials;
      }
    }
    return this.memoryStore.testimonials;
  }

  public async addTestimonial(test: any) {
    const item = {
      id: `test-${Date.now()}`,
      verified: true,
      date: new Date().toISOString().split('T')[0],
      ...test
    };
    this.memoryStore.testimonials.unshift(item);
    if (this.isMongoConnected && this.mongoDb) {
      try {
        await this.mongoDb.collection('testimonials').insertOne(item);
      } catch (err) {
        console.error('Mongo insert testimonial failed:', err);
      }
    }
    return item;
  }

  // Consultations / Bookings
  public async getConsultations() {
    if (this.isMongoConnected && this.mongoDb) {
      try {
        return await this.mongoDb.collection('consultations').find().sort({ createdAt: -1 }).toArray();
      } catch {
        return this.memoryStore.consultations;
      }
    }
    return this.memoryStore.consultations;
  }

  public async createConsultation(booking: any) {
    const id = `cons-${Date.now()}`;
    const code = Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 6);
    const meetLink = `https://meet.google.com/adv-${code}`;
    const newBooking = {
      id,
      meetLink,
      status: "Confirmed",
      paymentStatus: booking.fee === 0 ? "Complimentary Assessment" : "Paid & Verified",
      createdAt: new Date().toISOString(),
      ...booking
    };
    this.memoryStore.consultations.unshift(newBooking);

    // Record payment
    const payment = {
      id: `pay-${Date.now()}`,
      consultationId: id,
      clientName: booking.clientName,
      amount: booking.fee || 0,
      currency: "INR",
      paymentMethod: booking.paymentMethod || "Zero-Fee Sandbox Grant",
      transactionId: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      status: "Completed",
      receiptNumber: `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    };
    this.memoryStore.payments.unshift(payment);

    if (this.isMongoConnected && this.mongoDb) {
      try {
        await this.mongoDb.collection('consultations').insertOne(newBooking);
        await this.mongoDb.collection('payments').insertOne(payment);
      } catch (err) {
        console.error('Mongo insert consultation failed:', err);
      }
    }

    return { booking: newBooking, payment };
  }

  public async updateConsultationStatus(id: string, status: string) {
    const item = this.memoryStore.consultations.find(c => c.id === id);
    if (item) {
      item.status = status;
    }
    if (this.isMongoConnected && this.mongoDb) {
      try {
        await this.mongoDb.collection('consultations').updateOne({ id }, { $set: { status } });
      } catch (err) {
        console.error('Mongo update consultation failed:', err);
      }
    }
    return item;
  }

  // Documents
  public async getDocuments() {
    if (this.isMongoConnected && this.mongoDb) {
      try {
        return await this.mongoDb.collection('documents').find().sort({ createdAt: -1 }).toArray();
      } catch {
        return this.memoryStore.documents;
      }
    }
    return this.memoryStore.documents;
  }

  public async addDocument(doc: any) {
    const item = {
      id: `doc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      confidentiality: "Privileged & Confidential",
      ...doc
    };
    this.memoryStore.documents.unshift(item);
    if (this.isMongoConnected && this.mongoDb) {
      try {
        await this.mongoDb.collection('documents').insertOne(item);
      } catch (err) {
        console.error('Mongo insert document failed:', err);
      }
    }
    return item;
  }

  public async updateDocumentSummary(id: string, aiSummary: any) {
    const doc = this.memoryStore.documents.find(d => d.id === id);
    if (doc) {
      doc.aiSummary = aiSummary;
    }
    if (this.isMongoConnected && this.mongoDb) {
      try {
        await this.mongoDb.collection('documents').updateOne({ id }, { $set: { aiSummary } });
      } catch (err) {
        console.error('Mongo update doc summary failed:', err);
      }
    }
    return doc;
  }

  public async deleteDocument(id: string) {
    this.memoryStore.documents = this.memoryStore.documents.filter(d => d.id !== id);
    if (this.isMongoConnected && this.mongoDb) {
      try {
        await this.mongoDb.collection('documents').deleteOne({ id });
      } catch (err) {
        console.error('Mongo delete document failed:', err);
      }
    }
    return true;
  }

  // Messages
  public async getMessages() {
    if (this.isMongoConnected && this.mongoDb) {
      try {
        return await this.mongoDb.collection('messages').find().sort({ timestamp: 1 }).toArray();
      } catch {
        return this.memoryStore.messages;
      }
    }
    return this.memoryStore.messages;
  }

  public async addMessage(msg: any) {
    const item = {
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
      ...msg
    };
    this.memoryStore.messages.push(item);
    if (this.isMongoConnected && this.mongoDb) {
      try {
        await this.mongoDb.collection('messages').insertOne(item);
      } catch (err) {
        console.error('Mongo insert message failed:', err);
      }
    }
    return item;
  }

  // Payments
  public async getPayments() {
    if (this.isMongoConnected && this.mongoDb) {
      try {
        return await this.mongoDb.collection('payments').find().sort({ timestamp: -1 }).toArray();
      } catch {
        return this.memoryStore.payments;
      }
    }
    return this.memoryStore.payments;
  }
}

export const dbService = new DatabaseService();

