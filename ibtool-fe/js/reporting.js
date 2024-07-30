
$(async() => {
  var ChartValues= await getCOMCSOList();
  var Ownernames = ChartValues.filter(obj => obj['Investigation Team'] == 'Buc IB Team').map(function(obj) {
    return obj['Analysis Owner'];
});
var counts = {};
Ownernames.forEach(function(value) {
  counts[value] = (counts[value] || 0) + 1;
});
var resultArray = Object.keys(counts).map(function(key) {
  return { value: key, count: counts[key] };
});

const pieChartInstance =   $('#pie').dxPieChart({
        palette: 'bright',
        dataSource: resultArray,
        legend: {
            //position: "outside",
            //orientation: "horizontal",
            horizontalAlignment: "center", // or "left" | "right"
            verticalAlignment: "bottom" // or "bottom"
        },
        export: {
            enabled: true,
        },
        palette: ['#6022A6','#19bb7c', '#45b2c5', '#f8d754','#ff8652',"#b64201"],
        resolveLabelOverlapping: 'shift',
        series: [{
            argumentField: 'value',
            valueField: 'count',
            label: {
                visible: true,
                connector: {
                    visible: true,
                    width: 0.5,
                },
                format: 'fixedPoint',
                customizeText(point) {
                    return `${point.argumentText}: ${point.valueText}%`;
                },
            },
        }],
    }).dxPieChart('instance');


    
// Assuming ChartValues is your original array of objects

var currentDate = new Date(); // Assuming today's date

var Analysis = ChartValues.filter(obj => obj['Investigation Team'] == 'Buc IB Team').map(function(obj) {
    return {
        'Analysis Status': obj['Analysis Status'],
        'Date First Active': new Date(obj['Date First Active'])
    };
});

var resultObject = Analysis.reduce(function (acc, obj) {
    var status = obj['Analysis Status'];
    var analysisDate = obj['Date First Active'];
    let difference = currentDate.getTime() - analysisDate.getTime();
    let totalDays = Math.ceil(difference / (1000 * 3600 * 24));

    if (!acc[status]) {
        // Initialize the accumulator for the current status
        acc[status] = {
            'Analysis Status': status,
            '<30': 0,
            '<45': 0,
            '<60': 0,
            '<90': 0,
            '<120': 0,
            '<200': 0,
            '>200': 0
        };
    }

    if (totalDays <= 30) {
        acc[status]['<30'] += 1;
    } else if (totalDays <= 45) {
        acc[status]['<45'] += 1;
    } else if (totalDays <= 60) {
        acc[status]['<60'] += 1;
    } else if (totalDays <= 90) {
        acc[status]['<90'] += 1;
    } else if (totalDays <= 120) {
        acc[status]['<120'] += 1;
    } else if (totalDays <= 200) {
        acc[status]['<200'] += 1;
    } else if (totalDays > 200) {
        acc[status]['>200'] += 1;
    }

    return acc; // Make sure to return the accumulator
}, {});

var finalResultArray = Object.values(resultObject);
    
    $(() => {
      $('#chart').dxChart({
        dataSource:finalResultArray,
        commonSeriesSettings: {
          argumentField: 'Analysis Status',
          type: 'stackedBar',
        },
        series : [
          { valueField: '<30', name: 'Less than 30 days' },
          { valueField: '<45', name: 'Less than 45 days' },
          { valueField: '<60', name: 'Less than 60 days' },
          { valueField: '<90', name: 'Less than 90 days' },
          { valueField: '<120', name: 'Less than 120 days' },
          { valueField: '<200', name: 'Less than 200 days' },
          { valueField: '>200', name: 'More than 200 days' }
      ],
        legend: {
          verticalAlignment: 'bottom',
          horizontalAlignment: 'center',
          itemTextPosition: 'top',
        },
        export: {
          enabled: true,
        },
        palette: ['#508104','#9e8e01', '#f3b800', '#db8200','#b64201'],
        tooltip: {
          enabled: true,
          location: 'edge',
          customizeTooltip(arg) {
            return {
              text: `${arg.seriesName} ${arg.valueText}`,
            };
          },
        },
      });
    });



var Ages = ChartValues.filter(obj => obj['Investigation Team'] == 'Buc IB Team').map(function(obj) {
    return {
        'Date First Active': new Date(obj['Date First Active'])
    };
});

var resultObject = Ages.reduce(function (acc, obj) {
    var analysisDate = obj['Date First Active'];
    let difference = currentDate.getTime() - analysisDate.getTime();
    let totalDays = Math.ceil(difference / (1000 * 3600 * 24));

    if (!acc['<30']) {
        // Initialize the accumulator for each time range
        acc['<30'] = 0;
        acc['<45'] = 0;
        acc['<60'] = 0;
        acc['<90'] = 0;
        acc['<120'] = 0;
        acc['<200'] = 0;
        acc['>200'] = 0;
    }

    if (totalDays <= 30) {
        acc['<30'] += 1;
    } else if (totalDays <= 45) {
        acc['<45'] += 1;
    } else if (totalDays <= 60) {
        acc['<60'] += 1;
    } else if (totalDays <= 90) {
        acc['<90'] += 1;
    } else if (totalDays <= 120) {
        acc['<120'] += 1;
    } else if (totalDays <= 200) {
        acc['<200'] += 1;
    } else if(totalDays > 200) {
        acc['>200'] += 1;
    }

    return acc; // Make sure to return the accumulator
}, {});

// Convert resultObject to the desired dataSource format
var dataSource = Object.entries(resultObject).map(([ageRange, count]) => {
    return {
        Age: ageRange,
        number: count
    };
});

console.log("eztret",dataSource);


const AgePieChart=    $('#AgePie').dxPieChart({
      palette: 'bright',
      dataSource: dataSource,
      legend: {
          //position: "outside",
          //orientation: "horizontal",
          horizontalAlignment: "center", // or "left" | "right"
          verticalAlignment: "bottom" // or "bottom"
      },
      export: {
          enabled: true,
      },
      palette: ['#6da06f','#b6e9d1', '#ffbb43', '#ff8652','#c13525'],
      resolveLabelOverlapping: 'shift',
      series: [{
          argumentField: 'Age',
          valueField: 'number',
          label: {
              visible: true,
              connector: {
                  visible: true,
                  width: 0.5,
              },
              format: 'fixedPoint',
              customizeText(point) {
                  return `${point.argumentText}: ${point.valueText}%`;
              },
          },
      }],
  }).dxPieChart('instance');

  var ApplicationNames = ChartValues.filter(obj => obj['Investigation Team'] == 'Buc IB Team').map(function(obj) {
    return obj['Application_Feature'];
});
var counts = {};
ApplicationNames.forEach(function(value) {
  counts[value] = (counts[value] || 0) + 1;
});
var resultArray = Object.keys(counts).map(function(key) {
  return { value: key, count: counts[key] };
});

$(() => {
  $('#Appchart').dxChart({
      dataSource: resultArray,
      series: {
          argumentField: 'value',
          valueField: 'count',
          type: 'bar',
          color: '#45b2c5',
      },
      export: {
        enabled: true,
      },
      argumentAxis: {
          label: {
              rotationAngle: 45, // Adjust the rotation angle as needed
              overlappingBehavior: 'rotate', // Adjust the overlapping behavior
              wordWrap: 'normal', // Adjust the word wrap
          },
      },
      legend: {
          visible: false, // Optional: Hide legend if not needed
      },
      // Additional chart configurations as needed
  });
});

    
$('#exportcharts').dxButton({
  icon: 'export',
  text: 'Export',
  type: 'default',
  width: 200,
  onClick() {
    // Create temporary charts for exporting
    const tempAgePieChart = $('#tempAgePieChart').dxPieChart({
      palette: 'Harmony Light',
      dataSource: dataSource,
      title: 'Age Pie Chart',
      series: [{
        argumentField: 'Age',
        valueField: 'number',
        label: {
            visible: true,
            connector: {
                visible: true,
                width: 0.5,
            },
            format: 'fixedPoint',
            customizeText(point) {
                return `${point.argumentText}: ${point.valueText}%`;
            },
        },
    }],
      size: { width: 800, height: 600 }, // Adjust size for export
    }).dxPieChart('instance');

    const tempPieChartInstance = $('#tempPieChart').dxPieChart({
      palette: 'Harmony Light',
      dataSource: pieChartInstance.option('dataSource'),
      title: 'Pie Chart',
      series: [{
        argumentField: 'value',
        valueField: 'count',
        label: {
            visible: true,
            connector: {
                visible: true,
                width: 0.5,
            },
            format: 'fixedPoint',
            customizeText(point) {
                return `${point.argumentText}: ${point.valueText}%`;
            },
        },
    }],
      size: { width: 800, height: 600 }, // Adjust size for export
    }).dxPieChart('instance');

    // Export the temporary charts
    DevExpress.viz.exportWidgets([[tempAgePieChart, tempPieChartInstance]], {
      fileName: 'chart',
      format: 'JPG',
    });

    // Dispose of the temporary charts after exporting
    tempAgePieChart.dispose();
    tempPieChartInstance.dispose();
  },
});

    
    let dateCOM = await getLastImport("LastComUpdate");
    let dateCSO = await getLastImport("LastCsoUpdate");

    $("#importtime").text(dateCOM.value);
    $("#csoimporttime").text(dateCSO.value);

});