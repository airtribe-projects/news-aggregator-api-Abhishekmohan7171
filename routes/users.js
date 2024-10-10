const express = require('express');
const User = require('../models/users');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//register User
router.post('/register', async (req,res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 10);
    //adding the user in the DB
    const dbUser = await User.create(user);
    res.send({newUser: dbUser, message:'User created successfully'});
});

//login User
router.post('/login', async (req,res) => {
    const {email,password} = req.body;
    const dbUser =await  User.findOne({email});
    if(!dbUser){
        return res.status(404).send({message:'Email not found'});
    }
    const samePassword = await bcrypt.compareSync(password,dbUser.password);
    if(!samePassword){
        return res.status(404).send({message:'Password incorrect'});
    }
    const token = jwt.sign({role:dbUser.role},process.env.JWT_SECRET,{expiresIn:'1h'});
    res.send({message:'Login successful', token});
})


module.exports = router;