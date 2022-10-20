var express = require('express');
var router = express.Router();
const Board = require("../models/Board")
const List = require("../models/List")
const Organization = require("../models/Organization")
const Card = require("../models/Card")
const User = require("../models/User");
const { route } = require('./main');

router.get('/cards', (req, res, next) => {
  let card = new Card()
  card.cardTitle = "card1"
  card.cardLabel = "test card 1"
  card.cardDescription = "Polaroid man braid kombucha twee jean shorts semiotics. Godard poutine poke, same bushwick man bun portland blue bottle hashtag pug gentrify migas DSA. Thundercats mixtape quinoa austin master cleanse, plaid kitsch. Artisan kinfolk fanny pack, selfies VHS roof party pabst paleo vibecession before they sold out crucifix iceland man braid waistcoat unicorn. Big mood hot chicken fashion axe subway tile, gluten-free single-origin coffee palo santo quinoa unicorn stumptown etsy tumblr next level. Photo booth snackwave chicharrones XOXO semiotics humblebrag, gatekeep irony normcore polaroid chia."
  
  card.save((err) => {
    if(err) throw err
  })
  res.end()
})


router.get("/lists", (req,res,next) => {
  let list = new List()
  list.listName = "test project board"
  list.cards = ["633347f5337de223e6e62f2e"]
  list.save((err) => {
    if(err) throw err
  })
  res.end()
})

router.get("/board", (req, res, next) => {
  let board = new Board()
  board.boardName = "test project board"
  board.organization = "6332336e9f943e79ee68170e"
  board.users = []
  board.lists = ["6333485719168bfdc01a75e3"]
  board.save((err) => {
    if(err) throw err
  })
  res.end()
})

router.get('/user', (req, res, next) =>{
  let user = new User()
  user.username = "tester2"
  user.firstname = "Jane"
  user.lastname = "Smart"
  user.email = "jane.smart@email.email"
  user.phone = "2345678901"
  user.avatarUrl = "https://i.etsystatic.com/23032371/r/il/39127b/3163819403/il_794xN.3163819403_6c0h.jpg"
  user.contacts = []
  user.organization = "6332336e9f943e79ee68170e"
  user.password = "password"
  user.save((err) => {
    if(err) throw err
  })
  res.end()
})






module.exports = router;