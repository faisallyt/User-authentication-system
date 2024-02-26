const express=require("express");
const app=express();
const bcrypt=require("bcrypt");
const {Student,Teacher} =require("../db/index");
const authenticate =require('../middlewares/authMiddleware');
const router=express.Router();


router.post('/signup',async(req,res)=>{
    const username=req.body.username;
    const password=req.body.password;
    const name=req.body.name;

    const ifUserExistsInStudents=await Student.findOne({
        username,
    })

    const ifUserExistsInTeacher=await Teacher.findOne({
        username
    })

    if(!ifUserExistsInStudents && !ifUserExistsInTeacher){
        try{
            const hashedPassword=await bcrypt.hash(password,10);
            const newStudent= await Student.create({
                username,
                password:hashedPassword,
                name
            })
            req.session.user={
                id:newStudent._id,
                role:'student'
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

});

router.post('/login',async(req,res)=>{
    if(req.session.user){
        return res.status(403).json({
            error:'user is already logged in',
        });
    }
    const {username,password}=req.body;

    const student=await Student.findOne({username});

    if(student){
        const passwordMatch=await bcrypt.compare(password,student.password);
        if(passwordMatch){
            req.session.user={
                id:student._id,
                role:'student',
            };
    
            res.status(200).json({
                message:"login Succesfull",
                user:req.session.user,
                data:student,
            });
        }
        else{
            res.status(401).json({
                error:"Invalid credentials",
            })
        }
    }
    else{
        res.status(401).json({
            error:"Invalid credentials",
        })
    }
})

router.get('/dashboard',authenticate('student'),async (req,res)=>{
    const data=await Student.findOne({_id:req.session.user.id})
        res.status(200).json({
            message:'welcome to the student dashboard',
            user:req.session.user,
            data:data
        }); 
});


router.get('/logout',authenticate('student'),(req,res)=>{
    req.session.destroy();
    res.status(200).json({
        message:'Logout succesfull',
    });
});

router.put('/update-name',authenticate('student'),async(req,res)=>{
    try{
        const updatedStudent= await Student.updateOne({_id:req.session.user.id},{$set:{name:req.body.name}});
        
        res.status(200).json({
            message:"Name updated succesfully",
            user:req.session.user,
            data:updatedStudent,
        });
    }
    catch(err){
        console.error(err);
        res.status(500).json({
            
                error:"Internal Server Error",
        });
    }
});

router.put('/update-password',authenticate('student'),async(req,res)=>{
    const inputPassword=req.body.password;
    
        try{
            const user=await Student.findOne({_id:req.session.user.id});
            const isSamePassword=await bcrypt.compare(inputPassword,user.password);
            if(isSamePassword){
                res.status(401).json({
                    error:'New Password is same as the Old password',
                })
            }
            else{
                const newHashedPassword=await bcrypt.hash(inputPassword,10);
                const updatedStudent= await Student.updateOne({_id:req.session.user.id},{$set:{password:newHashedPassword}});
                res.status(200).json({
                    message:"password updated succesfully",
                    user:req.session.user,
                    data:updatedStudent,
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