import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/userModel";
import dbConnect from "@/libs/dbConnect";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const users = await UserModel.find({}, { name: 1, email: 1, _id: 0 });

        const userCount = users.length;

        return NextResponse.json({
            message: `Total number of users: ${userCount}`,
            users: users,
        }, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return NextResponse.json({
            message: "Failed to fetch users",
        }, { status: 500 });
    }
}
