import { NextRequest, NextResponse } from "next/server";
import { chatbotModel } from "@/models/ChatModel";
import dbConnect from "@/libs/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/actions/authOptions";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ 
        message: "Unauthorized" 
      }, { status: 401 });
    }

    const { id } = params;
    const { contextData } = await req.json();

    if (!contextData || typeof contextData !== 'object') {
      return NextResponse.json({
        message: "Context data must be a valid object"
      }, { status: 400 });
    }

    const chatbot = await chatbotModel.findOne({
      _id: id,
      userId: session.user.id
    });

    if (!chatbot) {
      return NextResponse.json({ 
        message: "Chatbot not found or unauthorized" 
      }, { status: 404 });
    }

    const updatedChatbot = await chatbotModel.findByIdAndUpdate(
      id,
      { $set: { contextData } },
      { new: true }
    );

    return NextResponse.json({
      message: "Context data updated successfully",
      data: updatedChatbot
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json({ 
      message: "Internal server error" 
    }, { status: 500 });
  }
}
