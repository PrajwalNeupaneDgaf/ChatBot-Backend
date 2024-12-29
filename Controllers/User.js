import User from '../Models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export const signup = async (req , res)=>{
    const {email , password , name} = req.body
    if(!email , !password , !name){
        return res.status(400).json({msg : "Please enter all fields" })
    }
    const user = await User.findOne({email})
    if(user){
        return res.status(400).json({msg : "User already exists" })
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({email , password:hashedPassword , name})
    const savedUser = await newUser.save()
    const token = jwt.sign({id : savedUser._id} , process.env.SECRET_KEY)
    return res.json({token , user : savedUser})
} 

export const login = async (req,res)=>{
    const {email , password} = req.body
    const user = await User.findOne({email})
    if(!user){
        return res.status(400).json({msg : "Invalid credentials" })
        }
        const isMatch = await bcrypt.compare(password , user.password)
        if(!isMatch){
            return res.status(400).json({msg : "Invalid credentials" })
            }
            const token = jwt.sign({id : user._id} , process.env.SECRET_KEY)

            return res.status(200).json({
                token ,
                user
            })
}

export const me = async (req,res)=>{
    const me = await User.findById(req.user.id)
    if(!me){
        return res.status(400).json({msg:'No user Found'})
    }
    return res.status(200).json({
        user:me
    })
}

