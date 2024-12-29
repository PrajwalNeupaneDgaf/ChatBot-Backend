import express from 'express'
import cors from 'cors'
import dotenv  from 'dotenv'
import mongoose from 'mongoose'
import { login, me, signup } from './Controllers/User.js'
import Auth from './Middleware/Auth.js'
import { createChat, DeleteChat, getMessages, getMyChat } from './Controllers/Message.js'

dotenv.config()

const app = express()

app.use(express.json())

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.URI, {});
      console.log("Connected to MongoDB successfully");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error.message);
      process.exit(1); // Exit the process with failure
    }
  };

  connectDB()


// app.use(express.urlencoded({ extended: true }));


app.use(cors())


app.listen(process.env.PORT , ()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})


app.post('/api/login', login)
app.post('/api/register', signup)
app.get('/api/me',Auth, me)
app.delete('/api/chat/delete/:chatId',Auth, DeleteChat)
app.get('/api/chat/:chatId',Auth, getMyChat)
app.post('/api/chat/create',Auth, createChat)
app.post('/api/message/:chatId',Auth, getMessages)