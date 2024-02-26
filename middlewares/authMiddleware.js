const authenticate=(role)=>{
    return (req,res,next)=>{
        if(req.session.user && req.session.user.role===role){
            next();
        }
        else{
            res.status(401).json({
                error:'Unauthorized Access',
            });
        }
    };
};

module.exports=authenticate;