const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());

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

app.get('/', (req, res) => {
    knex.select('*').from('users')
    .then(users => {
        if (users.length) {
            res.json(users)
        } else {
            res.status(400).json('users not found!')
        }
    })
    .catch(err => res.status(400).json("error getting users"))
})

app.post('/signin', (req, res) => {
    knex.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if (isValid) {
            return knex.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
        } else {
            res.status(400).json('wrong credentials')
        }
    })
    .catch(err => res.status(400).json("wrong credentials"))
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    let hash = bcrypt.hashSync(password, 8);
    knex.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
            })
            .then(user => {
                res.json(user[0])
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => {
        console.log("an error occured", err);
        res.status(400).json("unable to register");
    })
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    knex.select('*').from('users').where({id})
    .then(user => {
        if (user.length) {
            res.json(user[0])
        } else {
            res.status(400).json('user not found!')
        }
    })
    .catch(err => res.status(400).json("error getting user"))
})

app.put('/image', (req, res) => {
    const { idd } = req.body;
    knex('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        if (entries[0]) {
            res.json(entries[0].entries)
        } else {
            res.status(400).json('entries not found')
        }
    })
    .catch(err => res.status(400).json("unable tp get entries"))
})

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