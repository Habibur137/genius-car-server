const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0rhho.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const serviceCollection = client.db("geniusCar").collection("services");
    const ordersCollection = client.db("geniusCar").collection("orders");
    console.log("connect");

    // Auth
    // app.post("/login", async (req, res) => {
    //   const user = req.body;
    //   const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
    //     expiresIn: "1d",
    //   });
    //   res.send(token);
    // });

    //Service Api implementation
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.send(result);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await serviceCollection.findOne(query);
      res.send(result);
    });

    app.get("/orders", async (req, res) => {
      const { email } = req.query;
      const query = { email: email };
      const cursor = ordersCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // order post
    app.post("/orders", async (req, res) => {
      const orders = req.body;
      const result = await ordersCollection.insertOne(orders);
      res.send(result);
    });

    // app.put("/services/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const service = req.body;
    //   const filter = { _id: ObjectId(id) };
    //   const options = { upsert: true };
    //   const updateDoc = {
    //     $set: {
    //       ...service,
    //     },
    //   };
    //   const result = await serviceCollection.updateOne(
    //     filter,
    //     updateDoc,
    //     options
    //   );
    //   res.send(result);
    // });
  } finally {
  }
}
run().catch(console.dir);
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
