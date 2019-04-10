const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const _ = require('lodash');

exports.signup = async (req, res, next) => {
  try {
    const getUser = await User.findOne({ email: req.body.email });
    if (getUser) {
      res.status(422).send('This user is already exists');
    } else {
      const email = req.body.email;
      const name = req.body.name;
      const password = req.body.password;
      const isAdmin = 0;
      const hashedPw = await bcrypt.hash(password, 12);

      const user = new User({
        email: email,
        name: name,
        isAdmin: isAdmin,
        password: hashedPw,
      });

      await user.save();

      const token = user.generateAuthToken();
      // const data = res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
      // const data = res.header('x-auth-token', token)
      res.status(200).send({ token });
    }
  } catch (ex) {
    if (!ex.statusCode) {
      ex.statusCode = 500;
      const error = new Error('Cannot create this user');
      throw error;
    }
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send('Invalid email or password.');
    }

    const isSame = await bcrypt.compare(password, user.password);

    if (!isSame) {
      return res.status(404).send('Wrong password');
    }
    const token = user.generateAuthToken();

    res.send(token);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
  }
};
