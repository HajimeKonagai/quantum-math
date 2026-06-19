import { useRef } from "react";
import { useNav } from "../context/NavigationContext";

/**
 * Returns the current step index for the active slide.
 *
 * When a slide transition occurs (slideIndex changes), the exiting
 * component still re-renders via AnimatePresence. Without freezing,
 * the old slide would briefly show step 0 (the new slide's initial step).
 *
 * This hook captures the slideIndex at mount time and only updates
 * the step while the slide hasn't changed, preventing the flicker.
 */
export function useStep(): number {
  const { stepIndex, slideIndex } = useNav();
  const mountedSlideRef = useRef(slideIndex);
  const frozenStepRef = useRef(stepIndex);

  if (slideIndex === mountedSlideRef.current) {
    frozenStepRef.current = stepIndex;
  }

  return frozenStepRef.current;
}
