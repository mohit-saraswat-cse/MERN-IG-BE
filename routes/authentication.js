const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Users = require('../models/user_model');
const {JWT_SECRET} = require('../config');
const jwt = require('jsonwebtoken');

const protectedResource = require('../middleware/protectedResource');

router.get('/not-secured', (req, res)=> {
    res.send('not secured route');
});

router.get('/secured', protectedResource, (req, res)=> {
    res.send('secured route');
});

router.post('/login', (req, res) => {
    const {email, password} = req.body;
    if(!email) {
        return res.status(400).json({error: "Email field is empty"});
    }
    if(!password) {
        return res.status(400).json({error: "Password field is empty"});
    }
    Users.findOne({email}).then((dbUser)=> {
        if(!dbUser) {
            return res.status(400).json({error: "User does not exists"}); 
        }
        bcrypt.compare(password, dbUser.password).then((didMatch)=> {
            if(didMatch) {
                // res.status(200).json({result: "User logged in successfully !!"});
                const jwtToken = jwt.sign({ _id: dbUser._id }, JWT_SECRET);
                const { _id, fullName, email, followers, following, profilePicUrl } = dbUser;
                res.json({ token: jwtToken, userInfo: { _id, fullName, email, followers, following, profilePicUrl } });
            } else {
                return res.status(400).json({error: "Invalid Credentials"});
            }
        })
    })
});

router.post('/register', (req, res) => {
    const {fullName, email, password, profilePicUrl} = req.body;
    if(!fullName || !email || !password) {
        return res.status(400).json({error: "One or more mandatory field is empty"});
    }
    Users.findOne({email: email}).then((dbUser) => {
        if(dbUser) {
            return res.status(500).json({error: "User already exists in the DB !"});
        }
        bcrypt.hash(password, 16).then((hashedPassword)=> {
            const user = new Users({ fullName, email, password: hashedPassword, profilePicUrl: profilePicUrl });
            user.save().then((user) => {
                res.status(201).json({result: 'User Registed Successfully !'});
            }).catch(error => {
                console.log(error);
            });
        });
    }).catch(error => {
        console.log(error);
    })
});

module.exports = router;