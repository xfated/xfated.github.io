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
    const image = document.getElementById('img');
    const pred = model.predict(image).dataSync();
    console.log(pred);

}
start()

/**
 * @description preprocess the image to size (224, 224) for our model
 */
function preprocess(img){
    return tf.to
}

/**
 * @description make a prediction on the given image
 */
function prediction(){
    
    const image = document.getElementById('img');
    const pred = model.predict(preprocess(image)).dataSync();
    console.log(pred);

}