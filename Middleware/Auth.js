import jsonwebtoken from  'jsonwebtoken'

 const  Auth = async (req,res,next )=>{

    const tokenValue = req.header('Authorization')
    if(!tokenValue) return res.status(401).send('Access denied. No token provided')
    const token = tokenValue.split(' ')[1]
    if(!token) {
        req.message('Better Login For Storage')
        next()
        return res.status(401).send({message: 'Access denied. No token provided.'})
    }
    try {
        const decoded = jsonwebtoken.verify(token, process.env.SECRET_KEY)
        req.user = decoded
        next()
        } catch (ex) {
            return res.status(400).send({message: 'Invalid token.'}) 
        }

    
}

export default Auth