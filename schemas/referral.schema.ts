export const REFERRAL_CODE_REGEX = /^[A-Z0-9]{4,20}$/;

export function isValidReferralCode(value: string): boolean {
  return REFERRAL_CODE_REGEX.test(value);
}
