import { Router } from "express";
import type { IRoute, IRouter } from "express";
import { login, signup } from "../controller/authController.js";

const userRoute = Router();

//User Login
userRoute.post("/login", login);
userRoute.post("/signup", signup);


export default userRoute