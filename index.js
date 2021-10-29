const express = require("express");
const app = express();
const cors = require("cors");
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const dotenv = require("dotenv");
dotenv.config();
const url = process.env.DB;
const PORT = process.env.PORT || 3000;
app.use(cors({
    origin: "*"
}))

app.use(express.json());

app.post('/create-mentor', async function (req,res){
    try {
        let data={};
        data.mentor = req.body.mentor;
        let client = await mongoClient.connect(url);
        let db = client.db('mentor');
        let data = await db.collection('mentors').insertOne(data);
        await client.close();
        res.json({
            message:"Mentor created successfully"
        })
    } catch (error) {
        console.log(error)
    }
})
app.post('/create-student', async function(req,res){
    try {
        let data=  {};
        data.student= req.body.student;
        data.isAssigned = false;
        let client = await mongoClient.connect(url);
        let db = client.db('mentor');
        let data = await db.collection('students').insertOne(data);
        await client.close();
        res.json({
            message:"Student created successfully"
        })
    } catch (error) {
        
    }
})
app.get("/mentors", async function(req,res){
    try {
        let client = await mongoClient.connect(url);
        let db = client.db('mentor');
        let data = await db.collection('mentors').find();
        await client.close();
        res.json(data)
    } catch (error) {
        
    }
})
app.get("/students", async function(req,res){
    try {
        let client = await mongoClient.connect(url);
        let db = client.db('mentor');
        let data = await db.collection('students').find({isAssigned:false});
        await client.close();
        res.json(data)
    } catch (error) {
        
    }
})
app.post("/assign-student",async function(req,res){
    try {
        data={};
        data.mentor = req.body.mentor;
        data.mentorid = req.body.mentorid
        data.studentid = req.body.studentid;
        let client = await mongoClient.connect(url);
        let db = client.db('mentor');
        data.studentid.forEach(id => {
           await db.collection('students').findOneAndUpdate({_id:id},{$set:{mentorid=data.mentorid}});
        });
        await client.close();
        res.json({
            message:"Students Assigned to mentor"
        })
    } catch (error) {
        console.log(error)
    }
})
app.post('/assign-mentor',async function(req,res){
    try {
        data={};
        data.studentid=req.body.studentid;
        data.mentorid = req.body.mentorid;
        let client = await mongoClient.connect(url);
        let db = client.db('mentor');
        await db.collection('students').findOneAndUpdate({_id:id},{$set:{mentorid=data.mentorid}});
        client.close();
        res.json({
            message:"Mentor assigned"
        })
    } catch (error) {
        
    }
})
app.get('/student-data', async function(req,res){
    try {
        let client = await mongoClient.connect(url);
        let db = client.db('mentor');
        let data= await db.collection('students').find({mentorid:req.body.mentorid});
        client.close();
        res.json(data);
    } catch (error) {
        
    }
})
app.listen(PORT,function(){
    console.log(`This app is listening to ${PORT}`)
})