/**
 * MemeStudio — Template Grid Component
 * Dark Studio Pro design system
 * Shows a scrollable grid of meme template thumbnails
 */

import { MEME_TEMPLATES, type MemeTemplate } from '@/lib/memeTemplates';
import { Upload } from 'lucide-react';
import { motion } from 'framer-motion';

interface TemplateGridProps {
  selectedId: string | null;
  onSelect: (template: MemeTemplate) => void;
  onCustomUpload: () => void;
}

// Direct URLs for thumbnails (no CORS proxy needed for <img> tags)
const THUMBNAIL_URLS: Record<string, string> = {
  'drake': 'https://i.imgflip.com/30b1gx.jpg',
  'two-buttons': 'https://i.imgflip.com/1g8my4.jpg',
  'change-my-mind': 'https://i.imgflip.com/24y43o.jpg',
  'doge': 'https://i.imgflip.com/4t0m5.jpg',
  'left-exit': 'https://i.imgflip.com/22bdq6.jpg',
  'distracted-bf': 'https://i.imgflip.com/1ur9b0.jpg',
  'this-is-fine': 'https://i.imgflip.com/wxica.jpg',
  'one-does-not': 'https://i.imgflip.com/1bij.jpg',
};

export default function TemplateGrid({
  selectedId,
  onSelect,
  onCustomUpload,
}: TemplateGridProps) {
  const templates = MEME_TEMPLATES.filter((t) => t.id !== 'custom');

  return (
    <div className="flex flex-col gap-2">
      <p className="mono-label mb-1">Templates</p>

      {/* Custom upload button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={onCustomUpload}
        className={`
          flex items-center gap-2 w-full px-3 py-2.5 rounded-md border text-sm font-medium
          transition-all duration-150
          ${selectedId === 'custom'
            ? 'border-[#c8f135] bg-[#c8f135]/10 text-[#c8f135]'
            : 'border-[#2a2a32] bg-[#1e1e26] text-[#f0f0f5] hover:border-[#c8f135]/50 hover:text-[#c8f135]'
          }
        `}
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        <Upload size={14} />
        <span>Upload Custom Image</span>
      </motion.button>

      {/* Template grid */}
      <div className="grid grid-cols-2 gap-2 mt-1">
        {templates.map((template, index) => (
          <motion.button
            key={template.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            onClick={() => onSelect(template)}
            className={`template-card group relative text-left ${selectedId === template.id ? 'active' : ''}`}
          >
            {/* Thumbnail */}
            <div className="relative overflow-hidden bg-[#1a1a1f]" style={{ aspectRatio: template.aspectRatio }}>
              <img
                src={THUMBNAIL_URLS[template.id] || template.imageUrl}
                alt={template.name}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                loading="lazy"
              />
              {/* Active overlay */}
              {selectedId === template.id && (
                <div className="absolute inset-0 bg-[#c8f135]/15 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-[#c8f135] flex items-center justify-center">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="#0f0f11" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              )}
            </div>
            {/* Label */}
            <div className="px-2 py-1.5 bg-[#1a1a1f]">
              <p className="text-[11px] font-medium text-[#f0f0f5] leading-tight truncate"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {template.name}
              </p>
              <p className="text-[10px] text-[#6b6b7a] mt-0.5">{template.category}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
