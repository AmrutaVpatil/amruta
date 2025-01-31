const express = require('express');
const mongodb = require('mongodb');

const app = express();
const MongoClient = mongodb.MongoClient;

const dbUrl = 'mongodb+srv://demoproject:demoproject@cluster0.pj2bg.mongodb.net/'
const dbName = 'amity';

app.use(express.json());

let client;

// Inialize mongoDB connection Once
async function connectDB() {
    if(!client) {
        client = await MongoClient.connect(dbUrl);
        console.log('Connected to mongodb')
    }
    return client.db(dbName);
}

// Get All Users
app.get('/', async(req, res)=>{
    try{
        const db = await connectDB();
        const users = await db.collection('userDetails').find().toArray();
        res.json({message: 'Displaying all records', users});
    } 
    catch(error)
    {
        console.error(error);
        res.status(500).json({message: 'Internal Server Error'});
    }
});

// Insert New Record
app.post('/', async(req, res)=>{
    try{
        const db = await connectDB();
        const result = await db.collection('userDetails').insertOne(req.body);
        res.json({message: 'Record Inserted', insertedId: result.insertedId});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: 'Internal Server Error'});
    }
});

// Fetch User by ID
app.get('/fetch/:id', async(req, res)=>{
    try {
        const db = await connectDB();
        const id = parseInt(req.params.id);
        const user = await db.collection('userDetails').findOne({ id });

        if(user)
            {
            res.json({ message: 'Record Found', user });
        }else{
            res.status(404).json({ message: 'Record Not Found' });
        }
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update User by Name
app.put('/update/:name', async(req, res)=>{
    try{
        const db = await connectDB();
        const name = req.params.name;
        const updatedData = { $set: req.body };
        const result = await db.collection('userDetails').updateOne({ name }, updatedData);

        if(result.modifiedCount > 0) {
            res.json({ message: 'Record Updated' });
        } else {
            res.status(404).json({ message: 'Record Not Found or No Change Made' });
        }
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete User by Name
app.delete('/delete/:name', async(req, res)=>{
    try {
        const db = await connectDB();
        const name = req.params.name;
        const result = await db.collection('userDetails').deleteOne({ name });

        if (result.deletedCount > 0) {
            res.json({ message: 'Record Deleted' });
        } else {
            res.status(404).json({ message: 'Record Not Found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.listen(8000, () => console.log('Server is running on port 8000'));