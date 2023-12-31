const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zjauaf8.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        const userCollection = client.db('TaskManagement').collection('users');
        const userCollectionTask = client.db('TaskManagement').collection('tasks');


        // user related api 

        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email }
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'user already exists', insertedId: null })
            }
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        // get user data 

        app.get("/users", async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        });
        
        // added tasek 

        app.post("/tasks", async (req, res) => {
            const user = req.body;
            //   console.log(user);
            const result = await userCollectionTask.insertOne(user);
            console.log(result);
            res.send(result);
        });

        // get task 

        app.get("/tasks", async (req, res) => {
            const result = await userCollectionTask.find().toArray();
            res.send(result);
        });

        // delete task 
     

          app.delete("/tasks/:id", async (req, res) => {
            const id = req.params.id;
            console.log("delete", id);
            const query = {
              _id: new ObjectId(id),
            };
            const result = await userCollectionTask.deleteOne(query);
            console.log(result);
            res.send(result);
          });






        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('port is running')
})

app.listen(port, () => {
    console.log(`Port is running ${port}`);
})