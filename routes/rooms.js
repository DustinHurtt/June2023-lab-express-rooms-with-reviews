var express = require('express');
var router = express.Router();

const Room = require('../models/Room');

const isLoggedIn = require('../middleware/isLoggedIn');
const isOwner = require('../middleware/isOwner')

/* GET home page. */
router.get('/', (req, res, next) => {

    Room.find()
    .populate('owner')
    .then((foundRooms) => {       
        res.render('rooms/all-rooms.hbs', { rooms: foundRooms })
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
 
});

router.get('/create', isLoggedIn, (req, res, next) => {
    res.render('rooms/create-room.hbs')
})

router.post('/create', isLoggedIn, (req, res, next) => {

    const { name, description, imageUrl } = req.body

    Room.create({
        name,
        description,
        imageUrl,
        owner: req.session.user._id
    })
    .then((createdRoom) => {
        console.log("Created Room:", createdRoom)
        res.redirect('/rooms')
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})

router.get('/details/:roomId', (req, res, next) => {

    Room.findById(req.params.roomId)
    .populate('owner')
    .populate({
        path: 'reviews', 
        populate: {path: 'user'}
    })
    .then((foundRoom) => {
        console.log("Found Room", foundRoom)
        res.render('rooms/room-details.hbs', foundRoom)
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})

router.get('/edit/:roomId', isLoggedIn, isOwner, (req, res, next) => {

    Room.findById(req.params.roomId)
    .populate('owner')
    .then((foundRoom) => {
        console.log("Found Room", foundRoom)
        res.render('rooms/edit-room.hbs', foundRoom)
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})

router.post('/edit/:roomId', isLoggedIn, isOwner, (req, res, next) => {

    const { name, description, imageUrl } = req.body

    Room.findByIdAndUpdate(
        req.params.roomId,
        {
            name,
            description,
            imageUrl
        },
        {new: true}
    )
    .then((updatedRoom) => {
        res.redirect(`/rooms/details/${updatedRoom._id}`)
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})

router.get('/delete/:roomId', isLoggedIn, isOwner, (req, res, next) => {
    
    Room.findByIdAndDelete(req.params.roomId)
    .then((deletedRoom) => {
        console.log("Deleted room:", deletedRoom)
        res.redirect('/rooms')
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

})

module.exports = router;