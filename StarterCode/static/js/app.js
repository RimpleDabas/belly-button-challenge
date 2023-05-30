// get the url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// console log the data using d3
d3.json(url).then(function(data) {
    console.log(data);
  });

  // understand the data, it has three main arrays of length 153 
  // 1.names with the person ids 2.metadata details about the person  3. samples has four values
  // id,out_ids, sample_values and otu labels

// conspole log sample data to see what we need for the plots
// d3.json(url).then((data) => {
// console.log(data.samples);
// the output will look like : {id: '940', otu_ids: Array(80), sample_values: Array(80), otu_labels: Array(80)}


// create a function to get the details based on the samples and plot bar and bubble charts

function sample_plot(sample_id) {
//get the data and extraxct what we need and assign them to the variables
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
            color: 'coral',
            width: 1
          },
        orientation : "h",
      }
    ];

    var bar_Layout = {
        title: "Top 10 OTU ",
        margin: {
            l: 100,
            r: 100,
            t: 100,
            b: 100
          }
        
    };
    Plotly.newPlot("bar", trace_bar, bar_Layout);

// build a bubble chart 

    var trace_bubble =[
         {
        x: otu_ids,
        y: values,
        text : otu_labels,
        mode: 'markers',
        marker: {
        color: otu_ids,
        size: values,
        }
    }
    ];

   var bubble_layout = {
        title: "Bacteria Per Sample",
        hovermode: "closest",
        xaxis: {title: "OTU ID"},
    };

    Plotly.newPlot("bubble", trace_bubble, bubble_layout);
});
}
// get the demographic information based on the sample

function sample_Metadata(sample_id) {

    d3.json(url).then((data) => {
      var metadata= data.metadata; // assign variables to get the information
      var sample_result_array= metadata.filter(sample => sample.id == sample_id);// filter based on the samples
      var sample_result = sample_result_array[0]

      d3.select("#sample-metadata").html("");
      // use The Object.entries() static method to return an array of a given object's own enumerable string-keyed property key-value pairs.
      Object.entries(sample_result).forEach(([key,value]) => { 
        console.log(key,value);
        d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
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
function optionChanged(next_Sample) {
     sample_plot(next_Sample);
     sample_Metadata(next_Sample);
    }
   // Initialize the dashboard
   init();
