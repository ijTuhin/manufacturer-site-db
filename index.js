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
        const itemCollection = client.db('wareHouse').collection('item');
        app.get('/item', async(req, res) => {
            const query = {};
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        });

        /* app.get('/item/:id', async(req, res) =>{
            const id = req.params.id;
            const query={_id: ObjectId(id)};
            const item = await itemCollection.findOne(query);
            res.send(item);
        });

        // POST
        app.post('/item', async(req, res) =>{
            const newItem = req.body;
            const result = await itemCollection.insertOne(newItem);
            res.send(result);
        });


        // update user
        app.put('/item/:id', async(req, res) =>{
            const id = req.params.id;
            const updatedItem = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: updatedItem.quantity,
                    sold: updatedItem.sold,
                }
            };
            const result = await itemCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        app.put('/item/:id', async(req, res) =>{
            const id = req.params.id;
            const restockItem = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: restockItem.quantity,
                    
                }
            };
            const result = await itemCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        // DELETE
        app.delete('/item/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await itemCollection.deleteOne(query);
            res.send(result);
        }); */
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