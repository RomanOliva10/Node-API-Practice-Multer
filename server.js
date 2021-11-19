const methodOverride = require('method-override');
const cors = require('cors');
const express = require('express');
const path = require('path');
const multer = require('multer');


const server = express();
server.use(cors());
server.use(methodOverride());
server.use(express.urlencoded({extended:true}))
server.use(express.json());
let PORT = process.env.PORT || 3000;
const log = console.log;

let users = [
    {email:"johndoe@gmail.com",name:"John Doe",pass:"123456789", foto: "bucket/img1.jpg"},
    {email:"johndoe2@gmail.com",name:"John Doe",pass:"123456789", foto: "bucket/img1.jpg"},
    {email:"johndoe3@gmail.com",name:"John Doe",pass:"123456789", foto: "bucket/img1.jpg"},
    {email:"johndoe4@gmail.com",name:"John Doe",pass:"123456789", foto: "bucket/img1.jpg"},
];

const multerConfig = multer.diskStorage({
    destination:function(req, foto, cb){
        cb(null, "./bucket");
    },
    filename:function(req, foto, cb){
        cb(null, foto.originalname);
    },
});
const multerMiddle = multer({storage:multerConfig});


server.get("/",(req, res) => {
    res.sendFile(path.join(__dirname,"/views/index.html"));
});

server.get('/users/get', (req, res) => {
    res.send(users);
    
});


server.get('/user/get/:email', (req, res) => {
    res.send(users.filter(user => user.email === req.params.email));
});

server.get('/user/get/?name', (req, res) => {
    res.send(users.filter(user => user.name === req.query.name));
});


server.post('/user/create', multerMiddle.single("foto"), (req, res) => {
    const {name, email, pass} = req.body
    const foto = req.file;
    users.push({
        email,name,pass,foto
    });
    
    res.send('Usuario creado');
});


server.delete('/user/delete/:email', (req, res) => {
    users = users.filter(user => user.email !== req.params.email);
    res.send('Usuario eliminado');
});


server.delete("/users/delete",(req,res)=>{
    let mail= req.query.mail;
    mail.forEach(params=>{   
        users = users.filter((user) => user.email !== params);
    })
    res.send("usuarios eliminado");
})


server.post("/user/update", (req, res)=>{
    const {oldMail, newMail} = req.body;
    users.forEach((user,i)=>{
       if (oldMail == user.email){
          users[i].email = newMail;
       }
    });
    res.send('email Modificado')
});
 


server.listen(PORT,()=>{
    log("start server");
});