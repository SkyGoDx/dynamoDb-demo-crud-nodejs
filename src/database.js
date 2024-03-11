const { DynamoDBClient }  = require("@aws-sdk/client-dynamodb");
const config = require("./config")

module.exports = {
    pool: new DynamoDBClient(config)
}