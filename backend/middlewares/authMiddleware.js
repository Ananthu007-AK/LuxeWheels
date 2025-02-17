const jwt=require('jsonwebtoken');


function verifyToken(req,res,next){
    const token=req.header('Authorization');
    if(!token)
        return res.status(401).json({error:'Access Denied'});
    try{
        const decoded=jwt.verify(token.process.env.JWT_SECRET);
        req.userid=decoded.userid;
        next()
    }
    catch(error){
        res.status(401).json({error:'Invalid Token'});
    }
}
module.exports=verifyToken;