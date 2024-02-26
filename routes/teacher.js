const express=require("express");
const app=express();
const bcrypt=require("bcrypt");
const {Student,Teacher} =require("../db/index");
const authenticate=require('../middlewares/authMiddleware');
const router=express.Router();


router.post('/signup',async(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    const name=req.body.name;
    const subjects=req.body.subjects;

    const ifUserExistsInStudents=await Student.findOne({
        username,
    })

    const ifUserExistsInTeacher= await Teacher.findOne({
        username
    })

    if(!ifUserExistsInStudents && !ifUserExistsInTeacher){
        try{

            const hashedPassword=await bcrypt.hash(password,10);
            const newTeacher=await Teacher.create({
                username,
                password:hashedPassword,
                name,
                subjects
            })
            req.session.user={
                id:newTeacher._id,
                role:'teacher'
            }
            res.status(201).json({
                message:"profile created succesfully"
            });
        }
        catch(err){
            res.status(500).json({
                error:err.message
            })
        }
    }
    else{
        res.status(409).json({
            error:'User already Exists'
        })
    }

})

router.post('/login',async(req,res)=>{

    if(req.session.user){
        return res.status(403).json({
            error:'user is already logged in',
        });
    }
    const {username,password}=req.body;

    const teacher=await Teacher.findOne({username});

    if(teacher){
        const passwordMatch=await bcrypt.compare(password,teacher.password);
        if(passwordMatch){
            req.session.user={
               id:teacher._id,
               role:'teacher'
            }
   
            res.status(200).json({
               message:'Login succesfull',
               user:req.session.user,
               data:teacher
            })
        }
        else{
            res.status(401).json({
                error:'Invalid credentials'
            })
        }
    }
    else{
        res.status(401).json({
            error:'Invalid credentials',
        })
    }
})

router.get('/dashboard',authenticate('teacher'),async (req,res)=>{
        const data= await Teacher.findOne({_id:req.session.user.id});
        res.status(200).json({
            message:'Welcome to the student dashboard',
            user:req.session.user,
            data:data
        });
});


router.get('/logout',authenticate('teacher'),(req,res)=>{
    req.session.destroy();
    res.status(200).json({
        message:'Logout Successfull',
    })
})

router.put('/update-name',authenticate('teacher'),async(req,res)=>{
    try{
        const updatedTeacher= await Teacher.updateOne({_id:req.session.user.id},{$set:{name:req.body.name}});
        
        res.status(200).json({
            message:"Name updated succesfully",
            user:req.session.user,
            data:updatedTeacher,
        });
    }
    catch(err){
        console.error(err);
        res.status(500).json({
            
                error:"Internal Server Error",
        });
    }
});

router.put('/update-password',authenticate('teacher'),async(req,res)=>{
    const inputPassword=req.body.password;
    
        try{
            const user=await Teacher.findOne({_id:req.session.user.id});
            const isSamePassword=await bcrypt.compare(inputPassword,user.password);
            if(isSamePassword){
                res.status(401).json({
                    error:'New Password is same as the Old password',
                })
            }
            else{
                const newHashedPassword= await bcrypt.hash(inputPassword,10);
                const updatedTeacher= await Teacher.updateOne({_id:req.session.user.id},{$set:{password:newHashedPassword}});
                res.status(200).json({
                    message:"Name updated succesfully",
                    user:req.session.user,
                    data:updatedTeacher,
                });
            }
        }
        catch(err){
            console.error(err);
            res.status(500).json({
                
                    error:"Internal Server Error",
            });
        }

});

module.exports=router;