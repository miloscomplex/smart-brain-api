
exports.handleRoot = (req, res, knex) => {
    knex.select('*').from('users')
    .then(users => {
        if (users.length) {
            res.json(users)
        } else {
            res.status(400).json('users not found!')
        }
    })
    .catch(err => res.status(400).json("error getting users"))
}