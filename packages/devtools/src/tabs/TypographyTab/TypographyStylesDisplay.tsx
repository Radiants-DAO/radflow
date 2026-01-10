'use client';

import React from 'react';
import { useDevToolsStore } from '../../store';
import type { TypographyStyle } from '../../types';

// Sample text for each element type
const SAMPLE_TEXT: Record<string, string> = {
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  p: 'The quick brown fox jumps over the lazy dog.',
  a: 'Click this link',
  ul: 'List item example',
  ol: 'Numbered item',
  li: 'Item content',
  small: 'Small fine print text',
  strong: 'Strong importance',
  em: 'Emphasized text',
  code: 'inline code',
  pre: 'code block\nexample',
  kbd: 'Ctrl+C',
  mark: 'Highlighted text',
  blockquote: 'A wise quote goes here.',
  cite: 'Citation reference',
  abbr: 'HTML',
  dfn: 'Definition term',
  q: 'Inline quotation',
  sub: 'Subscript',
  sup: 'Superscript',
  del: 'Deleted text',
  ins: 'Inserted text',
  caption: 'Table caption',
  label: 'Form label',
  figcaption: 'Figure caption',
};

export function TypographyStylesDisplay() {
  const { typographyStyles, fonts } = useDevToolsStore();

  // Group styles by category
  const headings = typographyStyles.filter(s => s.element.startsWith('h'));
  const text = typographyStyles.filter(s => ['p', 'a'].includes(s.element));
  const lists = typographyStyles.filter(s => ['ul', 'ol', 'li'].includes(s.element));
  const code = typographyStyles.filter(s => ['code', 'pre', 'kbd', 'samp', 'var'].includes(s.element));
  const semantic = typographyStyles.filter(s => ['strong', 'em', 'mark', 'del', 'ins', 'b', 'i', 'u', 's'].includes(s.element));
  const quotations = typographyStyles.filter(s => ['blockquote', 'cite', 'q'].includes(s.element));
  const captions = typographyStyles.filter(s => ['caption', 'small', 'figcaption', 'label'].includes(s.element));
  const other = typographyStyles.filter(s => 
    !s.element.startsWith('h') && 
    !['p', 'a', 'ul', 'ol', 'li', 'code', 'pre', 'kbd', 'samp', 'var', 'strong', 'em', 'mark', 'del', 'ins', 'b', 'i', 'u', 's', 'blockquote', 'cite', 'q', 'caption', 'small', 'figcaption', 'label'].includes(s.element)
  );

  // Get font family for display
  const getFontFamily = (fontFamilyId: string) => {
    const font = fonts.find(f => f.id === fontFamilyId);
    return font?.family || fontFamilyId;
  };

  // Build classes string
  const buildClasses = (style: TypographyStyle) => {
    const classes = [
      style.fontSize,
      style.fontWeight,
      style.lineHeight,
      style.letterSpacing,
      ...(style.utilities || []),
    ].filter(Boolean);
    return classes.join(' ');
  };

  // Render a single style row
  const renderStyleRow = (style: TypographyStyle) => {
    const fontFamily = getFontFamily(style.fontFamilyId);
    const classes = buildClasses(style);

    return (
      <div
        key={style.id}
        className="p-4 bg-surface-secondary preview-light rounded flex flex-col gap-4 mb-4"
      >
        {/* Element name and preview */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <code className="px-2 py-0.5 bg-surface-tertiary text-content-primary rounded" style={{ fontFamily: 'PixelCode' }}>
              {`<${style.element}>`}
            </code>
            <span className="font-mondwest text-sm text-content-primary/60">
              {style.displayName}
            </span>
          </div>
        </div>

        {/* Live Preview - each element has data-edit-scope directly */}
        <div className="py-2 px-3 bg-surface-primary rounded-sm">
          {style.element === 'h1' && <h1 data-edit-scope="layer-base">{SAMPLE_TEXT.h1}</h1>}
          {style.element === 'h2' && <h2 data-edit-scope="layer-base">{SAMPLE_TEXT.h2}</h2>}
          {style.element === 'h3' && <h3 data-edit-scope="layer-base">{SAMPLE_TEXT.h3}</h3>}
          {style.element === 'h4' && <h4 data-edit-scope="layer-base">{SAMPLE_TEXT.h4}</h4>}
          {style.element === 'h5' && <h5 data-edit-scope="layer-base">{SAMPLE_TEXT.h5}</h5>}
          {style.element === 'h6' && <h6 data-edit-scope="layer-base">{SAMPLE_TEXT.h6}</h6>}
          {style.element === 'p' && <p data-edit-scope="layer-base">{SAMPLE_TEXT.p}</p>}
          {style.element === 'a' && <a href="#" data-edit-scope="layer-base">{SAMPLE_TEXT.a}</a>}
          {style.element === 'ul' && (
            <ul data-edit-scope="layer-base">
              <li>{SAMPLE_TEXT.ul}</li>
            </ul>
          )}
          {style.element === 'ol' && (
            <ol data-edit-scope="layer-base">
              <li>{SAMPLE_TEXT.ol}</li>
            </ol>
          )}
          {style.element === 'li' && <li data-edit-scope="layer-base">{SAMPLE_TEXT.li}</li>}
          {style.element === 'small' && <small data-edit-scope="layer-base">{SAMPLE_TEXT.small}</small>}
          {style.element === 'strong' && <strong data-edit-scope="layer-base">{SAMPLE_TEXT.strong}</strong>}
          {style.element === 'em' && <em data-edit-scope="layer-base">{SAMPLE_TEXT.em}</em>}
          {style.element === 'code' && <code data-edit-scope="layer-base" className="bg-surface-tertiary text-content-primary" style={{ fontFamily: 'PixelCode' }}>{SAMPLE_TEXT.code}</code>}
          {style.element === 'pre' && <pre data-edit-scope="layer-base">{SAMPLE_TEXT.pre}</pre>}
          {style.element === 'kbd' && <kbd data-edit-scope="layer-base">{SAMPLE_TEXT.kbd}</kbd>}
          {style.element === 'mark' && <mark data-edit-scope="layer-base">{SAMPLE_TEXT.mark}</mark>}
          {style.element === 'blockquote' && <blockquote data-edit-scope="layer-base">{SAMPLE_TEXT.blockquote}</blockquote>}
          {style.element === 'cite' && <cite data-edit-scope="layer-base">{SAMPLE_TEXT.cite}</cite>}
          {style.element === 'abbr' && <abbr title="HyperText Markup Language" data-edit-scope="layer-base">{SAMPLE_TEXT.abbr}</abbr>}
          {style.element === 'dfn' && <dfn data-edit-scope="layer-base">{SAMPLE_TEXT.dfn}</dfn>}
          {style.element === 'q' && <q data-edit-scope="layer-base">{SAMPLE_TEXT.q}</q>}
          {style.element === 'sub' && <sub data-edit-scope="layer-base">{SAMPLE_TEXT.sub}</sub>}
          {style.element === 'sup' && <sup data-edit-scope="layer-base">{SAMPLE_TEXT.sup}</sup>}
          {style.element === 'del' && <del data-edit-scope="layer-base">{SAMPLE_TEXT.del}</del>}
          {style.element === 'ins' && <ins data-edit-scope="layer-base">{SAMPLE_TEXT.ins}</ins>}
          {style.element === 'caption' && <caption data-edit-scope="layer-base">{SAMPLE_TEXT.caption}</caption>}
          {style.element === 'label' && <label data-edit-scope="layer-base">{SAMPLE_TEXT.label}</label>}
          {style.element === 'figcaption' && <figcaption data-edit-scope="layer-base">{SAMPLE_TEXT.figcaption}</figcaption>}
        </div>

        {/* Style Properties (read-only) */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-content-primary/50">Font:</span>
            <span className="text-content-primary font-mono">{fontFamily}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-content-primary/50">Size:</span>
            <span className="text-content-primary font-mono">{style.fontSize}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-content-primary/50">Weight:</span>
            <span className="text-content-primary font-mono">{style.fontWeight}</span>
          </div>
          {style.lineHeight && (
            <div className="flex items-center gap-2">
              <span className="text-content-primary/50">Line Height:</span>
              <span className="text-content-primary font-mono">{style.lineHeight}</span>
            </div>
          )}
          {style.letterSpacing && (
            <div className="flex items-center gap-2">
              <span className="text-content-primary/50">Tracking:</span>
              <span className="text-content-primary font-mono">{style.letterSpacing}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-content-primary/50">Color:</span>
            <span className="text-content-primary font-mono">{style.baseColorId}</span>
          </div>
          {style.utilities && style.utilities.length > 0 && (
            <div className="flex items-center gap-2 col-span-2">
              <span className="text-content-primary/50">Utilities:</span>
              <span className="text-content-primary font-mono">{style.utilities.join(' ')}</span>
            </div>
          )}
        </div>

        {/* @apply classes (what will be written to CSS) */}
        <div className="pt-2 border-t border-edge-primary/10">
          <code className="bg-surface-tertiary text-content-primary px-2 py-1 rounded-sm" style={{ fontFamily: 'PixelCode' }}>
            @apply {classes}
          </code>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Headings Section */}
      <div id="typography-headings">
        <h3 className="mb-3">
          Headings
        </h3>
        <div className="space-y-2">
          {headings.map(renderStyleRow)}
        </div>
      </div>

      {/* Text Section */}
      <div id="typography-text">
        <h3 className="mb-3">
          Text
        </h3>
        <div className="space-y-2">
          {text.map(renderStyleRow)}
        </div>
      </div>

      {/* Lists Section */}
      <div id="typography-lists">
        <h3 className="mb-3">
          Lists
        </h3>
        <div className="space-y-2">
          {lists.map(renderStyleRow)}
        </div>
      </div>

      {/* Code Section */}
      {code.length > 0 && (
        <div id="typography-code">
          <h3 className="mb-3">
            Code
          </h3>
          <div className="space-y-2">
            {code.map(renderStyleRow)}
          </div>
        </div>
      )}

      {/* Semantic Section */}
      {semantic.length > 0 && (
        <div id="typography-semantic">
          <h3 className="mb-3">
            Semantic
          </h3>
          <div className="space-y-2">
            {semantic.map(renderStyleRow)}
          </div>
        </div>
      )}

      {/* Quotations Section */}
      {quotations.length > 0 && (
        <div id="typography-quotations">
          <h3 className="mb-3">
            Quotations
          </h3>
          <div className="space-y-2">
            {quotations.map(renderStyleRow)}
          </div>
        </div>
      )}

      {/* Captions Section */}
      {captions.length > 0 && (
        <div id="typography-captions">
          <h3 className="mb-3">
            Captions & Labels
          </h3>
          <div className="space-y-2">
            {captions.map(renderStyleRow)}
          </div>
        </div>
      )}

      {/* Other Section */}
      {other.length > 0 && (
        <div>
          <h3 className="mb-3">
            Other
          </h3>
          <div className="space-y-2">
            {other.map(renderStyleRow)}
          </div>
        </div>
      )}

      {/* Note about editing */}
      <div className="p-3 bg-surface-tertiary/20 border border-tertiary rounded-sm">
        <p>
          Typography styles are display-only. Use the Cursor visual editor to modify these styles directly in your CSS.
        </p>
      </div>
    </div>
  );
}

export default TypographyStylesDisplay;

