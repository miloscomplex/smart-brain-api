const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());
const register = require('./controllers/Register');
const root = require('./controllers/Root');
const signin = require('./controllers/Signin');
const profile = require('./controllers/Profile');
const image = require('./controllers/Image');

console.log(register.handleRegister);
const knex = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'michaelsutton',
      password : '',
      database : 'smart-brain'
    }
});

// let k = knex.select('*').from('users').then(data => {
//     console.log(data);
// });

app.get('/', (req, res) => { root.handleRoot(req, res, knex) })

app.post('/signin', (req, res) => { signin.handleSignin(req, res, knex, bcrypt) })

app.post('/register', (req, res) => { register.handleRegister(req, res, knex, bcrypt) })

app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res) })

app.put('/image', (req, res) => { image.handleImage(req, res, knex) })

app.listen(3000, () => {
    console.log('app is running on port 3000');
})

/* scematic 
/ --> res = this is working
/signin --> POST = success/fail 
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user(?)
*/