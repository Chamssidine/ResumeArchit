import { Inter, Lora, Roboto_Mono as RobotoMono } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
});

export const robotoMono = RobotoMono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  weight: ['400', '500', '700'],
});

export const availableFonts = [
  { id: 'Geist Sans', name: 'Geist Sans (Default)', variable: 'var(--font-geist-sans)' , className: ''},
  { id: 'Inter', name: 'Inter (Sans Serif)', variable: 'var(--font-inter)', className: inter.variable },
  { id: 'Lora', name: 'Lora (Serif)', variable: 'var(--font-lora)', className: lora.variable },
  { id: 'Roboto Mono', name: 'Roboto Mono (Monospace)', variable: 'var(--font-roboto-mono)', className: robotoMono.variable },
];

export function getFontClassName(fontFamilyName: string): string {
  const font = availableFonts.find(f => f.name === fontFamilyName || f.id === fontFamilyName);
  return font ? font.className : '';
}
