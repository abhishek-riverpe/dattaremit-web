export type RecipientKycStatus = "PENDING" | "APPROVED" | "REJECTED" | "FAILED";
export type BankAccountType = "SAVINGS" | "CURRENT" | "NRE" | "NRO" | "OTHER";

export interface BankDetails {
  id: string;
  label: string | null;
  bankName: string | null;
  bankAccountName: string | null;
  bankAccountNumberMasked: string | null;
  bankIfsc: string | null;
  branchName: string | null;
  bankAccountType: BankAccountType | null;
  isDefault: boolean;
  created_at?: string;
}

export interface Recipient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumberPrefix: string;
  phoneNumber: string;
  nationality: string;
  addressLine1: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  kycStatus: RecipientKycStatus;
  hasBankAccount: boolean;
  banks: BankDetails[];
  defaultBank: BankDetails | null;
  /** True when the create call linked the user to an already-existing recipient. */
  shared?: boolean;
  created_at: string;
}

export interface CreateRecipientPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumberPrefix: string;
  phoneNumber: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface AddRecipientBankPayload {
  accountName: string;
  accountNumber: string;
  ifsc: string;
  bankName?: string;
  branchName?: string;
  bankAccountType?: BankAccountType;
  label?: string;
}

export interface UpdateRecipientBankPayload {
  label?: string | null;
  bankName?: string;
  branchName?: string;
  bankAccountType?: BankAccountType;
}

export interface CheckIdentityPayload {
  email: string;
  phoneNumberPrefix: string;
  phoneNumber: string;
}

export type CheckIdentityResult =
  | { exists: false }
  | {
      exists: true;
      alreadyLinked: boolean;
      recipient: {
        id: string;
        firstName: string;
        lastName: string;
        kycStatus: RecipientKycStatus | null;
        hasBankAccount: boolean;
      };
    };
