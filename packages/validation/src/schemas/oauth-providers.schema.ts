import { z } from 'zod';

const emailSchema = z.string().email();

export const googlePassportProfileSchema = z
  .object({
    id: z.string(),
    emails: z.array(z.object({ value: emailSchema }).passthrough()).min(1),
    displayName: z.string().optional(),
    name: z
      .object({
        givenName: z.string().optional(),
        familyName: z.string().optional(),
      })
      .passthrough()
      .optional(),
    photos: z.array(z.object({ value: z.string().url() }).passthrough()).optional(),
    _json: z
      .object({
        email_verified: z.boolean().optional(),
        given_name: z.string().optional(),
        family_name: z.string().optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

export const githubPassportProfileSchema = z
  .object({
    id: z.string(),
    displayName: z.string().optional(),
    username: z.string().optional(),
    photos: z.array(z.object({ value: z.string().url() }).passthrough()).optional(),
    emails: z.array(z.object({ value: emailSchema }).passthrough()).optional(),
  })
  .passthrough();

export const githubEmailsResponseSchema = z.array(
  z
    .object({
      email: emailSchema,
      verified: z.boolean().optional(),
      primary: z.boolean().optional(),
    })
    .passthrough()
);

export type ParsedGoogleOAuthProfile = {
  id: string;
  email: string;
  emailVerified: boolean;
  firstName?: string;
  lastName?: string;
  name?: string;
  avatarUrl?: string;
};

export function parseGoogleOAuthProfile(profile: unknown): ParsedGoogleOAuthProfile {
  const parsed = googlePassportProfileSchema.parse(profile);
  const id = parsed.id;
  const email = parsed.emails[0]?.value;
  if (!email) {
    throw new Error('oauth_profile_invalid');
  }

  const json = parsed._json;
  const emailVerified = json?.email_verified === true;

  const firstName = parsed.name?.givenName || json?.given_name || undefined;
  const lastName = parsed.name?.familyName || json?.family_name || undefined;
  const avatarUrl = parsed.photos?.[0]?.value || undefined;

  return {
    id,
    email,
    emailVerified,
    firstName,
    lastName,
    name: parsed.displayName || undefined,
    avatarUrl,
  };
}

export type ParsedGithubPassportProfile = {
  id: string;
  displayName?: string;
  username?: string;
  avatarUrl?: string;
};

export function parseGithubPassportProfile(profile: unknown): ParsedGithubPassportProfile {
  const parsed = githubPassportProfileSchema.parse(profile);
  return {
    id: parsed.id,
    displayName: parsed.displayName || undefined,
    username: parsed.username || undefined,
    avatarUrl: parsed.photos?.[0]?.value || undefined,
  };
}

export function pickVerifiedGithubEmail(json: unknown): string | null {
  const emails = githubEmailsResponseSchema.parse(json);
  const primaryVerified = emails.find((e) => e.primary === true && e.verified === true);
  if (primaryVerified?.email) return primaryVerified.email;
  const anyVerified = emails.find((e) => e.verified === true);
  return anyVerified?.email ?? null;
}
