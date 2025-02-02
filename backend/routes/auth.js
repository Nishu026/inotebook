const express = require("express");
const User =require("../models/User")
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchUser');

const JWT_SECRET="$2a$10$C8qZtjw/7tT0hF5o2Yj8I3";

//Rout1: Create a User using: POST "/api/auth/createuser". No login required
router.post('/createuser',[
   body('name').isLength({min:3}),
   body('email','Enter a valid email').isEmail(),
   body('password','Password should be atleast 5 characters').isLength({min:5})
],async(req,res)=>{
   //if errors return bad request and the errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    //check whether the user with this email exists already
    try
    {
    let user= await User.findOne({email:req.body.email});
    if(user){
      return res.status(400).json({error:"Sorry a user with this email already exists"})
    } 
    const salt = await bcrypt.genSalt(10);
    const securedPass= await bcrypt.hash(req.body.password,salt);
    //create a new user
    user = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:securedPass,
    })

    const data={
      user:{
         id:user.id
      }
    }

    const authToken = jwt.sign(data, JWT_SECRET);

    res.json({authToken,"message":"User created successfully"});
   }catch(error){
       console.error(error.message);
       res.status(500).send("Internal Server Error");
   }
})


//Route 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login',[
  body('email','Enter a valid email').isEmail(),
  body('password','Password cannot be blank').exists(),
],async(req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()});
  }

  const {email,password}=req.body;
  try{
    let user = await User.findOne({email});
    if(!user){
      return res.status(400).json({error:"Please try to login with correct credentials"});
    }

    const comparePass = await bcrypt.compare(password,user.password);
    if (!comparePass){
      return res.status(400).json({error:"Please try to login with correct credentials"});
    }
    
    const data={
      user:{
         id:user.id
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET);
    res.json({authToken,"message":"User Logged in successfully"});

  }catch(error){
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})


//Route 3: Get User Details using:POST "/api/auth/getuser.Login Required"
router.post('/getuser',fetchuser,async(req,res)=>{
  try{
    const userId=req.user.id;
    const user = await User.findById(userId).select("-password"); //select all fields except password
    res.send(user);
  }catch(error){
    console.error(error.message);
    res.status(500).send("Internal Server Error");
}

})


module.exports = router