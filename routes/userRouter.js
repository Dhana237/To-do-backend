import express from "express"
import { forgotPassword, loginUser, registerUser, resetPassword, verifyOtp } from "../controllers/userController.js"

const userRouter= express.Router()
userRouter.post("/signUp", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/forgot-password", forgotPassword)
userRouter.post("/verify-otp", verifyOtp)
userRouter.post("/reset-password", resetPassword)
export default userRouter