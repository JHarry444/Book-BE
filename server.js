const express = require('express');
const app = express();
const cors = require('cors');
const passport = require('./auth');
const books = require('./routes/books');
const users = require('./routes/users');

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(cors());

app.use(passport.initialize());
app.use(passport.session());
// app.use(passport.authenticate('local'));
app.use(express.json());

app.use('/books', books);

app.use('/users', users);

app.listen(9000);