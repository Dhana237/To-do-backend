import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import nodemailer from "nodemailer";

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Doesn't exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// signup
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter valid email" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedpassword,
    });
    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const forgotPassword =async(req,res)=>{
  const {email}=req.body;

  const user = await userModel.findOne({email})
  if (!user) return res.json({success:false, message:"User not found"})
  
  const otp= Math.floor(1000 + Math.random()*9000).toString();

  user.otp= otp;
  user.otpExpires = Date.now() + 5 * 60 * 1000
  await user.save()

  const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
      user:"nodemailsmtp@gmail.com",
      pass:"gsqz fdzz krzf shru"
    }
  })

  await transporter.sendMail({
    to:email,
    subject:"Your OTP Code",
    text:`Your OTP is ${otp}`
  })
  return res.json({success: true, message:"OTP sent to email"})
}

const verifyOtp = async(req, res)=>{
  const {email, otp} = req.body;
  const user = await userModel.findOne({email});
  if(!user) return res.json({ success:false, message:"User not found"});
  if(user.otp !==otp)return res.json({ success:false, message:"Invalid OTP"})
  if (user.otpExpires < Date.now())
    return res.json({ success:false, message:"OTP expired"})
  return res.json({success:true, message:"OTP verified"})
}

const resetPassword = async (req,res)=>{
  const {email, newPassword}= req.body
  const hashedPassword =await bcrypt.hash(newPassword, 10);
  await userModel.findOneAndUpdate({ email }, { password: hashedPassword, otp:null, otpExpires:null})
  return res.json({ success:true, message:"password updated successfully"})
}
export {loginUser, registerUser, forgotPassword, verifyOtp, resetPassword}