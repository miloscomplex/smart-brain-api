import { PAT_KEY } from "./KEY";

const FaceDetection = (imgUrl) => {
    console.log("faceDetection was called");
    const IMAGE_URL = imgUrl;

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
        .then(result => calculateFaceLocation(result.outputs[0].data.regions[0].region_info.bounding_box))
        .catch(error => console.log('error', error));

    const calculateFaceLocation = (data) => {
        const image = document.getElementById('input-image');
        const width = Number(image.width);
        const height = Number(image.height);
        console.log(width, height);

        return this.setState({box: {
            leftCol: data.left_col * width,
            topRow: data.top_row * height,
            rightCol: width - (data.right_col * width),
            botomRow: height - (data.bottom_row * height)
        }});
    }

    const displayFaceBox = (box) => {
        //const boundingBox = document.querySelector('.bounding-box');
        //boundingBox.computedStyleMap.backgroundColor = "yellow";
    }
}

export default FaceDetection;
