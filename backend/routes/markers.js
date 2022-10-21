const e = require("express");
var express = require("express");
var router = express.Router();
const passport = require("passport");
const passportService = require("../authentication/passport");
const requireAuth = passport.authenticate("jwt", { session: false });
moment = require('moment')
const Marker = require("../models/Marker");

/* GET all marker data. */
router.get("/", requireAuth, function (req, res, next) {
  Marker.find().exec((err, markers) => {
    if (err) {
      res.status(400).send(err);
      return next(err);
    } else {
      res.status(200).send(markers).end();
    }
  });
});



/* POST add new marker */
router.post("/", function (req, res, next) {
  // needs backend verification of user data! (later lol)
  const newTimestamp = moment().format('MMMM Do YYYY, h:mm:ss a');
  const {
    lat,
    lng,
    species,
    description
  } = req.body;


  const newMarker = new Marker({
    lat,
    lng,
    species,
    description,
    time: newTimestamp
  })

  newMarker.save((err) => {
    if (err) return next(err);
    res.status(200).send(newMarker);
  });
} 
);

module.exports = router;