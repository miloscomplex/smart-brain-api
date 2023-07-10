
exports.handleRegister = (req, res, knex, bcrypt) => {
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
}
