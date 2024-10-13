const express = require('express');
const jwt = require('jsonwebtoken');

//middleware to validate the token
exports.validateJwt = (req,res,next) => {
    // console.log(req.headers)
    const token = req.headers.authorization;
    if(!token){
        console.log("No Token --------------------")
        next();
    }
    const decodedToken = jwt.verify(token , process.env.JWT_SECRET);
    if(!decodedToken){
        res.status(401).send({message:'Unauthorized'});
    }
    req.user = decodedToken;
    // console.log(req.user)
    next();
}