const express=require('express');
const router=express.Router();
const jwt=require('jsonwebtoken');//to generate tokken
const bcrypt=require('bcryptjs');//encrypt password
//Check validation for requests

const  {check,validationResult}=require('express-validator');
const gravatar=require('gravatar');//get user image by email
//Models
const User=require('../models/User');


// @route POST api/user/register
// @desc Register User
// @access Public
router.post('/register',[
  //validation

  check('name','Name is required').not().isEmpty(),
    check('email','Please include a Valid Email').isEmail(),
      check('password','Please enter a password with 6 or more characters required').isLength({
        min:6,
      }),
],async(req,res)=>{
  const errors=validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({
      errors:errors.array(),
    });
  }
  //get name email and password from requests
  const{name,email,password}=req.body;
  try{
    //check if user already exists
    let user=await User.findOne({email});

    //if user exists
    if(user){
      return res.status(400).json({
        errors:[
          {
            msg:'User already exists',
          },
        ],
      });
    }
    //if not exists
    //get image from gravatar
    const avatar=gravatar.url(email,{
      s:'200',//size
      r:'pg',//rate
      d:'mm',
    });
    //create user object
    user=new User({
      name,email,avatar,password
    });
    //encrypt password
    const salt=await bcrypt.genSalt(10);//generate salt contains 10
    //save passworrd
    user.password=await bcrypt.hash(password,salt);//use   user password and salt tp hash password
    //save user in database
    await user.save();
    //payload to generate token
    const payload={
      user:{
        id:user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,{
        expiresIn:360000,//for development for production it will 3600
      },
      (err,token)=>{
        if(err) throw err;
        res.json({token});
      }
    );
  }catch(error){
    console.log(err.message);
    res.state(500).send('Server error');
  }
});
module.exports=router
