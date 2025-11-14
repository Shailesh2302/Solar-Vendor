import { Router } from "express";
import type { IRoute, IRouter } from "express";
import { login,signup } from "../controller/authController.js";
import { authorizeRoles } from "../middleware/roleBasedAuthController.js";

const userRoute : IRouter = Router();

//User Login
userRoute.post("/login", login);
userRoute.post("/signup",signup)


export default userRoute