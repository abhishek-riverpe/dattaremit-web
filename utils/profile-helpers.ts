import type { Address as ApiAddress } from "@/types/api";

export interface AddressForm {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export function splitName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  const trimmed = fullName.trim();
  const spaceIndex = trimmed.indexOf(" ");
  if (spaceIndex === -1) return { firstName: trimmed, lastName: "" };
  return {
    firstName: trimmed.substring(0, spaceIndex),
    lastName: trimmed.substring(spaceIndex + 1),
  };
}

export function apiAddressToForm(addr: ApiAddress): AddressForm {
  return {
    street: addr.street,
    city: addr.city,
    state: addr.state,
    postalCode: addr.zipCode,
    country: addr.country,
  };
}

export function addressesEqual(a: AddressForm, b: AddressForm): boolean {
  return (
    a.street === b.street &&
    a.city === b.city &&
    a.state === b.state &&
    a.postalCode === b.postalCode &&
    a.country === b.country
  );
}
