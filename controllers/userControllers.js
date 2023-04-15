const User = require('../models/userModels')
const jwt = require('jsonwebtoken')


//to create token
const createToken = (_id) => {   
   return jwt.sign({_id } , process.env.SECRET, {expiresIn : '3d'})
}


//for login
const loginUser = async (req,res) => {
    const {email, password} = req.body
    try {
        const user = await User.login(email,password)
        //it will return that user from static login function

        //creating token with the help of id
        const token = createToken(user._id)
        res.status(200).json({email, token})
     }
     catch(error){
        res.status(400).json({error  : error.message})
     }
    
}



//for sign up
const signUpUser = async (req, res) => {
    const {email, password } = req.body;
    
    try {
       const user = await User.signup(email,password)

       
       const token = createToken(user._id)
       res.status(200).json({email, token}) 
    }
    catch(error){
       res.status(400).json({error  : error.message})
    }
}

module.exports = {
    loginUser,
    signUpUser
}

