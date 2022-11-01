const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
exports.putItemHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    const body = JSON.parse(event.body);
    const id = body.id;
    const name = body.name;
    const rating = body.rating;
    const address = body.address;

    let response = {};

    try {
        const params = {
            TableName : process.env.TABLE_NAME,
            Item: { id : id, name: name, rating: rating, address: address }
        };
    
        const result = await docClient.put(params).promise();
    
        response = {
            statusCode: 200,
            body: JSON.stringify(body)
        };
    } catch (ResourceNotFoundException) {
        response = {
            statusCode: 404,
            body: "Unable to call DynamoDB. Table resource not found."
        };
    }

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
