import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";

export interface NavState {
  slideIndex: number;
  stepIndex: number;
  /** Total number of slides */
  slideCount: number;
  /** steps count per slide (indexed by slideIndex) */
  stepsPerSlide: number[];
}

export type NavAction =
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "GOTO"; slideIndex: number; stepIndex?: number };

function navReducer(state: NavState, action: NavAction): NavState {
  const maxStep = state.stepsPerSlide[state.slideIndex] - 1;

  switch (action.type) {
    case "NEXT": {
      if (state.stepIndex < maxStep) {
        return { ...state, stepIndex: state.stepIndex + 1 };
      }
      if (state.slideIndex < state.slideCount - 1) {
        return { ...state, slideIndex: state.slideIndex + 1, stepIndex: 0 };
      }
      return state;
    }
    case "PREV": {
      if (state.stepIndex > 0) {
        return { ...state, stepIndex: state.stepIndex - 1 };
      }
      if (state.slideIndex > 0) {
        const prevSlide = state.slideIndex - 1;
        return {
          ...state,
          slideIndex: prevSlide,
          stepIndex: state.stepsPerSlide[prevSlide] - 1,
        };
      }
      return state;
    }
    case "GOTO": {
      const si = Math.max(0, Math.min(action.slideIndex, state.slideCount - 1));
      const step = action.stepIndex ?? 0;
      return { ...state, slideIndex: si, stepIndex: step };
    }
  }
}

const NavigationContext = createContext<NavState | null>(null);
const NavigationDispatchContext = createContext<Dispatch<NavAction> | null>(
  null,
);

export function NavigationProvider({
  stepsPerSlide,
  children,
}: {
  stepsPerSlide: number[];
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(navReducer, {
    slideIndex: 0,
    stepIndex: 0,
    slideCount: stepsPerSlide.length,
    stepsPerSlide,
  });

  return (
    <NavigationContext value={state}>
      <NavigationDispatchContext value={dispatch}>
        {children}
      </NavigationDispatchContext>
    </NavigationContext>
  );
}

export function useNav(): NavState {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useNav must be used within NavigationProvider");
  return ctx;
}

export function useNavDispatch(): Dispatch<NavAction> {
  const ctx = useContext(NavigationDispatchContext);
  if (!ctx)
    throw new Error("useNavDispatch must be used within NavigationProvider");
  return ctx;
}
