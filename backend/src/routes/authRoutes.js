import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const generateToken  = (userId) => {
   return jwt.sign({userId} , process.env.JWT_SECRET , {expiresIn : "15d"})
}

router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    console.log(req.body);
    
    

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters long" });
    }

    if(username.length < 3 ) {
        return res.status(400).json({message : "Username must be atleast 3 characters long"})
    }

//    const existingUser = await User.findOne({$or : [{email : email} , {username}]})

//    if(existingUser) {
//        return res.status(400).json({message : "User already exists"})
//    }


    const exitingEmail = await User.findOne({email});
    if(exitingEmail) {
        return res.status(400).json({message : "Email already exists"})
    }

    const existingUsername = await User.findOne({username});
    if(existingUsername) {
        return res.status(400).json({message : "Username already exists"})
    }

    const profilePhoto  = "https://api.dicebear.com/9.x/avataaars/svg?seed=Brian"


    const user =  new User({
      email,
      username,
      password,
    });

    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({
        token ,
        user : {
            _id : user._id,
            username : user.username,
            email : user.email,
            profileImage  : profilePhoto
        }
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/login", async (req, res) => {
        try {
            const {email , password} = req.body;

            if(!email || !password) {
                return res.status(400).json({message : "Please fill all the fields"})
            }
            
            // check if user exits

            const user = await User.findOne({email});

            if(!user) {
                return res.status(400).json({message : "Invalid credentials"})
            }
            const isPasswordCorrect = await user.comparePassword(password);

            if(!isPasswordCorrect) {
                return res.status(400).json({message : "Invalid credentials"})
            }

            const token = generateToken(user._id);

            res.status(200).json({
                token,
                user : {
                    _id : user._id,
                    username : user.username,
                    email : user.email,
                    profileImage : user.profileImage
                },
                msg : "Logged in successfully"
            })
            
        } catch (error){
            console.log(error);
            res.status(500).json({message : "Server Error"})
        }
});

export default router;
