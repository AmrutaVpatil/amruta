//for importing express module
//import express module
const express=require('express')
const app=express()
app.use(express.json());
let item=[ ];

//get all users
app.get('/user',(req,res)=>{
    res.json(users)
})
 
//post - new user
app.post('/users',(req,res)=>{

    const newuser={id:users.lenght+1, ...req.body}
    users.push(newuser)
    res.status(201),json(newuser);
})

//upadate --put()
app.put('/user/:id',(req,res)=>{
    const user=users.find(u=>u.id===parseInt(req.params.id))
    if(!user) return res.status(404).json({message:"user not found"})
    user.name=req.body.name || req.name
    user.email=req.body.email || req.email
    res.json(user)
})

//delete
app.delete('/users/:id',(req,res)=>{
users=users.filter(user=>user.id !==PerseInt(req.params.id))
res.json({message:'user deleted'})
})
app.listen(8000,()=>console.log("server is running in the port 8000"))
    





