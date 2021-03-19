const { response } = require('express');
const {OAuth2Client, UserRefreshClient, jwt,JWT}= require('google-auth-library');
const { default: userModel } = require('../../dist/models/user-model');


const client = new OAuth2Client("100334197755-0nps2ssqsmbh3r8lomd3j1gbhupe3mmv.apps.googleusercontent.com")


exports.googlelogin = (req ,res)=>{
    const {tokenId}=res.body;
    client.verifyIdToken({idToken: tokenId,audience: "100334197755-0nps2ssqsmbh3r8lomd3j1gbhupe3mmv.apps.googleusercontent.com"}).then(response =>{
      const {email_verified, name, email} = response.payload;
    //   console.log(response.payload);
      if(email_verified){
          User.findOne({email}).exec((err, user)=>{
           if(err){
               return res.status(400).json({
                   error:"something went wrong. try again"
               })
           }else{
                 if(user){   //if user already exist in db
                   const token=jwt.sign({_id:user._id}, process.env.JWT_SIGNIN_key, {expiresIn: '7d'})       //creating new token and expring after 7 days.
                   const {_id,name,email}=user;                                                            //so user needs to relogin again for auth.

                   res.json({
                   token,
                   user:{_id,name,email}
                   })

                 }else{  //user trying to login for 1st time       //creating a new user
                    let password = email+process.env.JWT_SIGNIN_key;      //creating a password
                    let newUser = new User({name, email, password});        //creating user 
                    newUser.save((err,data)=>{
                    if(err){
                        return res.status(400).json({
                            error:"something went wrong. try again"
                    })
                }
                    else{
                      const token=jwt.sign({_id:data._id}, process.env.JWT_SIGNIN_key, {expiresIn: '7d'})       //creating new token and expring after 7 days.
                      const {_id,name,email}=newUser;                                                            //so user needs to relogin again for auth.
   
                    res.json({
                        token,
                        user:{_id,name,email}
                 })
                 }})
           }}
          })
      }
    })
    console.log();
}