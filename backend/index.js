require("dotenv").config();

const config = require("./config.json"); 
const mongoose = require("mongoose");  


mongoose.connect(config.connectionString);

const User = require("./models/user.model");   
const Libelium = require("./models/libelium.model");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");    
const {authenticateToken} = require("./utilities");

app.use(express.json());

app.use(
    cors({
        origin: "*"
    })
);


app.get("/", (req, res) => {
    res.json({data: "hello"});
});


//creat account
app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;

    if(!fullName){
        return res
        .status(400)
        .json({error: true, message: "fullName is required"});
    }

    if(!email){
        return res
        .status(400)
        .json({error: true, message: "email is required"});
    }

    if(!password){
        return res
        .status(400)
        .json({error: true, message: "password is required"});
    }

    const isUser = await User.findOne({email: email});    
    if(isUser){
        return res.json({
            error: true,
            message: "User already exist",
        });  
    }

    const user = new User({
        fullName,
        email,
        password,
    }); 
    await user.save();

    const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "36000m",
    });

    return res.json({
        error: false,
        user,
        accessToken,
        message: "Account created successfully", 
    });
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if(!email){
        return res
        .status(400)
        .json({ message: "email is required"});
    }

    if(!password){
        return res
        .status(400)
        .json({ message: "password is required"});
    }

    const userInfo = await User.findOne({email: email});

    if(!userInfo){
        return res.json({
            message: "User does not exist",
        });
    }

    if(userInfo.email== email && userInfo.password== password){
        const user = {user: userInfo};
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m",
        });
        return res.json({
            error: false,
            message: "Login successfully",
            email,
            accessToken,
        });

    } else {
        return res.status(400).json({
            error: true,
            message: "Incorrect email or password",
        });
    }
});

//add libelium data
app.post("/add-libelium", authenticateToken, async (req, res) => {
    const {sensor, value} = req.body;
    const {user} = req.user;

    if(!sensor){
        return res.status(400).json({error: true, message: "sensor is required"});  
    }
    if(!value){
        return res.status(400).json({error: true, message: "value is required"});
    }

    try{
        const libelium = new Libelium({
            sensor,
            value,
            userId: user._id,
        });
        await libelium.save();

        return res.json({
            error: false,
            libelium,
            message: "Libelium data added successfully",
        });
    } catch(error){
        return res.status(500).json({
            error: true, 
            message: "internal server error",
        });
    }
});
//get user
app.get("/get-user", authenticateToken, async (req, res) => {
    const { user } = req.user;
    
    const isUser = await User.findOne({_id: user._id});

    if(!isUser){
        return res.sendStatus(401);
    }

    return res.json({
        user: {
        fullName : isUser.fullName, 
        email: isUser.email, 
        "_id": isUser._id, 
        createdOn: isUser.createdOn
    },
        message: "",
    });
});

app.get("/get-all-libelium", authenticateToken, async (req, res) => {
    const { user } = req.user;
    try {
        const libeliumData = await Libelium.find({userId: user._id}).sort ({isPinned: -1});
        
        return res.json({
            error: false,
            libeliumData,
            message: "Libelium data retrieved successfully",
        });

    } catch (error) {
        return res.status(500).json({
        error:true,
        message:"internal server error",
        });
    }
});

app.delete("/delete-libelium/:libeliumId", authenticateToken, async (req, res) => {
    const libeliumId = req.params.libeliumId;
    const { user } = req.user;

    try{
        const libelium = await Libelium.findOne({_id: libeliumId, userId: user._id}); 

        if(!libelium){
            return res.status(404).json({
                error: true,
                message: "Libelium not found",
            });
        }

        await Libelium.deleteOne({_id: libeliumId, userId: user._id});

        return res.json ({
            error: false,
            message: "Libelium deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
});

//isPinned
app.put("/update-libelium-pinned/:libeliumId", authenticateToken, async (req, res) => {
    const libeliumId = req.params.libeliumId;
    const { isPinned } = req.body;
    const { user } = req.user;

    try{
        const libelium = await Libelium.findOne({_id: libeliumId, userId: user._id});

        if(!libelium){
            return res.status(404).json({error: true, message: "Libelium not found"});    
        }

        libelium.isPinned = isPinned ;

        await libelium.save();

        return res.json({
            error: false,
            libelium,
            message: "Libelium pinned successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
});

app.listen(8000);


module.exports = app;