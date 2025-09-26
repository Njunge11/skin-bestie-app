// app/(marketing)/page.tsx
import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { GetLandingPage } from "@/queries/general/landing.page";
import Benefits from "./benefits";
export const revalidate = 60;

type GQL = {
  page: {
    home?: {
      mainHeadline?: string | null;
      backgroundImage?: {
        node?: { altText?: string | null; sourceUrl?: string | null } | null;
      } | null;
      skinbestieBenefits?:
        | {
            skinbestieBenefit?: string | null;
            skinbestieBenefitDescription?: string | null;
          }[]
        | null;
    } | null;
  } | null;
};

async function getLanding() {
  const data = await fetchGraphQL<GQL>(GetLandingPage, {});
  const home = data.page?.home;

  const heading = home?.mainHeadline ?? "WITH SKINBESTIE, YOU GET";
  const imageSrc =
    home?.backgroundImage?.node?.sourceUrl ?? "/why-skinbestie.jpg";
  const imageAlt = home?.backgroundImage?.node?.altText ?? "why-skinbestie";

  const items = (home?.skinbestieBenefits ?? []).slice(0, 4).map((b) => ({
    title: (b.skinbestieBenefit ?? "").toUpperCase(), // keeps your uppercase style
    description: b.skinbestieBenefitDescription ?? "",
  }));

  return { heading, imageSrc, imageAlt, items };
}

export default async function MarketingHome() {
  const { heading, imageSrc, imageAlt, items } = await getLanding();

  return (
    <main>
      {/* Other sections above/below as you add them */}
      <Benefits
        heading={heading}
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        items={items}
      />
    </main>
  );
}
