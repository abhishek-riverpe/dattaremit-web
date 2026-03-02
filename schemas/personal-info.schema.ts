import * as yup from "yup";

export const personalInfoSchema = yup.object({
  firstName: yup.string().trim().required("First name is required"),
  lastName: yup.string().trim().required("Last name is required"),
  phoneNumberPrefix: yup.string().trim().required("Country code is required"),
  phoneNumber: yup
    .string()
    .trim()
    .required("Phone number is required")
    .min(4, "Phone number must be at least 4 digits")
    .matches(/^\d+$/, "Phone number must contain only digits"),
  dateOfBirth: yup.string().required("Date of birth is required"),
  nationality: yup
    .string()
    .trim()
    .required("Nationality is required")
    .test("valid-nationality", "Nationality must be US or IN", (v) => v === "US" || v === "IN"),
});

export type PersonalInfoFormData = yup.InferType<typeof personalInfoSchema>;
