const mongoose=require('mongoose');
const UserSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true,
  },
  email:{
    type:String,
    required:true,
    unique:true //unique email for each user
  },
  password:{
    type:String,
    required:true
  },
  avatar:{//User Image
    type:String,
  },
  role:{//Role of user Admin Or Consumer
    type:Number,
    default:0
  },
  history:{
    tyep:Array,
    default:[],
  },
});

module.exports=User=mongoose.model('User,UserSv')
