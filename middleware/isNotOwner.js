const isNotOwner = (req, res, next) => {

    if(req.params.ownerId !== req.session.user._id) {
        next()
    } else {
        res.redirect('/rooms')
    }

}

module.exports = isNotOwner