import { Request, Response } from "express";
import messageModel from '../Model/MessageModel';




class messageController{


    async createMessage (req: Request, res: Response):Promise<any>{

        const {conversationId , senderId , text } = req.body;
    
        const message = new messageModel({
            conversationId,
            senderId,
            text
        })   
        try {
            const response = await message.save();
            res.status(200).json(response);
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Server Error" });
        }
    }



    async getMessages (req: Request, res: Response):Promise<any>{
        const conversationId = req.query.conversationId;
        try {
            const messages = await messageModel.find({conversationId: conversationId});
            res.status(200).json(messages);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Server Error" });
            
        }
    }


}

export default new messageController();


