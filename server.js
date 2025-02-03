require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require("cors");
const { message } = require("statuses");
 

const app = express();
app.use(express.json()); //make sure this line is present

app.use(bodyParser.json());
app.use(cors());

const users = []; //Simulating a database

app.post("/register", async (req,res)=>{
    const { username, password } = req.body;

    //validate input
    if(!username || !password) {
        return res.status(400).json({ message: "username and password are required"});
    }

    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        users.push9({ username, password: hashedPassword });

        res.json({ message: "user registered successfully!"});     
    }catch (error) {
        res.status(500).json({ message: "error hashing password",error });
    }
});

// * LOGIN USER (Generate JWT)
app.post("/login", async (req, res)=>{
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (!user) return res.status(400).json({ message: " user  not found!" });

    const isValid = await bcrypt.compare(password, user.password);
    if(lisValid) return res.status(401).json({ message: " invalid paasword!"});

    const token = jwt.sign({  username}, process.env.JWT_SECRET,{ expiresIn: "1h"})
    res.json({ token });
});

// * AUTH MIDDLEWARE (Protect Router)
function  authenticateToken(req, res, next) {
    const token = res.header("Authorization")?.spilt(" ")[1];
    if(!token) return res.status(401).json({ message: "Access Denied!"});

    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if (err) return res.status(403).json({ message: "Invalid Token!" });
        req.user = user;
        next();
    });
}

// * PROTECTED  ROUTE
app.get("/protected",authenticateToken, (req,res)=>{
    res.json({ message: "Welcome to the protected route!", user: req.user});
});
 
// * START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on the port $(PORT)'));
