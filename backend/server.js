import AWS from 'aws-sdk';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// Configure AWS
AWS.config.update({
  region: '',
  accessKeyId: '',
  secretAccessKey: '',
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Users';

// Register or fetch user
app.post('/register', async (req, res) => {
  const { name, age, email } = req.body;

  if (!name || !age || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if user exists
    const existingUser = await dynamoDb
      .get({
        TableName: TABLE_NAME,
        Key: { email },
      })
      .promise();

    let points = existingUser.Item?.points || 0;

    if (existingUser.Item) {
      return res.status(200).json({
        message: 'User already registered',
        user: { name: existingUser.Item.name, age: existingUser.Item.age, email, points },
      });
    }

    // Create a new user
    const params = {
      TableName: TABLE_NAME,
      Item: {
        email,
        name,
        age,
        points: 0, // Start with 0 points
      },
    };

    await dynamoDb.put(params).promise();
    res.status(200).json({
      message: 'User registered successfully!',
      user: { name, age, email, points },
    });
  } catch (error) {
    console.error('Error interacting with DynamoDB:', error);
    res.status(500).json({ error: 'Could not register user' });
  }
});

// Update points for a user
app.put('/update-points', async (req, res) => {
  const { email, points } = req.body;

  if (!email || points === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const params = {
      TableName: TABLE_NAME,
      Key: { email },
      UpdateExpression: 'set points = :points',
      ExpressionAttributeValues: {
        ':points': points,
      },
      ReturnValues: 'UPDATED_NEW',
    };

    const result = await dynamoDb.update(params).promise();
    res.status(200).json({
      message: 'Points updated successfully!',
      updatedPoints: result.Attributes.points,
    });
  } catch (error) {
    console.error('Error updating points:', error);
    res.status(500).json({ error: 'Could not update points' });
  }
});

// Get leaderboard - Fetch all users and sort by points
app.get('/leaderboard', async (req, res) => {
  try {
    const params = {
      TableName: TABLE_NAME,
    };

    const result = await dynamoDb.scan(params).promise();
    const leaderboard = result.Items.sort((a, b) => b.points - a.points); // Sort by points in descending order

    res.status(200).json({
      message: 'Leaderboard fetched successfully!',
      leaderboard,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Could not fetch leaderboard' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
