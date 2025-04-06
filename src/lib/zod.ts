import { z } from "zod";

export const formSchema = z.object({
    caption: z.string().min(2, "Caption must be at least 2 characters"),
    description: z.string().min(2, "Description must be at least 2 characters"),
    category: z.string().min(2, "Category must be at least"),
    visibility: z.string().min(2, "Field is required"),
    publicId:z.string(),
    coverImage:z.string(),
    userId:z.string().optional(),
  });