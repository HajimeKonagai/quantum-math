import { useNav } from "../../context/NavigationContext";
import styles from "./ProgressBar.module.scss";

export function ProgressBar() {
  const { slideIndex, stepIndex, slideCount, stepsPerSlide } = useNav();

  // Calculate total progress across all slides
  let completedSteps = 0;
  let totalSteps = 0;
  for (let i = 0; i < slideCount; i++) {
    totalSteps += stepsPerSlide[i];
    if (i < slideIndex) {
      completedSteps += stepsPerSlide[i];
    } else if (i === slideIndex) {
      completedSteps += stepIndex + 1;
    }
  }
  const pct = (completedSteps / totalSteps) * 100;

  return <div className={styles.bar} style={{ width: `${pct}%` }} />;
}
