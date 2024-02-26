const express=require("express");
const app=express();
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
            const newStudent= await Student.create({
                username,
                password,
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

    const student=await Student.findOne({username,password});

    if(student){
        req.session.user={
            id:student._id,
            role:'student',
        };

        res.status(200).json({
            message:"login Succesfull",
            user:req.session.user,
            data:student,
        })
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


module.exports=router;