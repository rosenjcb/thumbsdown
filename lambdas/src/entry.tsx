import { Client } from 'pg';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// PostgreSQL connection details
const dbConfig = {
  host: 'your-db-host',
  database: 'your-db-name',
  user: 'your-db-username',
  password: 'your-db-password',
};

export const lambdaHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  // Extract request parameters
  const { linkedin_id, dislike_count } = JSON.parse(event.body);

  // Create a new PostgreSQL client
  const client = new Client(dbConfig);

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
  } catch (error) {
    return {
      statusCode: 500,
      body: `Error updating row: ${error.message}`,
    };
  } finally {
    // Disconnect from the PostgreSQL database
    await client.end();
  }
};