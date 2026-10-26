require('dotenv').config();
const express = require('express');
const axios = require('axios');
const logger = require('../giftlink-backend/logger');
const expressPino = require('express-pino-logger')({ logger });
// Task 1: import the natural library
const natural = require('natural');

// Task 2: initialize the express server
const app = express();
app.use(natural);
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(expressPino);

// Define the sentiment analysis route
// Task 3: create the POST /sentiment analysis
app.post('/sentiment', async (req, res) => {

    // Task 4: extract the sentence parameter
    const sentence  = req.query;


    if (!sentence) {
        logger.error('No sentence provided');
        return res.status(400).json({ error: 'No sentence provided' });
    }

    // Initialize the sentiment analyzer with the Natural's PorterStemmer and "English" language
    // Purpose: This class acts as the blueprint for creating objects that can calculate sentiment scores (positive, negative, or neutral) for given sets of words.
    const Analyzer = natural.SentimentAnalyzer; // Action: Extracts the SentimentAnalyzer class constructor from the 'natural' library.

    // Action: References the PorterStemmer module from the library.
    // Purpose: Text normalization. A stemmer reduces words to their base or root form
    //         (e.g., "running", "runs", and "ran" are reduced to "run"). This ensures 
    //          the analyzer can match different variations of a word to its single database entry.
    const stemmer = natural.PorterStemmer;

    // Action: Instantiates a new instance of the sentiment analyzer by passing three configuration arguments to the constructor:
    /**
     * "English": Specifies the target language for the analysis.
     * stemmer: Passes the Porter Stemmer to handle word normalization during processing.
     * "afinn": Specifies the sentiment vocabulary / lexicon to use. AFRINN is a list of English words rated with an integer between
     *          -5 and +5. 
     * */
    const analyzer = new Analyzer("English", stemmer, "afinn");

    // Perform sentiment analysis
    try {
        const analysisResult = analyzer.getSentiment(sentence.split(' '));

        let sentiment = "neutral";

        // Task 5: set sentiment to negative or positive based on score rules
        if (analysisResult < 0 && analysisResult >= -5) {
            sentiment = "negative";
        } else if (analysisResult > 0 && analysisResult <= 5) {
            sentiment = "positive";
        }

        // Logging the result
        logger.info(`Sentiment analysis result: ${analysisResult}`);

        // Task 6: send a status code of 200 with both sentiment score and the sentiment txt in the format { sentimentScore: analysisResult, sentiment: sentiment }
        res.status(200).json({ sentimentScore: analysisResult, sentiment: sentiment });
    } catch (error) {
        logger.error(`Error performing sentiment analysis: ${error}`);
        // Task 7: if there is an error, return a HTTP code of 500 and the json {'message': 'Error performing sentiment analysis'}
        res.status(500).json({ message: 'Error performing sentiment analysis' });
    }
});

app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});
