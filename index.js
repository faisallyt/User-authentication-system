const express=require("express");
const app=express();
const TeacherRouter=require("./routes/teacher");
const StudentRouter=require("./routes/students");


app.use(express.json());

app.use('/student',StudentRouter);
app.use('/teacher',TeacherRouter);


app.listen(3000,()=>{
    console.log("Server Started at port 3000");
})