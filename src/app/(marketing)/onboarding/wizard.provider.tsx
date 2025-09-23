"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { StepMeta, WizardCtx } from "./onboarding.types";

const WizardContext = createContext<WizardCtx | null>(null);

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used within <WizardProvider>");
  return ctx;
}

export function WizardProvider({
  children,
  steps,
}: {
  children: ReactNode;
  steps: StepMeta[];
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const total = steps.length;
  const clampedIndex = Math.min(Math.max(stepIndex, 0), Math.max(total - 1, 0));
  const current = steps[clampedIndex];

  const next = () => setStepIndex((i) => Math.min(i + 1, total - 1));
  const back = () => setStepIndex((i) => Math.max(i - 1, 0));

  const value: WizardCtx = {
    stepIndex: clampedIndex,
    setStepIndex,
    next,
    back,
    steps,
    current,
    total,
  };
  return (
    <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
  );
}
