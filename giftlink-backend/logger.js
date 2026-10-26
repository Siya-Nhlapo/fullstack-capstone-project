/**
 * This code creates a reusable logger module using Pino that changes
 * how it formats and filters logs depending on whether your application
 * is running in development or production.
 * 
 * Pino is a highly efficient, fast Node.js logging library that records 
 * application events (like errors, API requests, or system statuses).
 */

const pino = require('pino');

let logger;

if (process.env.NODE_ENV !== 'production') {
    // In non-production environments, log to the console
    logger = pino({
        /**level: 'debug':
         * Sets the log threshold to a low level. It will capture detailed
         * messages (debug, info, warn, error) which is ideal for troubleshooting. */
        level: 'debug',
        /**transport: { target: "pino-pretty" }:
         * By default, Pino outputs raw JSON text (which is hard for humans 
         * to read.) This setting passes the logs through a tool called
         * pino-pretty to turn them into colorized, cleanly formatted lines
         * in your terminal.
         */
        transport: {
            target: "pino-pretty",
        },
    });
} else {
    // production
    logger = pino();
}

module.exports = logger;
