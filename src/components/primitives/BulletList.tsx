import { motion, AnimatePresence } from "motion/react";
import { useStep } from "../../hooks/useStep";

interface Props {
  /** List of bullet items */
  items: string[];
  /** Step index at which the first item appears */
  startStep: number;
  /** If true, all items appear at startStep. Otherwise one per step. */
  allAtOnce?: boolean;
  color?: string;
  className?: string;
}

export function BulletList({
  items,
  startStep,
  allAtOnce = false,
  color,
  className,
}: Props) {
  const currentStep = useStep();

  return (
    <ul className={className} style={{ listStyle: "none", padding: 0 }}>
      <AnimatePresence>
        {items.map((item, i) => {
          const showAt = allAtOnce ? startStep : startStep + i;
          if (currentStep < showAt) return null;
          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, delay: allAtOnce ? i * 0.08 : 0 }}
              style={{ color, marginBottom: "0.4em", fontSize: "1.1rem" }}
            >
              {item}
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
