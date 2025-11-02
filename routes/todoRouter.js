import express from "express"
import { addTodo, deleteTodo, getTodo, updateTodo } from "../controllers/todoController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"


const todoRouter=express.Router()
todoRouter.post("/add",authMiddleware, addTodo)
todoRouter.get("/get", authMiddleware, getTodo)
todoRouter.put("/updateTodo/:id",authMiddleware, updateTodo)
todoRouter.delete("/todoDelete/:id",authMiddleware,deleteTodo)
export default todoRouter