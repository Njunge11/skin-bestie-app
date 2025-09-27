// import { print } from "graphql";
// import { fetchGraphQL } from "@/utils/fetchGraphQL";
// import { GetLandingPage } from "@/queries/general/landing.page";
// import Benefits from "./benefits";
// import Journey from "./journey";
// import Testimonials from "./testimonials";

// export const revalidate = 60;

// async function getLanding() {
//   // same style as [[...slug]]: print() → pass string → no bespoke TS types
//   const data = await fetchGraphQL(print(GetLandingPage));
//   const home = data?.page?.home;

//   // Benefits block (first entry)
//   const b = home?.skinbestieBenefits?.[0];
//   const imageSrc = b?.backgroundImage?.node?.sourceUrl ?? "";
//   const imageAlt = b?.backgroundImage?.node?.altText ?? "";
//   const items = (b?.list ?? []).slice(0, 4).map((x: any) => ({
//     title: x?.title ?? "",
//     description: x?.description ?? "",
//   }));

//   // Journey block (first entry)
//   const j = home?.skinbestieJourney?.[0];
//   const journeyHeading = j?.mainHeadline ?? "";
//   const journeySub = j?.subHeadline ?? "";
//   const steps = (j?.list ?? []).slice(0, 3).map((s: any) => ({
//     iconSrc: s?.icon?.node?.sourceUrl ?? "",
//     iconAlt: s?.icon?.node?.altText ?? "",
//     title: s?.title ?? "",
//     description: s?.description ?? "",
//   }));

//   return {
//     benefits: { imageSrc, imageAlt, items },
//     journey:
//       journeyHeading || journeySub || steps.length
//         ? { heading: journeyHeading, subheading: journeySub, steps }
//         : null,
//   };
// }

// export default async function MarketingHome() {
//   const { benefits, journey } = await getLanding();

//   return (
//     <main>
//       <Benefits
//         imageSrc={benefits.imageSrc}
//         imageAlt={benefits.imageAlt}
//         items={benefits.items}
//       />
//       {journey ? (
//         <Journey
//           heading={journey.heading}
//           subheading={journey.subheading}
//           steps={journey.steps}
//         />
//       ) : null}
//       <Testimonials />
//     </main>
//   );
// }
// app/(marketing)/page.tsx
import { print } from "graphql";
import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { GetLandingPage } from "@/queries/general/landing.page";
import Benefits from "./benefits";
import Journey from "./journey";
import Testimonials from "./testimonials";

export const revalidate = 60;

// --- extractors ---
function extractBenefits(home: any) {
  const block = home?.skinbestieBenefits?.[0];
  if (!block) return null;

  const imageSrc = block?.backgroundImage?.node?.sourceUrl ?? "";
  const imageAlt = block?.backgroundImage?.node?.altText ?? "";
  const items = (block?.list ?? []).slice(0, 4).map((x: any) => ({
    title: x?.title ?? "",
    description: x?.description ?? "",
  }));

  return { imageSrc, imageAlt, items };
}

function extractJourney(home: any) {
  const block = home?.skinbestieJourney?.[0];
  if (!block) return null;

  const heading = block?.mainHeadline ?? "";
  const subheading = block?.subHeadline ?? "";
  const steps = (block?.list ?? []).slice(0, 3).map((s: any) => ({
    iconSrc: s?.icon?.node?.sourceUrl ?? "",
    iconAlt: s?.icon?.node?.altText ?? "",
    title: s?.title ?? "",
    description: s?.description ?? "",
  }));

  const hasContent = heading || subheading || steps.length > 0;
  return hasContent ? { heading, subheading, steps } : null;
}

function extractTestimonials(home: any) {
  const block = home?.skinbestieTestimonials?.[0];
  if (!block) return null;

  const heading = block?.mainHeadline ?? "";
  const subheading = block?.subHeadline ?? "";
  const imageSrc = block?.image?.node?.sourceUrl ?? "";
  const imageAlt = block?.image?.node?.altText ?? "";

  // WP shape: carousel[] -> cardContent[]
  const items = (block?.carousel ?? [])
    .flatMap((slide: any) => slide?.cardContent ?? [])
    .map((c: any) => ({
      concern: c?.concern ?? "",
      goal: c?.goal ?? "",
      testimonial: c?.testimonial ?? "",
      customerName: c?.customerName ?? "",
    }));

  const hasContent = heading || imageSrc || items.length > 0;
  return hasContent ? { heading, subheading, imageSrc, imageAlt, items } : null;
}

// --- data loader ---
async function getLanding() {
  const data = await fetchGraphQL<any>(print(GetLandingPage));
  const home = data?.page?.home;

  return {
    benefits: extractBenefits(home),
    journey: extractJourney(home),
    testimonials: extractTestimonials(home),
  };
}

export default async function MarketingHome() {
  const { benefits, journey, testimonials } = await getLanding();
  console.log("testimonials:", testimonials);

  return (
    <main>
      {benefits && (
        <Benefits
          imageSrc={benefits.imageSrc}
          imageAlt={benefits.imageAlt}
          items={benefits.items}
        />
      )}

      {journey && (
        <Journey
          heading={journey.heading}
          subheading={journey.subheading}
          steps={journey.steps}
        />
      )}

      {testimonials && (
        <Testimonials
          heading={testimonials.heading}
          subheading={testimonials.subheading}
          imageSrc={testimonials.imageSrc}
          imageAlt={testimonials.imageAlt}
          items={testimonials.items}
        />
      )}
    </main>
  );
}
