import React, { useState, useRef, useCallback } from "react";
import { Slide } from "./types";
import { INITIAL_SLIDES, MAX_SLIDES } from "./constants";
import SlideCanvas from "./components/SlideCanvas";
import EditorPanel from "./components/EditorPanel";
import { generateCarouselContent } from "./services/geminiService";
import { toPng } from "html-to-image";

const App: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>(INITIAL_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [prompt, setPrompt] = useState("");

  const canvasRef = useRef<HTMLDivElement>(null);
  const currentSlide = slides[currentIndex];

  const handleUpdateSlide = (updates: Partial<Slide>) => {
    setSlides((prev) =>
      prev.map((s, i) => (i === currentIndex ? { ...s, ...updates } : s)),
    );
  };

  const handleAddSlide = () => {
    if (slides.length >= MAX_SLIDES) return;
    const newSlide: Slide = {
      ...currentSlide,
      id: Math.random().toString(36).substr(2, 9),
      numberText: (slides.length + 1).toString().padStart(2, "0"),
    };
    setSlides((prev) => [...prev, newSlide]);
    setCurrentIndex(slides.length);
  };

  const handleDuplicateSlide = () => {
    if (slides.length >= MAX_SLIDES) return;
    const newSlide: Slide = {
      ...currentSlide,
      id: Math.random().toString(36).substr(2, 9),
    };
    const newSlides = [...slides];
    newSlides.splice(currentIndex + 1, 0, newSlide);
    setSlides(newSlides);
    setCurrentIndex(currentIndex + 1);
  };

  const handleRemoveSlide = () => {
    if (slides.length <= 1) return;
    setSlides((prev) => prev.filter((_, i) => i !== currentIndex));
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const handleAiGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const generated = await generateCarouselContent(prompt);
      const newSlides: Slide[] = generated.map((item: any, idx: number) => ({
        id: Math.random().toString(36).substr(2, 9),
        title: item.title,
        description: item.description,
        numberText: item.numberText || (idx + 1).toString().padStart(2, "0"),
        brandName: currentSlide.brandName,
        accentColor: currentSlide.accentColor,
        secondaryColor: currentSlide.secondaryColor,
        showGrid: currentSlide.showGrid,
        customCss: currentSlide.customCss,
        logoUrl: currentSlide.logoUrl,
        numberFontSize: currentSlide.numberFontSize,
        numberOpacity: currentSlide.numberOpacity,
        numberRotation: currentSlide.numberRotation,
      }));
      setSlides(newSlides);
      setCurrentIndex(0);
      setPrompt("");
    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("حدث خطأ أثناء توليد المحتوى. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = useCallback(async () => {
    if (canvasRef.current === null) return;
    setIsExporting(true);

    try {
      // Ensure fonts are loaded before capturing
      if (document.fonts) {
        await document.fonts.ready;
      }

      const dataUrl = await toPng(canvasRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: currentSlide.secondaryColor,
        style: {
          transform: "scale(1)",
          borderRadius: "0",
        },
        filter: (node: HTMLElement) => {
          return !["navigation-arrow", "ai-input"].some((cls) =>
            node.classList?.contains(cls),
          );
        },
      });

      const link = document.createElement("a");
      link.download = `carousel-${currentIndex + 1}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export error:", err);
      alert("حدث خطأ أثناء تصدير الصورة.");
    } finally {
      setIsExporting(false);
    }
  }, [currentIndex, currentSlide.secondaryColor]);

  return (
    <div className="app-container">
      <EditorPanel
        slide={currentSlide}
        onUpdate={handleUpdateSlide}
        onAddSlide={handleAddSlide}
        onRemoveSlide={handleRemoveSlide}
        onDuplicateSlide={handleDuplicateSlide}
        isLastSlide={slides.length <= 1}
      />

      <div className="main-workspace">
        <div className="top-bar">
          <div className="status-badge">
            <span className="pagination-info">
              الشريحة {currentIndex + 1} من {slides.length}
            </span>
            <div className="pagination-dots">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`dot ${i === currentIndex ? "dot--active" : "dot--inactive"}`}
                />
              ))}
            </div>
          </div>

          <div className="navigation-actions">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="export-button"
            >
              {isExporting ? (
                <>
                  <span className="loading-spinner"></span>
                  جاري التصدير...
                </>
              ) : (
                "تصدير PNG"
              )}
            </button>
          </div>
        </div>

        <div className="canvas-wrapper scrollbar-hide">
          <div className="slide-wrapper slide-shadow flex-shrink-0 relative">
            <SlideCanvas slide={currentSlide} ref={canvasRef} />

            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="navigation-arrow navigation-arrow--right z-20 absolute top-1/2 -translate-y-1/2"
            >
              <span>→</span>
            </button>
            <button
              onClick={() =>
                setCurrentIndex((prev) => Math.min(slides.length - 1, prev + 1))
              }
              disabled={currentIndex === slides.length - 1}
              className="navigation-arrow navigation-arrow--left z-20 absolute top-1/2 -translate-y-1/2"
            >
              <span>←</span>
            </button>
          </div>
        </div>

        <div className="ai-input-container">
          <div className="ai-input-wrapper">
            <input
              type="text"
              placeholder="اكتب موضوع الكاروسيل وسيقوم الذكاء الاصطناعي بالباقي..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAiGenerate()}
              className="ai-input-field"
              dir="rtl"
            />
          </div>
          <button
            onClick={handleAiGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="ai-generate-button"
          >
            {isGenerating ? "جاري التوليد..." : "توليد سحري ✨"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
