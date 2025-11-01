// app/(marketing)/page.tsx
import { print } from "graphql";
import { wpFetch } from "@/utils/wp";
import { GetLandingPage } from "@/queries/general/landing.page";
import Benefits from "../(marketing)/benefits";
import Journey from "../(marketing)/journey";
import Testimonials from "../(marketing)/testimonials"; // Community
import Values from "../(marketing)/values";
import Pricing from "../(marketing)/pricing";
import Faqs from "../(marketing)/faqs";
import OurStory from "../(marketing)/OurStory";
import Header from "../(marketing)/header";
import HeroSection from "../(marketing)/hero";

export const revalidate = 60;

// --- types ---
type HomeData = {
  skinbestieBenefits?: Array<{
    mainHeadline?: string;
    backgroundImage?: { node?: { sourceUrl?: string; altText?: string } };
    list?: Array<{
      icon?: { node?: { sourceUrl?: string; altText?: string } };
      description?: string;
    }>;
  }>;
  skinbestieJourney?: Array<{
    mainHeadline?: string;
    subHeadline?: string;
    list?: Array<{
      icon?: { node?: { sourceUrl?: string; altText?: string } };
      title?: string;
      description?: string;
    }>;
  }>;
  skinbestieTestimonials?: Array<{
    mainHeadline?: string;
    subHeadline?: string;
    image?: { node?: { sourceUrl?: string; altText?: string } };
    carousel?: Array<{
      cardContent?: Array<{
        concern?: string;
        goal?: string;
        timeline?: string;
        testimonial?: string;
        customerName?: string;
      }>;
    }>;
  }>;
  skinbestieValues?: Array<{
    mainHeadline?: string;
    image?: { node?: { sourceUrl?: string; altText?: string } };
    values?: Array<{
      icon?: { node?: { sourceUrl?: string; altText?: string } };
      title?: string;
      description?: string;
    }>;
  }>;
  skinbestieStory?: Array<{
    mainHeadline?: string;
    values?: Array<{
      icon?: { node?: { sourceUrl?: string; altText?: string } };
      title?: string;
      description?: string;
    }>;
  }>;
  skinbestiePricing?: Array<{
    mainHeadline?: string;
    subHeadline?: string;
    valueProp?: Array<{
      mainHeadline?: string;
      subHeadline?: string;
      benefits?: Array<{ benefit?: string }>;
    }>;
  }>;
  skinbestieFaqs?: Array<{
    mainHeadline?: string;
    mainHeadline2?: string;
    subHeadline?: string;
    faqs?: Array<{
      question?: string;
      answerType?: string[];
      answerText?: string;
      answerList?: Array<{ item?: string }>;
    }>;
  }>;
};

// --- extractors ---
function extractBenefits(home: HomeData) {
  const block = home?.skinbestieBenefits?.[0];
  if (!block) return null;

  const heading = block?.mainHeadline ?? "";
  const imageSrc = block?.backgroundImage?.node?.sourceUrl ?? "";
  const imageAlt = block?.backgroundImage?.node?.altText ?? "";
  const items = (block?.list ?? []).slice(0, 4).map((x) => ({
    iconSrc: x?.icon?.node?.sourceUrl ?? "",
    iconAlt: x?.icon?.node?.altText ?? "",
    description: x?.description ?? "",
  }));

  return { heading, imageSrc, imageAlt, items };
}

function extractJourney(home: HomeData) {
  const block = home?.skinbestieJourney?.[0];
  if (!block) return null;

  const heading = block?.mainHeadline ?? "";
  const subheading = block?.subHeadline ?? "";
  const steps = (block?.list ?? []).slice(0, 3).map((s) => ({
    iconSrc: s?.icon?.node?.sourceUrl ?? "",
    iconAlt: s?.icon?.node?.altText ?? "",
    title: s?.title ?? "",
    description: s?.description ?? "",
  }));

  const hasContent = heading || subheading || steps.length > 0;
  return hasContent ? { heading, subheading, steps } : null;
}

function extractTestimonials(home: HomeData) {
  const block = home?.skinbestieTestimonials?.[0];
  if (!block) return null;

  const heading = block?.mainHeadline ?? "";
  const subheading = block?.subHeadline ?? "";
  const imageSrc = block?.image?.node?.sourceUrl ?? "";
  const imageAlt = block?.image?.node?.altText ?? "";

  const items = (block?.carousel ?? [])
    .flatMap((slide) => slide?.cardContent ?? [])
    .map((c) => ({
      concern: c?.concern ?? "",
      goal: c?.goal ?? "",
      timeline: c?.timeline ?? "",
      testimonial: c?.testimonial ?? "",
      customerName: c?.customerName ?? "",
    }));

  const hasContent = heading || imageSrc || items.length > 0;
  return hasContent ? { heading, subheading, imageSrc, imageAlt, items } : null;
}

function extractValues(home: HomeData) {
  const block = home?.skinbestieValues?.[0];
  if (!block) return null;

  const heading = block?.mainHeadline ?? "";
  const imageSrc = block?.image?.node?.sourceUrl ?? "";
  const imageAlt = block?.image?.node?.altText ?? "";

  const items = (block?.values ?? []).map((v) => ({
    iconSrc: v?.icon?.node?.sourceUrl ?? "",
    iconAlt: v?.icon?.node?.altText ?? "",
    title: v?.title ?? "",
    description: v?.description ?? "",
  }));

  const hasContent = heading || imageSrc || items.length > 0;
  return hasContent ? { heading, imageSrc, imageAlt, items } : null;
}

function extractStory(home: HomeData) {
  const block = home?.skinbestieStory?.[0];
  if (!block) return null;

  const heading = block?.mainHeadline ?? "";
  const items = (block?.values ?? []).map((v) => ({
    iconSrc: v?.icon?.node?.sourceUrl ?? "",
    iconAlt: v?.icon?.node?.altText ?? "",
    title: v?.title ?? "",
    description: v?.description ?? "",
  }));

  const hasContent = heading || items.length > 0;
  return hasContent ? { heading, items } : null;
}

function extractPricing(home: HomeData) {
  const block = home?.skinbestiePricing?.[0];
  if (!block) return null;

  const heading = block?.mainHeadline ?? "";
  const subheading = block?.subHeadline ?? "";

  const plan = block?.valueProp?.[0];
  const priceHeadline = plan?.mainHeadline ?? "";
  const priceSub = plan?.subHeadline ?? "";
  const benefits: string[] = (plan?.benefits ?? [])
    .map((b) => b?.benefit ?? "")
    .filter(Boolean);

  const hasContent =
    heading || subheading || priceHeadline || priceSub || benefits.length > 0;
  return hasContent
    ? { heading, subheading, priceHeadline, priceSub, benefits }
    : null;
}

function extractFaqs(home: HomeData) {
  const block = home?.skinbestieFaqs?.[0];
  if (!block) return null;

  const heading = block?.mainHeadline ?? "";
  const heading2 = block?.mainHeadline2 ?? "";
  const subheading = block?.subHeadline ?? "";

  const items = (block?.faqs ?? []).map((f) => {
    const answerType = String(f?.answerType?.[0] ?? "text").toLowerCase();
    const type: "text" | "list" = answerType === "list" ? "list" : "text";
    return {
      question: f?.question ?? "",
      type,
      text: f?.answerText ?? "",
      list: (f?.answerList ?? []).map((x) => x?.item ?? "").filter(Boolean),
    };
  });

  const hasContent = heading || heading2 || subheading || items.length > 0;
  return hasContent ? { heading, heading2, subheading, items } : null;
}

// --- data loader ---
async function getLanding() {
  const data = await wpFetch<{ page?: { home?: HomeData } }>(
    print(GetLandingPage),
  );
  const home = data?.page?.home;

  return {
    benefits: home ? extractBenefits(home) : null,
    journey: home ? extractJourney(home) : null,
    testimonials: home ? extractTestimonials(home) : null,
    values: home ? extractValues(home) : null,
    story: home ? extractStory(home) : null,
    pricing: home ? extractPricing(home) : null,
    faqs: home ? extractFaqs(home) : null,
  };
}

export default async function MarketingHome() {
  const { benefits, journey, testimonials, values, story, pricing, faqs } =
    await getLanding();

  return (
    <main>
      <Header />
      <HeroSection />

      {story && <OurStory heading={story.heading} items={story.items} />}

      {benefits && (
        <Benefits
          heading={benefits.heading}
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
          items={testimonials.items}
        />
      )}

      {values && (
        <Values
          heading={values.heading}
          imageSrc={values.imageSrc}
          imageAlt={values.imageAlt}
          items={values.items}
        />
      )}

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
