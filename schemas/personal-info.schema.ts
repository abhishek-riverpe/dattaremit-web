import * as yup from "yup";

export const personalInfoSchema = yup.object({
  firstName: yup.string().trim().required("First name is required"),
  lastName: yup.string().trim().required("Last name is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .min(5, "Phone number must be at least 5 characters"),
  dateOfBirth: yup.string().required("Date of birth is required"),
});

export type PersonalInfoFormData = yup.InferType<typeof personalInfoSchema>;
