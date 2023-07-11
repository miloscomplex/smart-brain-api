const { PAT_KEY } = process.env;

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

exports.faceDetection = (req, res) => {
    // console.log("faceDetection was called");
    const IMAGE_URL = req.body.imgUrl;
    //console.log("imgurl=", IMAGE_URL);

    const raw = JSON.stringify({
    "user_app_id": {
        "user_id": "clarifai",
        "app_id": "main"
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT_KEY
        },
        body: raw
    };

    // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
    // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // this will default to the latest version_id

    fetch(`https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs`, requestOptions)
        .then(response => response.json())
        .then(data => res.json(data))
        .catch(error => console.log('error', error))

}
