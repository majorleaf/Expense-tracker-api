

import mongoose from 'mongoose';
import dotenv from 'dotenv';

const connectDb = async () => {
    try {  
        // Good practice: Appending the specific database name to the URL
        const url = `${process.env.MONGODB_URL}/expense-tracker-api`;
        
        await mongoose.connect(url);
        console.log("MongoDb connected successfully");

        // Optional: Listen for errors AFTER the initial connection is established
        mongoose.connection.on("error", (error) => {
             console.error("MongoDB runtime error:", error);
        });

    } catch(error) {
        console.error("Failed to connect to MongoDB:", error.message);
        // Best practice: kill the server if the database fails to connect
    }
}

export default connectDb;