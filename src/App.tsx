import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { NavigationProvider, useNav } from "./context/NavigationContext";
import { SubtitleProvider } from "./context/SubtitleContext";
import { AppProvider } from "./context/AppContext";
import { useNavigation } from "./hooks/useNavigation";
import { SlideFrame } from "./components/layout/SlideFrame";
import { ProgressBar } from "./components/layout/ProgressBar";
import { SubtitleBar } from "./components/layout/SubtitleBar";
import { Sidebar } from "./components/layout/Sidebar";
import { AppModal } from "./components/layout/AppModal";
import { AppDrawer } from "./components/layout/AppDrawer";
import { KeyboardHelp } from "./components/layout/KeyboardHelp";
import { chapters, allSlides } from "./data/chapters";
import { getSubtitle } from "./data/subtitles";
import { appRegistry } from "./data/appRegistry";

const stepsPerSlide = allSlides.map((s) => s.steps);

function SlidePresenter() {
  const { slideIndex, stepIndex } = useNav();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleSidebar = useCallback(
    () => setSidebarOpen((v) => !v),
    [],
  );
  const toggleDrawer = useCallback(
    () => setDrawerOpen((v) => !v),
    [],
  );

  useNavigation(toggleSidebar, toggleDrawer);

  const current = allSlides[slideIndex];
  const SlideComponent = current.component;
  const subtitle = getSubtitle(current.id, stepIndex);

  // Find current chapter title
  let chapterTitle = "";
  let count = 0;
  for (const ch of chapters) {
    if (slideIndex < count + ch.slides.length) {
      chapterTitle = ch.title;
      break;
    }
    count += ch.slides.length;
  }

  return (
    <>
      <SlideFrame chapterTitle={chapterTitle}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ height: "100%" }}
          >
            <SlideComponent />
          </motion.div>
        </AnimatePresence>
      </SlideFrame>
      <ProgressBar />
      <SubtitleBar text={subtitle} />
      <Sidebar
        chapters={chapters}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <AppDrawer
        registry={appRegistry}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <AppModal registry={appRegistry} />
      <KeyboardHelp />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <SubtitleProvider>
        <NavigationProvider stepsPerSlide={stepsPerSlide}>
          <SlidePresenter />
        </NavigationProvider>
      </SubtitleProvider>
    </AppProvider>
  );
}
