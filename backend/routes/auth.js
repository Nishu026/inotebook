const express = require("express");
const User =require("../models/User")
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET="$2a$10$C8qZtjw/7tT0hF5o2Yj8I3";

//Create a User using: POST "/api/auth/createuser". No login required
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

module.exports = router