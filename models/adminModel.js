const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require("validator")


//CREATING SCHEMA
const Schema = mongoose.Schema
const adminSchema = new Schema({
    email : {
        type : String,
        required : true,
        unique : true 
    },
    password : {
        type : String,
        required : true
    }
})

//STATIC SIGNUP METHOD
adminSchema.statics.signup = async function (email,password) {

    //validation
    if(!email || !password){
      throw Error('All fields are mandatory')
    }
    if(!validator.isEmail(email)){
      throw Error('Email is not valid')
    }
    if(!validator.isStrongPassword(password)){
      throw Error('Password is not strong enough')
    }


  //first we check if this email exist or not
 const exists = await this.findOne({email}) 
 if(exists){
  throw Error("Email already in Use")
 }
 

 //to genrate salt 
 const salt = await bcrypt.genSalt(10)//default value = 10
 const hash = await bcrypt.hash(password, salt)
 

 //create user with email and hashed password
 const user = await this.create({email, password : hash})
 return user

}






//STATIC LOGIN METHOD
adminSchema.statics.login = async function (email, password){

  //first we check is there any password or email
  if(!email || !password){
    throw Error('All fields are mandatory')
  }
  

  //if there is email then find the email in the database
  const user = await this.findOne({email})
  if(!user){
  throw Error("Incorrect Email")
  }


  //comparing passwords with user's(in database)
  const match = await bcrypt.compare(password, user.password)
  if(!match){
    throw Error ("Incorrect Password")
  }

  return user
}




module.exports = mongoose.model("Admin" , adminSchema)









