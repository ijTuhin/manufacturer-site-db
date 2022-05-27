const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
console.log(process.env);
//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.12dph.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();

        // =============== Reviews =================
        const reviewCollection = client.db('manufactureDb').collection('review');
        app.get('/review', async(req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

    }
    finally {

    }
};
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Server side!')
})

app.listen(port, () => {
    console.log(`Server Running on port ${port}`)
})