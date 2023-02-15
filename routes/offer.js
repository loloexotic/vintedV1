const express = require("express");
const router = express.Router();

const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

const User = require("../models/Sign_up");
const Offer = require("../models/Offer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUIDNARY_API_KEY,
  api_secret: process.env.CLOUIDNARY_API_SECRET,
  secure: true,
});

const isAuthenticated = require("../middleware/isAuthenticated");
const { default: mongoose } = require("mongoose");

const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

router.post(
  "/offer/publish",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    try {
      const picture = req.files.picture;
      const result = await cloudinary.uploader.upload(convertToBase64(picture));
      const { title, description, price, condition, city, brand, size, color } =
        req.body;
      console.log(result);
      const newOffer = new Offer({
        product_name: title,
        product_description: description,
        product_price: price,

        product_details: [
          {
            MARQUE: brand,
          },
          { TAILLE: size },
          { ETAT: condition },
          { COULEUR: color },
          { EMPLACEMENT: city },
        ],
        product_image: result,
        owner: req.user,
      });
      console.log(req.body);

      await newOffer.save();
      res.json(newOffer);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

router.get("/offers", async (req, res) => {
  try {
    //const { title, priceMin, priceMax, sort, page } = req.query;
    const results = await Offer.find({
      product_name: regExp,
      product_price: { $gte: 10, $lte: 200 },
    })
      .sort({ product_price: -1 })
      .skip(1)
      .limit(5)
      .select("product_name product_price");
    res.json(results);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/update", isAuthenticated, fileUpload(), async (req, res) => {
  const { title, description, price, condition, city, brand, size, color } =
    req.body;
  const publishToModify = await Offer.findOneAndUpdate(req.body, { new: true });

  await publishToModify.save();
  res.json({ message: "Your offer has been modified" });
});

router.delete("/delete", isAuthenticated, fileUpload(), async (req, res) => {
  // il faut que je cherche l'annonce "Offer" à modifier et que je la supprime
  const offerToDelete = await Offer.findOneAndDelete(req.body);

  res.json({ message: "Your offer has been deleted" });
});

router.get("/offer/:id", async (req, res) => {
  try {
    console.log(req.params);
    const offer = await Offer.findById(req.params.id).populate(
      "owner",
      "account"
    );
    res.json(offer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
