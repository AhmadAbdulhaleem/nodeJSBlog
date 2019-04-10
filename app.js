const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('config');

const app = express();

if (!config.get('jwtPrivateKey')) {
  console.log('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);
}

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === 'image/png' ||
//     file.mimetype === 'image/jpg' ||
//     file.mimetype === 'image/jpeg'
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

// Should i create two Repos ??

app.use(bodyParser.json());

app.use(multer({ storage: fileStorage }).single('image'));

app.use('/images', express.static(path.join(__dirname, 'images')));

/// Load Routes
const postRoute = require('./routes/post');
const userRoute = require('./routes/user');

app.use(cors());

// To solve CORS problem

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });

app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);

mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true });

const connection = mongoose.connection;

connection.on('connected', () => {
  app.listen('3005');
  console.log('Connected to db');
});
