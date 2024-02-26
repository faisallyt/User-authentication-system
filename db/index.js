const mongoose=require("mongoose");
const dbConnection=process.env.MONGODB_URI || "mongodb+srv://anony6905:faisald181@cluster0.zwdgraw.mongodb.net/User-authorization";
mongoose.connect(dbConnection)
  .then(()=>{
    console.log("connected to MongoDb");
  })
  .catch((error)=>{
    console.error("Error connecting to MongoDB",error.message);
  })

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
