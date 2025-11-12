import { z } from "zod";

/**
 * User entity schema
 * Used across: Dashboard, Profile, Journal, Goals
 */
export const userSchema = z.object({
  userId: z.string(),
  userProfileId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phoneNumber: z.string(),
  dateOfBirth: z.string().datetime(),
  nickname: z.string().nullable(),
  skinType: z.array(z.string()).nullable(),
  concerns: z.array(z.string()).nullable(),
  hasAllergies: z.boolean(),
  allergyDetails: z.string().nullable(),
  isSubscribed: z.boolean(),
  occupation: z.string().nullable(),
  bio: z.string().nullable(),
  timezone: z.string(),
  profileTags: z.array(z.string()).nullable(),
});

// Export inferred type
export type User = z.infer<typeof userSchema>;
