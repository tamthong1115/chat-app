import { Request, Response } from "express";
import User from "../models/user.model";
import Message from "../models/message.model";
import cloudinary from "../lib/cloudinary";

export const getUsersForSidebar = async (req: Request, res: Response) => {
  try {
    const loggedInUserId = req.user?._id; // Assuming req.user is set by protectRoute middleware
    if (!loggedInUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Fetch users excluding the logged-in user
    const users = await User.find(
      { _id: { $ne: loggedInUserId } },
      "fullName email profilePicture"
    ).select("-password"); 

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users for sidebar:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { id : userToChatId } = req.params;
    const myId = req.user?._id;
    
    const messages = await Message.find({
        $or: [
            { sender: myId, receiver: userToChatId },
            { sender: userToChatId, receiver: myId }
        ]
    })

    res.status(200).json(messages);

  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const {text, image} = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user?._id;

       let imageUrl;
        if (image) {
            // Assuming you have a cloudinary upload function
            const uploadResult = await cloudinary.uploader.upload(image, {
                folder: "chat_app/messages",
            });
            imageUrl = uploadResult.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        // todo - Emit the message to the receiver via socket.io
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

        

