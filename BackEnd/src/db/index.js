import mongoose from "mongoose";
import { DB_name } from "../constants.js";
export const connectDb = async() =>{

    try {
        console.log(`${process.env.MONGODB_URI}/Ecommerce`);
        
       
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_name}`)
        console.log(`MongoDB Connected 🎃🎯 DB HOST :${connectionInstance.connection.host}`)
        
    } catch (error) {
        console.log("MongoDB Connection Failed 😂🙏", error);
        process.exit(1)
        
    }
} 