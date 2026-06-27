const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

require("dotenv").config();
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.MONGO_DB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const database = client.db("expense-tracker");
    const expenseCollection = database.collection("expenses");

    // expenses get method
    app.get("/api/expenses", async (req, res) => {
      const cursor = expenseCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // expenses post method
    app.post("/api/expenses", async (req, res) => {
      const expenseData = req.body;
      const updateExpenseData = { ...expenseData, createAt: new Date() };

      const result = await expenseCollection.insertOne(updateExpenseData);
      res.send(result);
    });

    // expense patch method
    app.patch("/api/expenses/:id", async (req, res) => {
      const { id } = req.params;

      const updateData = req.body;
      const newUpdateData = {
        ...updateData,
        updateAt: new Date(),
      };
      console.log(id, "from backend");

      const filter = { _id: new ObjectId(id) };

      const update = { $set: { ...newUpdateData } };

      const result = await expenseCollection.updateOne(filter, update);
      res.send(result);
    });

    // expense delete
    app.delete("/api/expenses/:id", async (req, res) => {
      const { id } = req.params;

      const query = {
        _id: new ObjectId(id),
      };

      const result = await expenseCollection.deleteOne(query);
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!",
    // );
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log(`Expense tracker server is running on port ${port}`);
});
