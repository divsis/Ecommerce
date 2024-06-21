import mongoose from "mongoose";

const connectDB =async()=>{
    try{
      const connectionInstance=  await mongoose.connect(`${process.env.MONGODB_URI}/ecommerce`)
      console.log(`\n MONGODB connected !! DB HOST :${connectionInstance.connection.host}`);
    }catch(error){
        console.log("MONGODB connection error ",error);
        process.exit()
    }
}

export default connectDB;