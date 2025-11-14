// src/controllers/lead.controller.ts
import { type Request, type Response, type NextFunction } from "express";
import { prisma } from "../config/prisma.js";
import { Status } from "../generated/prisma/enums.js";

// Create Lead
export const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await prisma.lead.create({
      data: req.body,
      include: { createdBy: true },
    });

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (err: any) {
    console.error("❌ Error creating lead:", err);
    next(err);
  }
};

// Get all Leads
export const getLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const leads = await prisma.lead.findMany({
      include: { createdBy: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: leads });
  } catch (err: any) {
    console.error("❌ Error fetching leads:", err);
    next(err);
  }
};

// Get single Lead
export const getLeadById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid ID" });

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: { createdBy: true },
    });

    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });

    res.json({ success: true, data: lead });
  } catch (err: any) {
    console.error("❌ Error fetching lead:", err);
    next(err);
  }
};

// Update Lead
export const updateLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid ID" });

    const lead = await prisma.lead.update({
      where: { id },
      data: req.body,
      include: { createdBy: true },
    });

    res.json({ success: true, message: "Lead updated successfully", data: lead });
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    console.error("❌ Error updating lead:", err);
    next(err);
  }
};

// Delete Lead [not tested]
export const deleteLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, message: "Invalid ID" });

    await prisma.lead.delete({ where: { id } });

    res.json({ success: true, message: "Lead deleted successfully" });
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    console.error("❌ Error deleting lead:", err);
    next(err);
  }
};

// Bulk update lead status to "archived"
export const archiveLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ids } = req.body; // expecting array of lead IDs

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of lead IDs to archive",
      });
    }

    // validate all ids are numbers
    const invalidIds = ids.filter((id) => isNaN(Number(id)));
    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID(s): ${invalidIds.join(", ")}`,
      });
    }

    const result = await prisma.lead.updateMany({
      where: { id: { in: ids.map(Number) } },
      data: { status: "archived" },
    });

    res.json({
      success: true,
      message: `${result.count} lead(s) archived successfully`,
    });
  } catch (err) {
    console.error("❌ Error archiving leads:", err);
    next(err);
  }
};


// Employee: Get only their own leads by status
export const getEmployeeLeadsByStatus = async (req: Request, res: Response) => {
  try {
    const { status, userId } = req.body;
    //TODO : get the userId from cookie and status from re.param /{param}. t
    //So that we do not have to provide this details in req.body
    // const userId = req.user?.id;  // 
    console.log(userId);
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized .." });
    }

    if (!Object.values(Status).includes(status as Status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const leads = await prisma.lead.findMany({
      where: {
        status: {
          equals: status as Status,
        },
        createdById: userId,
      },
      include: {
        createdBy: {
          select: { id: true, username: true, email: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!leads.length) {
      return res.status(404).json({
        message: `No ${status} leads found for this user.`,
      });
    }

    res.json({
      count: leads.length,
      leads,
    });
  } catch (error) {
    console.error("Error fetching employee leads:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//  Admin: Get all leads by status
export const getAdminLeadsByStatus = async (req: Request, res: Response) => {
  try {
    let { status } = req.params;
    console.log(status);
    

    // Normalize to lowercase
    status = status.toLowerCase();
    console.log(status);
    

    // Validate against actual enum values
    if (!Object.values(Status).includes(status as Status)) {
      return res.status(400).json({
        message: `Invalid status '${status}'. Allowed: ${Object.values(Status).join(", ")}`,
      });
    }

    const leads = await prisma.lead.findMany({
      where: {
        status: status as Status,
      },
      include: {
        createdBy: {
          select: { id: true, username: true, email: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ count: leads.length, leads });

  } catch (error) {
    console.error("Error fetching admin leads:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Assign Lead to Employee
export const assignLead = async (req: Request, res: Response)=>{
  try {
    const {userId, leadId} = req.body;

    if(!userId || !leadId){
      return res.status(401).json({Error:"userId/leadId is missing"})
    }

    const user = await prisma.user.findUnique({
      where:{
        id:userId
      },
    
    })

    if(!user){
      return res.status(401).json({Error:` Invlid User ${userId} `})
    }

    const lead = await prisma.lead.update({
      where:{
        id: leadId
      },
      data: {
        assignedTo:userId
      }
    })

    res.json({ success: true, message: "Lead updated successfully", data: lead });

    
    res.json({userId})
  } catch (error) {
    
  }
}
