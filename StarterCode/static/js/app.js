// Use D3 fetch to read the JSON file
function getData(sampleID){
  d3.json("samples.json").then((importedData) => {
    var data = importedData;
    console.log(data);

    var sampleData = data.samples;
    console.log(sampleData);

    var resultArr = sampleData.filter(sampleObject => sampleObject.id == sampleID);
    //console.log(resultArr);
    var variableArr = resultArr[0];
    //console.log(variableArr);
    var sample_values = variableArr.sample_values;
    var otu_ids = variableArr.otu_ids;
    var otu_labels = variableArr.otu_labels;
    //console.log(otu_ids);
    
    //get wfreqdata
    var mData = data.metadata;
    var resultFreq = mData.filter(freqObject => freqObject.id == sampleID);
    var freqData = resultFreq[0];
    console.log(freqData);
    var wFreq = freqData.wfreq;
    
    //create bar chart
    var arrData = [{
      x: sample_values.slice(0, 10).reverse(),
      y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
      marker: {
          color: 'rgb(255,20,147)'
      }
    }];

    var barLayout = {
      title: "Top 10 OTUs Found",
      //font: { family: "Impact,Charcoal,sans-serif"},
      xaxis: { title: "Sample Values"},
      yaxis: { title: "OTU IDs"}
    };

    Plotly.newPlot("bar", arrData, barLayout);

    //create bubble data
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Rainbow'
      }
    }];

    var bubbleLayout = {
      title: "OTUs Sample Size",
      font: {family: "Impact,Charcoal,sans-serif"},
      xaxis: { title: "OTU ID"}
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    //Create gauge chart
    var gaugeData = [{
      type: "indicator",
      mode: "gauge+number+delta",
      value: wFreq,
      title: "Scrub per Week",
      gauge: {
        axis: { range: [0,9], tickwidth:1, tickcolor:"blue" },
        bar: { color: "white"},
        bgcolor: "white",
        borderwidth: 1,
        bordercolor: "gray",
        steps: [
          { range: [0,1], color: "beige"},
          { range: [1,2], color: "yellow"},
          { range: [2,3], color: "pink"},
          { range: [3,4], color: "lightpink"},
          { range: [4,5], color: "red"},
          { range: [5,6], color: "brown"},
          { range: [6,7], color: "skyblue"},
          { range: [7,8], color: "blue"},
          { range: [8,9], color: "violet"}
        ]
      }
        
    }];

    var gaugeLayout = {
      title: "Belly Button Washing Frequency",
      //font: { family: "Impact,Charcoal,sans-serif"},
      width: 400,
      height: 300,
      margin: { t: 25, r: 25, l: 25, b: 25 }
    };

    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
});

};

function getDemoData(metaID){
  d3.json("samples.json").then((importedData) => {
    var data = importedData;
    console.log(data);

    var metaData = data.metadata;
    console.log(metaData);
    var metaArr = metaData.filter(metaObject => metaObject.id == metaID);
    var varArr =metaArr[0];

    var ethnicity = varArr.ethnicity;
    console.log(ethnicity);
    var gender = varArr.gender;
    console.log(gender);
    var age = varArr.age;
    console.log(age);
    var location = varArr.location;
    console.log(location);
    var bbtype = varArr.bbtype;
    console.log(bbtype);
    var wfreq = varArr.wfreq;
    console.log(wfreq);

    var metaDataset = d3.select("#sample-metadata");

    metaDataset.html("");
    Object.entries(varArr).forEach(([key, value]) =>{
        metaDataset.append("h6").text(`${key}: ${value}`);
    })

  });
};

function init(){
  d3.json("samples.json").then((d) => {
      var sampleName = d.names;
      var dataset = d3.select("#selDataset");
      sampleName.forEach((sample) =>{
          dataset
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
  var resultSample = sampleName[0];
  getData(resultSample);
  getDemoData(resultSample);
  });
  
};

init();

d3.selectAll("#selDataset").on("change", optionChanged);

//new chart per new data
function optionChanged(the_new_sample){
  getData(the_new_sample);
  getDemoData(the_new_sample);
};