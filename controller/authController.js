import User from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";



//user registration
const registerUser = async (req, res)  => {
    const salt = 10
    try{
          const { username, email, password } = req.body;
          
          if(!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required"});
          }

          const userExists = await User.findOne({username});
          if(userExists) {
            return res.status(400).json({ message: "Username already exists"});

          }
          // hash password 

        
          const hashPassword = await bcrypt.hash(password, salt);

          // create user 
          const user = await User.create({
            username,
            email,
            password: hashPassword
          })
             // save user to database 
          await user.save();

          res.status(201).json({ message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
          });



    }catch(error) {
        console.log(error);
    }
};

// user login 
//authenticate user and get token
//POST /api/auth/login
const loginUser = async (req, res) => {
    try{
        const { username, password } = req.body;

        //Find user by username in the database
        const user= await User.findOne({ username });
        if(!user) {
            return res.status(400).json({ message: "Invalid username or password"});
        }
         //Check if the password matches the hashed password in the  database
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({
                message: "Invalid username or password"
            });
        }

        // Generate JWT token 
        const token = jwt.sign(
            {id: user._id, username: user.username}, // the payload of the token
            process.env.JWT_SECRET, // secret key used to sign the token
            { expiresIn: "30d"}

        );

        // send token back to client
        res.status(200).json({
            message: "login successful",
            token: token
        });


    }catch(error) {
        console.log(error);
        res.return(500).json({ message: "Server error"});
    }
};


export  { registerUser, loginUser };


