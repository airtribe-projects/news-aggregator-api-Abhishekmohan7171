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
    const dbUser = await User.findById(id);
    console.log(dbUser,"->>>>>>>>>>>>>>")
    let preferences = dbUser.preferences;
    // const id = req.params.id;
    // const user = dbUser.find((user) => user.id === id);
    // console.log(user,"-------------------")
    preferences = req.body.preferences;
    res.send({
        updatedPrefernces: preferences
    })

})

module.exports = router;