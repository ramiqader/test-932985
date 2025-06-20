// Basic types for component rendering
export interface ComponentData {
  type: string;
  props: Record<string, any>;
  children?: ComponentData[];
  id?: string;
  className?: string;
}

export interface BuilderComponent extends ComponentData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

export interface ExportOptions {
  projectName: string;
  includeThemes?: boolean;
  includeAssets?: boolean;
  framework?: 'nextjs' | 'react';
  typescript?: boolean;
  canvasWidth?: number;
  canvasHeight?: number;
  currentBreakpoint?: string;
}

export type DeploymentResult = {
  success: boolean;
  url?: string;
  error?: string;
};
