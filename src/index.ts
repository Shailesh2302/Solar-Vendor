import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import leadRoute from "./routes/leadRoute.js";
import userRoute from "./routes/userRoute.js";



dotenv.config()
const app = express();
const PORT = process.env.PORT || 3000

app.use(cors());
app.use(express.json());

// Lead route
app.use("/api/v1/leads", leadRoute);

// User Route
app.use("/api/v1/auth",userRoute);


app.listen(PORT,()=>{
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(PORT);
    
})




