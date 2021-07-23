const jwt=require('jsonwebtoken')

module.exports=function(req,res,next){
  //get toen headr
  const token=req.header('x-auth-token');

//check if no
if(!token){
  return res.status(401).json({
    msg:'No token,auth denied'
  })
}
//verify token
try{
  const decoded=jwt.verify(token,process.env.JWT_SECRET)
  //set user in in req.User
  req.user=decoded.user;
  next()
}catch(error){
  req.status(401).json({
    msg:'Token is not valid'
  })
}
}
