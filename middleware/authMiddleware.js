import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {

    // Check if authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            //verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // find user by id in the database and attach it to the request object

            req.user = await User.findById(decoded.id).select('-password');

            // let the continue to the next function(controller)
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed'});
        }
    }
    if(!token) {
        res.status(401).json({ message: 'Not authorized, no token'});
    }
};