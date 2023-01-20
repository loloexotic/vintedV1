const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

require("dotenv").config();

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URI);

const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

const userRoutes = require("./routes/sign_up");
const offerRoutes = require("./routes/offer");

app.use(userRoutes);
app.use(offerRoutes);

app.get("/", (req, res) => {
  res.status.json({ message: "Bienvenue dans mon serveur" });
});
app.all("*", (req, res) => {
  res.status(404).json({ message: "This route doesn't exist" });
});

app.listen(process.env.PORT, () => {
  console.log("Server has started");
});
