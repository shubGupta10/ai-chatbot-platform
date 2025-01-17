import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {}

async function dbConnect(retryCount = 5): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to the database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URL || "", {
            serverSelectionTimeoutMS: 60000,  // 30 seconds for server selection
            socketTimeoutMS: 60000,           // 30 seconds for socket operations
            connectTimeoutMS: 60000,          // 30 seconds for connection time
        });

        connection.isConnected = db.connections[0].readyState;
        console.log("Database successfully connected");
    } catch (error) {
        if (retryCount > 0) {
            console.log(`Retrying database connection. Attempts left: ${retryCount}`);
            await new Promise((resolve) => setTimeout(resolve, 5000));
            return dbConnect(retryCount - 1); 
        }
        console.error("Database connection failed", error);
        process.exit(1); 
    }
}

export default dbConnect;
