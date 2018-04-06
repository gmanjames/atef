// Has to be a better way than this
require('dotenv').config({ path: '../.env' });

const mongoose = require('mongoose');

// Connect to database:
//     need to rethink connecion string bussiness.
mongoose.connect(process.env.CONNECTION_STRING).then(
    () => {
        console.log('ok yes?');
    },
    (error) => {
        console.log('boo');
    }
);

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        max: 32
    },
    email: {
        type: String,
        required: true,
        max: 100
    },
    password: {
        type: String,
        required: true,
        max: 100
    },
    date_created: Date

});

const User = mongoose.model('User', userSchema);

const kiriyama = new User({ username: 'kiriyama', email: 'todo@todo.com', password: 'test', date_created: Date.now() });

console.log(kiriyama);
