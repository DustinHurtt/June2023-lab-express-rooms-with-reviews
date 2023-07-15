const Room = require('../models/Room')

const isOwner = (req, res, next) => {

    Room.findById(req.params.roomId)
    .populate('owner')
    .then((foundRoom) => {
        if(foundRoom.owner._id.toString() === req.session.user._id) {
            next()
        } else {
            res.redirect('/rooms')
        }
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })

}

module.exports = isOwner