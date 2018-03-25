const mongoose = require('mongoose');
require('dotenv').config();

const mongoDbAdrress = `mongodb://${process.env.DB_SERVER}/${process.env.DB_NAME}`;

module.exports = mongoose.connect(mongoDbAdrress)
    .then(() => {
        console.log('Database connection successful');
    })
    .catch(() => {
        console.error('Database connection error');
    });
