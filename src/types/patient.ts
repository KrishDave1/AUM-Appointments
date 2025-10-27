import { z } from "zod";

export const CaseCategory = {
  HAIR: "HAIR",
  SKIN: "SKIN",
  MOLES: "MOLES",
  HAIR_REMOVAL: "HAIR_REMOVAL",
  HYDRAFACIAL: "HYDRAFACIAL",
  WEIGHT_LOSS: "WEIGHT_LOSS",
  OTHER: "OTHER",
} as const;

export type CaseCategoryType = (typeof CaseCategory)[keyof typeof CaseCategory];

export const patientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z
    .number()
    .min(1, "Age must be at least 1")
    .max(120, "Age must be less than 120"),
  address: z.string().optional(),
  caseCategory: z.nativeEnum(CaseCategory),
  contactNo: z.string().min(10, "Contact number must be at least 10 digits"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
});

export type PatientFormData = z.infer<typeof patientSchema>;

export const caseCategoryLabels = {
  [CaseCategory.HAIR]: "Hair Treatment",
  [CaseCategory.SKIN]: "Skin Care",
  [CaseCategory.MOLES]: "Mole Removal",
  [CaseCategory.HAIR_REMOVAL]: "Hair Removal",
  [CaseCategory.HYDRAFACIAL]: "Hydrafacial",
  [CaseCategory.WEIGHT_LOSS]: "Weight Loss",
  [CaseCategory.OTHER]: "Other",
} as const;
