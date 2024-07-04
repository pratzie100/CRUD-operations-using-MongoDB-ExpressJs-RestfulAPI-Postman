const express = require("express");
const mongoose = require("mongoose");
const records = require("./routes/records");

const app = express();

mongoose.connect("mongodb://localhost/studentRecords")
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => console.error("Could not connect to MongoDB...", err));

app.use(express.json());

app.use("/api/records", records);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port: ${port}...`));
