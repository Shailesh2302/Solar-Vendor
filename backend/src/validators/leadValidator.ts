// src/validators/lead.validator.ts
import { z } from "zod";
import { Status } from "../generated/prisma/enums.js";

export const createLeadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
  address: z.string().optional(),
  panels: z.string().min(1, "Panels field is required"),
  inverter: z.string().min(1, "Inverter field is required"),
  status: z.enum(Status).default(Status.contacted),
  capacity: z.number().positive("Capacity must be a positive number"),
  structure: z.string().min(1, "Structure field is required"),
  createdById: z.string().uuid("Invalid createdById format"),
  invoiceNoId: z.string()
});

export const updateLeadSchema = createLeadSchema.partial();
