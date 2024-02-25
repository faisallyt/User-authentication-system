const express=require("express");
const app=express();
const {Student,Teacher} =require("../db/index");
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
            await Teacher.create({
                username,
                password,
                name,
                subjects
            })
    
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


module.exports=router;