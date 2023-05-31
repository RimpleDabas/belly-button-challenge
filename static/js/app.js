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
        width: 500,
        height: 400,
        margin: { t: 50, r: 30, l: 75, b: 25 },
        paper_bgcolor: "lavender",
        font: { color: "darkblue", family: "Arial" },
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
// build gauge chart
function gauge_chart(washing_frequency) {
  var data = [{
      type: "indicator",
      mode: "gauge+number+delta",
      value:washing_frequency,
      title: { text: "<b> Belly Button Washing Frequency</b> <br> Scrubs per week" , font: { size: 24 } },
      delta: { reference: 5 , increasing: { color: "Purple" }},
      gauge: {
        axis: { range: [null, 9] , tickwidth: 1, tickcolor: "darkblue" },
        bar: { color: "120106" },
        steps: [
          { range: [0, 1], color: 'D9C4C9'},
          { range: [1, 2], color: 'DAB5BE'},
          { range: [2, 3], color: 'DE99AA'},
          { range: [3, 4], color: 'E55F80'},
          { range: [4, 5], color: 'E25570'},
          { range: [5, 6], color: 'E24A67'},
          { range: [6, 7], color: 'E22E50'},
          { range: [7, 8], color: '990F29'},
          { range: [8, 9], color: '570918'}
        ],
        threshold: {
          line: { color: "5D3542", width: 4 },
          thickness: 0.75,
          value: 5
        }
      }
  }];

  // Get data and layout
  var gaugeLayout = { 
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "lavender",
      font: { color: "darkblue", family: "Arial" }
   }
  

  Plotly.newPlot('gauge', data, gaugeLayout);
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
        gauge_chart(washing_frequency)
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
