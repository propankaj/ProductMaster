require("dotenv").config();
const jwt = require("jsonwebtoken");

var db = require('../db/conn');

module.exports.loginCheck = async function (req) {
    try {
        let query = "select count(*) as user from user where email_id = ? OR mobile = ?";  
        // console.log("userid in Q ==>",req.body.userid)
        let values = [req.body.userid,req.body.userid];
        return await db.execQuery(query, values);
    } catch (error) {
        console.log(error);
    }
}

module.exports.genetrateAuthToken = async function(req){
    try{
        const token = jwt.sign(
                    {_user: req.body.userid}, process.env.SECRET_KEY
                )
                return token;
            
    }catch(error) {
        console.log(error);
    }
}

module.exports.saveToken = async function (token,req) {
    try {
        let query = "UPDATE user SET jwt_token = ? where email_id = ?";  
        let values = [token,req.body.userid];
        return await db.execQuery(query, values);
    } catch (error) {
        console.log(error);
    }
}

module.exports.getUser = async function (token) {
    try {
        let query = "select email_id from user where jwt_token = ?";  
        let values = [token];
        return await db.execQuery(query, values);
    } catch (error) {
        console.log(error);
    }
}