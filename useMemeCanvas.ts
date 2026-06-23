/**
 * MemeStudio — Canvas Rendering Engine
 * Dark Studio Pro design system
 *
 * Handles all HTML5 Canvas drawing:
 * - Image rendering with CORS proxy support
 * - Coordinate-based text overlay with outline
 * - Word-wrap for long text
 * - Graceful fallback if CORS fails
 */

import { useCallback, useEffect, useRef } from 'react';
import type { MemeTemplate, TextZone } from '@/lib/memeTemplates';

export interface TextFieldValues {
  [fieldId: string]: string;
}

export interface TextStyle {
  fontSize: number;
  fontFamily: string;
  color: string;
  uppercase: boolean;
  outlineColor: string;
  outlineWidth: number;
}

interface UseMemeCanvasOptions {
  template: MemeTemplate | null;
  customImageUrl: string | null;
  textValues: TextFieldValues;
  textStyle: TextStyle;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

/** Wrap text to fit within maxWidth, returns array of lines */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const { width } = ctx.measureText(testLine);
    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

/** Draw a single text zone on the canvas */
function drawTextZone(
  ctx: CanvasRenderingContext2D,
  zone: TextZone,
  text: string,
  style: TextStyle,
  canvasWidth: number,
  canvasHeight: number
) {
  if (!text.trim()) return;

  const displayText = style.uppercase ? text.toUpperCase() : text;
  // Scale font size relative to canvas width (base: 500px)
  const scaledFontSize = Math.round(style.fontSize * (canvasWidth / 500));
  const fontStr = `bold ${scaledFontSize}px "${style.fontFamily}", Impact, "Arial Black", sans-serif`;
  ctx.font = fontStr;

  const maxWidth = zone.maxWidthFrac * canvasWidth;
  const lines = wrapText(ctx, displayText, maxWidth);
  const lineHeight = scaledFontSize * 1.25;
  const totalHeight = lines.length * lineHeight;

  const cx = zone.xFrac * canvasWidth;
  const cy = zone.yFrac * canvasHeight;

  let startY: number;
  if (zone.verticalAnchor === 'top') {
    startY = cy + scaledFontSize / 2;
  } else if (zone.verticalAnchor === 'bottom') {
    startY = cy - totalHeight + scaledFontSize / 2;
  } else {
    startY = cy - totalHeight / 2 + scaledFontSize / 2;
  }

  ctx.textAlign = zone.align;
  ctx.textBaseline = 'middle';

  lines.forEach((line, i) => {
    const y = startY + i * lineHeight;

    // Outline (stroke)
    if (style.outlineWidth > 0) {
      ctx.strokeStyle = style.outlineColor;
      ctx.lineWidth = style.outlineWidth * (canvasWidth / 500) * 1.5;
      ctx.lineJoin = 'round';
      ctx.miterLimit = 2;
      ctx.strokeText(line, cx, y, maxWidth);
    }

    // Fill
    ctx.fillStyle = style.color;
    ctx.fillText(line, cx, y, maxWidth);
  });
}

/** Draw placeholder when no image */
function drawPlaceholder(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#1a1a1f';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#2a2a32';
  ctx.font = `bold ${Math.round(w * 0.035)}px "Space Grotesk", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Select a meme template', w / 2, h / 2);
}

export function useMemeCanvas({
  template,
  customImageUrl,
  textValues,
  textStyle,
  canvasRef,
}: UseMemeCanvasOptions) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const imageUrlRef = useRef<string>('');
  const renderScheduled = useRef(false);

  const renderCanvas = useCallback(() => {
    if (renderScheduled.current) return;
    renderScheduled.current = true;

    requestAnimationFrame(() => {
      renderScheduled.current = false;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = imageRef.current;
      if (!img || !img.complete || img.naturalWidth === 0) {
        drawPlaceholder(ctx, canvas.width, canvas.height);
        return;
      }

      // Draw image filling canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Draw text zones
      if (template) {
        template.textFields.forEach((zone) => {
          const text = textValues[zone.id] || '';
          drawTextZone(ctx, zone, text, textStyle, canvas.width, canvas.height);
        });
      }
    });
  }, [template, textValues, textStyle, canvasRef]);

  // Load image when URL changes
  useEffect(() => {
    const imageUrl = customImageUrl || template?.imageUrl || '';

    if (!imageUrl) {
      imageRef.current = null;
      imageUrlRef.current = '';
      renderCanvas();
      return;
    }

    // Same URL and already loaded — just re-render
    if (imageUrl === imageUrlRef.current && imageRef.current?.complete && imageRef.current.naturalWidth > 0) {
      renderCanvas();
      return;
    }

    imageUrlRef.current = imageUrl;
    const img = new Image();

    // For proxied URLs and blob URLs, crossOrigin may cause issues
    // Only set crossOrigin for non-blob URLs
    if (!imageUrl.startsWith('blob:')) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      imageRef.current = img;

      // Resize canvas to match image aspect ratio, capped at 800px wide
      const canvas = canvasRef.current;
      if (canvas) {
        const maxW = 800;
        const scale = Math.min(1, maxW / img.naturalWidth);
        canvas.width = Math.round(img.naturalWidth * scale);
        canvas.height = Math.round(img.naturalHeight * scale);
      }

      renderCanvas();
    };

    img.onerror = () => {
      // If CORS proxy fails, try without crossOrigin (canvas will be tainted but image shows)
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        imageRef.current = fallbackImg;
        const canvas = canvasRef.current;
        if (canvas) {
          const maxW = 800;
          const scale = Math.min(1, maxW / fallbackImg.naturalWidth);
          canvas.width = Math.round(fallbackImg.naturalWidth * scale);
          canvas.height = Math.round(fallbackImg.naturalHeight * scale);
        }
        renderCanvas();
      };
      fallbackImg.onerror = () => {
        imageRef.current = null;
        renderCanvas();
      };
      // Try direct URL (extract from proxy)
      const directUrl = imageUrl.includes('corsproxy.io')
        ? decodeURIComponent(imageUrl.split('?url=')[1] || imageUrl)
        : imageUrl;
      fallbackImg.src = directUrl;
    };

    img.src = imageUrl;
  }, [template?.id, customImageUrl, renderCanvas, canvasRef]);

  // Re-render when text or style changes
  useEffect(() => {
    if (imageRef.current?.complete && imageRef.current.naturalWidth > 0) {
      renderCanvas();
    }
  }, [textValues, textStyle, renderCanvas]);

  const downloadMeme = useCallback(
    (filename = 'meme.png') => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      try {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      } catch {
        // Canvas tainted — use a different approach
        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = filename;
          link.href = url;
          link.click();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        }, 'image/png');
      }
    },
    [canvasRef]
  );

  return { renderCanvas, downloadMeme };
}
