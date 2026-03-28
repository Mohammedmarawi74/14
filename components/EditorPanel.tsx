
import React, { useState, useRef } from 'react';
import { Slide } from '../types';
import { COLOR_THEMES, PRESET_LOGOS } from '../constants';

interface EditorPanelProps {
  slide: Slide;
  onUpdate: (updates: Partial<Slide>) => void;
  onAddSlide: () => void;
  onRemoveSlide: () => void;
  onDuplicateSlide: () => void;
  isLastSlide: boolean;
}

type TabType = 'ai' | 'content' | 'design' | 'customize';

const CSS_SNIPPETS = [
  { label: 'ذهبي فاخر', css: 'background: linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c) !important;\ncolor: #000 !important;' },
  { label: 'عنوان مفرغ', css: '.poster-headline {\n  -webkit-text-stroke: 2px white;\n  color: transparent !important;\n}' },
  { label: 'حاوية زجاجية', css: 'background: rgba(255, 255, 255, 0.05) !important;\nbackdrop-filter: blur(10px);\nborder: 1px solid rgba(255, 255, 255, 0.1);' },
  { label: 'بدون نقش', css: '.grid-pattern { display: none !important; }' },
  { label: 'تدرج ريترو', css: 'background: linear-gradient(135deg, #ff00cc, #3333ff) !important;' },
  { label: 'صورة دائرية', css: '.poster-logo { border-radius: 50%; overflow: hidden; border: 2px solid white; }' },
];

const EditorPanel: React.FC<EditorPanelProps> = ({ 
  slide, 
  onUpdate, 
  onAddSlide, 
  onRemoveSlide, 
  onDuplicateSlide,
  isLastSlide
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('design');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applySnippet = (snippetCss: string) => {
    const currentCss = slide.customCss || '';
    onUpdate({ customCss: currentCss + (currentCss ? '\n' : '') + snippetCss });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'customize':
        return (
          <div className="animate-slide-in-left">
            <section className="form-group">
              <h3 className="section-title">
                قوالب جاهزة (SNIPPETS)
              </h3>
              <div className="snippets-grid">
                {CSS_SNIPPETS.map((snippet, idx) => (
                  <button
                    key={idx}
                    onClick={() => applySnippet(snippet.css)}
                    className="snippet-button"
                  >
                    <span>+ {snippet.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="form-group">
              <div className="flex justify-between items-center mb-2">
                 <h3 className="section-title" style={{ color: 'var(--neon-cyan)' }}>محرر CSS المتقدم</h3>
              </div>
              <p style={{ fontSize: '10px', color: '#6b7280', marginBottom: '0.75rem', fontFamily: 'monospace' }}>
                Classes: <span style={{ color: 'var(--neon-cyan)' }}>.poster-root</span>, <span style={{ color: 'var(--neon-cyan)' }}>.poster-headline</span>, <span style={{ color: 'var(--neon-cyan)' }}>.poster-desc</span>...
              </p>
              <div className="relative group">
                <textarea 
                  value={slide.customCss}
                  onChange={(e) => onUpdate({ customCss: e.target.value })}
                  placeholder="...هنا لتخصيص التصميم CSS اكتب كود"
                  className="css-editor-textarea scrollbar-hide"
                  dir="ltr"
                />
              </div>
            </section>

            <button 
              onClick={() => onUpdate({ customCss: '' })}
              className="reset-button"
            >
              إعادة تعيين CSS
            </button>
          </div>
        );

      case 'design':
        return (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <section>
              <h3 className="section-title">اختر الشعار (LOGO)</h3>

              {/* Preset logos grid */}
              <div className="preset-logos-grid">
                {PRESET_LOGOS.map((logo) => {
                  const isSelected = slide.logoUrl === logo.url;
                  return (
                    <button
                      key={logo.name}
                      onClick={() => onUpdate({ logoUrl: isSelected ? undefined : logo.url })}
                      className={`preset-logo-card ${isSelected ? 'preset-logo-card--active' : ''}`}
                      title={logo.name}
                    >
                      <img src={logo.url} alt={logo.name} className="preset-logo-img" />
                      <span className="preset-logo-name">{logo.name}</span>
                    </button>
                  );
                })}
                {/* None option */}
                <button
                  onClick={() => onUpdate({ logoUrl: undefined })}
                  className={`preset-logo-card ${!slide.logoUrl ? 'preset-logo-card--active' : ''}`}
                  title="بدون شعار"
                >
                  <div className="preset-logo-none">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </div>
                  <span className="preset-logo-name">بدون</span>
                </button>
              </div>

              {/* Custom upload row */}
              <div className="logo-custom-upload">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-button-sm"
                >
                  ↑ رفع شعار مخصص
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
              </div>
            </section>

            <section className="section-divider">
              <h3 className="section-title">ثيمات الألوان (THEMES)</h3>
              <div className="themes-grid">
                {COLOR_THEMES.map((theme) => {
                  const isActive = slide.accentColor === theme.accent && slide.secondaryColor === theme.secondary;
                  return (
                    <button
                      key={theme.name}
                      onClick={() => onUpdate({ accentColor: theme.accent, secondaryColor: theme.secondary })}
                      className={`theme-card ${isActive ? 'theme-card--active' : ''}`}
                    >
                      <span className="theme-label">{theme.name}</span>
                      <div className="theme-swatch">
                        <div className="swatch-part" style={{ backgroundColor: theme.accent }} />
                        <div className="swatch-part" style={{ backgroundColor: theme.secondary }} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="section-divider">
              <h3 className="section-title">تخصيص دقيق</h3>
              <div className="custom-colors-area">
                <div className="color-input-container">
                   <div 
                    className="color-preview-bar" 
                    style={{ backgroundColor: slide.accentColor }} 
                   />
                   <input 
                      type="color" 
                      value={slide.accentColor}
                      onChange={(e) => onUpdate({ accentColor: e.target.value })}
                      className="color-picker-input"
                    />
                </div>
                <div className="color-input-container">
                   <div 
                    className="color-preview-bar" 
                    style={{ backgroundColor: slide.secondaryColor }} 
                   />
                   <input 
                      type="color" 
                      value={slide.secondaryColor}
                      onChange={(e) => onUpdate({ secondaryColor: e.target.value })}
                      className="color-picker-input"
                    />
                </div>
              </div>
            </section>

            <section className="section-divider" style={{ paddingTop: '1rem' }}>
              <div className="toggle-group">
                <label htmlFor="grid-toggle" className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>إظهار شبكة التصميم</label>
                <input 
                  type="checkbox" 
                  checked={slide.showGrid}
                  onChange={(e) => onUpdate({ showGrid: e.target.checked })}
                  className="checkbox-custom"
                  id="grid-toggle"
                />
              </div>
            </section>
          </div>
        );

      case 'content':
      default:
        return (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">العنوان</label>
              <textarea 
                value={slide.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                className="form-textarea"
                style={{ minHeight: '100px' }}
                dir="rtl"
              />
            </div>

            <div className="form-group">
              <label className="form-label">الوصف</label>
              <textarea 
                value={slide.description}
                onChange={(e) => onUpdate({ description: e.target.value })}
                className="form-textarea"
                style={{ minHeight: '80px' }}
                dir="rtl"
              />
            </div>

            <div className="form-group">
              <label className="form-label">الرقم الخلفي (03)</label>
              <input 
                type="text"
                value={slide.numberText}
                onChange={(e) => onUpdate({ numberText: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <div className="flex justify-between items-center mb-1">
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>{slide.numberFontSize || 380}px</span>
                <label className="form-label">حجم الرقم الخلفي</label>
              </div>
              <input 
                type="range"
                min="100"
                max="800"
                step="5"
                value={slide.numberFontSize || 380}
                onChange={(e) => onUpdate({ numberFontSize: parseInt(e.target.value) })}
                style={{ 
                  width: '100%', 
                  accentColor: 'var(--neon-cyan)',
                  cursor: 'pointer'
                }}
              />
            </div>

            <div className="form-group" style={{ marginTop: '-0.5rem' }}>
              <div className="flex justify-between items-center mb-1">
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>{Math.round((slide.numberOpacity ?? 0.35) * 100)}%</span>
                <label className="form-label">شفافية الرقم</label>
              </div>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={slide.numberOpacity ?? 0.35}
                onChange={(e) => onUpdate({ numberOpacity: parseFloat(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--neon-cyan)', cursor: 'pointer' }}
              />
            </div>

            <div className="form-group" style={{ marginTop: '-0.5rem' }}>
              <div className="flex justify-between items-center mb-1">
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>{(slide.numberRotation ?? 0)}°</span>
                <label className="form-label">ميلان الرقم</label>
              </div>
              <input 
                type="range"
                min="-45"
                max="45"
                step="1"
                value={slide.numberRotation ?? 0}
                onChange={(e) => onUpdate({ numberRotation: parseInt(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--neon-cyan)', cursor: 'pointer' }}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="editor-panel">
      <div className="tab-list">
        <TabButton 
          active={activeTab === 'customize'} 
          onClick={() => setActiveTab('customize')}
          label="تخصيص"
          icon={<path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />}
        />
        <TabButton 
          active={activeTab === 'content'} 
          onClick={() => setActiveTab('content')}
          label="النصوص"
          icon={<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />}
        />
        <TabButton 
          active={activeTab === 'design'} 
          onClick={() => setActiveTab('design')}
          label="التصميم"
          icon={<path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />}
        />
        <TabButton 
          active={activeTab === 'ai'} 
          onClick={() => setActiveTab('ai')}
          label="الذكاء"
          icon={<path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 22.5l-.394-1.933a2.25 2.25 0 0 0-1.773-1.773L12.4 18.4l1.933-.394a2.25 2.25 0 0 0 1.773-1.773l.394-1.933.394 1.933a2.25 2.25 0 0 0 1.773 1.773l1.933.394-1.933.394a2.25 2.25 0 0 0-1.773 1.773Z" />}
        />
      </div>

      <div className="tab-content-area scrollbar-hide">
        {activeTab === 'ai' ? (
           <div className="ai-empty-state">
              <div className="ai-icon-circle">
                <svg className="ai-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>الذكاء الاصطناعي</h2>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>استخدم شريط الإدخال في الأسفل لتوليد محتوى الكاروسيل بالكامل بلمسة واحدة.</p>
           </div>
        ) : renderTabContent()}
      </div>

      <div className="editor-footer">
        <button 
          onClick={onAddSlide}
          className="add-slide-button"
        >
          <span style={{ fontSize: '1.25rem' }}>+</span> إضافة شريحة
        </button>
        <div className="action-buttons-grid">
          <button 
            onClick={onDuplicateSlide}
            className="secondary-action-button"
          >
            تكرار
          </button>
          <button 
            disabled={isLastSlide}
            onClick={onRemoveSlide}
            className="danger-action-button"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) => (
  <button 
    onClick={onClick}
    className={`tab-button ${active ? 'tab-button--active' : 'tab-button--inactive'}`}
  >
    <svg className="tab-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      {icon}
    </svg>
    <span className="tab-label">{label}</span>
    {active && (
      <div className="tab-indicator" />
    )}
  </button>
);

export default EditorPanel;
