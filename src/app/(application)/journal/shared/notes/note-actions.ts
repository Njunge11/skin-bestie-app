"use server";

import { auth } from "@/auth";
import type { Note, NoteFormData } from "./note.types";

type Result<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string; code?: string } };

/**
 * Fetch all notes for the current user
 */
export async function fetchNotesAction(): Promise<Result<Note[]>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: { message: "Unauthorized", code: "UNAUTHORIZED" },
      };
    }

    // TODO: Replace with actual API call
    // const notes = await api.get(`/api/notes?userId=${session.user.id}`);

    // Mock skincare journal entries
    const mockNotes: Note[] = [
      {
        id: "1",
        title: "Starting My Skincare Journey",
        content: `Today marks the beginning of my structured skincare journey! After my consultation with my skin coach, I've learned so much about my combination skin type and what it really needs. My main concerns are my oily T-zone that gets shiny by midday, dry patches on my cheeks, and some occasional breakouts around my chin.

My coach has set me up with a simple but effective routine. In the morning, I'll be using a gentle cleanser, vitamin C serum, lightweight moisturizer, and SPF 50. For my evening routine, I'll do a double cleanse, use a BHA exfoliant twice a week, apply niacinamide serum, and finish with a richer night cream.

I'm excited but also trying to be patient. My coach reminded me that real results take 6-8 weeks, so I'm committing to staying consistent and tracking my progress here. She also stressed the importance of not switching products too quickly and giving each step time to work. I'm feeling hopeful about this new chapter!`,
        createdBy: {
          id: session.user.id,
          name: session.user.name || "User",
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
          id: session.user.id,
          name: session.user.name || "User",
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
          id: session.user.id,
          name: session.user.name || "User",
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
          id: session.user.id,
          name: session.user.name || "User",
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
          id: session.user.id,
          name: session.user.name || "User",
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
          id: session.user.id,
          name: session.user.name || "User",
        },
        createdAt: new Date("2024-05-20").toISOString(),
        lastModified: new Date("2024-05-20").toISOString(),
        tags: ["routine", "summer"],
      },
    ];

    return { success: true, data: mockNotes };
  } catch (error) {
    console.error("Error fetching notes:", error);
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to fetch notes",
      },
    };
  }
}

/**
 * Fetch a single note by ID
 */
export async function fetchNoteAction(noteId: string): Promise<Result<Note>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: { message: "Unauthorized", code: "UNAUTHORIZED" },
      };
    }

    // TODO: Replace with actual API call
    // const note = await api.get(`/api/notes/${noteId}`);

    // Mock data for now
    const result = await fetchNotesAction();
    if (!result.success) {
      return result;
    }

    const note = result.data.find((n) => n.id === noteId);
    if (!note) {
      return {
        success: false,
        error: { message: "Note not found", code: "NOT_FOUND" },
      };
    }

    return { success: true, data: note };
  } catch (error) {
    console.error("Error fetching note:", error);
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to fetch note",
      },
    };
  }
}

/**
 * Create a new note
 */
export async function createNoteAction(
  data: NoteFormData,
): Promise<Result<Note>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: { message: "Unauthorized", code: "UNAUTHORIZED" },
      };
    }

    // TODO: Replace with actual API call
    // const note = await api.post("/api/notes", {
    //   userId: session.user.id,
    //   ...data,
    // });

    // Mock data for now
    const newNote: Note = {
      id: Date.now().toString(),
      ...data,
      createdBy: {
        id: session.user.id,
        name: session.user.name || "User",
      },
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    return { success: true, data: newNote };
  } catch (error) {
    console.error("Error creating note:", error);
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to create note",
      },
    };
  }
}

/**
 * Update an existing note
 */
export async function updateNoteAction(
  noteId: string,
  data: Partial<NoteFormData>,
): Promise<Result<Note>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: { message: "Unauthorized", code: "UNAUTHORIZED" },
      };
    }

    // TODO: Replace with actual API call
    // const note = await api.patch(`/api/notes/${noteId}`, data);

    // Mock data for now
    const result = await fetchNoteAction(noteId);
    if (!result.success) {
      return result;
    }

    const updatedNote: Note = {
      ...result.data,
      ...data,
      lastModified: new Date().toISOString(),
    };

    return { success: true, data: updatedNote };
  } catch (error) {
    console.error("Error updating note:", error);
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to update note",
      },
    };
  }
}

/**
 * Delete a note
 */
export async function deleteNoteAction(noteId: string): Promise<Result<void>> {
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
    const _noteId = noteId; // Will be used when API is implemented
    // await api.delete(`/api/notes/${noteId}`);

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error deleting note:", error);
    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : "Failed to delete note",
      },
    };
  }
}
