import { useState, useEffect } from "react";
import { animate } from "motion";
import { Vector } from "mafs";

interface AnimatedVectorProps {
  tip: [number, number];
  tail?: [number, number];
  color?: string;
  weight?: number;
  opacity?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Animation delay in seconds */
  delay?: number;
}

/**
 * A Mafs Vector that grows from its tail to its tip on mount.
 * Uses motion's `animate` to interpolate the tip position.
 */
export function AnimatedVector({
  tip,
  tail = [0, 0],
  duration = 0.5,
  delay = 0,
  ...rest
}: AnimatedVectorProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const controls = animate(0, 1, {
      duration,
      delay,
      ease: "easeOut",
      onUpdate: setProgress,
    });
    return () => controls.stop();
  }, [tip[0], tip[1], tail[0], tail[1], duration, delay]);

  const currentTip: [number, number] = [
    tail[0] + (tip[0] - tail[0]) * progress,
    tail[1] + (tip[1] - tail[1]) * progress,
  ];

  return <Vector tip={currentTip} tail={tail} {...rest} />;
}
