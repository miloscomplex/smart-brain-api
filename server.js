require('dotenv').config()
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


process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 

console.log(register.handleRegister);
const knex = require('knex')({
    client: 'pg',
    connection: {
      connectionString : process.env.DATABASE_URL,
      ssl: true
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

app.post('/image-detect', (req, res) => { image.faceDetection(req, res) })

const PORT = process.env.PORT || 3000;
// console.log(process.env);

app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
})

/* scematic 
/signin --> POST = success/fail 
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user(?)
*/