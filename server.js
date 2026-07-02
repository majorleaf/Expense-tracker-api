import express from 'express';
import 'dotenv/config'; // Automatically loads the .env variables
import connectDb from './config/mongodb.js';
import router from './routes/authRoutes.js';

const app = express();
// Add a fallback port just in case .env doesn't have one
const PORT = process.env.PORT || 8000; 

app.use(express.json());

// Database connection 
connectDb();


app.use('/api/auth', router);

app.get('/', (req, res) => {
    console.log('Test route hit!');
    // FIX: You MUST send a response back, otherwise the browser will load infinitely
    res.send('Welcome to the Expense Tracker API'); 
})


// FIX: Use the PORT variable instead of hardcoding 8000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});