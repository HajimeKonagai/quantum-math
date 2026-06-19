import type { ComponentType } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyParams = any;

/** Each interactive app receives its params as props */
export interface AppEntry {
  id: string;
  title: string;
  description: string;
  component: ComponentType<{ params: AnyParams }>;
  /** Default params when launched from the drawer without specific context */
  defaultParams: Record<string, unknown>;
}
