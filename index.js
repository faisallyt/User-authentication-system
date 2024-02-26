const express=require("express");
const session=require("express-session");
const cookieParser=require("cookie-parser");
const morgan=require("morgan");
const TeacherRouter=require("./routes/teacher");
const StudentRouter=require("./routes/students");

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use(session({
    secret:"placement",
    resave:true,
    saveUninitialized:true,
}))
app.use(morgan("dev"));

app.use('/student',StudentRouter);
app.use('/teacher',TeacherRouter);


app.listen(3000,()=>{
    console.log("Server Started at port 3000");
})