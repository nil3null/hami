/**
 * MemeStudio — Meme Canvas Component
 * Dark Studio Pro design system
 * Renders the HTML5 canvas with the meme image + text overlays
 */

import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import type { MemeTemplate } from '@/lib/memeTemplates';
import type { TextFieldValues, TextStyle } from '@/hooks/useMemeCanvas';
import { useMemeCanvas } from '@/hooks/useMemeCanvas';
import { motion } from 'framer-motion';

export interface MemeCanvasHandle {
  download: (filename?: string) => void;
}

interface MemeCanvasProps {
  template: MemeTemplate | null;
  customImageUrl: string | null;
  textValues: TextFieldValues;
  textStyle: TextStyle;
}

const MemeCanvas = forwardRef<MemeCanvasHandle, MemeCanvasProps>(
  ({ template, customImageUrl, textValues, textStyle }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const { downloadMeme } = useMemeCanvas({
      template,
      customImageUrl,
      textValues,
      textStyle,
      canvasRef,
    });

    useImperativeHandle(ref, () => ({
      download: (filename?: string) => downloadMeme(filename),
    }));

    const hasImage = template && (template.imageUrl || customImageUrl);

    return (
      <div className="flex flex-col items-center justify-center w-full h-full min-h-[300px] relative">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(200,241,53,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(200,241,53,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {!hasImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#1a1a1f] border border-[#2a2a32] flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="4" y="8" width="24" height="18" rx="2" stroke="#2a2a32" strokeWidth="1.5"/>
                <circle cx="12" cy="15" r="2.5" stroke="#c8f135" strokeWidth="1.5"/>
                <path d="M4 22L10 16L15 21L20 15L28 22" stroke="#2a2a32" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-[#f0f0f5] font-semibold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                No template selected
              </p>
              <p className="text-[#6b6b7a] text-xs mt-1">
                Pick a template from the sidebar to get started
              </p>
            </div>
          </motion.div>
        )}

        <motion.canvas
          key={template?.id || 'empty'}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: hasImage ? 1 : 0, scale: hasImage ? 1 : 0.97 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          ref={canvasRef}
          width={800}
          height={600}
          className="max-w-full max-h-full object-contain relative z-10"
          style={{
            boxShadow: hasImage ? '0 0 0 1px rgba(200,241,53,0.1), 0 20px 60px rgba(0,0,0,0.6)' : 'none',
          }}
        />
      </div>
    );
  }
);

MemeCanvas.displayName = 'MemeCanvas';
export default MemeCanvas;
