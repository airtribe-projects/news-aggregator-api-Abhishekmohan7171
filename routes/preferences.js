const express = require('express');
const router = express.Router();
const User = require("../models/users");
const jwt = require('jsonwebtoken');
const {validateJwt} = require('../middleware/validateJwt');

//get all preferences
router.get('/',validateJwt, (req,res)=>{
   if(!req.user){
        return res.status(401).send({message:'Unauthorized'});
   }
   res.send({preferences: req.user.preferences,message:'Preferences fetched successfully'});
})

//update preferences
router.put('/update',validateJwt,async (req,res) => {
    if(!req.user){
        return res.status(401).send({message:'Unauthorized'});
    }
    const id = req.user.id;
    const dbUser = await User.findByIdAndUpdate(id,{preferences:req.body.preferences});
    console.log(dbUser,"->>>>>>>>>>>>>>")
    preferences = dbUser.preferences;
    res.send({
        updatedPreferences: preferences
    })

})

module.exports = router;