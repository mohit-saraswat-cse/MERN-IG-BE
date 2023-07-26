const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const mongoose = require('mongoose');
const Users = require('../models/user_model');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    //authorization -> Bearer gkjfgskgkgdgkdgsj
    if (!authorization) {
        return res.status(401).json({ error: "User not logged in" });
    }
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET, (error, payload)=>{
        if(error){
            return res.status(401).json({ error: "Token is invalid !" });
        }
        const {_id} = payload;
        Users.findById(_id)
        .then(dbUser=>{
            req.dbUser = dbUser;
            //forward the request to the next middleware or to the next route
            next();
        });
        
    });
}