"use server";

import { auth } from "@/auth";

export interface Journey {
  id: string;
  title: string;
  content: string;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  lastModified: string;
  tags: string[];
}

export interface JourneyFormData {
  title: string;
  content: string;
  tags: string[];
}

type Result<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string; code?: string } };

// In-memory storage for all journeys (persists until server restart)
const journeysMap = new Map<string, Journey>();

// Helper to check if content is valid Lexical JSON
function isValidLexicalJSON(content: string): boolean {
  try {
    const parsed = JSON.parse(content);
    return (
      parsed.root && parsed.root.children && Array.isArray(parsed.root.children)
    );
  } catch {
    return false;
  }
}

// Convert plain text to Lexical JSON format
function convertPlainTextToLexicalJSON(plainText: string): string {
  // Split by double newlines to create paragraphs
  const paragraphs = plainText
    .split("\n\n")
    .filter((text) => text.trim())
    .map((text) => ({
      children: [
        {
          detail: 0,
          format: 0,
          mode: "normal",
          style: "",
          text: text.trim(),
          type: "text",
          version: 1,
        },
      ],
      direction: "ltr",
      format: "",
      indent: 0,
      type: "paragraph",
      version: 1,
    }));

  return JSON.stringify({
    root: {
      children: paragraphs,
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  });
}

// Initialize with mock data on first load
function initializeMockData(userId: string, userName: string) {
  if (journeysMap.size === 0) {
    const mockJourneys: Journey[] = [
      {
        id: "1",
        title: "Starting My Skincare Journey",
        content: `Today marks the beginning of my structured skincare journey! After my consultation with my skin coach, I've learned so much about my combination skin type and what it really needs. My main concerns are my oily T-zone that gets shiny by midday, dry patches on my cheeks, and some occasional breakouts around my chin.

My coach has set me up with a simple but effective routine. In the morning, I'll be using a gentle cleanser, vitamin C serum, lightweight moisturizer, and SPF 50. For my evening routine, I'll do a double cleanse, use a BHA exfoliant twice a week, apply niacinamide serum, and finish with a richer night cream.

I'm excited but also trying to be patient. My coach reminded me that real results take 6-8 weeks, so I'm committing to staying consistent and tracking my progress here. She also stressed the importance of not switching products too quickly and giving each step time to work. I'm feeling hopeful about this new chapter!`,
        createdBy: {
          id: userId,
          name: userName,
        },
        createdAt: new Date("2024-01-15").toISOString(),
        lastModified: new Date("2024-01-15").toISOString(),
        tags: ["routine", "beginner"],
      },
      {
        id: "2",
        title: "Week 2: Purging Phase",
        content: `Two weeks in and I'm experiencing what my coach warned me about - the purging phase. My skin is breaking out more than usual, especially on my forehead and chin. The BHA exfoliant is bringing congestion to the surface. My coach explained this is actually a good sign that the product is working to clear out my pores. It's not new acne, just existing congestion coming up faster.

I'm handling it by staying consistent with my routine and not adding or removing anything. I'm being extra gentle when cleansing, using hydrocolloid patches on the bigger spots, and constantly reminding myself that this is temporary. My coach said this usually lasts 2-4 weeks, so I'm about halfway through.

On the positive side, I've noticed some great changes already. My skin texture feels noticeably smoother, and the dry patches on my cheeks are way better. My sunscreen isn't pilling anymore either, which makes my morning routine so much easier. Trying to trust the process here and will give it another 2-3 weeks before evaluating. Fingers crossed the worst is behind me!`,
        createdBy: {
          id: userId,
          name: userName,
        },
        createdAt: new Date("2024-01-29").toISOString(),
        lastModified: new Date("2024-01-29").toISOString(),
        tags: ["progress", "breakout"],
      },
      {
        id: "3",
        title: "Product Review: The Niacinamide Serum",
        content: `One month in and I have to give a shoutout to the niacinamide serum my coach recommended. This has been a game-changer for my oily T-zone! My skin stays matte so much longer now - about 4-5 hours compared to just 2 hours before. My pores look noticeably smaller, especially on my nose, and it layers beautifully under my moisturizer with no pilling or stickiness. The bottle has lasted forever too since I only need 3-4 drops per application.

I've learned some great application tips along the way. I apply it to damp skin for better absorption, wait about 30 seconds before applying moisturizer, and I've found it works great under makeup too. My breakouts from the purging phase have calmed down significantly, and I think the niacinamide's anti-inflammatory properties really helped speed up the healing.

My coach wants me to introduce a retinol in a few weeks once my skin is fully adjusted to the current routine. I'm a bit nervous about adding another active ingredient, but also really excited for the next level of results. She said retinol will help with the fine lines I've been noticing and improve my overall skin texture even more.`,
        createdBy: {
          id: userId,
          name: userName,
        },
        createdAt: new Date("2024-02-15").toISOString(),
        lastModified: new Date("2024-02-15").toISOString(),
        tags: ["product review", "niacinamide"],
      },
      {
        id: "4",
        title: "Introducing Retinol: Slow and Steady",
        content: `Started retinol last night! My coach emphasized starting slow to avoid irritation, so I'm following the "sandwich method" she taught me. I'm only using it twice per week on Monday and Thursday nights. The sandwich method means I apply moisturizer first, then retinol, then moisturizer again. I wait 20 minutes after cleansing to make sure my skin is completely dry, use only a pea-sized amount for my entire face, and I'm careful to avoid the eye area.

No irritation at all this morning! My skin feels normal, maybe slightly tighter than usual, but no redness or flaking. The sandwich method seems to be working perfectly. I'm also being extra diligent about my SPF 50 during the day since retinol increases sun sensitivity. My coach warned me that this is non-negotiable.

I need to remember not to use BHA on retinol nights and to keep my routine simple on those days. I'll stay at this frequency for a month before gradually increasing. My coach reminded me that results take 3-4 months to really show, so I need to be patient and trust the process. So far so good though! Will update in a few weeks once I've gotten into the rhythm of this new addition.`,
        createdBy: {
          id: userId,
          name: userName,
        },
        createdAt: new Date("2024-03-01").toISOString(),
        lastModified: new Date("2024-03-01").toISOString(),
        tags: ["retinol", "routine"],
      },
      {
        id: "5",
        title: "3-Month Progress Check",
        content: `Three months since I started this journey and I'm honestly amazed at the changes! My skin texture is SO much smoother than when I started. I'm barely getting any breakouts anymore - maybe just 1-2 small ones during my period. The oiliness is finally under control, my skin tone looks more even, and the fine lines around my eyes are noticeably softer. My makeup applies like an absolute dream now, which has been such a confidence boost.

My current routine has evolved but stayed simple. In the morning I use a gentle cleanser, vitamin C serum, niacinamide, moisturizer, and SPF 50. At night I double cleanse, use BHA on Monday and Friday, apply retinol on Tuesday and Saturday, follow with niacinamide serum, night cream, and eye cream. I've worked up to using retinol 2-3 times per week and my skin has adjusted beautifully with zero irritation.

The biggest lessons I've learned are that consistency is absolutely everything, simple routines work better than complicated ones, and sunscreen is completely non-negotiable. Patience really does pay off, and having a coach to guide me has made such a huge difference. My coach suggested we start thinking about addressing some old acne marks with a targeted treatment, and she's researching options for me. We're also considering adding a hydrating toner for extra moisture as we head into warmer weather. Feeling really proud of myself for sticking with this journey!`,
        createdBy: {
          id: userId,
          name: userName,
        },
        createdAt: new Date("2024-04-15").toISOString(),
        lastModified: new Date("2024-04-15").toISOString(),
        tags: ["progress", "milestone"],
      },
      {
        id: "6",
        title: "Summer Routine Adjustments",
        content: `Had my check-in with my coach today and we're making some tweaks for summer! The warmer weather means my skin is producing more oil again, and I need to be more vigilant about sun protection. We're switching to a gel cleanser for a lighter texture in the morning, keeping the same vitamin C and niacinamide but switching to a lighter gel moisturizer instead of cream. I'll still use SPF 50 but will reapply with a powder SPF at midday. For evening, I'm keeping the double cleanse since it's even more important with sweat and sunscreen buildup, continuing retinol three times per week, and might reduce my night cream thickness if needed.

My coach gave me some great additional summer tips. She suggested keeping my skincare in the fridge for an extra cooling effect, using a clay mask once per week for oil control, and staying super hydrated since drinking more water helps skin from the inside out. She also reminded me to wear a hat when possible and to be absolutely consistent with SPF reapplication throughout the day.

Someone at work asked if I'd gotten a facial because my skin was glowing, which totally made my day! This journey has been so worth it. I've also noticed I'm way more confident going makeup-free now - just some concealer and SPF and I'm good to go. I never thought I'd feel this comfortable in my own skin. Feeling so grateful for this skincare journey and my amazing coach who's guided me every step of the way!`,
        createdBy: {
          id: userId,
          name: userName,
        },
        createdAt: new Date("2024-05-20").toISOString(),
        lastModified: new Date("2024-05-20").toISOString(),
        tags: ["routine", "summer"],
      },
    ];

    // Migrate plain text to Lexical JSON and populate the Map
    mockJourneys.forEach((journey) => {
      if (!isValidLexicalJSON(journey.content)) {
        journey.content = convertPlainTextToLexicalJSON(journey.content);
      }
      journeysMap.set(journey.id, journey);
    });
  }
}

/**
 * Fetch all journeys for the current user
 */
export async function fetchJourneysAction(): Promise<Result<Journey[]>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: { message: "Unauthorized", code: "UNAUTHORIZED" },
      };
    }

    // Initialize mock data if not already done
    initializeMockData(session.user.id, session.user.name || "User");

    // Return all journeys from Map (sorted by creation date, newest first)
    const journeys = Array.from(journeysMap.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return { success: true, data: journeys };
  } catch (error) {
    console.error("Error fetching journeys:", error);
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to fetch journeys",
      },
    };
  }
}

/**
 * Fetch a single journey by ID
 */
export async function fetchJourneyAction(
  journeyId: string,
): Promise<Result<Journey>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: { message: "Unauthorized", code: "UNAUTHORIZED" },
      };
    }

    // Initialize mock data if not already done
    initializeMockData(session.user.id, session.user.name || "User");

    // Check if journey exists in Map
    if (journeysMap.has(journeyId)) {
      return { success: true, data: journeysMap.get(journeyId)! };
    }

    return {
      success: false,
      error: { message: "Journey not found", code: "NOT_FOUND" },
    };
  } catch (error) {
    console.error("Error fetching journey:", error);
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to fetch journey",
      },
    };
  }
}

/**
 * Create a new journey
 */
export async function createJourneyAction(
  data: JourneyFormData,
): Promise<Result<Journey>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: { message: "Unauthorized", code: "UNAUTHORIZED" },
      };
    }

    const newJourney: Journey = {
      id: Date.now().toString(),
      ...data,
      createdBy: {
        id: session.user.id,
        name: session.user.name || "User",
      },
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    // Store in Map
    journeysMap.set(newJourney.id, newJourney);

    return { success: true, data: newJourney };
  } catch (error) {
    console.error("Error creating journey:", error);
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to create journey",
      },
    };
  }
}

/**
 * Update an existing journey
 */
export async function updateJourneyAction(
  journeyId: string,
  data: Partial<JourneyFormData>,
): Promise<Result<Journey>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: { message: "Unauthorized", code: "UNAUTHORIZED" },
      };
    }

    const result = await fetchJourneyAction(journeyId);
    if (!result.success) {
      return result;
    }

    const updatedJourney: Journey = {
      ...result.data,
      ...data,
      lastModified: new Date().toISOString(),
    };

    // Update in Map (works for both mock and created journeys)
    journeysMap.set(journeyId, updatedJourney);

    return { success: true, data: updatedJourney };
  } catch (error) {
    console.error("Error updating journey:", error);
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to update journey",
      },
    };
  }
}

/**
 * Delete a journey
 */
export async function deleteJourneyAction(
  journeyId: string,
): Promise<Result<void>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: { message: "Unauthorized", code: "UNAUTHORIZED" },
      };
    }

    // TODO: Replace with actual API call
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _journeyId = journeyId; // Will be used when API is implemented

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error deleting journey:", error);
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to delete journey",
      },
    };
  }
}
