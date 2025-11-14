import { Router, type RequestHandler } from "express";
import { 
  createLead, 
  getLeads, 
  getLeadById, 
  updateLead, 
  deleteLead, 
  archiveLeads,
  getEmployeeLeadsByStatus,
  getAdminLeadsByStatus,
  assignLead
} from "../controller/leadController.js";

const leadRoute = Router();

leadRoute.post("/", createLead as RequestHandler);
leadRoute.get("/", getLeads as RequestHandler);
leadRoute.get("/:id", getLeadById as RequestHandler);
leadRoute.put("/:id", updateLead as RequestHandler);
leadRoute.delete("/:id", deleteLead as RequestHandler);
leadRoute.patch("/archive", archiveLeads)
leadRoute.post("/status/emp/:id", getEmployeeLeadsByStatus)

//
leadRoute.post("/status/admin/:status", getAdminLeadsByStatus) //TODO : add admin only middleware
leadRoute.post("/assign", assignLead) // TODO : add manager and admin middleware 

export default leadRoute;