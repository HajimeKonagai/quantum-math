import type { ReactNode } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useStep } from "../../hooks/useStep";

type Animation = "fadeIn" | "slideUp" | "slideRight" | "scaleIn";

const presets: Record<Animation, Variants> = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideRight: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
};

interface Props {
  /** Step index at which this element appears */
  step: number;
  /** Step index at which this element disappears (exclusive). Omit to keep visible. */
  exitAtStep?: number;
  animation?: Animation;
  duration?: number;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function StepReveal({
  step,
  exitAtStep,
  animation = "fadeIn",
  duration = 0.4,
  children,
  className,
  style,
}: Props) {
  const currentStep = useStep();
  const visible =
    currentStep >= step && (exitAtStep === undefined || currentStep < exitAtStep);

  const variants = presets[animation];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration }}
          className={className}
          style={style}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
