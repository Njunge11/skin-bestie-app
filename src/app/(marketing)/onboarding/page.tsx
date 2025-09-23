import { print } from "graphql/language/printer";
import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { GET_ONBOARDING_PAGE } from "@/queries/general/onboarding";
import type { StepMeta } from "./onboarding.types";
import OnboardingClient from "./onboarding.client";

// Map WP steps -> your StepMeta
function mapWpStepsToStepMeta(steps: any[]): StepMeta[] {
  return steps
    .map((s: any, idx: number) => {
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
            align: "left", // this step wants left-aligned headings in your UI
          } as StepMeta;
        default:
          return null;
      }
    })
    .filter(Boolean) as StepMeta[];
}

async function getOnboardingSteps(): Promise<StepMeta[]> {
  const query = print(GET_ONBOARDING_PAGE);
  const data = await fetchGraphQL(query);
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

  // React Hook Form must be inside a Client Component; wrap it in a small client shell:
  return <OnboardingClient steps={steps} />;
}
