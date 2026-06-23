/**
 * MemeStudio — Main Page
 * Dark Studio Pro design system
 *
 * Layout:
 * - Left sidebar: template grid + text controls + style controls
 * - Right panel: live canvas preview + download button
 * - Mobile: sidebar collapses to bottom sheet tabs
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ChevronDown, Layers, Type, X, Sparkles, Zap } from 'lucide-react';
import { toast } from 'sonner';

import { MEME_TEMPLATES, type MemeTemplate } from '@/lib/memeTemplates';
import type { TextFieldValues, TextStyle } from '@/hooks/useMemeCanvas';
import TemplateGrid from '@/components/TemplateGrid';
import TextControls from '@/components/TextControls';
import MemeCanvas, { type MemeCanvasHandle } from '@/components/MemeCanvas';

const DEFAULT_TEXT_STYLE: TextStyle = {
  fontSize: 36,
  fontFamily: 'Impact',
  color: '#FFFFFF',
  uppercase: true,
  outlineColor: '#000000',
  outlineWidth: 4,
};

type SidebarTab = 'templates' | 'text';

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState<string | null>(null);
  const [textValues, setTextValues] = useState<TextFieldValues>({});
  const [textStyle, setTextStyle] = useState<TextStyle>(DEFAULT_TEXT_STYLE);
  const [isDownloading, setIsDownloading] = useState(false);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [mobilePanelTab, setMobilePanelTab] = useState<SidebarTab>('templates');
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('templates');

  const canvasRef = useRef<MemeCanvasHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTemplateSelect = useCallback((template: MemeTemplate) => {
    setSelectedTemplate(template);
    setCustomImageUrl(null);
    setTextValues({});
    // Auto-switch to text tab after selecting template
    setSidebarTab('text');
    setMobilePanelTab('text');
    setMobilePanelOpen(false);
  }, []);

  const handleCustomUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const url = URL.createObjectURL(file);
    setCustomImageUrl(url);

    const customTemplate = MEME_TEMPLATES.find((t) => t.id === 'custom')!;
    setSelectedTemplate(customTemplate);
    setTextValues({});
    setSidebarTab('text');
    setMobilePanelTab('text');
    setMobilePanelOpen(false);

    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleTextChange = useCallback((fieldId: string, value: string) => {
    setTextValues((prev) => ({ ...prev, [fieldId]: value }));
  }, []);

  const handleStyleChange = useCallback((updates: Partial<TextStyle>) => {
    setTextStyle((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleDownload = useCallback(async () => {
    if (!selectedTemplate) {
      toast.error('Select a meme template first!');
      return;
    }
    setIsDownloading(true);
    const templateName = selectedTemplate.name.toLowerCase().replace(/\s+/g, '-');
    canvasRef.current?.download(`memestudio-${templateName}.png`);
    toast.success('Meme downloaded! 🎉', {
      description: 'Your masterpiece has been saved as PNG.',
    });
    setTimeout(() => setIsDownloading(false), 800);
  }, [selectedTemplate]);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (customImageUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(customImageUrl);
      }
    };
  }, [customImageUrl]);

  const hasContent = selectedTemplate !== null;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0f0f11]">
      {/* ── Header ── */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-[#2a2a32] bg-[#141418] z-20">
        <div className="flex items-center gap-3">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663787290835/d4ADagJa53kpNkjKWRqpPH/meme-logo-c6GBrzsGFUpSxy6hr6bgGH.webp"
            alt="MemeStudio"
            className="w-7 h-7 object-contain"
          />
          <div>
            <h1 className="text-sm font-bold text-[#f0f0f5] leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              MemeStudio
            </h1>
            <p className="text-[10px] text-[#6b6b7a] leading-none mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Make it. Meme it. Send it.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tip badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#c8f135]/10 border border-[#c8f135]/20">
            <Zap size={10} className="text-[#c8f135]" />
            <span className="text-[10px] text-[#c8f135]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              8 templates · live preview · PNG export
            </span>
          </div>

          {/* Download button — desktop */}
          <motion.button
            whileHover={{ scale: hasContent ? 1.02 : 1 }}
            whileTap={{ scale: hasContent ? 0.97 : 1 }}
            onClick={handleDownload}
            disabled={!hasContent}
            className={`
              hidden sm:flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold
              transition-all duration-200
              ${isDownloading ? 'download-flash' : ''}
              ${hasContent
                ? 'btn-brand'
                : 'bg-[#2a2a32] text-[#6b6b7a] cursor-not-allowed'
              }
            `}
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <Download size={14} />
            Download Meme
          </motion.button>

          {/* Mobile panel toggle */}
          <button
            onClick={() => setMobilePanelOpen((v) => !v)}
            className="sm:hidden flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#2a2a32] text-[#f0f0f5] text-sm font-medium"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <Layers size={14} />
            <span>Edit</span>
            <ChevronDown
              size={12}
              className={`transition-transform duration-200 ${mobilePanelOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </header>

      {/* ── Main layout ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Desktop Sidebar ── */}
        <aside className="hidden sm:flex flex-col w-[320px] flex-shrink-0 border-r border-[#2a2a32] bg-[#141418] overflow-hidden">
          {/* Sidebar tabs */}
          <div className="flex border-b border-[#2a2a32]">
            {(['templates', 'text'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSidebarTab(tab)}
                className={`
                  flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all duration-150
                  ${sidebarTab === tab
                    ? 'text-[#c8f135] border-b-2 border-[#c8f135] bg-[#1a1a1f]'
                    : 'text-[#6b6b7a] hover:text-[#f0f0f5]'
                  }
                `}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {tab === 'templates' ? <Layers size={12} /> : <Type size={12} />}
                {tab === 'templates' ? 'Templates' : 'Text & Style'}
              </button>
            ))}
          </div>

          {/* Sidebar content */}
          <div className="flex-1 overflow-y-auto p-3">
            <AnimatePresence mode="wait">
              {sidebarTab === 'templates' ? (
                <motion.div
                  key="templates"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                >
                  <TemplateGrid
                    selectedId={selectedTemplate?.id ?? null}
                    onSelect={handleTemplateSelect}
                    onCustomUpload={handleCustomUpload}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="text"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                >
                  <TextControls
                    template={selectedTemplate}
                    textValues={textValues}
                    textStyle={textStyle}
                    onTextChange={handleTextChange}
                    onStyleChange={handleStyleChange}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>

        {/* ── Canvas Area ── */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#0f0f11]">
          {/* Canvas wrapper */}
          <div
            className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden relative"
            style={{
              backgroundImage: `url("https://d2xsxph8kpxj0f.cloudfront.net/310519663787290835/d4ADagJa53kpNkjKWRqpPH/canvas-bg-7pC8p72SdR4b3QmmLPvZuL.webp")`,
              backgroundSize: 'cover',
            }}
          >
            <MemeCanvas
              ref={canvasRef}
              template={selectedTemplate}
              customImageUrl={customImageUrl}
              textValues={textValues}
              textStyle={textStyle}
            />
          </div>

          {/* Canvas footer — status bar */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-t border-[#2a2a32] bg-[#141418]">
            <div className="flex items-center gap-3">
              {selectedTemplate ? (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c8f135] animate-pulse" />
                  <span className="text-[11px] text-[#6b6b7a]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {selectedTemplate.name}
                  </span>
                  <span className="text-[11px] text-[#3a3a45]">·</span>
                  <span className="text-[11px] text-[#3a3a45]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {selectedTemplate.textFields.length} text zone{selectedTemplate.textFields.length !== 1 ? 's' : ''}
                  </span>
                </>
              ) : (
                <span className="text-[11px] text-[#3a3a45]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  No template selected
                </span>
              )}
            </div>

            {/* Mobile download */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleDownload}
              disabled={!hasContent}
              className={`
                sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold
                transition-all duration-200
                ${hasContent ? 'btn-brand' : 'bg-[#2a2a32] text-[#6b6b7a] cursor-not-allowed'}
              `}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <Download size={12} />
              Download
            </motion.button>

            <div className="hidden sm:flex items-center gap-1.5">
              <Sparkles size={10} className="text-[#c8f135]" />
              <span className="text-[11px] text-[#3a3a45]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                PNG export · lossless
              </span>
            </div>
          </div>
        </main>
      </div>

      {/* ── Mobile Bottom Sheet ── */}
      <AnimatePresence>
        {mobilePanelOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="sm:hidden fixed inset-0 bg-black/60 z-30"
              onClick={() => setMobilePanelOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#141418] border-t border-[#2a2a32] rounded-t-2xl max-h-[80vh] flex flex-col"
            >
              {/* Sheet handle + tabs */}
              <div className="flex items-center justify-between px-4 pt-4 pb-2 relative">
                <div className="w-8 h-1 rounded-full bg-[#2a2a32] absolute left-1/2 -translate-x-1/2 top-2" />
                <div className="flex gap-1 mt-1">
                  {(['templates', 'text'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setMobilePanelTab(tab)}
                      className={`
                        flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all
                        ${mobilePanelTab === tab
                          ? 'bg-[#c8f135] text-[#0f0f11]'
                          : 'bg-[#2a2a32] text-[#6b6b7a]'
                        }
                      `}
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {tab === 'templates' ? <Layers size={11} /> : <Type size={11} />}
                      {tab === 'templates' ? 'Templates' : 'Text & Style'}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setMobilePanelOpen(false)}
                  className="ml-auto text-[#6b6b7a] hover:text-[#f0f0f5] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Sheet content */}
              <div className="flex-1 overflow-y-auto px-4 pb-6">
                <AnimatePresence mode="wait">
                  {mobilePanelTab === 'templates' ? (
                    <motion.div
                      key="m-templates"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <TemplateGrid
                        selectedId={selectedTemplate?.id ?? null}
                        onSelect={handleTemplateSelect}
                        onCustomUpload={handleCustomUpload}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="m-text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <TextControls
                        template={selectedTemplate}
                        textValues={textValues}
                        textStyle={textStyle}
                        onTextChange={handleTextChange}
                        onStyleChange={handleStyleChange}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
