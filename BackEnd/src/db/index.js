import mongoose from "mongoose";
import { DB_name } from "../constants.js";
export const connectDb = async() =>{

    try {
        console.log(process.env.MONGODB_URI);
        
       
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB Connected 🎃🎯 DB HOST :${connectionInstance.connection.host}`)
        
    } catch (error) {
        console.log("MongoDB Connection Failed 😂🙏", error);
        process.exit(1)
        
    }
} 