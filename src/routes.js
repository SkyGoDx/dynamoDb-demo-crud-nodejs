const { PutItemCommand, ListTablesCommand, ScanCommand, UpdateItemCommand, DeleteItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { pool } = require("./database");
const crypto = require("crypto");
const router = require("express").Router();

router.get("/users", async (req, res) => {
    try {
        const params = {
            TableName: "users_crud"
        };
        const cmd = new ScanCommand(params);
        const data = await pool.send(cmd);
        return res.json(data.Items)
    } catch(e) {
        return res.status(500).json({
            status: 0,
            msg: e.message
        });
    }
});

router.get('/s/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const cmd = new GetItemCommand({
        "Key": {
            "id": {
                "N": id
            }
        },
        "TableName": "users_crud"
      });
      const data  = await pool.send(cmd);
      return res.json(data.Item);
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            status: 0,
            msg: e.message ?? e
        })
    }
});

router.post("/add", async (req, res) => {
    const { name, age, class_name } = req.body;
    const uuid = crypto.randomInt(1000); // Generates a random integer between 0 and 999

    const input = {
        Item: {
            id: { N: uuid.toString() }, // Convert uuid to string for DynamoDB
            Name: { S: name },
            Age: { S: age.toString() }, // Convert age to string if necessary
            Class: { S: class_name }
        },
        TableName: "users_crud"
    }
    try {
        const command = new PutItemCommand(input);
        const response = await pool.send(command);
        return res.json({
            status: 1,
            msg: "Data added successfully..."
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            status: 0,
            msg: e.message // Access e.message to get the error message
        });
    }
});

router.put('/update/:id', async(req, res) => {
    const { name, age, class_name } = req.body;

    const input = {
        "ExpressionAttributeNames": {
          "#N": "Name",
          "#A": "Age",
          "#C": "Classs"
        },
        "ExpressionAttributeValues": {
          ":n": {
            "S": name
          },
          ":a": {
            "N": age
          },
          ":c": {
            "S": class_name
          } 
        },
        "Key": {
          "id": {
            "N": req.params.id
          }
        },
        "ReturnValues": "ALL_NEW",
        "TableName": "users_crud",
        "UpdateExpression": "SET #N = :n, #A = :a, #C = :c"
      };
      try {
        const cmd = new UpdateItemCommand(input);
        const data = await pool.send(cmd);
        return res.json({
         status: 1,
         msg: "Data updated successfully..."
        });

      } catch(e) {
        console.log(e)
        return res.status(500).json({
            status: 0,
            msg: e.message ?? e
        })
      }
})

router.delete('/del/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const cmd = new DeleteItemCommand({
            "Key": {
                "id": {
                    "N": id
                }
            },
            "TableName": "users_crud",
        });
        const data = await pool.send(cmd);
        return res.json({
            status: 1,
            msg: "Data deleted sucessfully..."
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            status: 0,
            msg: e.message ?? e
        })
    }
});

module.exports = { apiRouter: router };
