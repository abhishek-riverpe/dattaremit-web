export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}

export type AddressType = "PRESENT" | "PERMANENT";

export interface Address {
  id: string;
  userId: string;
  type: AddressType;
  label?: string | null;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  clerkUserId: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  dateOfBirth?: string | null;
  createdAt: string;
  updatedAt: string;
  addresses?: Address[];
}

export interface UserPayload {
  name?: string;
  phone?: string;
  dateOfBirth?: string;
}

export interface CreateAddressPayload {
  type: AddressType;
  label?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface UpdateAddressPayload {
  type?: AddressType;
  label?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  isDefault?: boolean;
}

export type AccountUser = Omit<User, "addresses">;

export interface Account {
  user: AccountUser;
  addresses: Address[];
}

