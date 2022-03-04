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
function buildBarCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
        var samples = data.samples;
       
        
    // 4. Create a variable that filters the samples for the object with the desired sample number.
        var filteredSample = samples.filter(sampleName => sampleName.id == sample)[0];
    //  5. Create a variable that holds the first sample in the array.
        var filteredMetaSample = filteredSample[0];


    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
        let otu_ids = filteredSample.otu_ids;
        let otu_labels = filteredSample.otu_labels;
        let sample_values = filteredSample.sample_values;

        console.log(otu_ids)
        console.log(otu_labels)
        console.log(sample_values)
    // =================Bar chart==========================================================
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

     var yticksbar = otu_ids.slice(0,10).map(otuID => `OTU${otuID}`).reverse()
      console.log(yticks)
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
  let xticksBubble = otu_ids.slice(0,10).map(OtuID => `OTU ${otuID}`).reverse();

  var bubbleData = [
    {
    x: xticksBubble,
    y: sample_values.slice(0,10).reverse(),
    text: otu_labels.slice(0,10).reverse(),
    mode:'markers',
    marker:{
      size:sample_values.slice(0,10).reverse()
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
  
  };

// 3. Use Plotly to plot the data with the layout.
Plotly.newPlot('buble',bubbleData,bubbleLayout); 
  
  });
}


