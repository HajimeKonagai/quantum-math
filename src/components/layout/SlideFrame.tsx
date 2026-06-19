import type { ReactNode } from "react";
import styles from "./SlideFrame.module.scss";

interface SlideFrameProps {
  children: ReactNode;
  chapterTitle?: string;
}

export function SlideFrame({ children, chapterTitle }: SlideFrameProps) {
  return (
    <div className={styles.frame}>
      <div className={styles.viewport}>
        {chapterTitle && (
          <div className={styles.chapterHeader}>{chapterTitle}</div>
        )}
        <div className={styles.slideContent}>{children}</div>
      </div>
    </div>
  );
}
