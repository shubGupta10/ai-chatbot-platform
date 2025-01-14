import {  NextResponse } from "next/server";
import CustomizationModel from "@/models/CustomizationModel";
import dbConnect from "@/libs/dbConnect";

export async function GET(req: any){
    try {
        await dbConnect();

        const { chatbotId, userId } = req.params;
        const customization = await CustomizationModel.findOne({ chatbotId, userId });
        if(!customization){
            return NextResponse.json({
                message: "Customization not found"
            }, {status: 404})
        }

        return NextResponse.json({
            customization,
            message: "Successfully fetched customization settings"
        }, {status: 200})
    } catch (error) {
        return NextResponse.json({
            message: "Failed to fetch customization"
        }, {status: 500})
    }
}