const input = document.querySelector("#image-input");
const reader = new FileReader();

/* Variables */
let model;
let class_names = [];
let predictions = [];

let prediction_chart = new CanvasJS.Chart("prediction-chart",{
    title:{
        text:"Top 3 predictions"
    },
    legend: {
        maxWidth: 350,
        itemWidth: 120
    },
    data: [{
        type:"pie",
        backgroundColor:'',
        showInLegend: true,
        legendText:"{indexLabel}",
        dataPoints: predictions
    }]
});

$("#image-input").change(function(){
    readURL(this);
});

$("#captured-image").on('load',function(){
    console.log('change detected');
    predicting(3);
})

/**
 * @description load the model
 */
async function start(){
    
    console.log("Start function");
    
    //load model
    model = await tf.loadLayersModel('model/model.json');
    console.log('Successfully loaded model');

    //load dict
    await loadDict();
    console.log('Successfully loaded class names');

    //warmup
    await predicting();
    prediction_chart.title.remove()
}

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
                return prediction_array[b] - prediction_array[a];
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
        const class_list = JSON.parse(data);
        for (let i = 0; i < class_list.length; i ++){
            let gym_equipment = class_list[i];
            class_names[i] = gym_equipment; //load gym equipment name into global list
        }
    })
}

/**
 * @description converts captured image for display
 */
function readURL(input){
    if (input.files && input.files[0]){
        reader.onload = function(e){
            $('#captured-image').attr('src', e.target.result);
            //document.getElementById("captured-image").src = e.target.result;
        };

        reader.readAsDataURL(input.files[0]); //convert to base64 string
    }
}

/** 
 * @description wrapper function for my predictions
 */
async function predicting(num_predictions){
    const image = document.getElementById('captured-image');
    const pred = model.predict(preprocess(image)).dataSync();
    console.log('predicted');
    let prediction_index = findMaxIndices(pred, num_predictions);

    /* take highest probability as prediction */
    let category_name = class_names[prediction_index[0]].name;
    let category_description = class_names[prediction_index[0]].desc;
    document.getElementById('prediction-output').innerText = `
      <b>Equipment:</b> ${category_name} <br>
      <b>Description:</b> ${category_description}`;
    
    /* update chart */
    predictions = await updateChart(preds, num_predictions);

    prediction_chart.render();
}

/**
 * @description sync function to update predictions before chart render
 */
function updateChart(preds, num_predictions){
    let results = []

    for(let i = 0; i < num_predictions; i ++){
        results.push({
            y: pred[prediction_index[i]]*100, //change to 100%
            indexLabel: class_names[prediction_index[i]].name
        })
    }

    return results;
}


/**
 * @description workaround function to change name of input file button
 */
function FileSelected(e)
{
    file = document.getElementById('image-input').files[document.getElementById('image-input').files.length - 1];
    document.getElementById('fileName').innerHtml= file.name;
}

