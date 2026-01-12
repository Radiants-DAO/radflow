import { StateCreator } from 'zustand';
import type { FontDefinition, FontFile, TypographyStyle } from '../../types';

export interface TypographySlice {
  // State
  fonts: FontDefinition[];
  typographyStyles: TypographyStyle[];
  
  // Actions - Fonts
  addFont: (font: Omit<FontDefinition, 'id'>) => void;
  updateFont: (id: string, updates: Partial<FontDefinition>) => void;
  deleteFont: (id: string) => void;
  addFontFile: (fontId: string, file: Omit<FontFile, 'id'>) => void;
  removeFontFile: (fontId: string, fileId: string) => void;
  
  // Actions - Typography Styles
  addTypographyStyle: (style: Omit<TypographyStyle, 'id'>) => void;
  updateTypographyStyle: (id: string, updates: Partial<TypographyStyle>) => void;
  deleteTypographyStyle: (id: string) => void;
  
  // Helpers
  getFontById: (id: string) => FontDefinition | undefined;
  getFontByFamily: (family: string) => FontDefinition | undefined;
  
  // Sync
  syncTypographyToCSS: () => Promise<void>;
  loadTypographyFromCSS: () => Promise<void>;
  loadFontsFromFilesystem: () => Promise<void>;
}

// Default fonts matching radOS
const defaultFonts: FontDefinition[] = [
  {
    id: 'mondwest',
    name: 'Mondwest',
    family: 'Mondwest',
    files: [
      { id: 'mondwest-regular', weight: 400, style: 'normal', format: 'woff2', path: '/fonts/Mondwest-Regular.woff2' },
      { id: 'mondwest-bold', weight: 700, style: 'normal', format: 'woff2', path: '/fonts/Mondwest-Bold.woff2' },
    ],
    weights: [400, 700],
    styles: ['normal'],
  },
  {
    id: 'joystix',
    name: 'Joystix Monospace',
    family: 'Joystix Monospace',
    files: [
      { id: 'joystix-regular', weight: 400, style: 'normal', format: 'ttf', path: '/fonts/joystix_monospace.ttf' },
    ],
    weights: [400],
    styles: ['normal'],
  },
];

// Default typography styles matching Webflow style guide with @layer base
const defaultTypographyStyles: TypographyStyle[] = [
  {
    id: 'h1',
    element: 'h1',
    fontFamilyId: 'mondwest',
    fontSize: 'text-4xl',
    lineHeight: 'leading-tight',
    fontWeight: 'font-bold',
    baseColorId: 'black',
    displayName: 'Heading 1',
  },
  {
    id: 'h2',
    element: 'h2',
    fontFamilyId: 'mondwest',
    fontSize: 'text-3xl',
    lineHeight: 'leading-tight',
    fontWeight: 'font-normal',
    baseColorId: 'black',
    displayName: 'Heading 2',
  },
  {
    id: 'h3',
    element: 'h3',
    fontFamilyId: 'mondwest',
    fontSize: 'text-2xl',
    lineHeight: 'leading-snug',
    fontWeight: 'font-semibold',
    baseColorId: 'black',
    displayName: 'Heading 3',
  },
  {
    id: 'h4',
    element: 'h4',
    fontFamilyId: 'mondwest',
    fontSize: 'text-xl',
    lineHeight: 'leading-snug',
    fontWeight: 'font-medium',
    baseColorId: 'black',
    displayName: 'Heading 4',
  },
  {
    id: 'h5',
    element: 'h5',
    fontFamilyId: 'mondwest',
    fontSize: 'text-lg',
    lineHeight: 'leading-normal',
    fontWeight: 'font-medium',
    baseColorId: 'black',
    displayName: 'Heading 5',
  },
  {
    id: 'h6',
    element: 'h6',
    fontFamilyId: 'mondwest',
    fontSize: 'text-base',
    lineHeight: 'leading-normal',
    fontWeight: 'font-medium',
    baseColorId: 'black',
    displayName: 'Heading 6',
  },
  {
    id: 'p',
    element: 'p',
    fontFamilyId: 'mondwest',
    fontSize: 'text-base',
    lineHeight: 'leading-relaxed',
    fontWeight: 'font-normal',
    baseColorId: 'black',
    displayName: 'Paragraph',
  },
  {
    id: 'a',
    element: 'a',
    fontFamilyId: 'mondwest',
    fontSize: 'text-base',
    lineHeight: 'leading-normal',
    fontWeight: 'font-normal',
    baseColorId: 'sky-blue',
    displayName: 'Link',
    utilities: ['underline', 'hover:opacity-80'],
  },
  {
    id: 'ul',
    element: 'ul',
    fontFamilyId: 'mondwest',
    fontSize: 'text-base',
    lineHeight: 'leading-relaxed',
    fontWeight: 'font-normal',
    baseColorId: 'black',
    displayName: 'Unordered List',
    utilities: ['pl-6'],
  },
  {
    id: 'ol',
    element: 'ol',
    fontFamilyId: 'mondwest',
    fontSize: 'text-base',
    lineHeight: 'leading-relaxed',
    fontWeight: 'font-normal',
    baseColorId: 'black',
    displayName: 'Ordered List',
    utilities: ['pl-6'],
  },
  {
    id: 'li',
    element: 'li',
    fontFamilyId: 'mondwest',
    fontSize: 'text-base',
    lineHeight: 'leading-relaxed',
    fontWeight: 'font-normal',
    baseColorId: 'black',
    displayName: 'List Item',
    utilities: ['mb-2'],
  },
  {
    id: 'small',
    element: 'small',
    fontFamilyId: 'mondwest',
    fontSize: 'text-sm',
    lineHeight: 'leading-normal',
    fontWeight: 'font-normal',
    baseColorId: 'black',
    displayName: 'Small Text',
  },
  {
    id: 'strong',
    element: 'strong',
    fontFamilyId: 'mondwest',
    fontSize: 'text-base',
    lineHeight: 'leading-normal',
    fontWeight: 'font-bold',
    baseColorId: 'black',
    displayName: 'Strong',
  },
  {
    id: 'em',
    element: 'em',
    fontFamilyId: 'mondwest',
    fontSize: 'text-base',
    lineHeight: 'leading-normal',
    fontWeight: 'font-normal',
    baseColorId: 'black',
    displayName: 'Emphasis',
    utilities: ['italic'],
  },
  {
    id: 'code',
    element: 'code',
    fontFamilyId: 'joystix',
    fontSize: 'text-xs',
    lineHeight: 'leading-normal',
    fontWeight: 'font-normal',
    baseColorId: 'black',
    displayName: 'Inline Code',
    utilities: ['text-content-primary', 'px-1', 'py-0.5', 'rounded-sm'],
  },
  {
    id: 'pre',
    element: 'pre',
    fontFamilyId: 'joystix',
    fontSize: 'text-sm',
    lineHeight: 'leading-relaxed',
    fontWeight: 'font-normal',
    baseColorId: 'black',
    displayName: 'Code Block',
    utilities: ['bg-surface-secondary/10', 'p-4', 'rounded-sm', 'overflow-x-auto'],
  },
  {
    id: 'kbd',
    element: 'kbd',
    fontFamilyId: 'joystix',
    fontSize: 'text-xs',
    lineHeight: 'leading-normal',
    fontWeight: 'font-normal',
    baseColorId: 'cream',
    displayName: 'Keyboard Input',
    utilities: ['bg-surface-secondary', 'px-1', 'py-0.5', 'rounded-sm'],
  },
  {
    id: 'mark',
    element: 'mark',
    fontFamilyId: 'mondwest',
    fontSize: 'text-base',
    lineHeight: 'leading-normal',
    fontWeight: 'font-normal',
    baseColorId: 'black',
    displayName: 'Highlighted Text',
    utilities: ['bg-surface-tertiary'],
  },
  {
    id: 'blockquote',
    element: 'blockquote',
    fontFamilyId: 'mondwest',
    fontSize: 'text-base',
    lineHeight: 'leading-relaxed',
    fontWeight: 'font-normal',
    baseColorId: 'black',
    displayName: 'Block Quote',
    utilities: ['border-l-4', 'border-edge-primary', 'pl-4', 'italic'],
  },
  {
    id: 'cite',
    element: 'cite',
    fontFamilyId: 'mondwest',
    fontSize: 'text-sm',
    lineHeight: 'leading-normal',
    fontWeight: 'font-normal',
    baseColorId: 'black',
    displayName: 'Citation',
    utilities: ['italic'],
  },
  {
    id: 'abbr',
    element: 'abbr',
    fontFamilyId: 'mondwest',
    fontSize: 'text-base',
    lineHeight: 'leading-normal',
    fontWeight: 'font-normal',
    baseColorId: 'black',
    displayName: 'Abbreviation',
    utilities: ['underline', 'decoration-dotted'],
  },
  {
    id: 'dfn',
    element: 'dfn',
    fontFamilyId: 'mondwest',
    fontSize: 'text-base',
    lineHeight: 'leading-normal',
    fontWeight: 'font-normal',
    baseColorId: 'black',
    displayName: 'Definition Term',
    utilities: ['italic'],
  },
  {
    id: 'q',
    element: 'q',
    fontFamilyId: 'mondwest',
    fontSize: 'text-base',
    lineHeight: 'leading-normal',
    fontWeight: 'font-normal',
    baseColorId: 'black',
    displayName: 'Inline Quote',
    utilities: ['italic'],
  },
  {
    id: 'sub',
    element: 'sub',
    fontFamilyId: 'mondwest',
    fontSize: 'text-xs',
    lineHeight: 'leading-none',
    fontWeight: 'font-normal',
    baseColorId: 'black',
    displayName: 'Subscript',
  },
  {
    id: 'sup',
    element: 'sup',
    fontFamilyId: 'mondwest',
    fontSize: 'text-xs',
    lineHeight: 'leading-none',
    fontWeight: 'font-normal',
    baseColorId: 'black',
    displayName: 'Superscript',
  },
  {
    id: 'del',
    element: 'del',
    fontFamilyId: 'mondwest',
    fontSize: 'text-base',
    lineHeight: 'leading-normal',
    fontWeight: 'font-normal',
    baseColorId: 'black',
    displayName: 'Deleted Text',
    utilities: ['line-through'],
  },
  {
    id: 'ins',
    element: 'ins',
    fontFamilyId: 'mondwest',
    fontSize: 'text-base',
    lineHeight: 'leading-normal',
    fontWeight: 'font-normal',
    baseColorId: 'black',
    displayName: 'Inserted Text',
    utilities: ['underline'],
  },
  {
    id: 'caption',
    element: 'caption',
    fontFamilyId: 'mondwest',
    fontSize: 'text-xs',
    lineHeight: 'leading-normal',
    fontWeight: 'font-normal',
    baseColorId: 'black',
    displayName: 'Caption',
  },
  {
    id: 'label',
    element: 'label',
    fontFamilyId: 'mondwest',
    fontSize: 'text-xs',
    lineHeight: 'leading-normal',
    fontWeight: 'font-medium',
    baseColorId: 'black',
    displayName: 'Form Label',
  },
  {
    id: 'figcaption',
    element: 'figcaption',
    fontFamilyId: 'mondwest',
    fontSize: 'text-xs',
    lineHeight: 'leading-normal',
    fontWeight: 'font-normal',
    baseColorId: 'black',
    displayName: 'Figure Caption',
  },
];

export const createTypographySlice: StateCreator<TypographySlice, [], [], TypographySlice> = (set, get) => ({
  fonts: defaultFonts,
  typographyStyles: defaultTypographyStyles,

  // Font Actions
  addFont: (font) => set((state) => ({
    fonts: [...state.fonts, { ...font, id: crypto.randomUUID() }]
  })),
  
  updateFont: (id, updates) => set((state) => ({
    fonts: state.fonts.map((f) => 
      f.id === id ? { ...f, ...updates } : f
    )
  })),
  
  deleteFont: (id) => set((state) => ({
    fonts: state.fonts.filter((f) => f.id !== id)
  })),
  
  addFontFile: (fontId, file) => set((state) => ({
    fonts: state.fonts.map((f) => {
      if (f.id !== fontId) return f;
      const newFile = { ...file, id: crypto.randomUUID() };
      return {
        ...f,
        files: [...f.files, newFile],
        weights: Array.from(new Set([...f.weights, file.weight])).sort((a, b) => a - b),
        styles: Array.from(new Set([...f.styles, file.style])),
      };
    })
  })),
  
  removeFontFile: (fontId, fileId) => set((state) => ({
    fonts: state.fonts.map((f) => {
      if (f.id !== fontId) return f;
      const newFiles = f.files.filter((file) => file.id !== fileId);
      return {
        ...f,
        files: newFiles,
        weights: Array.from(new Set(newFiles.map(file => file.weight))).sort((a, b) => a - b),
        styles: Array.from(new Set(newFiles.map(file => file.style))),
      };
    })
  })),

  // Typography Style Actions
  addTypographyStyle: (style) => set((state) => ({
    typographyStyles: [...state.typographyStyles, { ...style, id: crypto.randomUUID() }]
  })),
  
  updateTypographyStyle: (id, updates) => set((state) => ({
    typographyStyles: state.typographyStyles.map((s) => 
      s.id === id ? { ...s, ...updates } : s
    )
  })),
  
  deleteTypographyStyle: (id) => set((state) => ({
    typographyStyles: state.typographyStyles.filter((s) => s.id !== id)
  })),

  // Helpers
  getFontById: (id) => get().fonts.find((f) => f.id === id),
  getFontByFamily: (family) => get().fonts.find((f) => f.family === family),

  // Sync typography to CSS
  syncTypographyToCSS: async () => {
    const state = get();
    try {
      const response = await fetch('/api/devtools/write-css', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fonts: state.fonts,
          typographyStyles: state.typographyStyles,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to sync typography CSS');
      }
    } catch (error) {
      throw error;
    }
  },

  // Load typography from CSS (only typography styles, not fonts)
  loadTypographyFromCSS: async () => {
    try {
      const res = await fetch('/api/devtools/read-css');
      if (!res.ok) {
        throw new Error('Failed to fetch CSS');
      }
      const css = await res.text();
      
      // Import parser dynamically to avoid SSR issues
      const { parseLayerBase } = await import('../../lib/cssParser');
      
      // Only load typography styles, not fonts (fonts should come from filesystem)
      const typographyStyles = parseLayerBase(css);
      
      if (typographyStyles.length > 0) {
        set((state) => ({ ...state, typographyStyles }));
      }
    } catch {
      // Failed to load typography from CSS
    }
  },

  // Load fonts from filesystem
  loadFontsFromFilesystem: async () => {
    try {
      const res = await fetch('/api/devtools/fonts');
      if (!res.ok) {
        throw new Error('Failed to fetch fonts from filesystem');
      }
      const data = await res.json();
      
      // Import parser dynamically to avoid SSR issues
      const { detectFontPropertiesFromFilename } = await import('../../lib/cssParser');
      
      // Convert filesystem fonts to FontDefinition format
      const fontMap = new Map<string, FontDefinition>();
      
      for (const { family, files } of data.fonts || []) {
        const fontId = family.toLowerCase().replace(/\s+/g, '-');
        const fontFiles: FontFile[] = [];
        const weights = new Set<number>();
        const styles = new Set<string>();
        
        for (const file of files) {
          const { weight, style } = detectFontPropertiesFromFilename(file.filename);
          weights.add(weight);
          styles.add(style);
          
          fontFiles.push({
            id: `${fontId}-${file.filename.replace(/\.[^.]+$/, '')}`,
            weight,
            style,
            format: file.format as FontFile['format'],
            path: file.path,
          });
        }
        
        fontMap.set(fontId, {
          id: fontId,
          name: family,
          family: family,
          files: fontFiles,
          weights: Array.from(weights).sort((a, b) => a - b),
          styles: Array.from(styles),
        });
      }
      
      if (fontMap.size > 0) {
        set({ fonts: Array.from(fontMap.values()) });
      }
    } catch {
      // Failed to load fonts from filesystem
    }
  },
});

