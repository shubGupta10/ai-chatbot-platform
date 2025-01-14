import { NextRequest, NextResponse } from "next/server";
import CustomizationModel from "@/models/CustomizationModel";
import dbConnect from "@/libs/dbConnect";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const { chatbotId, userId, greetingMessage, theme, avatarUrl, fontFamily, backgroundColor, textColor, buttonColor, otherSettings } = await req.json();

        const customization = await CustomizationModel.findOneAndUpdate(
            { chatbotId, userId },
            { greetingMessage, theme, avatarUrl, fontFamily, backgroundColor, textColor, buttonColor, otherSettings },
            { new: true, upsert: true }  
          );

          return NextResponse.json({
            customization,
            message: "Customization saved successfully"
          }, {status: 200})

    } catch (error) {
        return NextResponse.json({
            message: "Error updating customization"
        }, {status: 500})
    }
}