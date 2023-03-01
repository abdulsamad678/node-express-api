const jwt = require('jsonwebtoken');
require ('dotenv').config()

const User= require('../models/User')

module.exports = async (req, res, next) =>{
    try{
        const Token = req.header('Authorization').replace('Bearer ', '');
        console.log("Token : "+Token);
        //jwt.decode(accessToken, JWT SECRET HERE)
        const verify = jwt.decode(Token,process.env.JWTSECRET);
        console.log("verify"+JSON.stringify(verify));

     //console.log("req.body"+JSON.stringify(req))
            
        let user= await User.find({email:verify.email})
        console.log("user12"+JSON.stringify(user))
        if(!user){
            return res.json({data: { success : false, message : error.message }})
        }
        if (user.length == -1){
            
            return res.json({data: { success : false, message : "No user found" }})
        }
        req.body.user = user
        next()
    } catch ( error ){
        console.log(error)
        return res.json({
            msg : 'Invalid Token'
        });
    }
}