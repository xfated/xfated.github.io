/* Variables */
let model;



/**
 * @description load the model
 */
async function start(){
    
    //load model
    model = await tf.loadLayersModel('model/model.json');
    console.log('Successfully loaded model');

    //test model
    console.log('Image shape is:');
    const image = document.getElementById('img');
    const pred = model.predict(preprocess(image));
    console.log(pred);

}

start()

/**
 * @description preprocess the image to size (224, 224) for our model
 */
function preprocess(imgData){
    return tf.tidy(() => {
        //convert to a tensor
        let tensor = tf.browser.fromPixels(imgData, numChannels = 1);

        //resize
        const resized = tf.image.resizeBilinear(tensor, [224,224]).toFloat();

        //add a dimension to get a batch shape
        const batched = resized.expandDims(0);

        return batched
    })
}

/**
 * @description make a prediction on the given image
 */
function prediction(){
    
    const image = document.getElementById('img');
    const pred = model.predict(preprocess(image)).dataSync();
    console.log(pred);

}