import type { ComponentType } from "react";

export interface SlideDefinition {
  id: string;
  title: string;
  steps: number;
  component: ComponentType;
}

export interface Chapter {
  id: string;
  title: string;
  slides: SlideDefinition[];
}
