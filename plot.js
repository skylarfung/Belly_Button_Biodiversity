//populates dropdown menu with the ids
function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
})}

init();

//calls on functions when html dropdown menu is changed
function optionChanged(newSample) {
  console.log(newSample);
  buildMetadata(newSample);
  buildCharts(newSample);
}

//fills out demographic info
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    PANEL.append("h6").text("ID: " + result.id);
    PANEL.append("h6").text("Ethnicity: " + result.ethnicity);
    PANEL.append("h6").text("Gender: " + result.gender);
    PANEL.append("h6").text("Age: " + result.age);
    PANEL.append("h6").text("Location: " + result.location);
    PANEL.append("h6").text("BBType: " + result.bbtype);
    PANEL.append("h6").text("WFreq: " + result.wfreq);
  });
}

//builds bar, bubble, and gauge charts
function buildCharts(sample) {
  d3.json("samples.json").then((data) =>{
    var samplesArray = data.samples;
    var resultArray = samplesArray.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    console.log(result);

    var bar_X_axis = result.sample_values.slice(0,10).reverse();
    var bar_Y_axis = result.otu_ids.slice(0,10).map(x => "OTU " + x).reverse();
    var barText = result.otu_labels.slice(0,10).reverse();
    
    console.log(bar_X_axis);
    console.log(bar_Y_axis);

    var plotData = [{
      type: "bar",
      x: bar_X_axis,
      y: bar_Y_axis,
      text: barText,
      orientation: "h"
    }];

    var barLayout = {
      title: "Top 10 Bacterial Species (OTUs)"
    };

    Plotly.newPlot("bar", plotData, barLayout);

    var trace1 ={
      x: result.otu_ids,
      y: result.sample_values,
      text: result.otu_labels,
      mode: "markers",
      marker:{
        size: result.sample_values,
        color: result.otu_ids,
      }
    };

    var bubbleData = [trace1];

    var bubbleLayout = {
      xaxis: {
        title: "OTU ID"
      }
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    var metadata = data.metadata;
    var gaugeArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var gaugeResult = gaugeArray[0];

    var gaugeData = [
      {
        domain: {x: [0,1], y: [0,1]},
        value: gaugeResult.wfreq,
        title: "Belly Button Washing Frequency",
        type: "indicator",
        mode: "gauge+number"
      }
    ];

    Plotly.newPlot("gauge", gaugeData);

  });

}

//starts page with 940's info
buildMetadata(940);
buildCharts(940);