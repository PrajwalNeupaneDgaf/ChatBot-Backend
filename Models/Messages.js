import mongoose from 'mongoose'

const MessageSchema = mongoose.Schema({
    Text:{
        type:String,
        required:true
    },
    From:{
        type:String,
        enum:['User','AI'],
        required:true
    },
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    ChatID:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

export default mongoose.model("Messages",MessageSchema)