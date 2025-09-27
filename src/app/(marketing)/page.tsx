import { print } from "graphql";
import { fetchGraphQL } from "@/utils/fetchGraphQL";
import { GetLandingPage } from "@/queries/general/landing.page";
import Benefits from "./benefits";
import Journey from "./journey";
import Testimonials from "./testimonials";
import Values from "./values";

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

function extractValues(home: any) {
  const block = home?.skinbestieValues?.[0];
  if (!block) return null;

  const imageSrc = block?.image?.node?.sourceUrl ?? "";
  const imageAlt = block?.image?.node?.altText ?? "";

  const items = (block?.values ?? []).map((v: any) => ({
    iconSrc: v?.icon?.node?.sourceUrl ?? "",
    iconAlt: v?.icon?.node?.altText ?? "",
    title: v?.title ?? "",
    description: v?.description ?? "",
  }));

  const hasContent = imageSrc || items.length > 0;
  return hasContent ? { imageSrc, imageAlt, items } : null;
}

// --- data loader ---
async function getLanding() {
  const data = await fetchGraphQL<any>(print(GetLandingPage));
  const home = data?.page?.home;

  return {
    benefits: extractBenefits(home),
    journey: extractJourney(home),
    testimonials: extractTestimonials(home),
    values: extractValues(home),
  };
}

export default async function MarketingHome() {
  const { benefits, journey, testimonials, values } = await getLanding();

  console.log("values", values);

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
      {values && (
        <Values
          imageSrc={values.imageSrc}
          imageAlt={values.imageAlt}
          items={values.items}
        />
      )}
    </main>
  );
}
