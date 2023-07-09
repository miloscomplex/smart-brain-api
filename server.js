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

let k = knex.select('*').from('users').then(data => {
    console.log(data);
});


const database = {
    users: [
        {
            id: '123',
            name: 'John', 
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally', 
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '',
            hash: '',
            email: ''
        }
    ]
}

app.get('/', (req, res) => {
    res.json(database.users);
})

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password)

        // bcrypt.compare(database.users[0].password, hash, function(err, res) {
        //     // res === true
        //     console.log(res);
        // });
        {
            res.json(database.users[0]); 
        } else {
            res.status(400).json('error logging in');
    }
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    // let salt = bcrypt.genSaltSync(10);
    // let hash = bcrypt.hashSync(password, salt);
    let hash = bcrypt.hashSync(password, 8);
    //console.log("hash=",hash);
    //console.log(email, name, password);
    knex('users')
        .returning('*')
        .insert({
        email: email,
        name: name,
        joined: new Date()
    }).then(user => {
        res.json(user[0])
    })
    .catch(err => {
        console.log("an error occured", err);
        res.status(400).json("something happened");
    })
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    knex.select('*').from('users').where({id})
    .then(user => {
        console.log(user)
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