const express = require("express");
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");

dotenv.config();

// Connecting to the MongoDB Client
const url = process.env.MONGO_URI;
const client = new MongoClient(url);

client
  .connect()
  .then(() => {
    console.log("Database connected"); //Succes Message
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit the process if the database connection fails
  });

// App & Database
const dbName = process.env.DB_NAME;
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json()); //As the data in sent in the json format
app.use(cors()); //To avoid cors error at frontend

// Get all the passwords
app.get("/", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection("passwords");
    const passwords = await collection.find({}).toArray();
    res.status(200).json(passwords);
  } catch (error) {
    console.error("Error fetching passwords:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Save a password
app.post("/", async (req, res) => {
  try {
    const { password } = req.body; // Assuming you're sending only the password field
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required" });
    }

    const db = client.db(dbName);
    const collection = db.collection("passwords");
    const result = await collection.insertOne({ password });
    res.status(201).json({ success: true, result });
  } catch (error) {
    console.error("Error saving password:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Delete a password by id
app.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });
    }

    const db = client.db(dbName);
    const collection = db.collection("passwords");
    const result = await collection.deleteOne({
      _id: new MongoClient.ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Password not found" });
    }

    res.status(200).json({
      success: true,
      message: "Password deleted successfully",
      result,
    });
  } catch (error) {
    console.error("Error deleting password:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Server listen
app.listen(port, () => {
  console.log(`PassOP server listening on http://localhost:${port}`);
});
