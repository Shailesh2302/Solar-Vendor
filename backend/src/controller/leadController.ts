import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma"; 

// Create a new lead
export const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await prisma.lead.create({
      data: req.json(),
    });
    res.status(201).json(lead);
  } catch (err) {
    next(err);
  }
};

// Get all leads
export const getLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const leads = await prisma.lead.findMany({
      include: { createdBy: true, invoice: true },
    });
    res.json(leads);
  } catch (err) {
    next(err);
  }
};

// Get single lead by ID
export const getLeadById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: Number(req.params.id) },
      include: { createdBy: true, invoice: true },
    });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (err) {
    next(err);
  }
};

// Update lead
export const updateLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await prisma.lead.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(lead);
  } catch (err) {
    next(err);
  }
};

// Delete lead
export const deleteLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.lead.delete({
      where: { id: Number(req.params.id) },
    });
    res.json({ message: "Lead deleted successfully" });
  } catch (err) {
    next(err);
  }
};
