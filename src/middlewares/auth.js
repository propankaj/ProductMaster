const jwt = require("jsonwebtoken"); 
const Login = require("../models/login");
 
const auth = async (req, res, next) => { 
    try{ 
        const token = req.cookies.jwt; 
        console.log("in Auth Token ==> "+ token); 
        if(!token){ 
            res.status(500).send("Cookie is not set"); 
        } 
        else{ 
            user = await Login.getUser(token);
            console.log(JSON.stringify(user))
            req.user = user;
            req.token = token; 
            next(); 
        } 
    } 
    catch(err){ 
        console.log(err) 
        res.status(400).send(err); 
    } 
} 
 
module.exports = auth; 