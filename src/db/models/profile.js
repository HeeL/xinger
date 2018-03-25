const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    profileId: {
        type: String,
        uniq: true
    },
    visitsCount: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Profile', profileSchema);
