// // app/(marketing)/page.tsx
// import { fetchGraphQL } from "@/utils/fetchGraphQL";
// import { GetLandingPage } from "@/queries/general/landing.page";
// import Benefits from "./benefits";
// import Journey from "./journey";
// export const revalidate = 60;

// type GQL = {
//   page: {
//     home?: {
//       mainHeadline?: string | null;
//       backgroundImage?: {
//         node?: { altText?: string | null; sourceUrl?: string | null } | null;
//       } | null;
//       skinbestieBenefits?:
//         | {
//             skinbestieBenefit?: string | null;
//             skinbestieBenefitDescription?: string | null;
//           }[]
//         | null;
//     } | null;
//   } | null;
// };

// async function getLanding() {
//   const data = await fetchGraphQL<GQL>(GetLandingPage, {});
//   const home = data.page?.home;

//   const heading = home?.mainHeadline ?? "WITH SKINBESTIE, YOU GET";
//   const imageSrc =
//     home?.backgroundImage?.node?.sourceUrl ?? "/why-skinbestie.jpg";
//   const imageAlt = home?.backgroundImage?.node?.altText ?? "why-skinbestie";

//   const items = (home?.skinbestieBenefits ?? []).slice(0, 4).map((b) => ({
//     title: (b.skinbestieBenefit ?? "").toUpperCase(), // keeps your uppercase style
//     description: b.skinbestieBenefitDescription ?? "",
//   }));

//   return { heading, imageSrc, imageAlt, items };
// }

// export default async function MarketingHome() {
//   const { heading, imageSrc, imageAlt, items } = await getLanding();

//   return (
//     <main>
//       {/* Other sections above/below as you add them */}
//       <Benefits
//         heading={heading}
//         imageSrc={imageSrc}
//         imageAlt={imageAlt}
//         items={items}
//       />
//       <Journey />
//     </main>
//   );
// }
// app/(marketing)/page.tsx
import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { GetLandingPage } from "@/queries/general/landing.page";
import Benefits from "./benefits";
import Journey from "./journey";

export const revalidate = 60;

type GQL = {
  page: {
    home?: {
      skinbestieBenefits?: Array<{
        backgroundImage?: {
          node?: { altText?: string | null; sourceUrl?: string | null } | null;
        } | null;
        list?: Array<{
          title?: string | null;
          description?: string | null;
        }> | null;
      }> | null;
      skinbestieJourney?: Array<{
        mainHeadline?: string | null;
        subHeadline?: string | null;
        list?: Array<{
          icon?: {
            node?: {
              altText?: string | null;
              sourceUrl?: string | null;
            } | null;
          } | null;
          title?: string | null;
          description?: string | null;
        }> | null;
      }> | null;
    } | null;
  } | null;
};

async function getLanding() {
  const data = await fetchGraphQL<GQL>(GetLandingPage, {});
  const home = data.page?.home;

  const benefitsBlock = home?.skinbestieBenefits?.[0];
  const imageSrc = benefitsBlock?.backgroundImage?.node?.sourceUrl ?? "";
  const imageAlt = benefitsBlock?.backgroundImage?.node?.altText ?? "";

  const items = (benefitsBlock?.list ?? []).slice(0, 4).map((b) => ({
    title: b.title ?? "",
    description: b.description ?? "",
  }));

  const journeyBlock = home?.skinbestieJourney?.[0];
  const journeyHeading = journeyBlock?.mainHeadline ?? "";
  const journeySub = journeyBlock?.subHeadline ?? "";
  const steps = (journeyBlock?.list ?? []).slice(0, 3).map((s) => ({
    iconSrc: s.icon?.node?.sourceUrl ?? "",
    iconAlt: s.icon?.node?.altText ?? "",
    title: s.title ?? "",
    description: s.description ?? "",
  }));

  return {
    benefits: { imageSrc, imageAlt, items },
    journey:
      journeyHeading || journeySub || steps.length
        ? { heading: journeyHeading, subheading: journeySub, steps }
        : null,
  };
}

export default async function MarketingHome() {
  const { benefits, journey } = await getLanding();

  return (
    <main>
      <Benefits
        // If your Benefits component expects a heading prop, pass it from WP.
        // You can keep it optional if you’ve already made it optional.
        imageSrc={benefits.imageSrc}
        imageAlt={benefits.imageAlt}
        items={benefits.items}
      />
      {journey ? (
        <Journey
          heading={journey.heading}
          subheading={journey.subheading}
          steps={journey.steps}
        />
      ) : null}
    </main>
  );
}
