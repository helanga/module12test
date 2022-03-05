function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
        const samples = data.samples;
        const metadata = data.metadata;
        
    // 4. Create a variable that filters the samples for the object with the desired sample number.
        var filteredSample = samples.filter(sampleName => sampleName.id == sample)[0];
    //  5. Create a variable that holds the first sample in the array.
        var filteredMetaSample = metadata.filter(sampleName => sampleName.id == sample)[0]


    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
        let otu_ids = filteredSample.otu_ids;
        let otu_labels = filteredSample.otu_labels;
        let sample_values = filteredSample.sample_values;
        let wshFreq = parseFloat(filteredMetaSample.wfreq);

        console.log(otu_ids)
        console.log(otu_labels)
        console.log(sample_values)
        console.log(wshFreq)
    // =================Bar chart==========================================================
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

     var yticksbar = otu_ids.slice(0,10).map(otuID => `OTU${otuID}`).reverse()
      console.log(yticksbar)
    // 8. Create the trace for the bar chart. 
    var barData = [
      {
        y:yticksbar,
        x:sample_values.slice(0,10).reverse(),
        text:otu_labels.slice(0,10).reverse(),
        type: 'bar',
        orientation: 'h',
        //width:0.6,
        marker:{color:'(55,83,109)'}
      },
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: 'Top 10 OTU',

      xaxis:{

        title:"Sample Value",
      },
      yaxis:{
   
        title:"OTU ID"
      },
      margin:{t:100,l:100,b:100,r:100},


    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData,barLayout);
    //===========End Bar chart========================================

    //===========Buble Chart==========================================
  // 1. Create the trace for the bubble chart.
  

  var bubbleData = [
    {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode:'markers',
    marker:{
      color: otu_ids,
      size: sample_values,
      colorscale: 'Earth'
      
      }
     
    },
  ];
 
// 2. Create the layout for the bubble chart.
  var bubbleLayout = {
    title: 'Bacteria Culture Per Sample',
    xaxis:{
      title: "OTU ID"
    },
    yaxis: {
      title: "Sample Value"
    },
    options: {
      scales: {
        xaxis: [{
          display: true,
          ticks: {
            beginAtZero: true,
            min: 0,
            max: 3500,
            stepSize: 500,
          }
        }],
        yaxis:[{
          display: true,
          ticks: {
            beginAtZero: true,
            min: 0,
            max: 250,
            stepSize: 50,
          }
        }]
      }
    }
  };

// 3. Use Plotly to plot the data with the layout.
Plotly.newPlot('buble',bubbleData,bubbleLayout); 
// =================End Buble Chart=====================================
var guageData = [
  {
      domain:{x: [0, 1], y: [0, 1]},
      value:wshFreq,
      title: {
        display: true,
        text: ['Belly Button Washing Frequency','Scrubs per Week'],font: { size: 24 }}, 
      type:"indicator",

      mode:"gauge+number",
      //delta: { reference: 10 },
      gauge: {
        axis: { range: [null, 10],tickwidth: 1, tickcolor: "black"  },
        bar: { color: "black" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "darkgreen" },
        ],
        
        
      }
  }
  
];
var guageLayout = { 
  title: "Belly Button Washing Frequency <br> Scrubs per Week",
  width: 500,
  height: 400,
  margin: { t: 25, r: 25, l: 25, b: 25 },
  paper_bgcolor: "white",
  font: { color: "black", family: "Arial" } };
Plotly.newPlot("gauge",guageData,guageLayout);
  });
}



