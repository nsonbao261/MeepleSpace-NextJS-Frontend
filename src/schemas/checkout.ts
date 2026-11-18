import { z } from "zod";

export const newAddressSchema = z.object({
  recipientName: z.string().trim().min(2, "Please enter recipient name"),
  phone: z.string().regex(/^(0|\+84)\d{9}$/, "Invalid phone number (10 digits)"),
  line1: z.string().trim().min(5, "Please enter street address"),
  ward: z.string().trim().min(2, "Please select ward/commune"),
  district: z.string().trim().min(2, "Please select district"),
  province: z.string().trim().min(2, "Please select province/city"),
  label: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || "Home"),
});

export type NewAddressFormValues = z.infer<typeof newAddressSchema>;
