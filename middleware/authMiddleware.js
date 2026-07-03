import jwt from 'jsonwebtoken';
// Change 'userModel.js' or 'User.js' to exactly what you named your file!
import User from '../models/userSchema.js'; 


export const protect = async (req, res, next) => {
    // FIX: Declare token at the very top of the function!
    let token;

    // 1. Check if the Authorization header exists and starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Extract the token from the header
            // NOTICE: We do NOT use 'let' or 'const' here. We just update the variable.
            token = req.headers.authorization.split(' ')[1];

            // 3. Verify the token using our secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Find the user in the database and attach them to the request object
            req.user = await User.findById(decoded.id).select('-password');

            // 5. Let the user proceed to the next function (the controller)
            next();
        } catch (error) {
            console.error(error);
            // Don't forget the 'return' so it stops running here!
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    // Since 'token' was declared at the top, this check works perfectly now!
    if (!token) {
        res.status(401).json({ message: "Not authorized, no token provided" });
    }
};