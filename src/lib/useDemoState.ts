"use client";

import { useEffect, useState } from "react";
import { defaultState, loadState, saveState } from "./store";
import type { DemoState } from "./types";

export function useDemoState() {
  const [state, setState] = useState<DemoState>(defaultState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadState());
    setReady(true);
    const onStorage = () => setState(loadState());
    const onCustom = (event: Event) => setState((event as CustomEvent<DemoState>).detail);
    window.addEventListener("storage", onStorage);
    window.addEventListener("fenix-state-change", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("fenix-state-change", onCustom);
    };
  }, []);

  const commit = (next: DemoState | ((current: DemoState) => DemoState)) => {
    setState((current) => {
      const resolved = typeof next === "function" ? next(current) : next;
      saveState(resolved);
      return resolved;
    });
  };

  return { state, setState: commit, ready };
}
