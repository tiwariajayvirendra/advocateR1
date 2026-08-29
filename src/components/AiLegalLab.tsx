import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Scale,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Send,
  Loader2,
  Copy,
  Check,
  BookmarkPlus,
  RefreshCw,
  HelpCircle,
  Gavel,
  BookOpen
} from 'lucide-react';
import { api } from '../services/api';
import { DocumentAiSummary, LegalInsightResult, ClauseDraftResult } from '../types';

interface AiLegalLabProps {
  initialPracticeArea?: string;
  onSaveToVault?: (doc: any) => void;
  onBookConsultation: () => void;
}

const sampleContracts = [
  {
    title: "Master Services Agreement (MSA) - Software & IP",
    category: "Commercial Contract",
    text: `MASTER SERVICES AGREEMENT
This Master Services Agreement ("Agreement") is made effective as of August 2026, by and between Nexus Tech Corp ("Provider") and Apex Global Enterprises ("Client").
1. SERVICES & DELIVERABLES: Provider shall perform software engineering and integration services as detailed in Statements of Work.
2. FEES & PAYMENT: Client shall remit payment within 30 days of undisputed invoice receipt. Late fees of 1.5% per month apply.
3. INTELLECTUAL PROPERTY: All pre-existing IP remains the exclusive property of the respective originating party. Work Product created specifically for Client shall vest in Client upon full payment of fees.
4. INDEMNIFICATION: Provider shall indemnify and defend Client against third-party claims alleging infringement of patent or copyright, provided Client gives prompt notice. Provider's total aggregate liability under this agreement shall not exceed the total fees paid in the preceding 12 months, except in instances of gross negligence or data breach.
5. GOVERNING LAW & DISPUTE RESOLUTION: This Agreement shall be governed by the laws of India. All disputes shall be resolved through sole arbitrator arbitration in New Delhi under the Arbitration and Conciliation Act, 1996.`
  },
  {
    title: "Non-Disclosure & Trade Secret Covenant",
    category: "Confidentiality Agreement",
    text: `MUTUAL NON-DISCLOSURE AGREEMENT
The Disclosing Party agrees to share proprietary technological blueprints, algorithm benchmarks, and financial projections with Receiving Party.
1. CONFIDENTIAL INFORMATION: Includes all non-public technical, operational, and commercial data.
2. OBLIGATIONS: Receiving Party shall hold all Confidential Information in strict confidence for a period of 5 years.
3. NON-COMPETE & NON-SOLICITATION: Receiving Party covenants not to solicit any core personnel of Disclosing Party for 24 months post-expiration.
4. INJUNCTIVE RELIEF: Both parties acknowledge that monetary damages alone will be inadequate for breach of confidentiality and agree to ex-parte restraining injunctive relief.`
  },
  {
    title: "Commercial Lease & Indemnity Deed",
    category: "Real Estate & Commercial Lease",
    text: `COMMERCIAL LEASE AGREEMENT
Lessor leases Commercial Chambers Unit 408 to Lessee for a period of 36 months.
1. SECURITY DEPOSIT: Lessee deposits 6 months rent as interest-free refundable security deposit.
2. MAINTENANCE & TAXES: Lessee bears all municipal commercial property surcharges and utility cess.
3. TERMINATION & LOCK-IN: Mandatory 18-month lock-in period. Early exit by Lessee triggers forfeiture of full security deposit and remaining lock-in rental consideration.`
  }
];

export const AiLegalLab: React.FC<AiLegalLabProps> = ({
  initialPracticeArea,
  onSaveToVault,
  onBookConsultation
}) => {
  const [activeTab, setActiveTab] = useState<'document' | 'insight' | 'clauses' | 'assistant'>('document');

  // Document Summarizer State
  const [docText, setDocText] = useState<string>(sampleContracts[0].text);
  const [docTitle, setDocTitle] = useState<string>(sampleContracts[0].title);
  const [docCategory, setDocCategory] = useState<string>(sampleContracts[0].category);
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [aiSummary, setAiSummary] = useState<DocumentAiSummary | null>(null);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [savedToVaultSuccess, setSavedToVaultSuccess] = useState<boolean>(false);

  // Case Viability State
  const [facts, setFacts] = useState<string>('Our company entered into a software development contract with a multi-million dollar vendor. After paying 70% upfront, the vendor missed critical milestones by 6 months, withheld our source code repositories, and is now threatening third-party licensing. We demand immediate delivery of source code, restraining injunction, and refund of advance fees.');
  const [practiceArea, setPracticeArea] = useState<string>(initialPracticeArea || 'Commercial & Corporate Disputes');
  const [jurisdiction, setJurisdiction] = useState<string>('High Court of Delhi / Commercial Division');
  const [clientGoal, setClientGoal] = useState<string>('Obtain urgent ex-parte status quo order, recover IP source code, and initiate arbitration damages');
  const [isAnalyzingCase, setIsAnalyzingCase] = useState<boolean>(false);
  const [caseInsight, setCaseInsight] = useState<LegalInsightResult | null>(null);

  // Clause Drafter State
  const [clauseType, setClauseType] = useState<string>('Limitation of Liability & Indemnity');
  const [clauseRequirements, setClauseRequirements] = useState<string>('Bilateral liability cap limited to 12 months consideration; strict carve-outs for IP infringement and gross negligence; mutual defense waiver');
  const [clauseJurisdiction, setClauseJurisdiction] = useState<string>('Supreme Court / Delhi Commercial Seat');
  const [isDraftingClause, setIsDraftingClause] = useState<boolean>(false);
  const [draftedClause, setDraftedClause] = useState<ClauseDraftResult | null>(null);
  const [copiedClause, setCopiedClause] = useState<boolean>(false);

  // AI Chat Assistant State
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    {
      role: 'model',
      text: 'Greetings. I am Senior Advocate Singhania’s AI Legal Counsel Assistant. You can ask me regarding statutory remedies, court filing procedures, arbitral rules, contract risk mitigation, or emergency injunction timelines. How may I assist your legal inquiry?'
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatSending, setIsChatSending] = useState<boolean>(false);

  // Handlers
  const handleSummarizeDoc = async () => {
    if (!docText.trim()) return;
    setIsSummarizing(true);
    try {
      const res = await api.summarizeDocument(docText, docCategory);
      setAiSummary(res);
    } catch (err) {
      console.error('Summary error:', err);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleAnalyzeCaseViability = async () => {
    if (!facts.trim()) return;
    setIsAnalyzingCase(true);
    try {
      const res = await api.getLegalInsight({
        facts,
        practiceArea,
        jurisdiction,
        clientGoal
      });
      setCaseInsight(res);
    } catch (err) {
      console.error('Insight error:', err);
    } finally {
      setIsAnalyzingCase(false);
    }
  };

  const handleDraftClause = async () => {
    if (!clauseRequirements.trim()) return;
    setIsDraftingClause(true);
    try {
      const res = await api.draftClause({
        clauseType,
        requirements: clauseRequirements,
        jurisdiction: clauseJurisdiction
      });
      setDraftedClause(res);
    } catch (err) {
      console.error('Draft clause error:', err);
    } finally {
      setIsDraftingClause(false);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatSending) return;
    const userText = chatInput.trim();
    setChatInput('');
    const newMessages = [...chatMessages, { role: 'user' as const, text: userText }];
    setChatMessages(newMessages);
    setIsChatSending(true);

    try {
      const reply = await api.chatLegalAI(newMessages);
      setChatMessages([...newMessages, { role: 'model', text: reply }]);
    } catch (err) {
      setChatMessages([...newMessages, { role: 'model', text: 'I apologize, but an error occurred while generating the legal assessment. Please consult Advocate Singhania directly.' }]);
    } finally {
      setIsChatSending(false);
    }
  };

  const handleSaveAnalyzedDoc = () => {
    if (!aiSummary || !onSaveToVault) return;
    onSaveToVault({
      title: docTitle || 'Analyzed Legal Document',
      category: docCategory,
      content: docText,
      fileSize: `${Math.round(docText.length / 1024)} KB`,
      tags: ['AI-Analyzed', docCategory, `Risk Score: ${aiSummary.riskScore}`],
      aiSummary
    });
    setSavedToVaultSuccess(true);
    setTimeout(() => setSavedToVaultSuccess(false), 4000);
  };

  const copyToClipboard = (text: string, type: 'summary' | 'clause') => {
    navigator.clipboard.writeText(text);
    if (type === 'summary') {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    } else {
      setCopiedClause(true);
      setTimeout(() => setCopiedClause(false), 2000);
    }
  };

  return (
    <section className="py-16 bg-slate-950 border-b border-slate-800/60 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs font-semibold text-amber-300 mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              Google Gemini AI Powered Legal Intelligence Engine
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Chambers AI Legal Analysis & Research Lab
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl font-light">
              Harness free-tier Gemini statutory intelligence to scan contracts for liabilities, evaluate judicial case viability, and draft customized protective clauses.
            </p>
          </div>

          {/* Module Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
            <button
              onClick={() => setActiveTab('document')}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'document'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Doc Summarizer & Risks</span>
            </button>
            <button
              onClick={() => setActiveTab('insight')}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'insight'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Case Viability Analyzer</span>
            </button>
            <button
              onClick={() => setActiveTab('clauses')}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'clauses'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Gavel className="w-3.5 h-3.5" />
              <span>Clause Drafter</span>
            </button>
            <button
              onClick={() => setActiveTab('assistant')}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'assistant'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Legal AI Chat</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Document Summarizer & Risk Scanner */}
        {activeTab === 'document' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Document Input & Samples */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    Document Input & Sample Contracts
                  </span>
                  <span className="text-[11px] text-slate-400">Gemini 3.7 Flash</span>
                </div>

                {/* Pre-Loaded Sample Templates */}
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-medium">Select Standard Legal Document to Inspect:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {sampleContracts.map((sample, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setDocTitle(sample.title);
                          setDocCategory(sample.category);
                          setDocText(sample.text);
                          setAiSummary(null);
                        }}
                        className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                          docTitle === sample.title
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                            : 'bg-slate-950/60 hover:bg-slate-950 text-slate-300 border-slate-800'
                        }`}
                      >
                        <div className="font-semibold line-clamp-1">{sample.category}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{sample.title}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title & Category Input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Document Title / Caption</label>
                    <input
                      type="text"
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Document Category</label>
                    <input
                      type="text"
                      value={docCategory}
                      onChange={(e) => setDocCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Text Area */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-slate-400">Legal Agreement / Pleading Clauses</label>
                    <span className="text-[11px] text-slate-500">{docText.length} characters</span>
                  </div>
                  <textarea
                    rows={9}
                    value={docText}
                    onChange={(e) => setDocText(e.target.value)}
                    placeholder="Paste contract clauses, NDA, petition draft, or settlement deed..."
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500 leading-relaxed resize-none"
                  />
                </div>

                {/* Action CTA */}
                <button
                  onClick={handleSummarizeDoc}
                  disabled={isSummarizing || !docText.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all transform active:scale-98"
                >
                  {isSummarizing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Scanning Clauses & Statutory Liabilities...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Run Gemini AI Legal Audit & Summary</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Summary Results Panel */}
            <div className="lg:col-span-6">
              {aiSummary ? (
                <div className="p-6 rounded-2xl bg-slate-900/95 border border-amber-500/40 shadow-2xl space-y-5 animate-in fade-in duration-300">
                  
                  {/* Top Bar */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        AI Analysis Verified
                      </span>
                      <h4 className="font-serif text-lg font-bold text-white mt-1">
                        {docTitle || "Legal Document Evaluation"}
                      </h4>
                    </div>

                    {/* Risk Score Pill */}
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Risk Assessment</div>
                      <div className={`text-xl font-bold font-serif ${
                        aiSummary.riskScore > 60 ? 'text-rose-400' : aiSummary.riskScore > 35 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {aiSummary.riskScore}/100 Risk Score
                      </div>
                    </div>
                  </div>

                  {/* Summary Narrative */}
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                      Executive Legal Summary:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-850">
                      {aiSummary.summary}
                    </p>
                  </div>

                  {/* Key Obligations */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Core Obligations & Covenants:
                    </span>
                    <ul className="space-y-1.5">
                      {aiSummary.keyObligations.map((ob, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/40 p-2 rounded-lg border border-slate-850">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                          <span>{ob}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Risk Factors & Exposure */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Identified Legal Risks & Liabilities:
                    </span>
                    <ul className="space-y-1.5">
                      {aiSummary.riskFactors.map((rf, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-rose-950/20 p-2 rounded-lg border border-rose-900/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0"></span>
                          <span>{rf}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Governing Law */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs flex items-center justify-between">
                    <span className="text-slate-400">Jurisdiction & Governing Seat:</span>
                    <span className="font-semibold text-amber-300">{aiSummary.governingLaw}</span>
                  </div>

                  {/* Recommended Amendments */}
                  {aiSummary.recommendedClausesToAmend && (
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                        Advocate Singhania’s Strategic Amendments:
                      </span>
                      <div className="space-y-1">
                        {aiSummary.recommendedClausesToAmend.map((rec, i) => (
                          <div key={i} className="text-xs text-slate-300 p-2 rounded-lg bg-indigo-950/20 border border-indigo-900/30">
                            👉 {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(aiSummary, null, 2), 'summary')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5"
                    >
                      {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSummary ? 'Copied' : 'Copy Analysis'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSaveAnalyzedDoc}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium border border-amber-500/30 flex items-center gap-1.5"
                      >
                        <BookmarkPlus className="w-3.5 h-3.5" />
                        <span>{savedToVaultSuccess ? 'Saved to Vault ✓' : 'Save to Client Vault'}</span>
                      </button>

                      <button
                        onClick={onBookConsultation}
                        className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1 shadow-sm"
                      >
                        <span>Discuss with Counsel</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="h-full min-h-[380px] p-8 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-amber-400">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div className="max-w-md space-y-1">
                    <h4 className="font-serif text-lg font-bold text-white">
                      Instant Document Intelligence
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-light">
                      Select a sample contract or paste your legal agreement on the left. Gemini AI will dissect indemnities, hidden covenants, liability limits, and dispute seats.
                    </p>
                  </div>
                  <button
                    onClick={handleSummarizeDoc}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-amber-500/30 flex items-center gap-1.5"
                  >
                    <span>Run Analysis on Sample MSA</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tab 2: Case Viability & Statutory Insight Analyzer */}
        {activeTab === 'insight' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Fact Scenario Form */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Scale className="w-4 h-4" />
                    Case Facts & Dispute Parameters
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    Free Judicial Assessment
                  </span>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Practice Area Discipline</label>
                  <select
                    value={practiceArea}
                    onChange={(e) => setPracticeArea(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Commercial & Corporate Disputes">Commercial & Corporate Disputes</option>
                    <option value="Constitutional & Civil Litigation">Constitutional & Civil Litigation</option>
                    <option value="Intellectual Property & Cyber Law">Intellectual Property & Cyber Law</option>
                    <option value="International & Domestic Arbitration">International & Domestic Arbitration</option>
                    <option value="White-Collar & Regulatory Defense">White-Collar & Regulatory Defense</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Jurisdiction / Forum Seat</label>
                  <input
                    type="text"
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Target Legal Objective</label>
                  <input
                    type="text"
                    value={clientGoal}
                    onChange={(e) => setClientGoal(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Factual Chronology & Dispute Summary</label>
                  <textarea
                    rows={7}
                    value={facts}
                    onChange={(e) => setFacts(e.target.value)}
                    placeholder="Describe sequence of events, contractual breach, default amounts, and actions taken..."
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-sans focus:outline-none focus:border-amber-500 leading-relaxed resize-none"
                  />
                </div>

                <button
                  onClick={handleAnalyzeCaseViability}
                  disabled={isAnalyzingCase || !facts.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
                >
                  {isAnalyzingCase ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Synthesizing Statutes, Precedents & Roadmaps...</span>
                    </>
                  ) : (
                    <>
                      <Scale className="w-4 h-4" />
                      <span>Compute Case Viability & Statutory Roadmap</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Case Viability Report Panel */}
            <div className="lg:col-span-7">
              {caseInsight ? (
                <div className="p-6 rounded-2xl bg-slate-900/95 border border-amber-500/40 shadow-2xl space-y-5 animate-in fade-in duration-300">
                  
                  {/* Top Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        Judicial Viability Assessment
                      </span>
                      <h4 className="font-serif text-xl font-bold text-white mt-1">
                        {caseInsight.caseTitle}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-400 uppercase">Viability Score</div>
                        <div className="text-2xl font-bold font-serif text-emerald-400">
                          {caseInsight.viabilityScore}%
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-400 uppercase">Risk Level</div>
                        <div className="text-sm font-bold text-amber-300">
                          {caseInsight.riskLevel}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Procedural Roadmap */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Gavel className="w-3.5 h-3.5" />
                      Sequential Judicial & Procedural Roadmap:
                    </span>
                    <div className="space-y-2">
                      {caseInsight.proceduralRoadmap.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-850">
                          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </span>
                          <p className="text-xs text-slate-300 font-light leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Applicable Statutes & Precedents */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      Applicable Statutory Framework & Precedents:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {caseInsight.applicableStatutesAndPrecedents.map((stat, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-900/40 text-xs text-indigo-200">
                          ⚖️ {stat}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strategic Recommendations */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                      Strategic Counsel Recommendations:
                    </span>
                    <div className="space-y-1.5">
                      {caseInsight.strategicRecommendations.map((rec, i) => (
                        <div key={i} className="text-xs text-slate-300 p-2.5 rounded-lg bg-slate-950/40 border border-slate-850 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Attorney Notes & Timeline */}
                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/25 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-amber-300 font-semibold">
                      <span>Senior Counsel Notes:</span>
                      <span className="text-slate-400 font-normal">Est. Timeline: {caseInsight.estimatedTimeline}</span>
                    </div>
                    <p className="text-slate-300 italic font-serif">
                      "{caseInsight.attorneyNotes}"
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                    <span className="text-xs text-slate-400">Ready to initiate notice or court motion?</span>
                    <button
                      onClick={onBookConsultation}
                      className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md"
                    >
                      <span>Book Strategy Session with Advocate</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              ) : (
                <div className="h-full min-h-[400px] p-8 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-amber-400">
                    <Scale className="w-7 h-7" />
                  </div>
                  <div className="max-w-md space-y-1">
                    <h4 className="font-serif text-lg font-bold text-white">
                      Case Viability & Statutory Forensics
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-light">
                      Submit your factual dispute summary to compute legal success probability, identify key statutory sections, and draft a step-by-step litigation roadmap.
                    </p>
                  </div>
                  <button
                    onClick={handleAnalyzeCaseViability}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-amber-500/30 flex items-center gap-1.5"
                  >
                    <span>Analyze Sample Breach Scenario</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tab 3: Custom Clause Drafter */}
        {activeTab === 'clauses' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Clause Config Form */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Gavel className="w-4 h-4" />
                  Clause Drafting Specifications
                </span>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Clause Type</label>
                  <select
                    value={clauseType}
                    onChange={(e) => setClauseType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Limitation of Liability & Indemnity">Limitation of Liability & Indemnity</option>
                    <option value="Arbitration, Venue & Seat of Dispute">Arbitration, Venue & Seat of Dispute</option>
                    <option value="Non-Compete, Non-Solicitation & Trade Secrets">Non-Compete, Non-Solicitation & Trade Secrets</option>
                    <option value="Liquidated Damages & Default Penalties">Liquidated Damages & Default Penalties</option>
                    <option value="Termination for Cause & Cure Period">Termination for Cause & Cure Period</option>
                    <option value="IP Assignment & Moral Rights Waiver">IP Assignment & Moral Rights Waiver</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Governing Jurisdiction & Seat</label>
                  <input
                    type="text"
                    value={clauseJurisdiction}
                    onChange={(e) => setClauseJurisdiction(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Client Protective Requirements & Carve-Outs</label>
                  <textarea
                    rows={6}
                    value={clauseRequirements}
                    onChange={(e) => setClauseRequirements(e.target.value)}
                    placeholder="Specify monetary caps, exclusions, mutual defense covenants, notice timelines..."
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500 leading-relaxed resize-none"
                  />
                </div>

                <button
                  onClick={handleDraftClause}
                  disabled={isDraftingClause || !clauseRequirements.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
                >
                  {isDraftingClause ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Drafting Statutory Enforceable Clause...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Draft Ironclad Custom Clause</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Drafted Clause Output */}
            <div className="lg:col-span-7">
              {draftedClause ? (
                <div className="p-6 rounded-2xl bg-slate-900/95 border border-amber-500/40 shadow-2xl space-y-5 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                        Enforceable Clause Ready
                      </span>
                      <h4 className="font-serif text-lg font-bold text-white mt-1">
                        {draftedClause.clauseTitle}
                      </h4>
                    </div>
                    <button
                      onClick={() => copyToClipboard(draftedClause.clauseText, 'clause')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center gap-1 border border-amber-500/30"
                    >
                      {copiedClause ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedClause ? 'Copied to Clipboard' : 'Copy Clause'}</span>
                    </button>
                  </div>

                  {/* Clause Text Box */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
                      {draftedClause.clauseText}
                    </pre>
                  </div>

                  {/* Plain English Explanation */}
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/30 text-xs space-y-1">
                    <span className="font-semibold text-emerald-400 block">Plain English Legal Protection:</span>
                    <p className="text-slate-300 font-light leading-relaxed">
                      {draftedClause.plainEnglishExplanation}
                    </p>
                  </div>

                  {/* Senior Advocate Notes */}
                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs space-y-1">
                    <span className="font-semibold text-amber-300 block">Chambers Practice Notes:</span>
                    <p className="text-slate-300 font-serif italic">
                      "{draftedClause.advocateNotes}"
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[380px] p-8 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-amber-400">
                    <Gavel className="w-7 h-7" />
                  </div>
                  <div className="max-w-md space-y-1">
                    <h4 className="font-serif text-lg font-bold text-white">
                      Bespoke Legal Clause Drafter
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-light">
                      Customize limitation caps, arbitration venues, and indemnities tailored specifically to Indian or international jurisdiction.
                    </p>
                  </div>
                  <button
                    onClick={handleDraftClause}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-amber-500/30 flex items-center gap-1.5"
                  >
                    <span>Draft Standard Indemnity Cap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tab 4: AI Legal Assistant Chat */}
        {activeTab === 'assistant' && (
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col h-[560px] overflow-hidden">
              
              {/* Chat Top Banner */}
              <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-white flex items-center gap-2">
                      Advocate AI Counsel Assistant
                      <span className="text-[10px] font-sans px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        Live Gemini 3.7
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Attorney-Client Privileged Session • Real-Time Statutory Analysis
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setChatMessages([chatMessages[0]])}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs flex items-center gap-1 border border-slate-800"
                  title="Clear conversation"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {chatMessages.map((msg, i) => {
                  const isModel = msg.role === 'model';
                  return (
                    <div
                      key={i}
                      className={`flex items-start gap-3 ${isModel ? 'justify-start' : 'justify-end'}`}
                    >
                      {isModel && (
                        <div className="w-7 h-7 rounded-full bg-slate-800 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xs flex-shrink-0">
                          <Scale className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                          isModel
                            ? 'bg-slate-950/80 border border-slate-800 text-slate-200'
                            : 'bg-amber-500 text-slate-950 font-medium'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                      </div>
                    </div>
                  );
                })}
                {isChatSending && (
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-slate-800 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xs">
                      <Scale className="w-3.5 h-3.5" />
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      <span>Reviewing judicial precedents and formulating counsel response...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Form */}
              <form onSubmit={handleSendChat} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask regarding contract indemnity, interim injunctions, arbitration seats, or filing steps..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isChatSending}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
