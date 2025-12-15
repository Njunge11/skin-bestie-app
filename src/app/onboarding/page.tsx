import type { Metadata } from "next";
import { Suspense } from "react";
import { print } from "graphql/language/printer";
import { wpFetch } from "@/utils/wp";
import { GET_ONBOARDING_PAGE } from "@/queries/general/onboarding";
import type { StepMeta } from "./onboarding.types";
import OnboardingClient from "./onboarding.client";
import { OnboardingSkeleton } from "./components/onboarding.skeleton";

export const metadata: Metadata = {
  title: "Get Started - SkinBestie",
  description:
    "Begin your personalized skincare journey. Share your skin concerns and goals to receive expert guidance tailored to your needs.",
};
// Map WP steps -> your StepMeta
type WPStep = {
  __typename: string;
  mainHeadline?: string;
  subHeadline?: string;
  backgroundImage?: { node?: { sourceUrl?: string } };
  formTitle?: string;
  formDescription?: string;
  formInstruction?: string;
  subscriptionHeadline?: string;
  subscriptionSubHeadline?: string;
  subscriptionBenefits?: Array<{ benefit?: string }>;
};

function mapWpStepsToStepMeta(steps: WPStep[]): StepMeta[] {
  return steps
    .map((s, idx: number) => {
      switch (s.__typename) {
        case "OnboardingStepsPersonalDetailsLayout":
          return {
            id: idx + 1,
            slug: `step-${idx + 1}`,
            headline: s.mainHeadline ?? "",
            subhead: s.subHeadline ?? "",
            bgImage: s?.backgroundImage?.node?.sourceUrl ?? "/onboarding.jpg",
            formTitle: s.formTitle ?? "",
            formSub: s.formDescription ?? "",
            component: "personal",
            align: "center", // this step wants left-aligned headings in your UI
          } as StepMeta;
        case "OnboardingStepsSkinTypeLayout":
          return {
            id: idx + 1,
            slug: `step-${idx + 1}`,
            headline: s.mainHeadline ?? "",
            subhead: s.subHeadline ?? "",
            bgImage: s?.backgroundImage?.node?.sourceUrl ?? "/onboarding.jpg",
            formTitle: s.formTitle ?? "",
            formInstruction: s.formInstruction ?? "",
            component: "skinType",
            align: "center",
          } as StepMeta;
        case "OnboardingStepsSkinConcernsLayout":
          return {
            id: idx + 1,
            slug: `step-${idx + 1}`,
            headline: s.mainHeadline ?? "",
            subhead: s.subHeadline ?? "",
            bgImage: s?.backgroundImage?.node?.sourceUrl ?? "/onboarding.jpg",
            formTitle: s.formTitle ?? "",
            formInstruction: s.formInstruction ?? "",
            formSub: s.formDescription ?? "",
            component: "concerns",
            align: "center", // this step wants left-aligned headings in your UI
          } as StepMeta;
        case "OnboardingStepsAllergiesLayout":
          return {
            id: idx + 1,
            slug: `step-${idx + 1}`,
            headline: s.mainHeadline ?? "",
            subhead: s.subHeadline ?? "",
            bgImage: s?.backgroundImage?.node?.sourceUrl ?? "/onboarding.jpg",
            formTitle: s.formTitle ?? "",
            formSub: s.formDescription ?? "",
            component: "allergies",
            align: "center", // this step wants left-aligned headings in your UI
          } as StepMeta;
        case "OnboardingStepsSubscriptionLayout":
          return {
            id: idx + 1,
            slug: `step-${idx + 1}`,
            headline: s.subscriptionHeadline ?? "",
            subhead: s.subscriptionSubHeadline ?? "",
            bgImage: s?.backgroundImage?.node?.sourceUrl ?? "/onboarding.jpg",
            formTitle: s.mainHeadline ?? "Subscribe",
            formSub: s.subHeadline ?? "",
            subscriptionHeadline: s.subscriptionHeadline ?? "",
            subscriptionSubHeadline: s.subscriptionSubHeadline ?? "",
            subscriptionBenefits: (s.subscriptionBenefits ?? [])
              .map((b) => b?.benefit)
              .filter(Boolean),
            component: "subscribe",
            align: "center",
          } as StepMeta;
        case "OnboardingStepsBookingLayout":
          return {
            id: idx + 1,
            slug: `step-${idx + 1}`,
            headline: s.subscriptionHeadline ?? "",
            subhead: s.subscriptionSubHeadline ?? "",
            bgImage: s?.backgroundImage?.node?.sourceUrl ?? "/onboarding.jpg",
            formTitle: s.mainHeadline ?? "Book",
            formSub: s.subHeadline ?? "",
            subscriptionHeadline: s.subscriptionHeadline ?? "",
            subscriptionSubHeadline: s.subscriptionSubHeadline ?? "",
            subscriptionBenefits: (s.subscriptionBenefits ?? [])
              .map((b) => b?.benefit)
              .filter(Boolean),
            component: "book",
            align: "center",
          } as StepMeta;
        default:
          return null;
      }
    })
    .filter(Boolean) as StepMeta[];
}

async function getOnboardingSteps(): Promise<StepMeta[]> {
  const query = print(GET_ONBOARDING_PAGE);
  const data = await wpFetch<{
    page?: {
      onboarding?: {
        steps?: WPStep[];
      };
    };
  }>(query);
  const rawSteps = data?.page?.onboarding?.steps ?? [];
  const mapped = mapWpStepsToStepMeta(rawSteps);

  // Safety: ensure at least one step
  if (!mapped.length) {
    return [
      {
        id: 1,
        slug: "step-1",
        headline: "Your skin’s story matters here.",
        subhead: "This process should only take about 2 minutes.",
        bgImage: "/onboarding.jpg",
        formTitle: "Set up your profile",
        formSub:
          "Just a few details so we can personalise your journey. We'll never share your details.",
        component: "personal",
        align: "center",
      },
    ];
  }
  return mapped;
}

export default async function OnboardingPage() {
  const steps = await getOnboardingSteps();

  // Suspense boundary required for useSearchParams in OnboardingClient
  // Prevents hydration mismatch when reading URL params for payment return flow
  return (
    <Suspense fallback={<OnboardingSkeleton />}>
      <OnboardingClient steps={steps} />
    </Suspense>
  );
}
