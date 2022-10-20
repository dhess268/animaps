const e = require("express");
var express = require("express");
var router = express.Router();
const { validateNewUser, validateUpdateUser } = require("../util/validateData");
const passport = require("passport");
const passportService = require("../authentication/passport");
const requireAuth = passport.authenticate("jwt", { session: false });

const User = require("../models/User");

/* GET all users listing. */
router.get("/", requireAuth, function (req, res, next) {
  User.find().exec((err, users) => {
    if (err) {
      res.status(400).send(err);
      return next(err);
    } else {
      res.status(200).send(users).end();
    }
  });
});

/* GET user by id */
router.get("/:userId", requireAuth, function (req, res, next) {
  const id = req.params.userId;
  User.findById(id)
    .populate("organization")
    .exec((err, user) => {
      if (err) {
        res.status(400).send(err);
        return next(err);
      } else {
        res.status(200).send(user).end();
      }
    });
});

/* POST add new user */
router.post("/", function (req, res, next) {
  if (validateNewUser(req)) {
    const {
      username,
      firstname,
      lastname,
      email,
      avatarUrl,
      password,
    } = req.body;
    const newUser = new User({
      username,
      firstname,
      lastname,
      email,
      avatarUrl,
      password,
    }).save((err) => {
      if (err) return next(err);
      res.status(204).json(newUser);
      res.end();
    });
  } else {
    res
      .status(401)
      .send(
        "username, firstname, lastname, email and password are required fields and cannot be empty"
      );
  }
});

/* DELETE remove user by id */
router.delete("/:userId", requireAuth, function (req, res, next) {
  const id = req.params.userId;
  User.findByIdAndDelete(id).exec((err) => {
    if (err) {
      res.status(400).send(err);
      return next(err);
    } else {
      res
        .send("User has been successfully removed from the database")
        .status(204)
        .end();
    }
  });
});

// Edit user by id
router.put("/:userId", requireAuth, async function (req, res, next) {
  if (validateUpdateUser(req)) {
    const userId = req.params.userId;
    const {
      username,
      firstname,
      lastname,
      email,
      phone,
      avatarUrl,
      contacts,
      organization,
      password,
    } = req.body;
    const update = {
      username: username,
      firstname: firstname,
      lastname: lastname,
      email: email,
      phone: phone,
      avatarUrl: avatarUrl,
      contacts: contacts,
      organization: organization,
      password: password,
    };
    const filter = { _id: userId };
    const updateUser = await User.findOneAndUpdate(
      filter,
      update,
      { new: true },
      function (err, response) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.send(response);
          res.status(200);
        }
      }
    );
  } else {
    res
      .status(401)
      .send(
        "username, firstname, lastname, email and password are required fields and cannot be empty"
      );
  }
});

module.exports = router;
