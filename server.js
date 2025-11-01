import express from "express"
import { connectDB } from "./lib/db.js"
import userRouter from "./routes/userRouter.js"

const app = express()
const port= 5000

await connectDB()

app.use(express.json());
app.use("/api/user", userRouter)

app.get("/", (req, res)=>{
    res.send("API working")
})

app.listen(port,()=>{
    console.log(`Server running on port http://localhost:${port}`);
    
})