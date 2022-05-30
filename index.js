const express = require('express');
const jwt = require('jsonwebtoken');
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

function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({ message: 'UnAuthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
      if (err) {
        return res.status(403).send({ message: 'Forbidden access' })
      }
      req.decoded = decoded;
      next();
    });
  }


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
        app.post('/review', async(req, res) =>{
            const newReview = req.body;
            const result = await reviewCollection.insertOne(newReview);
            res.send(result);
        });



        // =============== Products =================
        const productCollection = client.db('manufactureDb').collection('product');
        app.get('/product', async(req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });
        app.get('/product/:id', async(req, res) =>{
            const id = req.params.id;
            const query={_id: ObjectId(id)};
            const product = await productCollection.findOne(query);
            res.send(product);
        });
        app.post('/product', async(req, res) =>{
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        });
        app.put('/product/:id', async(req, res) =>{
            const id = req.params.id;
            const newAvailable = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    available: newAvailable.added,
                }
            };
            const result = await productCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })



        // =============== Users =================
        const userCollection = client.db('manufactureDb').collection('user');
        app.get('/user', async(req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        });
        app.get('/user/:email', async(req, res) =>{
            const email = req.params.email;
            const query={email: email};
            const user = await userCollection.findOne(query);
            res.send(user);
        });
        app.post('/user', async(req, res) =>{
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        });
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
              $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.send({ result, token });
          })

        // =============== Orders =================
        const orderCollection = client.db('manufactureDb').collection('order');
        app.get('/order', async(req, res) => {
            const query = {};
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        });
        app.get('/order/:email', async(req, res) =>{
            const email = req.params.email;
            const query={useremail: email};
            const order = await orderCollection.find(query).toArray();
            res.send(order);
        });
        app.get('/order/:email/:id', async(req, res) =>{
            const email = req.params.email;
            const id = req.params.id;
            const query={useremail: email, _id: ObjectId(id)};
            const order = await orderCollection.find(query).toArray();
            res.send(order);
        });
        app.get('/order/:id', async(req, res) =>{
            const id = req.params.id;
            const query={_id: ObjectId(id)};
            const order = await orderCollection.find(query).toArray();
            res.send(order);
        });

        app.put('/order/:email/:id', async(req, res) =>{
            const email = req.params.email;
            const id = req.params.id;
            const updated = req.body;
            const filter = {useremail: email, _id: ObjectId(id)};
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    order: updated,
                }
            };
            const result = await productCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        app.post('/order', async(req, res) =>{
            const newOrder = req.body;
            const result = await orderCollection.insertOne(newOrder);
            res.send(result);
        });

        app.delete('/order/:email/:id', async(req, res) =>{
            const email = req.params.email;
            const id = req.params.id;
            const query={useremail: email, _id: ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            res.send(result);
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