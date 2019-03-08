const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
require('dotenv').config();
const helmet = require('helmet')
const morgan = require('morgan');

const app = express();

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
    flags: 'a'
});



const MONGODB_URI = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds331145.mlab.com:31145/${process.env.MONGO_DATABASE}`;

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// app.use(bodyParser.urlencoded()); // x-www.form-urlencoded <form>

app.use(helmet())
app.use(morgan('combined', {
    stream: accessLogStream
}))

app.use(bodyParser.json()); //  application/json
app.use(multer({
    storage: fileStorage,
    fileFilter: fileFilter
}).single('image'))

// temp serve static images TODO: store images to s3 bucket

app.use('/images', express.static(path.join(__dirname, 'images')))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

// GET /feed/posts
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data: data
    });
});

mongoose
    .connect(MONGODB_URI)
    .then(result => {
        const server = app.listen(process.env.PORT || 3000);
        const io = require('./socket').init(server);
        io.on('connection', socket => {
            // TODO: client must add for realtime chat feature 
            console.log('client connected');
        });
    })
    .catch(error => console.log(error))