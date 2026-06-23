/**
 * MemeStudio — Text Controls Component
 * Dark Studio Pro design system
 * Dynamic text input fields + style controls (font, size, color, uppercase)
 */

import { type MemeTemplate, PRESET_COLORS, FONT_OPTIONS } from '@/lib/memeTemplates';
import type { TextFieldValues, TextStyle } from '@/hooks/useMemeCanvas';
import { Type, Palette, AlignCenter, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface TextControlsProps {
  template: MemeTemplate | null;
  textValues: TextFieldValues;
  textStyle: TextStyle;
  onTextChange: (fieldId: string, value: string) => void;
  onStyleChange: (updates: Partial<TextStyle>) => void;
}

export default function TextControls({
  template,
  textValues,
  textStyle,
  onTextChange,
  onStyleChange,
}: TextControlsProps) {
  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center py-8 gap-3">
        <div className="w-10 h-10 rounded-full bg-[#2a2a32] flex items-center justify-center">
          <Type size={18} className="text-[#6b6b7a]" />
        </div>
        <p className="text-[#6b6b7a] text-sm text-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Select a template to start editing
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Text Fields */}
      <div className="flex flex-col gap-3">
        <p className="mono-label flex items-center gap-1.5">
          <Type size={10} />
          Text Fields
        </p>
        {template.textFields.map((field, index) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col gap-1.5"
          >
            <label
              className="text-[11px] font-medium"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: '#6b6b7a' }}
            >
              {field.label}
            </label>
            <textarea
              value={textValues[field.id] || ''}
              onChange={(e) => onTextChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              rows={2}
              className="
                w-full px-3 py-2 rounded-md text-sm resize-none
                bg-[#1e1e26] border border-[#2a2a32] text-[#f0f0f5]
                placeholder:text-[#3a3a45]
                focus:outline-none focus:border-[#c8f135] focus:ring-1 focus:ring-[#c8f135]/20
                transition-all duration-150
              "
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </motion.div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-[#2a2a32]" />

      {/* Style Controls */}
      <div className="flex flex-col gap-3">
        <p className="mono-label flex items-center gap-1.5">
          <Palette size={10} />
          Text Style
        </p>

        {/* Font Family */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] text-[#6b6b7a]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Font
          </label>
          <div className="relative">
            <select
              value={textStyle.fontFamily}
              onChange={(e) => onStyleChange({ fontFamily: e.target.value })}
              className="
                w-full px-3 py-2 pr-8 rounded-md text-sm
                bg-[#1e1e26] border border-[#2a2a32] text-[#f0f0f5]
                focus:outline-none focus:border-[#c8f135]
                transition-all duration-150 appearance-none
              "
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {FONT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6b6b7a] pointer-events-none" />
          </div>
        </div>

        {/* Font Size */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] text-[#6b6b7a]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Font Size
            </label>
            <span className="text-[11px] font-medium text-[#c8f135]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {textStyle.fontSize}px
            </span>
          </div>
          <input
            type="range"
            min={12}
            max={80}
            value={textStyle.fontSize}
            onChange={(e) => onStyleChange({ fontSize: Number(e.target.value) })}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #c8f135 0%, #c8f135 ${((textStyle.fontSize - 12) / 68) * 100}%, #2a2a32 ${((textStyle.fontSize - 12) / 68) * 100}%, #2a2a32 100%)`,
              accentColor: '#c8f135',
            }}
          />
          {/* Quick size presets */}
          <div className="flex gap-1 mt-0.5">
            {[24, 36, 48, 64].map((size) => (
              <button
                key={size}
                onClick={() => onStyleChange({ fontSize: size })}
                className={`
                  flex-1 py-1 rounded text-[10px] font-medium transition-all duration-100
                  ${textStyle.fontSize === size
                    ? 'bg-[#c8f135] text-[#0f0f11]'
                    : 'bg-[#2a2a32] text-[#6b6b7a] hover:text-[#f0f0f5]'
                  }
                `}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Text Color */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] text-[#6b6b7a]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Text Color
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => onStyleChange({ color })}
                title={color}
                className={`
                  w-7 h-7 rounded-full transition-all duration-120 flex-shrink-0
                  ${textStyle.color === color
                    ? 'ring-2 ring-[#c8f135] ring-offset-1 ring-offset-[#141418] scale-110'
                    : 'hover:scale-110'
                  }
                `}
                style={{ backgroundColor: color, border: color === '#FFFFFF' ? '1px solid #2a2a32' : 'none' }}
              />
            ))}
            {/* Custom color picker */}
            <div className="relative w-7 h-7 flex-shrink-0">
              <input
                type="color"
                value={textStyle.color}
                onChange={(e) => onStyleChange({ color: e.target.value })}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                title="Custom color"
              />
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-dashed border-[#6b6b7a] hover:border-[#c8f135] transition-colors"
                style={{ backgroundColor: textStyle.color }}
              >
                <span style={{ color: textStyle.color === '#FFFFFF' || textStyle.color === '#FFD700' ? '#000' : '#fff', mixBlendMode: 'difference' }}>+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Outline */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] text-[#6b6b7a]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Outline Width
            </label>
            <span className="text-[11px] text-[#c8f135]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {textStyle.outlineWidth}px
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={8}
            value={textStyle.outlineWidth}
            onChange={(e) => onStyleChange({ outlineWidth: Number(e.target.value) })}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #c8f135 0%, #c8f135 ${(textStyle.outlineWidth / 8) * 100}%, #2a2a32 ${(textStyle.outlineWidth / 8) * 100}%, #2a2a32 100%)`,
              accentColor: '#c8f135',
            }}
          />
          <div className="flex items-center gap-2 mt-0.5">
            <label className="text-[11px] text-[#6b6b7a]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Outline Color
            </label>
            <div className="flex items-center gap-1.5 ml-auto">
              {['#000000', '#FFFFFF', '#FF4444', '#0044FF'].map((color) => (
                <button
                  key={color}
                  onClick={() => onStyleChange({ outlineColor: color })}
                  title={color}
                  className={`
                    w-6 h-6 rounded-full transition-all duration-120
                    ${textStyle.outlineColor === color
                      ? 'ring-2 ring-[#c8f135] ring-offset-1 ring-offset-[#141418] scale-110'
                      : 'hover:scale-110'
                    }
                  `}
                  style={{ backgroundColor: color, border: color === '#FFFFFF' ? '1px solid #2a2a32' : 'none' }}
                />
              ))}
              <div className="relative w-6 h-6 flex-shrink-0">
                <input
                  type="color"
                  value={textStyle.outlineColor}
                  onChange={(e) => onStyleChange({ outlineColor: e.target.value })}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
                <div
                  className="w-6 h-6 rounded-full border-2 border-dashed border-[#6b6b7a] hover:border-[#c8f135] transition-colors"
                  style={{ backgroundColor: textStyle.outlineColor }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Uppercase Toggle */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <AlignCenter size={12} className="text-[#6b6b7a]" />
            <label className="text-[11px] text-[#6b6b7a]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              UPPERCASE TEXT
            </label>
          </div>
          <button
            onClick={() => onStyleChange({ uppercase: !textStyle.uppercase })}
            className={`
              relative w-10 h-5 rounded-full transition-all duration-200
              ${textStyle.uppercase ? 'bg-[#c8f135]' : 'bg-[#2a2a32]'}
            `}
            aria-label="Toggle uppercase"
          >
            <span
              className={`
                absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200 shadow-sm
                ${textStyle.uppercase ? 'left-5' : 'left-0.5'}
              `}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
