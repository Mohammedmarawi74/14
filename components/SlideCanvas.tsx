
import React, { useMemo, forwardRef } from 'react';
import { Slide } from '../types';

interface SlideCanvasProps {
  slide: Slide;
  scale?: number;
}

const SlideCanvas = forwardRef<HTMLDivElement, SlideCanvasProps>(({ slide, scale = 1 }, ref) => {
  const scopeId = useMemo(() => `slide-${slide.id}`, [slide.id]);

  return (
    <div 
      ref={ref}
      className={`poster-root ${scopeId}`}
      style={{ 
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        width: '100%',
        maxWidth: '500px',
        backgroundColor: slide.secondaryColor
      }}
    >
      <style>
        {`
          .${scopeId} {
            ${slide.customCss || ''}
          }
          /* نظام الخطوط المحدث */
          .${scopeId} .poster-headline {
            font-size: 36px;
            font-weight: 900;
            line-height: 1.2;
            padding-top: 0.15em;
            padding-bottom: 0.15em;
            margin-bottom: 0.4em;
            display: block;
            word-break: keep-all;
            overflow-wrap: break-word;
            color: white;
          }
          .${scopeId} .poster-desc {
            font-size: 18px;
            font-weight: 400;
            line-height: 1.6;
            padding-top: 0.1em;
            padding-bottom: 0.5em;
            display: block;
            word-break: keep-all;
            color: rgba(255, 255, 255, 0.7);
          }
        `}
      </style>

      {/* Grid Pattern Overlay */}
      {slide.showGrid && (
        <div className="absolute-fill grid-pattern pointer-none opacity-20"></div>
      )}

      {/* Decorative Gradient Background */}
      <div 
        className="absolute blur-overlay pointer-none"
        style={{ 
          backgroundColor: slide.accentColor,
          width: '16rem',
          height: '16rem',
          top: '-6rem',
          left: '-6rem'
        }}
      />

      {/* Large Decorative Number - Centered and pushed down significantly */}
      <div className="absolute-fill poster-number-container pointer-none">
        <div 
          className="poster-number"
          style={{ 
              color: slide.accentColor,
              transition: 'all 0.7s',
          }}
        >
          {slide.numberText}
        </div>
      </div>

      {/* Top Left Icon */}
      <div className="poster-icon" style={{ top: '2.5rem', left: '2.5rem' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill={slide.accentColor} style={{ opacity: 0.8, transition: 'colors 0.5s' }}>
          <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" />
        </svg>
      </div>

      {/* Top Right Logo Slot */}
      <div className="poster-logo" style={{ top: '2.5rem', right: '2.5rem', opacity: 0.9 }}>
        {slide.logoUrl ? (
          <img 
            src={slide.logoUrl} 
            alt="Logo" 
            style={{ width: '3rem', height: '3rem', objectFit: 'contain' }}
          />
        ) : (
          <div style={{ position: 'relative', width: '3rem', height: '3rem' }}>
            <div className="absolute" style={{ top: 0, right: 0, width: '2rem', height: '2rem', borderTopRightRadius: '1rem', borderBottomLeftRadius: '1rem', backgroundColor: 'white', opacity: 0.4 }}></div>
            <div className="absolute" style={{ bottom: 0, left: 0, width: '2rem', height: '2rem', borderTopRightRadius: '1rem', borderBottomLeftRadius: '1rem', backgroundColor: 'white' }}></div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="poster-content">
        <h1 className="poster-headline">
          {slide.title}
        </h1>
        <p className="poster-desc">
          {slide.description}
        </p>
      </div>

      {/* Footer Branding */}
      <div className="poster-footer">
        <div className="footer-platform">منصة المستثمر الاقتصادية</div>
        <div className="footer-domain">al_inverstor.com</div>
      </div>
    </div>
  );
});

export default SlideCanvas;
