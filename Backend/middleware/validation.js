const mongoose = require('mongoose');

const validateMovieId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid movie ID format' });
    }
    next();
};

    module.exports = {
    validateMovieId
};