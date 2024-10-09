const express = require("express");
const dotenv = require("dotenv");
const { MongoClient, ObjectId } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");
const errorMsg = require("./errorMsg"); // Importing the error messages

// Encryption and Decryption keys
const ENCRYPTION_KEY = crypto.randomBytes(32);
const IV_LENGTH = 16;

const encrypt = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
};

function decrypt(text) {
  let ivBuffer = Buffer.from(text.iv, "hex");
  let encryptedText = text.encryptedData;

  let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), ivBuffer);
  let decrypted = decipher.update(encryptedText, "hex", "utf-8");
  decrypted += decipher.final("utf-8");

  return decrypted;
}

dotenv.config();

const url = process.env.MONGO_URI;
const client = new MongoClient(url);

client
  .connect()
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.error(errorMsg.databaseConnectionFailed, error); // Using errorMsg for error messages
    process.exit(1);
  });

const dbName = process.env.DB_NAME;
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.get("/", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection("passwords");
    const passwords = await collection.find({}).toArray();
    res.status(200).json(passwords);
  } catch (error) {
    console.error(errorMsg.internalServerError, error);
    res.status(500).json({ success: false, message: errorMsg.internalServerError });
  }
});

app.post("/", async (req, res) => {
  try {
    const { site, username, password } = req.body;
    if (!site || !username || !password) {
      return res.status(400).json({ success: false, message: errorMsg.requiredFields });
    }

    const db = client.db(dbName);
    const collection = db.collection("passwords");
    const encryptedPassword = encrypt(password);
    const result = await collection.insertOne({ site, username, password: encryptedPassword });
    res.status(201).json({ success: true, result });
  } catch (error) {
    console.error(errorMsg.internalServerError, error);
    res.status(500).json({ success: false, message: errorMsg.internalServerError });
  }
});

app.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { site, username, password } = req.body;

    if (!site || !username || !password) {
      return res.status(400).json({ success: false, message: errorMsg.requiredFields });
    }

    const db = client.db(dbName);
    const collection = db.collection("passwords");
    const encryptedPassword = encrypt(password);

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { site, username, password: encryptedPassword } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: errorMsg.passwordNotFound });
    }

    res.status(200).json({ success: true, message: "Password updated successfully", result });
  } catch (error) {
    console.error(errorMsg.internalServerError, error);
    res.status(500).json({ success: false, message: errorMsg.internalServerError });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: errorMsg.idRequired });
    }

    const db = client.db(dbName);
    const collection = db.collection("passwords");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: errorMsg.passwordNotFound });
    }

    res.status(200).json({ success: true, message: "Password deleted successfully", result });
  } catch (error) {
    console.error(errorMsg.internalServerError, error);
    res.status(500).json({ success: false, message: errorMsg.internalServerError });
  }
});

app.listen(port, () => {
  console.log(`PassOP server listening on http://localhost:${port}`);
});
