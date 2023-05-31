// get the url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// console log the data using d3
d3.json(url).then(function(data) {
    console.log(data);
  });

  // understand the data, it has three main arrays of length 153 1.names with the person ids 2.metadata details about the person  3. samples has four values
  // id,out_ids, sample_values and otu labels

// console log sample data to see what we need for the plots
// d3.json(url).then((data) => {
// console.log(data.samples);
// the output will look like : {id: '940', otu_ids: Array(80), sample_values: Array(80), otu_labels: Array(80)}


// create a function to get the details based on the samples and plot bar and bubble charts

function sample_plot(sample_id) {
//get the data and extract what we need and assign them to the variables
    d3.json(url).then((data) => {
        console.log(data.samples);
        var sample_array = data.samples; // create a variable for samples 
        var sample_array_result = sample_array.filter(sample => sample.id == sample_id) ;// get the result for the sample based on the id chosen 
        console.log(sample_array_result) // result is an array like 0 : {id: '940', otu_ids: Array(80), sample_values: Array(80), otu_labels: Array(80)}
        // get the index 0 from the previous step
        var sample_result = sample_array_result[0];
        console.log(sample_result) // result is  {id: '940', otu_ids: Array(80), sample_values: Array(80), otu_labels: Array(80)}
        // declare the variables for plots
        var otu_ids = sample_result.otu_ids;
        var otu_labels = sample_result.otu_labels;
        var values = sample_result.sample_values;
        console.log(otu_ids,otu_labels,values)
     
// build a bar chart 
// take help from plotly examples for plotting
    var trace_bar = [
        {
        x : values.slice(0,10).reverse(), // get top 10 values
        y : otu_ids.slice(0, 10).map(OTU_ID => `OTU ${OTU_ID}`).reverse(),
        text : otu_labels.slice(0,10).reverse(),
        type : "bar",
        marker: {
            color: 'DE738F',
            width: 1
          },
        orientation : "h",
      }
    ];

    var bar_Layout = {
        title: {text : `<b>Top 10 OTU in Sample ${sample_id}</b>`,font: { size: 24 }},
    };
    Plotly.newPlot("bar", trace_bar, bar_Layout);

// build a bubble chart 

    var trace_bubble = [
         {
        x: otu_ids,
        y: values,
        text : otu_labels,
        mode: 'markers',
        marker: {
        color: otu_ids,
        size: values,
        colorscale : 'Picnic'
        }
    }
    ];

   var bubble_layout = {
        title: {text :`<b>Bacteria in Sample ${sample_id}</b>`, font: { size: 24 }},
        hovermode: "closest",
        xaxis: {title: "OTU ID"},
    };

    Plotly.newPlot("bubble", trace_bubble, bubble_layout);
});
}

// // build gauge chart 

//   ---------Type 1--------
// function gaugePointer(washing_frequency) {
//   var data = [{
//       type: "indicator",
//       mode: "gauge+number+delta",
//       value:washing_frequency,
//       title: { text: "<b> Belly Button Washing Frequency</b> <br> Scrubs per week" , font: { size: 24 } },
//       delta: { reference: 5 , increasing: { color: "Purple" }},
//       gauge: {
//         axis: { range: [null, 9] , tickwidth: 1, tickcolor: "darkblue" },
//         bar: { color: "120106" },
//         steps: [
//           { range: [0, 1], color: 'D9C4C9'},
//           { range: [1, 2], color: 'DAB5BE'},
//           { range: [2, 3], color: 'DE99AA'},
//           { range: [3, 4], color: 'E55F80'},
//           { range: [4, 5], color: 'E25570'},
//           { range: [5, 6], color: 'E24A67'},
//           { range: [6, 7], color: 'E22E50'},
//           { range: [7, 8], color: '990F29'},
//           { range: [8, 9], color: '570918'}
//         ],
//         threshold: {
//           line: { color: "5D3542", width: 4 },
//           thickness: 0.75,
//           value: 5
//         }
//       }
//   }];

//   // Get data and layout
//   var gaugeLayout = { 
//       width: 500,
//       height: 400,
//       margin: { t: 25, r: 25, l: 25, b: 25 },
//       paper_bgcolor: "lavender",
//       font: { color: "darkblue", family: "Arial" }
//    }
  

//   Plotly.newPlot('gauge', data, gaugeLayout);
// };


// ------Type 2 with needle-----

// Help taken from https://codepen.io/ascotto/pen/eGNaqe?editors=0011

function gaugePointer(washing_frequency){
	// try different values in place of 20 , 20 was chosen considering half circle for the needle pointer is 180 and range is from 0-9 , 
  // for the needle to cover two points it takes 20 degrees.

  var degrees = (180 - washing_frequency*20),
  
  radius = .45;
  // converting degrees to radians
  var radians = degrees * Math.PI / 180;
// get x and y cordinates for the needle to create the path
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  var mainPath = 'M -.0 -0.035 L .0 0.035 L ',
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = 'Z';

  var path = mainPath.concat(pathX,space,pathY,pathEnd);

  var data_washing_frequency = [{
      type: 'scatter',
      x: [0], y:[0],
      marker: {size: 15, color:'#1f1717'},
      showlegend: false,
      name: 'Washing Frequency',
      text: washing_frequency,
      hoverinfo: 'text+name'},
      { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6','4-5', '3-4', '2-3', '1-2', '0-1', ''],
      textinfo: 'text',
      textposition:'inside',	  
              marker: {colors:['rgba(4, 87, 0, .5)', 'rgba(8, 107, 0, .5)', 
                              'rgba(10, 117, 0, .5)', 'rgba(14, 127, 0, .5)', 
                              'rgba(110, 154, 22, .5)', 'rgba(170, 202, 42, .5)', 
                              'rgba(202, 209, 95, .5)', 'rgba(210, 206, 145, .5)', 
                              'rgba(232, 226, 202, .5)', 'rgba(255, 255, 255, 0)']},
      labels: ['8-9', '7-8', '6-7', '5-6','4-5', '3-4', '2-3', '1-2', '0-1', ''],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
  }]

  var layout = {

      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '#6b211c',
          line: {
              color: 'black'
          }
        
          }],
      title: {text : '<b>Belly Button Washing Frequency</b> <br> Scrubs per week',font: { size: 24 }},
      xaxis: {zeroline:false, showticklabels:false,
                  showgrid: false, range: [-1, 1]},
      yaxis: {zeroline:false, showticklabels:false,
                  showgrid: false, range: [-1, 1]}
  };
  Plotly.newPlot('gauge', data_washing_frequency, layout);
};

// get the demographic information based on the sample which is in metadata array

function sample_Metadata(sample_id) {

    d3.json(url).then((data) => {
      var metadata= data.metadata; // assign variables to get the information
      var sample_result_array= metadata.filter(sample => sample.id == sample_id);// filter based on the samples
      var sample_result = sample_result_array[0]
      var washing_frequency = sample_result.wfreq
      console.log(washing_frequency)
    // clear the previous data if any otherwise it just keeps on adding the selections
      d3.select("#sample-metadata").html("");
      // use The Object.entries() static method to return an array of a given object's own enumerable string-keyed property key-value pairs.
      Object.entries(sample_result).forEach(([key,value]) => { 
        console.log(key,value);
        d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        gaugePointer(washing_frequency)
    });
    
   });

  }

// function for selection
function init() {
     var dropdownbutton = d3.select("#selDataset");
     d3.json(url).then((data) => {
        var sampleNames = data.names; // get the names array
        // perform loop on all the names based on the selection , . property will get the corresponding id name
        sampleNames.forEach((sample) => {
            dropdownbutton
            .append("option")
            .text(sample)
            .property("value", sample);
        });
        // initialize the dashboard and assign them to the functions created earlier
        const default_Sample = sampleNames[0];
        sample_plot(default_Sample);
        sample_Metadata(default_Sample);
});
// function to change the plots based on the selection
}
// option changed 
function optionChanged(next_Sample) {
     sample_plot(next_Sample);
     sample_Metadata(next_Sample);
    }
   init();
