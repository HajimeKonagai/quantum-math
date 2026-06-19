import { useRef, useEffect } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface Props {
  tex: string;
  display?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Math({ tex, display = false, className, style }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, {
        displayMode: display,
        throwOnError: false,
        strict: false,
      });
    }
  }, [tex, display]);

  return <span ref={ref} className={className} style={style} />;
}
