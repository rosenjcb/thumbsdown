"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lambdaHandler = void 0;
const pg_1 = require("pg");
// PostgreSQL connection details
const dbConfig = {
    host: 'your-db-host',
    database: 'your-db-name',
    user: 'your-db-username',
    password: 'your-db-password',
};
const lambdaHandler = async (event) => {
    // Extract request parameters
    const { linkedin_id, dislike_count } = JSON.parse(event.body);
    // Create a new PostgreSQL client
    const client = new pg_1.Client(dbConfig);
    try {
        // Connect to the PostgreSQL database
        await client.connect();
        // Update the row in the 'dislikes' table
        const updateQuery = `UPDATE dislikes SET dislike_count = ${dislike_count} WHERE linkedin_id = '${linkedin_id}'`;
        await client.query(updateQuery);
        return {
            statusCode: 200,
            body: 'Row updated successfully.',
        };
    }
    catch (error) {
        return {
            statusCode: 500,
            body: `Error updating row: ${error.message}`,
        };
    }
    finally {
        // Disconnect from the PostgreSQL database
        await client.end();
    }
};
exports.lambdaHandler = lambdaHandler;
//# sourceMappingURL=entry.js.map