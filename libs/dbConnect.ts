import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {}


async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        console.log("Already Connected to the database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URL || "", {
            serverSelectionTimeoutMS: 30000,
        });

        connection.isConnected = db.connections[0].readyState;

        console.log("Database sucessfully connected");
    } catch (error) {
        console.error("Database connection failed", error);
        process.exit(1);
    }
}

export default dbConnect;