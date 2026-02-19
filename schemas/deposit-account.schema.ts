import * as yup from "yup";

export const depositAccountSchema = yup.object({
  accountNumber: yup.string().trim().required("Account number is required"),
  ifscCode: yup
    .string()
    .trim()
    .required("IFSC code is required")
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "IFSC code must be in format XXXX0XXXXXXX"),
  accountHolderName: yup
    .string()
    .trim()
    .required("Account holder name is required"),
  bankName: yup.string().trim().required("Bank name is required"),
  branchName: yup.string().trim().required("Branch name is required"),
  bankAccountType: yup
    .string()
    .oneOf(["Current", "Savings"], "Account type must be Current or Savings")
    .required("Account type is required"),
  phoneNumber: yup
    .string()
    .trim()
    .required("Phone number is required")
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
});

export type DepositAccountFormData = yup.InferType<typeof depositAccountSchema>;
