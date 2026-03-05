
export interface Slide {
  id: string;
  title: string;
  description: string;
  numberText: string;
  brandName: string;
  accentColor: string;
  secondaryColor: string;
  showGrid: boolean;
  customCss?: string;
  logoUrl?: string; // New field for user-uploaded logo
}

export interface CarouselState {
  slides: Slide[];
  currentIndex: number;
}

export interface ColorTheme {
  name: string;
  accent: string;
  secondary: string;
}
