const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://anony6905:faisald181@cluster0.zwdgraw.mongodb.net/User-authorization");

const StudentSchema=new mongoose.Schema({
    username:{type:String,unique:true, required:true},
    password:{type:String,required:true},
    name:{type:String}
})

const TeacherSchema=new mongoose.Schema({
    username:{type:String,unique:true, required:true},
    password:{type:String,required:true},
    name:{type:String},
    subjects:{type:Array}
})

const Student=mongoose.model('Student',StudentSchema);
const Teacher=mongoose.model('Teacher',TeacherSchema);

module.exports={
    Student,
    Teacher
}
