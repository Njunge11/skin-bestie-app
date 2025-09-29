// app/(marketing)/page.tsx
import { print } from "graphql";
import { wpFetch } from "@/utils/wp";
import { GetLandingPage } from "@/queries/general/landing.page";
import Benefits from "./benefits";
import Journey from "./journey";
import Testimonials from "./testimonials"; // Community
import Values from "./values";
import Pricing from "./pricing";
import Faqs from "./faqs";
import ScrollEffectWrapper from "./ScrollEffectWrapper";
import HeroWithHeader from "./HeroWithHeader";
import OurStory from "./OurStory";
import Header from "./header";
import HeroSection from "./hero";

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

function extractPricing(home: any) {
  const block = home?.skinbestiePricing?.[0];
  if (!block) return null;

  const heading = block?.mainHeadline ?? "";
  const subheading = block?.subHeadline ?? "";

  const plan = block?.valueProp?.[0];
  const priceHeadline = plan?.mainHeadline ?? "";
  const priceSub = plan?.subHeadline ?? "";
  const benefits: string[] = (plan?.benefits ?? [])
    .map((b: any) => b?.benefit ?? "")
    .filter(Boolean);

  const hasContent =
    heading || subheading || priceHeadline || priceSub || benefits.length > 0;
  return hasContent
    ? { heading, subheading, priceHeadline, priceSub, benefits }
    : null;
}

function extractFaqs(home: any) {
  const block = home?.skinbestieFaqs?.[0];
  if (!block) return null;

  const heading = block?.mainHeadline ?? "";
  const heading2 = block?.mainHeadline2 ?? "";
  const subheading = block?.subHeadline ?? "";

  const items = (block?.faqs ?? []).map((f: any) => ({
    question: f?.question ?? "",
    type: String(f?.answerType?.[0] ?? "text").toLowerCase(), // 'text' | 'list'
    text: f?.answerText ?? "",
    list: (f?.answerList ?? []).map((x: any) => x?.item ?? "").filter(Boolean),
  }));

  const hasContent = heading || heading2 || subheading || items.length > 0;
  return hasContent ? { heading, heading2, subheading, items } : null;
}

// --- data loader ---
async function getLanding() {
  const data = await wpFetch(print(GetLandingPage));
  const home = data?.page?.home;

  return {
    benefits: extractBenefits(home),
    journey: extractJourney(home),
    testimonials: extractTestimonials(home),
    values: extractValues(home),
    pricing: extractPricing(home),
    faqs: extractFaqs(home),
  };
}

export default async function MarketingHome() {
  const { benefits, journey, testimonials, values, pricing, faqs } =
    await getLanding();

  return (
    <main>
      {/* 0: Hero with Header INSIDE, so Benefits can wipe over both */}

      <Header />
      <HeroSection />
      {/* <OurStory /> */}

      {/* 1: Benefits (curtain over Hero+Header) */}
      {benefits && (
        <Benefits
          imageSrc={benefits.imageSrc}
          imageAlt={benefits.imageAlt}
          items={benefits.items}
        />
      )}

      {/* 2: Journey (pinned base for next scene) */}
      {journey && (
        <Journey
          heading={journey.heading}
          subheading={journey.subheading}
          steps={journey.steps}
        />
      )}

      {/* 3: Community (curtain 1) */}
      {testimonials && (
        <Testimonials
          heading={testimonials.heading}
          subheading={testimonials.subheading}
          imageSrc={testimonials.imageSrc}
          imageAlt={testimonials.imageAlt}
          items={testimonials.items}
        />
      )}

      {/* 4: Values (curtain 2) */}
      {values && (
        <Values
          imageSrc={values.imageSrc}
          imageAlt={values.imageAlt}
          items={values.items}
        />
      )}

      {/* 5+: Normal scroll */}
      {pricing && (
        <Pricing
          heading={pricing.heading}
          subheading={pricing.subheading}
          priceHeadline={pricing.priceHeadline}
          priceSub={pricing.priceSub}
          benefits={pricing.benefits}
        />
      )}
      {faqs && (
        <Faqs
          heading={faqs.heading}
          heading2={faqs.heading2}
          subheading={faqs.subheading}
          items={faqs.items}
        />
      )}
    </main>
  );
}
