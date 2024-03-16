const express = require("express");
const router = require("express").Router();


router.get('/',(req,res)=>{
    res.send("Notes pages")
})

module.exports=router;