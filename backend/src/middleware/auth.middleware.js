import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// const response = await fetch("http://localhost:3000/api/books" , {
//     method : "POST",
//     body: JSON.stringify({
//         title,
//         caption
//     }),
//     headers : {Authorization : `Bearer ${token}`}
// })


const protectRoute = async (req , res , next) => {
    try {
        // get token

        const token = req.header("Authorization").replace("Bearer " , "");

        if(!token){
            return res.status(401).json({error : "You must be logged in to access this route"});
        }

        // verify token
        const decoded = jwt.verify(token , process.env.JWT_SECRET);

        // find user 

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(404).json({error : "Token is not valid"});
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error verifying token", error);
        res.status(500).json({error : "Internal Server Error"}); 
    }
} 


export default protectRoute;