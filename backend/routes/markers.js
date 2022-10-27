const e = require("express");
var express = require("express");
var router = express.Router();
const passport = require("passport");
const {cloudinary} = require('../util/cloudinary')
const passportService = require("../authentication/passport");
const requireAuth = passport.authenticate("jwt", { session: false });
moment = require('moment')
const Marker = require("../models/Marker");

var fs = require("fs"); // Load the filesystem module

/* GET all marker data. */
router.get("/", function (req, res, next) {
  Marker.find().exec((err, markers) => {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.status(200).send(markers).end();
    }
  });
});



/* POST add new marker */
router.post("/", async function (req, res, next) {
  // needs backend verification of user data! (later lol)

try {
  const newTimestamp = moment().format('MMMM Do YYYY, h:mm:ss a');
  const {
    lat,
    lng,
    species,
    description,
    image,
    addressString
  } = req.body;

  // gets the image's size in bytes
  const buff = new Buffer.from(image, 'base64').length
  const BYTES_PER_MB = 1024 ** 2;


  // cloudinary only can take images up to 10mb, so reject any images over that
  if(buff > BYTES_PER_MB){
    return res.status(413).send("That file is too large! Keep files under 10MB please")
  }

  const result = await cloudinary.uploader.upload(image, {
    folder: 'sightings',
    width: 300,
    crop: "scale"
  })

  const newMarker = new Marker({
    lat,
    lng,
    species,
    description,
    time: newTimestamp,
    image: {
      public_id: result.public_id,
      url: result.secure_url
    },
    addressString
  })

  newMarker.save((err) => {
    if (err) return next(err);
    res.status(200).send(newMarker);
  });
} catch (error) {
  console.log(error)
  next(error)
}
  


} 
);

module.exports = router;