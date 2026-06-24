import type { ReactNode } from "react";
import styles from "./SlideFrame.module.scss";

interface SlideFrameProps {
  children: ReactNode;
  chapterTitle?: string;
  slideId?: string;
  slideIndex?: number;
  stepIndex?: number;
}

export function SlideFrame({ children, chapterTitle, slideId, slideIndex, stepIndex }: SlideFrameProps) {
  return (
    <div className={styles.frame}>
      <div className={styles.viewport}>
        {chapterTitle && (
          <div className={styles.chapterHeader}>{chapterTitle}</div>
        )}
        {slideId && (
          <div className={styles.debugId}>
            p{(slideIndex ?? 0) + 1} / step {stepIndex ?? 0} — {slideId}
          </div>
        )}
        <div className={styles.slideContent}>{children}</div>
      </div>
    </div>
  );
}
