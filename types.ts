
export interface ImageFile {
  file: File;
  preview: string;
  base64: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}
