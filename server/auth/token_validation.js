const { verify } = require("jsonwebtoken");


const verifyJWT = (req, res , next)=>{
    let token= req.headers.authorization;
    if( !token){
        res.json({
            success: 0,
            message: "Acess denied! unauthorized user"
        });
    }
    else{
         token = token.split(' ')[1];
        verify (token ,process.env.SECRET,  (err,decoded)=> {
            if(err) res.json({success: 0,
                    message: "Invalid token"});
            else{
                req.userId= decoded.id;
                next();
            }
            
            
        })
    }

}
 module.exports= {verifyJWT};

