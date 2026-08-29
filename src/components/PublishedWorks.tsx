import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  BookOpen,
  Scale,
  Calendar,
  Tag,
  ExternalLink,
  ChevronRight,
  Sparkles,
  FileText,
  Search,
  Filter,
  Image as ImageIcon,
  Clock,
  Award,
  Layers,
  ChevronLeft,
  X,
  Share2,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Plus
} from 'lucide-react';
import { AdvocateWork } from '../types';

interface PublishedWorksProps {
  works: AdvocateWork[];
  isChambersAdmin?: boolean;
  onOpenAdminPortal?: () => void;
}

const ITEMS_PER_PAGE = 3;

export const PublishedWorks: React.FC<PublishedWorksProps> = ({
  works,
  isChambersAdmin = false,
  onOpenAdminPortal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedWorkForModal, setSelectedWorkForModal] = useState<AdvocateWork | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Infinite Scroll State (Industrial IntersectionObserver Approach)
  const [displayedCount, setDisplayedCount] = useState<number>(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Categories extraction
  const categories = useMemo(() => {
    const set = new Set<string>();
    works.forEach(w => set.add(w.category));
    return ['All', ...Array.from(set)];
  }, [works]);

  // Filtered list
  const filteredWorks = useMemo(() => {
    return works.filter(w => {
      const matchCat = selectedCategory === 'All' || w.category === selectedCategory;
      const matchQuery =
        w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.keyRuling.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.citationOrMatter.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [works, selectedCategory, searchQuery]);

  // Sliced items for infinite scroll display
  const visibleWorks = useMemo(() => {
    return filteredWorks.slice(0, displayedCount);
  }, [filteredWorks, displayedCount]);

  const hasMore = displayedCount < filteredWorks.length;

  // Infinite Scroll IntersectionObserver
  useEffect(() => {
    if (!hasMore || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasMore) {
          setIsLoadingMore(true);
          // Debounce delay to prevent layout thrashing
          setTimeout(() => {
            setDisplayedCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredWorks.length));
            setIsLoadingMore(false);
          }, 400);
        }
      },
      {
        root: null,
        rootMargin: '120px',
        threshold: 0.1
      }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
      observer.disconnect();
    };
  }, [hasMore, isLoadingMore, filteredWorks.length]);

  // Reset page when category or search changes
  useEffect(() => {
    setDisplayedCount(ITEMS_PER_PAGE);
  }, [searchQuery, selectedCategory]);

  return (
    <section className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Scale className="w-3.5 h-3.5" />
            <span>Advocacy Record & Landmark Jurisprudence</span>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-white tracking-tight">
            Published Legal Works & Landmark Court Rulings
          </h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-2xl">
            Selected judicial arguments, constitutional interpretations, reported precedents, and statutory analyses authored and defended by Adv. Utkarsh Pandey.
          </p>
        </div>

        {isChambersAdmin && (
          <button
            onClick={onOpenAdminPortal}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/15"
          >
            <Plus className="w-4 h-4" />
            <span>Chambers Thought & Case Manager</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-sm">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10 font-bold'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search rulings, citations, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Infinite Scroll List of Works */}
      {visibleWorks.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-slate-300">No published works match your criteria</h4>
          <p className="text-xs text-slate-500 mt-1">Try clearing filters or checking other practice areas.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {visibleWorks.map((work, index) => (
            <article
              key={work.id}
              className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-xl space-y-6 group relative overflow-hidden"
            >
              {/* Subtle gold corner tint */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/10 transition-all"></div>

              {/* Card Meta & Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300">
                    {work.category}
                  </span>
                  <span className="text-xs text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded-md border border-slate-800">
                    {work.court}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {work.citationOrMatter}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{work.date}</span>
                </div>
              </div>

              {/* Title & Core Ratio */}
              <div className="space-y-3">
                <h3
                  onClick={() => setSelectedWorkForModal(work)}
                  className="font-serif text-xl md:text-2xl font-bold text-white group-hover:text-amber-300 transition-colors cursor-pointer leading-tight"
                >
                  {work.title}
                </h3>
                
                {/* Ratio Decidendi Highlight Box */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ratio Decidendi / Core Legal Precedent</span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed italic">
                    "{work.keyRuling}"
                  </p>
                </div>

                <p className="text-xs md:text-sm text-slate-400 leading-relaxed line-clamp-3">
                  {work.synopsis}
                </p>
              </div>

              {/* Multi-Image Gallery Showcase (Up to 10 images) */}
              {work.images && work.images.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span>Case Records & Gallery Evidence ({work.images.length} photos)</span>
                    </span>
                    <span className="text-[11px] text-slate-500">Click photo to zoom</span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {work.images.slice(0, 4).map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedWorkForModal(work);
                          setActiveImageIndex(idx);
                        }}
                        className="relative rounded-xl overflow-hidden border border-slate-800 aspect-video bg-slate-950 cursor-pointer group/img hover:border-amber-500/60 transition-all"
                      >
                        <img
                          src={img}
                          alt={`${work.title} evidence ${idx + 1}`}
                          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        {idx === 3 && work.images.length > 4 && (
                          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xs">
                            +{work.images.length - 4} more
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Tags & Read More Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800/80 pt-4">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {work.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedWorkForModal(work)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                >
                  <span>Read Full Opinion (2000 Words)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Sentinel Trigger Element for Infinite Scroll */}
      <div ref={sentinelRef} className="py-6 flex items-center justify-center">
        {isLoadingMore ? (
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold py-2 px-4 rounded-full bg-slate-900 border border-slate-800">
            <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            <span>Loading additional judicial precedents...</span>
          </div>
        ) : hasMore ? (
          <button
            onClick={() => setDisplayedCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredWorks.length))}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs text-slate-400 hover:text-white transition-colors"
          >
            Scroll or click to load more ({filteredWorks.length - displayedCount} remaining)
          </button>
        ) : (
          visibleWorks.length > 0 && (
            <p className="text-xs text-slate-600 font-medium">
              — End of Reported Judicial Records & Thoughts Catalog —
            </p>
          )
        )}
      </div>

      {/* --- FULL OPINION & GALLERY MODAL (UP TO 2000 WORDS & 10 IMAGES) --- */}
      {selectedWorkForModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden my-6 max-h-[90vh] overflow-y-auto">
            
            {/* Top Close Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  {selectedWorkForModal.category}
                </span>
                <span className="text-xs text-slate-400 bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
                  {selectedWorkForModal.court}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedWorkForModal(null);
                  setActiveImageIndex(0);
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title & Citation */}
            <div className="space-y-2">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-white leading-tight">
                {selectedWorkForModal.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span>Matter Ref: <strong className="text-slate-200">{selectedWorkForModal.citationOrMatter}</strong></span>
                <span>Date of Pronouncement: <strong className="text-slate-200">{selectedWorkForModal.date}</strong></span>
                <span>Advocate Counsel: <strong className="text-amber-400">{selectedWorkForModal.publishedBy || 'Adv. Utkarsh Pandey'}</strong></span>
              </div>
            </div>

            {/* Ratio Decidendi */}
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Held & Settled Ratio:</span>
              </div>
              <p className="text-xs md:text-sm text-slate-200 leading-relaxed italic">
                "{selectedWorkForModal.keyRuling}"
              </p>
            </div>

            {/* Attached Multi-Image Lightbox Gallery */}
            {selectedWorkForModal.images && selectedWorkForModal.images.length > 0 && (
              <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-850">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-semibold flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>Case Documents & Evidence Showcase ({selectedWorkForModal.images.length} photos)</span>
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Showing image {activeImageIndex + 1} of {selectedWorkForModal.images.length}
                  </span>
                </div>

                {/* Main Selected Image */}
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 border border-slate-800">
                  <img
                    src={selectedWorkForModal.images[activeImageIndex]}
                    alt={`Evidence ${activeImageIndex + 1}`}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                  {selectedWorkForModal.images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setActiveImageIndex((prev) =>
                            prev === 0 ? selectedWorkForModal.images!.length - 1 : prev - 1
                          )
                        }
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/80 text-white hover:bg-amber-500 hover:text-slate-950 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setActiveImageIndex((prev) =>
                            prev === selectedWorkForModal.images!.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/80 text-white hover:bg-amber-500 hover:text-slate-950 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {selectedWorkForModal.images.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {selectedWorkForModal.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative rounded-lg overflow-hidden border w-16 h-12 shrink-0 transition-all ${
                          activeImageIndex === idx
                            ? 'border-amber-400 ring-2 ring-amber-400/20'
                            : 'border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Full 2,000-Word Content Body */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Full Judicial Argument & Detailed Commentary
              </h4>
              <div className="text-xs md:text-sm text-slate-300 leading-relaxed bg-slate-950/70 p-5 rounded-2xl border border-slate-850 whitespace-pre-line font-sans space-y-4">
                {selectedWorkForModal.fullContent || selectedWorkForModal.synopsis}
              </div>
            </div>

            {/* Tags & Counsel Signature */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 pt-4 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                {selectedWorkForModal.tags.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 text-[11px]">
                    #{t}
                  </span>
                ))}
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[10px]">AUTHORED & PUBLISHED BY</span>
                <span className="font-serif font-bold text-amber-300">{selectedWorkForModal.publishedBy || 'Adv. Utkarsh Pandey'}</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
