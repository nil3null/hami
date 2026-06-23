/**
 * MemeStudio — Meme Templates Data
 * Dark Studio Pro design system
 *
 * Each template defines:
 * - imageUrl: CORS-friendly meme image URL
 * - textFields: coordinate-mapped text zones (x/y as fractions of image dimensions)
 * - defaultFont, defaultSize, defaultColor
 *
 * Images are proxied through corsproxy.io to ensure canvas drawImage works without taint.
 */

export interface TextZone {
  id: string;
  label: string;
  placeholder: string;
  /** x position as fraction of image width (0–1) */
  xFrac: number;
  /** y position as fraction of image height (0–1) */
  yFrac: number;
  /** max width as fraction of image width */
  maxWidthFrac: number;
  align: CanvasTextAlign;
  /** vertical anchor: 'top' | 'bottom' | 'middle' */
  verticalAnchor: 'top' | 'bottom' | 'middle';
}

export interface MemeTemplate {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  /** Aspect ratio hint for display */
  aspectRatio: string;
  textFields: TextZone[];
}

// Use a CORS proxy to allow canvas drawing without taint
const proxy = (url: string) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`;

export const MEME_TEMPLATES: MemeTemplate[] = [
  {
    id: 'drake',
    name: 'Drake Hotline Bling',
    category: 'Classic',
    imageUrl: proxy('https://i.imgflip.com/30b1gx.jpg'),
    aspectRatio: '1/1',
    textFields: [
      {
        id: 'top',
        label: 'Drake rejects (top panel)',
        placeholder: 'Something you dislike...',
        xFrac: 0.75,
        yFrac: 0.25,
        maxWidthFrac: 0.42,
        align: 'center',
        verticalAnchor: 'middle',
      },
      {
        id: 'bottom',
        label: 'Drake approves (bottom panel)',
        placeholder: 'Something you prefer...',
        xFrac: 0.75,
        yFrac: 0.75,
        maxWidthFrac: 0.42,
        align: 'center',
        verticalAnchor: 'middle',
      },
    ],
  },
  {
    id: 'two-buttons',
    name: 'Two Buttons',
    category: 'Classic',
    imageUrl: proxy('https://i.imgflip.com/1g8my4.jpg'),
    aspectRatio: '3/4',
    textFields: [
      {
        id: 'button1',
        label: 'Left button label',
        placeholder: 'Option A',
        xFrac: 0.28,
        yFrac: 0.12,
        maxWidthFrac: 0.32,
        align: 'center',
        verticalAnchor: 'middle',
      },
      {
        id: 'button2',
        label: 'Right button label',
        placeholder: 'Option B',
        xFrac: 0.68,
        yFrac: 0.12,
        maxWidthFrac: 0.32,
        align: 'center',
        verticalAnchor: 'middle',
      },
      {
        id: 'caption',
        label: 'The situation (bottom)',
        placeholder: 'Me deciding...',
        xFrac: 0.5,
        yFrac: 0.88,
        maxWidthFrac: 0.9,
        align: 'center',
        verticalAnchor: 'middle',
      },
    ],
  },
  {
    id: 'change-my-mind',
    name: 'Change My Mind',
    category: 'Classic',
    imageUrl: proxy('https://i.imgflip.com/24y43o.jpg'),
    aspectRatio: '4/3',
    textFields: [
      {
        id: 'claim',
        label: 'Your controversial claim',
        placeholder: 'Write your hot take here...',
        xFrac: 0.62,
        yFrac: 0.58,
        maxWidthFrac: 0.38,
        align: 'center',
        verticalAnchor: 'middle',
      },
    ],
  },
  {
    id: 'doge',
    name: 'Doge',
    category: 'Classic',
    imageUrl: proxy('https://i.imgflip.com/4t0m5.jpg'),
    aspectRatio: '1/1',
    textFields: [
      {
        id: 'top-left',
        label: 'Top left',
        placeholder: 'wow',
        xFrac: 0.18,
        yFrac: 0.12,
        maxWidthFrac: 0.35,
        align: 'left',
        verticalAnchor: 'top',
      },
      {
        id: 'top-right',
        label: 'Top right',
        placeholder: 'such meme',
        xFrac: 0.82,
        yFrac: 0.18,
        maxWidthFrac: 0.35,
        align: 'right',
        verticalAnchor: 'top',
      },
      {
        id: 'mid-left',
        label: 'Middle left',
        placeholder: 'very canvas',
        xFrac: 0.15,
        yFrac: 0.5,
        maxWidthFrac: 0.35,
        align: 'left',
        verticalAnchor: 'middle',
      },
      {
        id: 'mid-right',
        label: 'Middle right',
        placeholder: 'much wow',
        xFrac: 0.85,
        yFrac: 0.55,
        maxWidthFrac: 0.35,
        align: 'right',
        verticalAnchor: 'middle',
      },
      {
        id: 'bottom',
        label: 'Bottom center',
        placeholder: 'so amaze',
        xFrac: 0.5,
        yFrac: 0.88,
        maxWidthFrac: 0.7,
        align: 'center',
        verticalAnchor: 'bottom',
      },
    ],
  },
  {
    id: 'left-exit',
    name: 'Left Exit 12 Off Ramp',
    category: 'Classic',
    imageUrl: proxy('https://i.imgflip.com/22bdq6.jpg'),
    aspectRatio: '4/3',
    textFields: [
      {
        id: 'straight',
        label: 'Going straight (ignored)',
        placeholder: 'The responsible choice',
        xFrac: 0.78,
        yFrac: 0.22,
        maxWidthFrac: 0.3,
        align: 'center',
        verticalAnchor: 'middle',
      },
      {
        id: 'exit',
        label: 'Taking the exit (temptation)',
        placeholder: 'The fun thing',
        xFrac: 0.28,
        yFrac: 0.55,
        maxWidthFrac: 0.35,
        align: 'center',
        verticalAnchor: 'middle',
      },
      {
        id: 'driver',
        label: 'The driver (you)',
        placeholder: 'Me',
        xFrac: 0.62,
        yFrac: 0.72,
        maxWidthFrac: 0.25,
        align: 'center',
        verticalAnchor: 'middle',
      },
    ],
  },
  {
    id: 'distracted-bf',
    name: 'Distracted Boyfriend',
    category: 'Classic',
    imageUrl: proxy('https://i.imgflip.com/1ur9b0.jpg'),
    aspectRatio: '4/3',
    textFields: [
      {
        id: 'girlfriend',
        label: 'Girlfriend (left, ignored)',
        placeholder: 'Responsibilities',
        xFrac: 0.12,
        yFrac: 0.72,
        maxWidthFrac: 0.22,
        align: 'center',
        verticalAnchor: 'middle',
      },
      {
        id: 'boyfriend',
        label: 'Boyfriend (center)',
        placeholder: 'Me',
        xFrac: 0.5,
        yFrac: 0.82,
        maxWidthFrac: 0.22,
        align: 'center',
        verticalAnchor: 'middle',
      },
      {
        id: 'other-woman',
        label: 'Other woman (right)',
        placeholder: 'New shiny thing',
        xFrac: 0.85,
        yFrac: 0.65,
        maxWidthFrac: 0.22,
        align: 'center',
        verticalAnchor: 'middle',
      },
    ],
  },
  {
    id: 'this-is-fine',
    name: 'This Is Fine',
    category: 'Classic',
    imageUrl: proxy('https://i.imgflip.com/wxica.jpg'),
    aspectRatio: '4/3',
    textFields: [
      {
        id: 'top',
        label: 'Top text',
        placeholder: 'Everything is on fire...',
        xFrac: 0.5,
        yFrac: 0.06,
        maxWidthFrac: 0.9,
        align: 'center',
        verticalAnchor: 'top',
      },
      {
        id: 'bottom',
        label: 'Bottom text',
        placeholder: 'This is fine.',
        xFrac: 0.5,
        yFrac: 0.92,
        maxWidthFrac: 0.9,
        align: 'center',
        verticalAnchor: 'bottom',
      },
    ],
  },
  {
    id: 'one-does-not',
    name: 'One Does Not Simply',
    category: 'Classic',
    imageUrl: proxy('https://i.imgflip.com/1bij.jpg'),
    aspectRatio: '4/3',
    textFields: [
      {
        id: 'top',
        label: 'Top text',
        placeholder: 'One does not simply',
        xFrac: 0.5,
        yFrac: 0.06,
        maxWidthFrac: 0.9,
        align: 'center',
        verticalAnchor: 'top',
      },
      {
        id: 'bottom',
        label: 'Bottom text',
        placeholder: 'walk into Mordor',
        xFrac: 0.5,
        yFrac: 0.92,
        maxWidthFrac: 0.9,
        align: 'center',
        verticalAnchor: 'bottom',
      },
    ],
  },
  {
    id: 'custom',
    name: 'Custom Image',
    category: 'Custom',
    imageUrl: '',
    aspectRatio: '4/3',
    textFields: [
      {
        id: 'top',
        label: 'Top text',
        placeholder: 'TOP TEXT',
        xFrac: 0.5,
        yFrac: 0.06,
        maxWidthFrac: 0.9,
        align: 'center',
        verticalAnchor: 'top',
      },
      {
        id: 'bottom',
        label: 'Bottom text',
        placeholder: 'BOTTOM TEXT',
        xFrac: 0.5,
        yFrac: 0.92,
        maxWidthFrac: 0.9,
        align: 'center',
        verticalAnchor: 'bottom',
      },
    ],
  },
];

export const PRESET_COLORS = [
  '#FFFFFF', // White (default)
  '#000000', // Black
  '#FFD700', // Gold
  '#FF4444', // Red
  '#44AAFF', // Blue
  '#44FF88', // Green
  '#FF44CC', // Pink
  '#FF8C00', // Orange
  '#c8f135', // Brand
];

export const FONT_OPTIONS = [
  { value: 'Impact', label: 'Impact (Classic)' },
  { value: 'Arial Black', label: 'Arial Black' },
  { value: 'Space Grotesk', label: 'Space Grotesk' },
  { value: 'Comic Sans MS', label: 'Comic Sans' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Courier New', label: 'Courier New' },
];
