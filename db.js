const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
require('dotenv').config();
let isConnected;
const MONGODB_URI = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds331145.mlab.com:31145/${process.env.MONGO_DATABASE}`;


module.exports = connectToDatabase = () => {
    if (isConnected) {
        console.log('=> using existing database connection');
        return Promise.resolve();
    }
    console.log('=> using new database connection');
    return mongoose.connect(MONGODB_URI)
        .then(db => {
            isConnected = db.connections[0].readyState;
        })
        .catch(error => console.log(error));
}