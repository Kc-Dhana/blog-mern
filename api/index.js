const express = require('express');
const cors =require('cors');
const mongoose = require("mongoose");
const User = require('./models/User')
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');

const salt =bcrypt.genSaltSync(10);

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://dananjayaperera99:tbl0SifpRdrEbLiT@cluster0.uhlqqfj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

app.post('/register',async (req,res) =>{
    const {username,password} =req.body;
    try{
        const userDoc= await User.create({
            username,
            password:bcrypt.hashSync(password,salt),
        });
        res.json(userDoc);
    }catch (e){
        console.log(e);
        res.status(400).json(e);

    }
});

app.post('/login',async (req,res) => {
    const {username,password} = req.body;
    const userDoc =await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password); // true
    if (passOk){
        //login in

    } else {
        res.status(400).json('wrong credentials');
    }



});


app.listen(4000);

