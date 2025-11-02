import todoModel from "../models/todoModel.js"


export const addTodo=async(req,res)=>{
  try {
    const { title, description }= req.body
    if (!title || !description) {
        return res.status(400).json({success: false, message:"All fields are required"})
    }
    const newTodo = await todoModel.create({
        title,
        description,
        user:req.user._id,
    });
    res.status(201).json({success:true, data:newTodo})
  } catch (error) {
    res.status(500).json({success: false, message:error.message})
  }
}

// get
export const getTodo = async(req, res)=>{
  try {
   const todo= await todoModel
   .find({user:req.user._id})
   .sort({created_at:-1})
   res.status(200).json({success: true, data:todo})
  } catch (error) {
    res.status(500).json({success: false, message: error.message})
  }
}

// update
export const updateTodo=async(req,res)=>{
  try {
    const{id} = req.params;
    const {title, description} = req.body

    const updatedTodo = await todoModel.findOneAndUpdate(
      {_id:id, user: req.user._id},
      {title, description},
      {new:true}
    );
    if (!updatedTodo) {
      return res.status(404).json({success:false, message:"todo not found or not yours"})
    }
    res.status(200).json({success:true, updatedTodo})
  } catch (error) {
    res.status(500).json({success: false, message:error.message})
  }
}


// Delete
export const deleteTodo = async(req, res)=>{
  try {
    const { id } = req.params;
    const deletedTodo = await todoModel.findOneAndDelete({
      _id:id,
      user:req.user._id,
    })
    if(!deletedTodo){
      return res.status(404).json({success: false, message:"Todo not found or not yours"})
    }
    res.status(200).json({success: true, message:"Todo deleted successfully"})
  } catch (error) {
    res.status(500).json({success: false, message:error.message})
  }
}