exports.handleImage = (req, res, knex) => {
    const { id } = req.body;
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
    .catch(err => res.status(400).json("unable to get entries"))
}