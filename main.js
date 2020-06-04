/* Variables */
let model;
let class_names = [];
const webcamElement = document.getElementById('webcam');

/**
 * @description load the model
 */
async function start(){
    
    //load model
    model = await tf.loadLayersModel('model/model.json');
    console.log('Successfully loaded model');

    //load dict
    await loadDict();
    console.log('Successfully loaded class names');

    // Create an object from Tensorflow.js data API which could capture image 
    // from the web camera as Tensor.
    const webcam = await tf.data.webcam(webcamElement);
    while (true) {
        document.getElementById('console').innerText = 'hi';
        const image = await webcam.capture();
        const pred = model.predict(image).dataSync();

        console.log('predicted:');
        let prediction_index = findMaxIndices(pred, 1);
        let equipment = class_names[prediction_index[0]];
        /*document.getElementById('console').innerText = `
            prediction: ${equiment}\n
            probability: ${pred[prediction_index]}`; 
        */
        image.dispose();

        await tf.nextFrame();
    }
    console.log('Trying with preprocessing:');
    const image = document.getElementById('img');
    const pred = model.predict(preprocess(image)).dataSync();
    console.log('predicted:');
    let prediction_index = findMaxIndices(pred, 1);
    console.log(class_names[prediction_index[0]]);

}

start()

/**
 * @description preprocess the image to size (224, 224) for our model
 */
function preprocess(imgData){
    return tf.tidy(() => {
        //convert to a tensor
        let tensor = tf.browser.fromPixels(imgData, numChannels = 3);

        //resize
        const resized = tf.image.resizeBilinear(tensor, [224,224]).toFloat();

        //add a dimension to get a batch shape
        const batched = resized.expandDims(0);

        return batched
    })
}

/**
 * @description get indices of top probabilities
 * @param {Array} prediction_array probabilities of each class
 * @param {Integer} count number of top categories we want
 */
function findMaxIndices(prediction_array, count){
    let output = [];
    for (let i = 0; i < prediction_array.length ; i ++){
        output.push(i); // add index to output array
        /* output will always have 'count' number of elements */
        /* each time take one, sort, remove smallest one */
        if (output.length > count){
            output.sort(function(a, b){
                return prediction_array[a] - prediction_array[b];
            }); //descending sort output array
            output.pop(); //remove smallest element
        }
    } 
    return output;
}

/**
 * @description load dictionary with class names
 */
async function loadDict(){
    let loc = 'model/class_names.txt';

    await $.ajax({
        url: loc,
        dataType: 'text'
    }).done((data)=>{
        const class_list = data.split(/\n/);
        for (let i = 0; i < class_list.length; i ++){
            let gym_equipment = class_list[i];
            class_names[i] = gym_equipment; //load gym equipment name into global list
        }
    })
}