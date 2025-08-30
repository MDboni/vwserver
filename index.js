const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()

app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.lum0bq6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const myDB = client.db("MYCoffee").collection("coffee");

app.get('/coffee',async(req,res)=>{
    const find = myDB.find()
    const result = await find.toArray()
    res.send(result)
})

app.get('/coffee/:id',async(req,res)=>{
    const id = req.params.id
    const query = {_id: new ObjectId(id)}
    const result = await myDB.findOne(query)
    res.send(result)
})

app.post('/coffee', async(req,res)=>{
    const newcoffee = req.body ;
    console.log(newcoffee);
    const result = await myDB.insertOne(newcoffee)
    res.send(result)
  
})

// ✅ Update Coffee
app.put('/coffee/:id', async (req, res) => {
    const updateId = req.params.id
    const updatedCoffee = req.body
    const filter = { _id: new ObjectId(updateId) }

    const updateDoc = {
        $set: {
            name: updatedCoffee.name,
            chef: updatedCoffee.chef,
            supplier: updatedCoffee.supplier,
            taste: updatedCoffee.taste,
            category: updatedCoffee.category,
            details: updatedCoffee.details,
            photo: updatedCoffee.photo
        }
    }

    const result = await myDB.updateOne(filter, updateDoc)
    res.send(result)
})


app.delete('/coffee/:id',async(req,res)=>{
    const deleteid = req.params.id
    const query = {_id: new ObjectId(deleteid)}
    const result = await myDB.deleteOne(query)
    res.send(result)
})



async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB Atlas!");
  } catch (err) {
    console.error("❌ Connection error:", err);
  }
}
run();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
