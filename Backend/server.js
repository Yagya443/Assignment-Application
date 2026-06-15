const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
// app.use("/api/assignment", assignmentRoutes);

const port = process.env.PORT || 3000;

app.listen(port, (req, res) => {
    console.log(`App running on ${port}`);
});

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_DB_URL);

    console.log(`Database connected successfully: ${conn.connection.host}`);
};

connectDB();
