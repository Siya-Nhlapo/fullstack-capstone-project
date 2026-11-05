// Step 1 - Task 2: Import necessary packages
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Step 1 - Task 1: Use the 'body', 'validationResult' from 'express-validator' for input validations
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const router = express.Router();
const dotenv = require('dotenv');
const pino = require('pino');
 
// Step 1 - Task 3: Create a Pino logger instance
const logger = pino();
/**
 * GLOBAL CONFIGURATION & REQUEST-SCOPED LOGGING ARCHITECTURE
 * 
 * 1. Global Logger Instance (`logger`):
 *    - Initialized above as a central, high-performance structured logging instance.
 *    - Passed directly into `pinoHttp({ logger })` middleware within the main server setup
 *      to intercept and log incoming HTTP metadata (methods, paths, status codes, response times).
 * 
 * 2. Request-Scoped Logger (`req.log`):
 *    - The `pinoHttp` middleware automatically attaches a specialized logger instance 
 *      to the Express request object as `req.log`.
 *    - ALWAYS use `req.log` inside route handlers (e.g., `req.log.error` or `req.log.info`) 
 *      instead of the global logger.
 *    - Benefit: It automatically injects a unique request correlation ID (`reqId`) 
 *      into every log message, making it trivial to trace a single user's request lifecycle 
 *      through a busy terminal stream.
 * 
 * 3. Operational Logging Levels (Do Not Chain Methods):
 *    - Logging methods represent individual severity thresholds and cannot be chained together 
 *      (e.g., `logger.error.info()` is invalid syntax and will cause a runtime crash).
 *    - Use `req.log.info('...')` for normal application flow tracking (e.g., database updates, successful steps).
 *    - Use `req.log.error('...')` for validation failures, missing client headers, or caught catch-block exceptions.
 */
dotenv.config();

// Step 1 - Task 4: Create JWT secret
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    // Step 2
    try {
        // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
        const db = await connectToDatabase();

        // Task 2: Access MongoDB collection
        const collection = db.collection("users");
        // Task 3: Check for existing email
        const existingEmail = await collection.findOne({ email: req.body.email });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt)
        const email = req.body.email;

        // Task 4: Save user details in database
        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date(),
        });
        // Task 5: Create JWT authentication with user._id as payload
        const payload = {
            user: {
                id: newUser.insertedId,
            },
        };

        const authToken = jwt.sign(payload, JWT_SECRET);
        req.logger.info('User registered successfully');
        return res.status(201).json({ authToken, email: req.body.email });
    }
    catch (e) {
        return res.status(500).send('Internal server error');
    }
});

router.post('/login', async (req, res) => {
    try {
        // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db,js`.
        const db = await connectToDatabase();
        // Task 2: Access MongoDB `users` collection
        const collection = db.collection("users");
        // Task 3: Check for user credentials in database
        const theUser = await collection.findOne({ email: req.body.email });
        // Task 4: Check if the password matches the encrypted password and send appropriate message on mismatch
        if(theUser) {
            let result = await bcrypt.compare(req.body.password, theUser.password)
            if (!result) {
                logger.error('Passwords do not match');
                return res.status(404).json({ error: 'Wrong password' });
            }
            // Task 5: Fetch user details from the database
            const userName = theUser.firstName;
            const userEmail = theUser.email;
            // Task 6: Create JWT authentication if passwords match with user.id as payload
            let payload = {
                user: {
                    id: theUser._id.toString(),
                },
            };
            const authtoken = jwt.sign(payload, JWT_SECRET)
            res.json({ authtoken, userName, userEmail });
        }
        // Task 7: Send appropriate message if user not found
        else {
            req.log.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }
    }
    catch (e){
        return res.status(500).send('Internal server error');
    }
})

router.put('/update', async (req, res) => {
    // Step 1 - Task 2: Validate the input using 'validationResult' and return appropriate message if there is an error.
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.log.error('Validation erros in update request', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }
    try {
        // Step 1 - Task 3: Check if 'email' is present in the header and throw an appropriate error message if not present.
        const email = req.headers.email;

        if(!email) {
            req.log.error('Email not found in the request headers');
            return res.status(400).json({ error: "Email not found in the request headers" });
        }
        // Step 1 - Task 4: Connect to MongoDB
        const db = await connectToDatabase();
        const collection = db.collection('users');
        // Step 1 - Task 5: find user credentials in database
        const existingUser = await collection.findOne({ email });
        existingUser.updatedAt = new Date();
        // Step 1 - Task 6: Update user credentials in database
        const updatedUser = await collection.findOneAndUpdate(
            { email },
            { $set: existingUser },
            { returnDocument: 'after' }
        );
        // Step 1 - Task 7: Create JWT authentication using secret key from .env file
        const payload = {
            user: {
                id: updatedUser._id.toString(),
            },
        };
        const authtoken = jwt.sign(payload, JWT_SECRET);
        res.json({authtoken});
    } catch (e) {
        return res.status(500).send('Internal server error');
    }
});

module.exports = router;
