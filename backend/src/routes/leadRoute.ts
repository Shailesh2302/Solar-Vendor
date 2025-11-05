import { Router } from "express";
import { createLead, getLeads, getLeadById, updateLead, deleteLead } from "../controller/leadController";

const router = Router();

// Create a new lead
router.post("/", createLead);

// Get all leads
router.get("/", getLeads);

// Get single lead by ID
router.get("/:id", getLeadById);

// Update a lead
router.put("/:id", updateLead);

// Delete a lead
router.delete("/:id", deleteLead);

export default router;
