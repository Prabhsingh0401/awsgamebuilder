import AWS from 'aws-sdk';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors()); // Allow requests from your React app

// Configure AWS
AWS.config.update({
  region: 'Region', // Change to your DynamoDB region
  accessKeyId: 'AccessKey', // Replace with your access key
  secretAccessKey: 'SecretKey', // Replace with your secret key
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Users'; // Replace with your table name

// Endpoint to add user data
app.post('/register', async (req, res) => {
  const { name, age, email } = req.body;

  if (!name || !age || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const params = {
    TableName: TABLE_NAME,
    Item: {
      email, // Partition key
      name,
      age,
    },
  };

  try {
    await dynamoDb.put(params).promise();
    res.status(200).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error saving to DynamoDB', error);
    res.status(500).json({ error: 'Could not register user' });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
