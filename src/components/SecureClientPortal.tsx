import React, { useState } from 'react';
import {
  Lock,
  FileText,
  MessageSquare,
  Calendar,
  Shield,
  Upload,
  Trash2,
  Sparkles,
  Download,
  Send,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  UserCheck,
  Plus,
  Loader2,
  ExternalLink,
  Receipt,
  FileCode,
  KeyRound
} from 'lucide-react';
import { ClientDocument, SecureMessage, ConsultationBooking, PaymentRecord, UserAuth } from '../types';
import { api } from '../services/api';

interface SecureClientPortalProps {
  documents: ClientDocument[];
  messages: SecureMessage[];
  consultations: ConsultationBooking[];
  payments: PaymentRecord[];
  user: UserAuth | null;
  onRefreshData: () => void;
  onOpenBooking: () => void;
  onOpenAiLabWithDoc?: (doc: ClientDocument) => void;
}

export const SecureClientPortal: React.FC<SecureClientPortalProps> = ({
  documents,
  messages,
  consultations,
  payments,
  user,
  onRefreshData,
  onOpenBooking,
  onOpenAiLabWithDoc
}) => {
  const [activeTab, setActiveTab] = useState<'vault' | 'messages' | 'consultations' | 'security'>('vault');
  
  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocCategory, setNewDocCategory] = useState('Commercial Contract');
  const [newDocContent, setNewDocContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Selected doc for AI view
  const [selectedDocForAi, setSelectedDocForAi] = useState<ClientDocument | null>(null);

  // Messaging state
  const [chatText, setChatText] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim() || !newDocContent.trim()) return;
    setIsUploading(true);
    try {
      await api.uploadDocument({
        title: newDocTitle,
        category: newDocCategory,
        content: newDocContent,
        fileSize: `${Math.round(newDocContent.length / 1024) || 1} KB`,
        uploadedBy: user?.name || 'Client',
        tags: [newDocCategory, 'Vault Upload']
      });
      setIsUploadOpen(false);
      setNewDocTitle('');
      setNewDocContent('');
      onRefreshData();
    } catch (err) {
      console.error('Doc upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDoc = async (id: string) => {
    if (!confirm('Are you sure you want to remove this privileged document from your vault?')) return;
    try {
      await api.deleteDocument(id);
      onRefreshData();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim() || isSendingMessage) return;
    const textToSend = chatText;
    setChatText('');
    setIsSendingMessage(true);
    try {
      await api.sendMessage({
        sender: 'client',
        senderName: user?.name || 'Client',
        recipient: 'advocate',
        text: textToSend
      });
      onRefreshData();
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <section className="py-12 bg-slate-950 border-b border-slate-800/60 min-h-[700px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Portal Header */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/20 border border-slate-800 shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-xs font-semibold text-emerald-400">
              <Lock className="w-3.5 h-3.5" />
              Attorney-Client Privileged Secure Portal
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Singhania Chambers Client Vault & Docket
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-light">
              End-to-end encrypted document repository, privileged advocate communication, and booking records.
            </p>
          </div>

          {/* User Verification Tag */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                {user?.name || "Verified Client"}
                <span className="text-[9px] px-1 rounded bg-emerald-900 text-emerald-300">Active</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {user?.email || "ajaytripathi821@gmail.com"}
              </div>
              <div className="text-[10px] text-amber-400 mt-0.5">
                OAuth 2.0 & MongoDB Verified
              </div>
            </div>
          </div>
        </div>

        {/* Portal Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('vault')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'vault'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Document Vault ({documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'messages'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Privileged Messages ({messages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('consultations')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'consultations'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Consultations & Invoices ({consultations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'security'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Security & OAuth Protocols</span>
          </button>
        </div>

        {/* TAB 1: Privileged Document Vault */}
        {activeTab === 'vault' && (
          <div className="space-y-6">
            
            {/* Vault Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-white">Privileged Legal Documents</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Contracts, affidavits, petitions, and evidence stored securely in MongoDB Atlas
                </p>
              </div>

              <button
                onClick={() => setIsUploadOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Document to Vault</span>
              </button>
            </div>

            {/* Document Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-xl group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-950 text-amber-400 border border-slate-800">
                        {doc.category}
                      </span>
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                        <Lock className="w-3 h-3" />
                        Privileged
                      </span>
                    </div>

                    <h4 className="font-serif text-base font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                      {doc.title}
                    </h4>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                      <span>Size: {doc.fileSize}</span>
                      <span>•</span>
                      <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* AI Summary Snippet */}
                    {doc.aiSummary && (
                      <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-850 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-amber-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Gemini AI Summary
                          </span>
                          <span className={`text-[10px] font-bold ${
                            doc.aiSummary.riskScore > 50 ? 'text-rose-400' : 'text-emerald-400'
                          }`}>
                            {doc.aiSummary.riskScore}/100 Risk
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-light line-clamp-2">
                          {doc.aiSummary.summary}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Document Actions */}
                  <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedDocForAi(doc)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium flex items-center gap-1 border border-amber-500/20"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      View AI Audit
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          const blob = new Blob([doc.content || "Privileged Document Content"], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${doc.title}.txt`;
                          a.click();
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDoc(doc.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-400 text-xs"
                        title="Delete from Vault"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Summary Modal */}
            {selectedDocForAi && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-400">
                        Privileged Vault AI Analysis
                      </span>
                      <h4 className="font-serif text-lg font-bold text-white">
                        {selectedDocForAi.title}
                      </h4>
                    </div>
                    <button
                      onClick={() => setSelectedDocForAi(null)}
                      className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
                    >
                      Close ✕
                    </button>
                  </div>

                  {selectedDocForAi.aiSummary ? (
                    <div className="space-y-4 text-xs">
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-850 space-y-1">
                        <span className="font-semibold text-amber-300">Executive Summary:</span>
                        <p className="text-slate-300 font-light leading-relaxed">
                          {selectedDocForAi.aiSummary.summary}
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <span className="font-semibold text-emerald-400">Key Obligations:</span>
                        <ul className="space-y-1">
                          {selectedDocForAi.aiSummary.keyObligations.map((ob, i) => (
                            <li key={i} className="text-slate-300 flex items-start gap-2 bg-slate-950/50 p-2 rounded-lg">
                              • {ob}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-1.5">
                        <span className="font-semibold text-rose-400">Identified Exposure & Risks:</span>
                        <ul className="space-y-1">
                          {selectedDocForAi.aiSummary.riskFactors.map((rf, i) => (
                            <li key={i} className="text-slate-300 flex items-start gap-2 bg-rose-950/20 p-2 rounded-lg">
                              ⚠️ {rf}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-xs">
                      No automated summary currently computed for this document.
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={() => setSelectedDocForAi(null)}
                      className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                    >
                      Close Analysis
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Document Upload Modal */}
            {isUploadOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h4 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                      <Upload className="w-4 h-4 text-amber-400" />
                      Deposit Legal Document into Privileged Vault
                    </h4>
                    <button
                      onClick={() => setIsUploadOpen(false)}
                      className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleUploadDocument} className="space-y-4 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">Document Title</label>
                      <input
                        type="text"
                        value={newDocTitle}
                        onChange={(e) => setNewDocTitle(e.target.value)}
                        placeholder="e.g. Share Purchase Agreement (SPA) Draft"
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Legal Category</label>
                      <select
                        value={newDocCategory}
                        onChange={(e) => setNewDocCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="Commercial Contract">Commercial Contract / MSA</option>
                        <option value="Court Pleading">Court Pleading / Petition</option>
                        <option value="Affidavit & Deposition">Affidavit & Deposition</option>
                        <option value="Injunction Notice">Legal Notice & Injunction</option>
                        <option value="Arbitration Brief">Arbitration Statement of Claim</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Document Text / Clauses Content</label>
                      <textarea
                        rows={6}
                        value={newDocContent}
                        onChange={(e) => setNewDocContent(e.target.value)}
                        placeholder="Paste document text here. Gemini AI will automatically generate an audit summary upon deposit..."
                        className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono focus:outline-none focus:border-amber-500 resize-none"
                        required
                      />
                    </div>

                    <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/20 text-[11px] text-slate-300">
                      ⚡ Gemini AI will automatically extract obligations, calculate statutory risk score, and index this document in your MongoDB encrypted vault.
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsUploadOpen(false)}
                        className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isUploading || !newDocTitle.trim() || !newDocContent.trim()}
                        className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold flex items-center gap-1.5"
                      >
                        {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        <span>Deposit & Auto-Analyze</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: Privileged Encrypted Messages */}
        {activeTab === 'messages' && (
          <div className="max-w-4xl mx-auto rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col h-[580px] overflow-hidden">
            
            {/* Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-amber-500/40 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1556157382-97eda2d62296?w=120&auto=format&fit=crop&q=80"
                    alt="Advocate Singhania"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-white flex items-center gap-2">
                    Adv. Rajeshwar V. Singhania
                    <span className="text-[10px] font-sans px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Privileged Thread
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Lead Counsel • Supreme Court Chambers Docket
                  </p>
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-400">
                <span className="text-emerald-400 flex items-center gap-1 justify-end">
                  <Lock className="w-3 h-3" />
                  E2E Encrypted
                </span>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((msg) => {
                const isAdvocate = msg.sender === 'advocate';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAdvocate ? 'items-start' : 'items-end'}`}
                  >
                    <div className="text-[10px] text-slate-500 mb-1 px-1">
                      {msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                        isAdvocate
                          ? 'bg-slate-950 border border-slate-850 text-slate-200'
                          : 'bg-amber-500 text-slate-950 font-medium'
                      }`}
                    >
                      <p>{msg.text}</p>
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-800/60 text-[11px] flex items-center gap-1.5 text-amber-400">
                          <FileText className="w-3 h-3" />
                          <span>Attachment: {msg.attachments[0]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                placeholder="Type privileged inquiry to Senior Counsel Singhania..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={!chatText.trim() || isSendingMessage}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isSendingMessage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>

          </div>
        )}

        {/* TAB 3: Consultations & Invoices */}
        {activeTab === 'consultations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-white">Scheduled Consultations & Billing Ledger</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time booking records, Google Meet video links, and verified payment invoices
                </p>
              </div>
              <button
                onClick={onOpenBooking}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Book New Session</span>
              </button>
            </div>

            <div className="space-y-4">
              {consultations.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-serif text-white">{c.consultationType}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {c.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300">
                      📅 <strong>{c.date}</strong> at <strong>{c.timeSlot}</strong>
                    </div>
                    <p className="text-xs text-slate-400 font-light max-w-xl">
                      Matter: {c.matterBrief}
                    </p>
                    <div className="text-[11px] text-amber-400">
                      Payment Status: {c.paymentStatus}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {c.meetLink && (
                      <a
                        href={c.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                      >
                        <span>Join Google Meet</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => window.print()}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1"
                      title="Print Official Invoice"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Invoice</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Security & OAuth Protocols */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-white">OAuth 2.0 Identity Protocol</h4>
                  <p className="text-xs text-slate-400">Cryptographically signed authentication tokens</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 font-light leading-relaxed">
                Client authentication is anchored in Google OAuth 2.0 standards, ensuring that unauthorized third parties cannot access chamber filings or privileged communication channels.
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-400 font-mono">
                Provider: Google Identity Services (GSI) • Token Scope: Identity & Meet Integration
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-white">MongoDB Atlas & Encryption-at-Rest</h4>
                  <p className="text-xs text-slate-400">Privileged Vault Storage Standards</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 font-light leading-relaxed">
                All legal briefs, contract summaries, and chat transcripts are stored in MongoDB collections with TLS 1.3 in transit and AES-256 at rest, conforming with Bar Council confidential handling norms.
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-400 font-mono">
                Database: MongoDB Atlas (M0 Free Cluster Tier Compatible)
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
