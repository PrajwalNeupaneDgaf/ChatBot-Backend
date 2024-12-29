import Messages from "../Models/Messages.js";
import User from "../Models/User.js";
import {nanoid} from 'nanoid'
import useAi from "./GetAnswer.js";

export const DeleteChat = async (req, res) => {
    const { chatId } = req.params;
    const chats = await Messages.find({ChatID: chatId , User:req.user.id})
    try {
        const chat = await Messages.deleteMany({ ChatID: chatId })
        const user = await User.findById(req.user.id)
        let chats = user.chats.filter(itm=> itm.id!=chatId)
        await User.findByIdAndUpdate(req.user.id,{
            chats:chats
        },{
            new:true
        })
       return res.status(200).json({ msg: "Chat deleted successfully" })
    } catch (error) {
        return res.status(500).json({
            msg: "Some Error Occured"
        })
    }
}

export const createChat = async (req, res) => {
    const UID = req.user.id

    const user = await User.findById(UID)

    if (!user) {
        return res.status(404).json({ msg: "User not found" })
    }
    let messages = user.chats || []
    const newId = nanoid()
    const data = { Name: user.name + 'New Chat' + messages.length + 1, id: newId }
    messages.push(data)
    try {
        const updatedUser = await User.findByIdAndUpdate(UID, {
            chats: messages
        }, { new: true });
    
        console.log('Updated User:', updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
    }
    return res.status(200).json({
        ID: newId,
        newChat:data,
        msg: "Chat created successfully",
    })
}

export const getMyChat = async (req, res) => {
    const { chatId } = req.params
    const UID = req.user.id
    const user = User.findById(UID)
    if (!user) {
        return res.status(404).json({ msg: "User not found" })
    }
    const messages = await Messages.find({ ChatID: chatId })

    return res.status(200).json({
        msg: "Chat found successfully",
        data: messages || []
    })
}

export const getMessages = async (req, res) => {
    const { chatId } = req.params
    const { message } = req.body
    const UID = req.user.id
    const user = User.findById(UID)
    if (!user) {
        return res.status(404).json({ msg: "User not found" })
    }
    const newMessage = new Messages({
        ChatID: chatId,
        Text: message,
        From: 'User',
        User: UID
    });
    const SavedMessage = await newMessage.save()
    const Result = await useAi(message)
    const newMessageAi = new Messages({
        ChatID: chatId,
        Text: Result.Text,
        From: 'AI',
        User: UID
    }) 

    const AI = await newMessageAi.save()

    return res.status(200).json({
        msg: "Message sent successfully",
        data: AI,
        res:Result
    })
    
}
