import { useEffect } from "react";
import { useNavDispatch } from "../context/NavigationContext";
import { useSubtitle } from "../context/SubtitleContext";

export function useNavigation(
  onToggleSidebar: () => void,
  onToggleAppDrawer: () => void,
) {
  const dispatch = useNavDispatch();
  const { toggle: toggleSubtitle } = useSubtitle();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.key) {
        case "ArrowRight":
        case " ":
        case "Enter":
          e.preventDefault();
          dispatch({ type: "NEXT" });
          break;
        case "ArrowLeft":
        case "Backspace":
          e.preventDefault();
          dispatch({ type: "PREV" });
          break;
        case "s":
          toggleSubtitle();
          break;
        case "m":
          onToggleSidebar();
          break;
        case "a":
          onToggleAppDrawer();
          break;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch, toggleSubtitle, onToggleSidebar, onToggleAppDrawer]);
}
