const mongoose = require('mongoose');
const conn = mongoose.connect('mongodb://localhost:27017/book', { useNewUrlParser: true });
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: [String],
        required: true
    },
    released: {
        type: Date,
        required: true
    },
    isbn: {
        type: String,
        required: true
    },
    cover: {
        type: String,
        required: true
    }
});

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    }
})

userSchema.plugin(passportLocalMongoose);


module.exports = {
    books: mongoose.model('Book', bookSchema),
    users: mongoose.model('User', userSchema)
}