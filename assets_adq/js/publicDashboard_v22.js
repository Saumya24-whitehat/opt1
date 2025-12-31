$(document).ready(function() {
    var imgVer = 12;
    var niftyname;
    var bankniftyname;
    var chart;
    var niftyDataHTML;
    var bankniftyDataHTML;
    var niftyPrice;
    var niftyPriceDiff;
    var niftyPriceChg;
    var niftyPriceDiffColor;
    var niftyPriceChgIcon;
    var niftyPriceChgColor;
    var niftyOiChg;
    var niftyIvChg;
    var niftyVol;
    var niftyOiChgIcon;
    var niftyOiChgColor;
    var niftyIvChgIcon;
    var niftyIvChgColor;
    var chart2;
    var bankniftyPrice;
    var bankniftyPriceDiff;
    var bankniftyPriceChg;
    var bankniftyPriceDiffColor;
    var bankniftyPriceChgIcon;
    var bankniftyPriceChgColor;
    var bankniftyOiChg;
    var bankniftyIvChg;
    var bankniftyVol;
    var bankniftyOiChgIcon;
    var bankniftyOiChgColor;
    var bankniftyIvChgIcon;
    var bankniftyIvChgColor;
    var gaugeniftyPcrChg;
    var gaugeniftyPcrChgIcon;
    var gaugeniftyPcrChgColor;
    var gaugeniftyIvChg;
    var gaugeniftyIvChgIcon;
    var gaugeniftyIvChgColor;
    var gaugebankniftyPcrChg;
    var gaugebankniftyPcrChgIcon;
    var gaugebankniftyPcrChgColor;
    var gaugebankniftyIvChg;
    var gaugebankniftyIvChgIcon;
    var gaugebankniftyIvChgColor;
    var barPriceChgColor;
    var barPriceChgIcon;
    var barOIChgColor;
    var barOIChgIcon;
    var barVolChgColor;
    var barVolChgIcon;
    var barColor;
    var bar2Color;
    var bar3Color;
    var longbuildupname;
    var longbuildup;
    var longbuildupdata;
    var positiveData1;
    var maxNumber1;
    var positiveData12;
    var maxNumber12;
    var shortcoveringname;
    var shortcovering;
    var shortcoveringdata;
    var positiveData2;
    var positiveData23;
    var positiveData42;
    var positiveData51;
    var positiveData52;
    var positiveData61;
    var positiveData62;
    var positiveData71;
    var positiveData72;
    var positiveData81;
    var positiveData82;
    var positiveData91;
    var positiveData92;
    var positiveData101;
    var positiveData102;
    var maxNumber2;
    var positiveData22;
    var maxNumber22;
    var shortbuildupname;
    var shortbuildup;
    var shortbuildupdata;
    var positiveData3;
    var positiveData13;
    var maxNumber3;
    var positiveData32;
    var maxNumber32;
    var longunwindingname;
    var longunwinding;
    var longunwindingdata;
    var positiveData4;
    var maxNumber4;
    var positiveData42;
    var positiveData43
    var maxNumber42;
    var pricegainersname;
    var pricegainers;
    var pricegainersdata;
    var positiveData5;
    var maxNumber5;
    var pricelosersname;
    var pricelosers;
    var pricelosersdata;
    var positiveData6;
    var maxNumber6;
    var oigainersname;
    var oigainers;
    var oigainersdata;
    var positiveData7;
    var maxNumber7;
    var oilosersname;
    var oilosers;
    var oilosersdata;
    var positiveData8;
    var maxNumber8;
    var ivrname;
    var ivr;
    var ivrdata;
    var positiveData9;
    var maxNumber9;
    var ivpname;
    var ivp;
    var ivpdata;
    var positiveData10;
    var maxNumber10;
    var isDarkMode;
    var OINiftyColor;
    var OIBankNiftyColor;
    var Niftylastupdated;
    var BankNiftylastupdated;
    var pNiftyColor;
    var areaNiftyColor;
    var pBankNiftyColor;
    var areaBankNiftyColor;

    // var OINifty;
    // var OIBankNifty;

    // Function to convert a date string to the desired format
    function formatDate(inputDate) {
        // Check if inputDate is a string
        if (typeof inputDate !== 'string') {
            return 'Invalid input';
        }

        // Define the months as an array for use in date formatting
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        // Split the input date string into date and time parts
        const dateAndTime = inputDate.split(' ');

        // Check if there are two parts (date and time)
        if (dateAndTime.length !== 2) {
            return 'Invalid date format';
        }

        let [datePart, timePart] = dateAndTime;

        // Check if the datePart includes "(EOD)"
        const isEOD = timePart.includes('(EOD)');

        if (isEOD) {
            // Remove "(EOD)" from datePart
            datePart = datePart.replace('(EOD)', '');
        }

        // Parse the date and time parts
        var [day, monthNum, year] = datePart.split('-');
        if (isEOD) {
            [year, monthNum, day] = datePart.split('-');
        }

        var [hours, minutes] = timePart.split(':');
        if (isEOD) {
            [hours, minutes] = isEOD ? ['15', '30'] : timePart.split(':');
        }
        // Check if year, monthNum, day, hours, and minutes are valid
        if (!day || !monthNum || !year || !hours || !minutes) {
            return 'Invalid date format';
        }

        // Remove the leading zero from the day
        day = String(parseInt(day, 10)); // Convert to integer and back to string

        // Get the month abbreviation from the months array
        const month = months[parseInt(monthNum, 10) - 1];

        // Create a suffix for the day (e.g., 1st, 2nd, 3rd, 4th, etc.)
        let daySuffix;
        if (day >= 11 && day <= 13) {
            daySuffix = 'th';
        } else {
            switch (day.slice(-1)) {
                case '1':
                    daySuffix = 'st';
                    break;
                case '2':
                    daySuffix = 'nd';
                    break;
                case '3':
                    daySuffix = 'rd';
                    break;
                default:
                    daySuffix = 'th';
            }
        }

        // Format the time in 12-hour standard
        let formattedTime;
        if (parseInt(hours, 10) === 0) {
            formattedTime = `12:${minutes} PM`;
        } else if (parseInt(hours, 10) < 12) {
            formattedTime = `${hours}:${minutes} AM`;
        } else if (parseInt(hours, 10) === 12) {
            formattedTime = `12:${minutes} PM`;
        } else {
            formattedTime = `${parseInt(hours, 10) - 12}:${minutes} PM`;
        }

        if (isEOD) {
            formattedTime = `EOD`;
        }

        // Format the date with or without (EOD)
        const formattedDate = isEOD ?
            `${day}${daySuffix} ${month} ${year} ${formattedTime}` :
            `${day}${daySuffix} ${month} ${year} ${formattedTime}`;

        return formattedDate;
    }

    // Test cases
    const date1 = '2023-09-18 (EOD)';
    const date2 = '18-09-2023 11:03';
    // console.log(formatDate(date1)); // Output: "18th Sep 2023 03:30 PM"
    // console.log(formatDate(date2)); // Output: "18th Sep 2023 11:03 AM"



    isDarkMode = localStorage.getItem("isDarkMode") === "true";
    //console.log(isDarkMode);
    if (isDarkMode === true) {
        $("body").addClass("dark-theme");
        $("#theme-toggle").prop("checked", true);
    }

    let chartHeight = '45%';
    chart = Highcharts.chart('chart', {
        chart: {
            type: 'line',
            height: chartHeight,
            zoomType: null,
            backgroundColor: 'transparent',
            stacked: false,

        },
        // colors: ['#dc3030', '#38c172'], // Replace with your colors
        title: {
            text: null
        },
        accessibility: {
            enabled: false
        },

        xAxis: {
            type: 'datetime',
            crosshair: {
                color: 'gray',
                dashStyle: 'Dash', // Makes it dashed (imaginary) line
                width: 1 // You can adjust the thickness

            },

            labels: {
                enabled: false
            },
            lineWidth: 0,
            tickLength: 0,
            gridLineWidth: 0, // Hide X-axis gridlines,
            minorGridLineWidth: 0

        },
        yAxis: [{
                min: [],
                max: "auto",
                title: {
                    text: null
                },
                labels: {
                    enabled: false
                },
                axisBorder: {
                    show: false, // Hide the y-axis border
                },
                gridLineWidth: 0, // Remove horizontal grid lines
                minorGridLineWidth: 0, // Remove minor grid lines
                tickAmount: 4
            },
            {
                min: [],
                max: "auto",
                title: {
                    text: null
                },
                labels: {
                    enabled: false
                },
                axisBorder: {
                    show: false, // Hide the y-axis border
                },
                opposite: true,
                gridLineWidth: 0, // Remove horizontal grid lines
                minorGridLineWidth: 0, // Remove minor grid lines
                tickAmount: 4
            }
        ],
        grid: {
            borderColor: "#f9f9f9",
            show: true,
            position: "back",
            clipMarkers: false,
            xaxis: {
                lines: {
                    show: false,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        tooltip: {
            shared: true,
            useHTML: true,
            intersect: false,
            borderWidth: 0,
            backgroundColor: 'black', // Your specified background color

        },
        plotOptions: {
            line: {
                marker: {
                    enabled: false
                },
                lineWidth: 1,
                states: {
                    hover: {
                        enabled: true
                    }
                },
                enableMouseTracking: true
            },
            area: {
                fillOpacity: 0.5,
                stacking: 'normal'
            }
        },
        stroke: {
            curve: "smooth",
            width: [1, 1],
        },

        series: [{
                name: 'Price',
                data: [ /* Array of price data */ ],
                type: 'line',
                yAxis: 0,
                marker: {
                    enabled: false
                }
            },
            {
                name: 'OI',
                data: [ /* Array of OI data */ ],
                type: 'area',
                yAxis: 1,
                marker: {
                    enabled: false
                }
            }
        ],
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        }
    });




    chart2 = Highcharts.chart('chart2', {
        chart: {
            type: 'line',
            height: chartHeight,
            zoomType: null,
            backgroundColor: 'transparent'
        },

        title: {
            text: null
        },
        accessibility: {
            enabled: false
        },
        xAxis: {
            crosshair: {
                color: 'gray',
                dashStyle: 'Dash',
                width: 1
            },
            labels: {
                enabled: false
            },
            lineWidth: 0,
            tickLength: 0,
            gridLineWidth: 0,
            minorGridLineWidth: 0
        },

        yAxis: [{
                min: null,
                max: 'auto',
                title: {
                    text: null
                },
                labels: {
                    enabled: false
                },
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                tickAmount: 4
            },
            {
                min: null,
                max: 'auto',
                title: {
                    text: null
                },
                labels: {
                    enabled: false
                },
                opposite: true,
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                tickAmount: 4
            }
        ],
        tooltip: {
            shared: true,
            useHTML: true,

        },
        plotOptions: {
            line: {
                marker: {
                    enabled: false
                },
                lineWidth: 1,
                states: {
                    hover: {
                        enabled: true
                    }
                },
                enableMouseTracking: true
            },
            area: {
                fillOpacity: 0.5,
                stacking: 'solid'
            }
        },
        series: [{
                name: 'Price',
                data: [ /* price data */ ],
                type: 'line',
                yAxis: 0
            },
            {
                name: 'OI',
                data: [ /* OI data */ ],
                type: 'area',
                yAxis: 1
            }
        ],
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: false
        }
    });

    /* 

      gauge1 = new ApexCharts(document.querySelector("#gauge1"), {
        chart: {
          type: "radialBar",
          height: 170,
          offsetY: -10,
          sparkline: {
            enabled: true,
          },
        },
        plotOptions: {
          radialBar: {
            startAngle: -90,
            endAngle: 90,
            hollow: {
              size: "60%",
            },
            track: {
              background: isDarkMode ? "#2e2e2e" : "#d9dbdb",
            },
            dataLabels: {
              show: true,
              name: {
                fontSize: "20px",
                fontWeight: "bold",
                fontFamily: "Poppins, sans-serif",
                color: isDarkMode ? "#f6f8fa" : "#000",
              },
              value: {
                show: false,
                fontSize: "50px",
                fontWeight: "bold",
                fontFamily: "Poppins, sans-serif",
              },
            },
          },
        },
        series: [],
        labels: [],
        stroke: {
          lineCap: "round",
        },
        colors: ["#38c172"],
      });
      gauge1.render();

      gauge2 = new ApexCharts(document.querySelector("#gauge2"), {
        chart: {
          type: "radialBar",
          height: 170,
          offsetY: -10,
          sparkline: {
            enabled: true,
          },
        },
        plotOptions: {
          radialBar: {
            startAngle: -90,
            endAngle: 90,
            hollow: {
              size: "60%",
            },
            track: {
              background: isDarkMode ? "#2e2e2e" : "#d9dbdb",
            },
            dataLabels: {
              show: true,
              name: {
                fontSize: "20px",
                fontWeight: "bold",
                fontFamily: "Poppins, sans-serif",
                // offsetY: -10,
                color: isDarkMode ? "#f6f8fa" : "#000",
              },
              value: {
                show: false,
                fontSize: "50px",
                fontWeight: "bold",
                fontFamily: "Poppins, sans-serif",
              },
            },
          },
        },
        stroke: {
          lineCap: "round",
        },
        series: [],
        labels: [],

        colors: ["#81ecec"],
      });
      gauge2.render();

      gauge3 = new ApexCharts(document.querySelector("#gauge3"), {
        chart: {
          type: "radialBar",
          height: 170,
          offsetY: -10,
          sparkline: {
            enabled: true,
          },
        },
        plotOptions: {
          radialBar: {
            startAngle: -90,
            endAngle: 90,
            hollow: {
              size: "60%",
            },
            track: {
              background: isDarkMode ? "#2e2e2e" : "#d9dbdb",
            },
            dataLabels: {
              show: true,
              name: {
                fontSize: "20px",
                fontWeight: "bold",
                fontFamily: "Poppins, sans-serif",
                // offsetY: -10,
                color: isDarkMode ? "#f6f8fa" : "#000",
              },
              value: {
                show: false,
                fontSize: "50px",
                fontWeight: "bold",
                fontFamily: "Poppins, sans-serif",
              },
            },
          },
        },
        stroke: {
          lineCap: "round",
        },
        series: [],
        labels: [],
        colors: ["#01cfc9"],
      });
      gauge3.render();

      gauge4 = new ApexCharts(document.querySelector("#gauge4"), {
        chart: {
          type: "radialBar",
          height: 170,
          offsetY: -10,
          sparkline: {
            enabled: true,
          },
        },
        plotOptions: {
          radialBar: {
            startAngle: -90,
            endAngle: 90,
            hollow: {
              size: "60%",
            },
            track: {
              background: isDarkMode ? "#2e2e2e" : "#d9dbdb",
            },
            dataLabels: {
              show: true,
              name: {
                fontSize: "20px",
                fontWeight: "bold",
                fontFamily: "Poppins, sans-serif",
                color: isDarkMode ? "#f6f8fa" : "#000",
              },
              value: {
                show: false,
                fontSize: "50px",
                fontWeight: "bold",
                fontFamily: "Poppins, sans-serif",
              },
            },
          },
        },
        stroke: {
          lineCap: "round",
        },
        series: [],
        labels: [],
        colors: ["#0984e3"],
      });
      gauge4.render(); */
    const baseGaugeOptions = {
        chart: {
            type: 'solidgauge',
            height: 145,
            backgroundColor: 'transparent',
            sparkline: {
                enabled: true,
            },
        },
        title: null,
        exporting: {
            enabled: false
        },
        tooltip: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        pane: {
            startAngle: -90,
            endAngle: 90,
            size: '100%',
            center: ['50%', '50%'],
            background: {
                backgroundColor: isDarkMode ? "#2e2e2e" : "#d9dbdb",
                borderWidth: 0,
                innerRadius: '80%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },
        // The yAxis labels should be hidden now as we move min/max to the center data label
        yAxis: {
            min: null,
            max: null,
            lineWidth: 0,
            tickWidth: 0,
            minorTickInterval: null,
            tickPixelInterval: 0,
            labels: {
                enabled: false, // <-- Crucial: Disable default yAxis labels
            }
        },
        plotOptions: {
            series: {
                animation: false // ⛔ Disable animation for all series updates
            },
            solidgauge: {
                borderRadius: 2,
                innerRadius: '80%',
                dataLabels: {
                    borderWidth: 0,
                    useHTML: true,
                    align: 'center',
                    verticalAlign: 'middle',

                    y: 10, // Adjusted position to allow space for the new content
                    style: {
                        fontSize: '16px',
                        fontFamily: 'Poppins',
                        color: isDarkMode ? "#f6f8fa" : "#000",
                    },
                    formatter: function() {
                        // Get the gauge name and custom options
                        const name = this.series.name;
                        const custom = this.series.options.custom || {};

                        // 1. Get MIN/MAX from custom options
                        const minVal = custom.min !== undefined ? parseFloat(custom.min).toFixed(2) : '-';
                        const maxVal = custom.max !== undefined ? parseFloat(custom.max).toFixed(2) : '-';

                        // Format current value
                        const val = (this.y === 0 || this.y === null || this.y === '' || this.y === '-') ?
                            '-' :
                            parseFloat(this.y).toFixed(2);

                        let changeVal = custom.change || 0;
                        let color = '';
                        let icon = '';
                        let changeName = '';

                        // Determine name, icon, and color
                        if (name.includes('PCR')) {
                            changeName = 'PCR';
                        } else if (name.includes('IV')) {
                            changeName = 'IV';
                        }

                        if (changeVal >= 0) {
                            color = '#38c172'; // Green
                            icon = "<i class='fa fa-arrow-trend-up'></i>";
                        } else {
                            color = '#dc3030'; // Red
                            icon = "<i class='fa fa-arrow-trend-down'></i>";
                        }

                        // **Updated HTML with increased width and text alignment:**
                        return (
						'<div style="text-align:center; line-height:2;">' +
							'<div title="' + changeName + ' Value" style="font-size:20px;">' + val + '</div>' +
							'<div style="display:flex; justify-content:space-between; align-items:center; width:140px; margin:2px auto 0 auto; font-size:12px;">' +
								'<span title="Min ' + changeName + '" style="text-align:left; padding-right:5px; font-size:10px;">' + minVal + '</span>' +
								'<span style="padding-right:2px">' + changeName +' </span>'+
								'<span title="' + changeName + ' Change" style="color:' + color + '; white-space:nowrap; text-align:center;">' + icon + ' (' + changeVal + '%)</span>' +
								'<span title="Max ' + changeName + '" style="text-align:right; padding-left:5px; font-size:10px;">' + maxVal + '</span>' +
							'</div>' +
						'</div>'); 
                    }
                }
            }
        }
    };
    // Helper to create a gauge
    // Helper to create a gauge - simplified as axisLabelFormatter is removed
    function createGauge(containerId, color, name) {
        // Note: baseGaugeOptions is merged first, then specific options applied.
        const chart = Highcharts.chart(containerId, Highcharts.merge(baseGaugeOptions, {
            yAxis: {
                min: 0,
                max: 100,
                stops: [
                    [1, color]
                ],
            },
            series: [{
                name,
                data: [],
                // Initial custom property for safety
                custom: {
                    min: 0,
                    max: 100,
                    change: 0
                }
            }]
        }));

        return chart;
    }


    // Helper function to update gauge values and min/max
    function updateGauge(gauge, min, max, value, change) {
        const minVal = min !== null ? parseFloat(min).toFixed(2) : 0;
        const maxVal = max !== null ? parseFloat(max).toFixed(2) : 100;
        const val = value !== null && value !== '-' && value !== 'N/A' && value !== null ? parseFloat(value) : 0;

        const name = gauge.series[0].name;

        // 1. Update Y-Axis min/max (This still sets the gauge's colored range)
        gauge.yAxis[0].update({
            min: parseFloat(minVal),
            max: parseFloat(maxVal),
        }, false); // Do not redraw yet

        // 2. Update Series Data and Custom Values
        // **CRUCIAL CHANGE: Pass min and max into the custom object for the formatter to access**
        gauge.series[0].update({
            data: [val],
            custom: {
                min: minVal, // <-- Now available to the formatter
                max: maxVal, // <-- Now available to the formatter
                change: change
            }
        }, true); // Redraw now
    }


    const parseVal = (val) => {
        if (val === '-' || val === 'N/A' || val === null) return null;
        return parseFloat(parseFloat(val)).toFixed(2); // number with 2 decimals
    };

    // Function to update gauges dynamically (No changes needed here, as it calls the fixed updateGauge)
    function updateGauges(data) {

        const Nifty = {
            minPCR: parseVal(data[12][16][0]),
            maxPCR: parseVal(data[12][17][0]),
            minIV: parseVal(data[12][14][0]),
            maxIV: parseVal(data[12][15][0]),
            pcrVal: data[12][9][0],
            ivVal: data[12][6][0],
            pcrChange: parseVal(data[12][12][0]),
            ivChange: parseVal(data[12][11][0])
        };

        const BankNifty = {
            minPCR: parseVal(data[13][16][0]),
            maxPCR: parseVal(data[13][17][0]),
            minIV: parseVal(data[13][14][0]),
            maxIV: parseVal(data[13][15][0]),
            pcrVal: data[13][9][0],
            ivVal: data[13][6][0],
            pcrChange: parseVal(data[13][12][0]),
            ivChange: parseVal(data[13][11][0])

        };


        // Update all gauges
        updateGauge(gauge1, Nifty.minPCR, Nifty.maxPCR, Nifty.pcrVal, Nifty.pcrChange);
        updateGauge(gauge2, Nifty.minIV, Nifty.maxIV, Nifty.ivVal, Nifty.ivChange);
        updateGauge(gauge3, BankNifty.minPCR, BankNifty.maxPCR, BankNifty.pcrVal, BankNifty.pcrChange);
        updateGauge(gauge4, BankNifty.minIV, BankNifty.maxIV, BankNifty.ivVal, BankNifty.ivChange);


    }

    // Create Gauges (as you provided)
    gauge1 = createGauge('gauge1', '#38c172', 'PCR');
    gauge2 = createGauge('gauge2', '#81ecec', 'IV');
    gauge3 = createGauge('gauge3', '#01cfc9', 'PCR');
    gauge4 = createGauge('gauge4', '#0984e3', 'IV');


    // Function to prepare datetime-based data dynamically
    function prepareChartData(rawData) {
        const datePart = rawData[4][0].split(" ")[0]; // e.g. "08-10-2025"
        const [day, month, year] = datePart.split("-").map(Number);

        // Convert "HH:MM:SS" → UTC timestamps
        const convertToUTC = (timeArr) =>
            timeArr.map((t) => {
                const [h, m, s] = t.split(":").map(Number);
                return Date.UTC(year, month - 1, day, h, m, s);
            });

        const timeUTC = convertToUTC(rawData[1]);
        const priceData = rawData[2].map((v, i) => [timeUTC[i], v]);
        const oiData = rawData[3].map((v, i) => [timeUTC[i], v]);

        return {
            priceData,
            oiData,
            timeUTC
        };
    }

    function loadDataAndUpdateChart() { 
        $.ajax({
            // url: "https://www.icharts.in/opt/api/dashboard/php/getDataForPublicDashboard_v17.php",
            url: "/opt/api/dashboard/php/getDataForPublicDashboard_v17.php",
            type: "GET",
            dataType: "json",
            success: function(data) {
                niftyname = data[0][0];
                bankniftyname = data[1][0];
                niftyPrice = parseFloat(data[12][0]).toFixed(2);
                niftyPriceDiff = parseFloat(data[12][13]).toFixed(2);
                niftyPriceChg = parseFloat(data[12][3]).toFixed(2);
                niftyOiChgDiff = parseFloat(data[12][18]).toFixed(2);
                niftyOiChg = parseFloat(data[12][4]).toFixed(2);
                niftyIvChg = parseFloat(data[12][11]).toFixed(2);
                niftyVol = data[12][2];

                bankniftyPrice = parseFloat(data[13][0]).toFixed(2);
                bankniftyPriceDiff = parseFloat(data[13][13]).toFixed(2);
                bankniftyPriceChg = parseFloat(data[13][3]).toFixed(2);
                bankniftyOiChgDiff = parseFloat(data[13][18]).toFixed(2);
                bankniftyOiChg = parseFloat(data[13][4]).toFixed(2);
                bankniftyIvChg = parseFloat(data[13][11]).toFixed(2);
                bankniftyVol = data[13][2];
                OINifty = data[0][2];
                OIBankNifty = data[1][3];
                Niftylastupdated = data[0][4];
                BankNiftylastupdated = data[1][4];

                // console.log(bankniftyOiChgDiff);
                //console.log(Niftylastupdated[0]);



                Niftylastupdated = formatDate(Niftylastupdated[0]);
                BankNiftylastupdated = formatDate(BankNiftylastupdated[0]);



                if (niftyOiChg > 0) {

                    OINiftyColor = " #43F173";

                } else {
                    OINiftyColor = "#FE6868";

                }

                if (bankniftyOiChg > 0) {
                    OIBankNiftyColor = "#43F173";

                } else {
                    OIBankNiftyColor = "#FE6868";

                }

                // console.log(OIBankNiftyColor);

                if (niftyPriceDiff > 0) {
                    niftyPriceDiffColor = "#38c172";
                } else {
                    niftyPriceDiffColor = "#dc3030";
                }
                if (niftyPriceChg > 0) {
                    niftyPriceChgIcon = "up";
                    niftyPriceChgColor = "#38c172";
                    niftyPriceChgColor1 = "#000000";
                    if (isDarkMode) {
                        niftyPriceChgColor1 = '#FFFFFF';
                    }
                } else {
                    niftyPriceChgIcon = "down";
                    niftyPriceChgColor = "#dc3030";
                    niftyPriceChgColor1 = "#dc3030";
                }
                if (niftyOiChg > 0) {
                    niftyOiChgIcon = "up";
                    niftyOiChgColor = "#38c172";
                } else {
                    niftyOiChgIcon = "down";
                    niftyOiChgColor = "#dc3030";
                }
                if (niftyIvChg > 0) {
                    niftyIvChgIcon = "up";
                    niftyIvChgColor = "#38c172";
                } else {
                    niftyIvChgIcon = "down";
                    niftyIvChgColor = "#dc3030";
                }

                //console.log(niftyPriceChgColor1);


                //nifty buidup color 

                if ((niftyPriceDiff > 0) && (niftyOiChgDiff > 0)) {
                    // $buildup[$p_symbol] =  "LB";  --dark green
                    niftyOiChgColorBuildUp = '#06a503';
                } else if ((niftyPriceDiff < 0) && (niftyOiChgDiff > 0)) {
                    //$buildup[$p_symbol] =  "SB";   --dark red
                    niftyOiChgColorBuildUp = '#e50404';
                } else if ((niftyPriceDiff > 0) && (niftyOiChgDiff < 0)) {
                    //$buildup[$p_symbol] =  "SC";  --light green
                    niftyOiChgColorBuildUp = '#9ffc94';
                } else if ((niftyPriceDiff < 0) && (niftyOiChgDiff < 0)) {
                    //$buildup[$p_symbol] =  "LU";   --light red
                    niftyOiChgColorBuildUp = '#fca4a4';
                } else {
                    niftyOiChgColorBuildUp = '#FFFFFF';
                }

                //console.log(niftyOiChgColorBuildUp);

                //banknifty build up color
                if ((bankniftyPriceDiff > 0) && (bankniftyOiChgDiff > 0)) {
                    // $buildup[$p_symbol] =  "LB";
                    BankNiftyOiChgColorBuildUp = '#06a503';
                } else if ((bankniftyPriceDiff < 0) && (bankniftyOiChgDiff > 0)) {
                    //$buildup[$p_symbol] =  "SB";
                    BankNiftyOiChgColorBuildUp = '#e50404';
                } else if ((bankniftyPriceDiff > 0) && (bankniftyOiChgDiff < 0)) {
                    //$buildup[$p_symbol] =  "SC";
                    BankNiftyOiChgColorBuildUp = '#9ffc94';
                } else if ((bankniftyPriceDiff < 0) && (bankniftyOiChgDiff < 0)) {
                    //$buildup[$p_symbol] =  "LU";
                    BankNiftyOiChgColorBuildUp = '#fca4a4';
                } else {
                    BankNiftyOiChgColorBuildUp = '#FFFFFF';
                }




                //console.log('nifty price diff: ',niftyPriceDiff);
                //console.log('nifty oi diff',niftyOiChgDiff);


                if (bankniftyPriceDiff > 0) {
                    bankniftyPriceDiffColor = "#38c172";
                } else {
                    bankniftyPriceDiffColor = "#dc3030";
                }
                if (bankniftyPriceChg > 0) {
                    bankniftyPriceChgIcon = "up";
                    bankniftyPriceChgColor = "#38c172";
                    bankniftyPriceChgColor1 = "#000000";
                    if (isDarkMode) {
                        bankniftyPriceChgColor1 = '#FFFFFF';
                    }
                } else {
                    bankniftyPriceChgIcon = "down";
                    bankniftyPriceChgColor = "#dc3030";
                    bankniftyPriceChgColor1 = "#dc3030";
                }
                if (bankniftyOiChg > 0) {
                    bankniftyOiChgIcon = "up";
                    bankniftyOiChgColor = "#38c172";
                } else {
                    bankniftyOiChgIcon = "down";
                    bankniftyOiChgColor = "#dc3030";
                }
                if (bankniftyIvChg > 0) {
                    bankniftyIvChgIcon = "up";
                    bankniftyIvChgColor = "#38c172";
                } else {
                    bankniftyIvChgIcon = "down";
                    bankniftyIvChgColor = "#dc3030";
                }
                gaugeniftyPcrChg = data[12][12];
                if (gaugeniftyPcrChg > 0) {
                    gaugeniftyPcrChgIcon = "up";
                    gaugeniftyPcrChgColor = "#38c172";
                } else {
                    gaugeniftyPcrChgIcon = "down";
                    gaugeniftyPcrChgColor = "#dc3030";
                }
                gaugeniftyIvChg = data[12][11];
                if (gaugeniftyIvChg > 0) {
                    gaugeniftyIvChgIcon = "up";
                    gaugeniftyIvChgColor = "#38c172";
                } else {
                    gaugeniftyIvChgIcon = "down";
                    gaugeniftyIvChgColor = "#dc3030";
                }

                gaugebankniftyPcrChg = data[13][12];
                if (gaugebankniftyPcrChg > 0) {
                    gaugebankniftyPcrChgIcon = "up";
                    gaugebankniftyPcrChgColor = "#38c172";
                } else {
                    gaugebankniftyPcrChgIcon = "down";
                    gaugebankniftyPcrChgColor = "#dc3030";
                }
                gaugebankniftyIvChg = data[13][11];
                if (gaugebankniftyIvChg > 0) {
                    gaugebankniftyIvChgIcon = "up";
                    gaugebankniftyIvChgColor = "#38c172";
                } else {
                    gaugebankniftyIvChgIcon = "down";
                    gaugebankniftyIvChgColor = "#dc3030";
                }
                let symbolName_1 = niftyname[0].split('-')[0];
                let symbolName_2 = bankniftyname[0].split('-')[0];
                $(".niftyname").text(niftyname);
                $(".bankniftyname").text(bankniftyname);
                // $(".gaugenifty").text("nifty");
                // $(".gaugebanknifty").text("banknifty");
                $(".gaugenifty").text(symbolName_1);
                $(".gaugebanknifty").text(symbolName_2);

                pNiftyColor = niftyPriceChgColor1;
                areaNiftyColor = niftyOiChgColorBuildUp;
                // Assuming `chart` is your Highcharts chart instance
                /*   chart.update({
                    colors: [niftyPriceChgColor1, niftyOiChgColorBuildUp],
                    series: [{
                            name: 'Price',
                            // type: 'line',
                            type: 'spline', // Changed to spline for smooth line
                            data: data[0][2],
                            yAxis: 0,
                            visible: !!data[0][2]?.length, // hide if no data
                            marker: {
                                enabled: false
                            },
                            lineWidth: 1,
                            zIndex: 1, // Ensure price line is above the area
                        },
                        {
                            name: 'OI',
                            type: 'area',
                            data: data[0][3],
                            yAxis: 1,
                            visible: !!data[0][3]?.length,
                            marker: {
                                enabled: false
                            },
                            color: {
                                linearGradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 0,
                                    y2: 1
                                },
                                stops: [
                                    [0, niftyOiChgColorBuildUp],
                                    [1, Highcharts.color(niftyOiChgColorBuildUp).setOpacity(0.1).get('rgba')]
                                ]
                            }
                        }
                    ],
                    xAxis: {
                        categories: data[0][1],
                        labels: {
                            enabled: false
                        },
                        lineWidth: 0,
                        tickLength: 0,
                        crosshair: {
                            color: 'gray',
                            dashStyle: 'Dash'
                        }
                    },
                    yAxis: [{
                            min: Math.min(...data[0][2].filter(v => v !== 0)), // ignore zeroes
                            max: Math.max(...data[0][2]),
                            labels: {
                                enabled: false
                            },
                            tickAmount: 1,
                            // opposite: true,
                        },
                        {
                            min: Math.min(...data[0][3].filter(v => v !== 0)),
                            max: Math.max(...data[0][3]),
                            labels: {
                                enabled: false
                            },
                            tickAmount: 1,
                            opposite: true
                        }
                    ],
                    tooltip: {
                        shared: true,
                        useHTML: true,

                        formatter: function() {
                            const pointIndex = this.points?.[0]?.point.index ?? 0;
                            return `
                <div class="tooltip-customs">
                    <div class="tooltip-custom_series">
                        <span class="tooltip-custom__namess">Price: </span>
                        <span class="tooltip-custom__values">
                            ${this.points?.[0]?.y ?? 'N/A'}
                        </span>
                    </div>
                    <div class="tooltip-custom_series">
                        <span class="tooltip-custom__namess">OI: </span>
                        <span class="tooltip-custom__values">
                            ${this.points?.[1]?.y ?? 'N/A'}
                        </span>
                    </div>
                    <div class="tooltip-custom_series">
                        <span class="tooltip-custom__namess">Time: </span>
                        <span class="tooltip-custom__values">
                            ${data[0][1][pointIndex]}
                        </span>
                    </div>
                    <div class="tooltip-custom_series">
                        <span class="tooltip-custom__namess">As On </span>
                        <span class="tooltip-custom__values">
                            ${data[0][4][0]}
                        </span>
                    </div>
                </div>
            `;
                        }
                    }
                });
 */

                const niftyData = prepareChartData(data[0]);
                const bankNiftyData = prepareChartData(data[1]);
                // ======== NIFTY Chart Update ========
                chart.update({
                    colors: [niftyPriceChgColor1, niftyOiChgColorBuildUp],
                    series: [{
                            name: 'Price',
                            type: 'spline',
                            data: niftyData.priceData,
                            yAxis: 0,
                            visible: !!niftyData.priceData.length,
                            marker: {
                                enabled: false
                            },
                            lineWidth: 1,
                            zIndex: 1,
                        },
                        {
                            name: 'OI',
                            type: 'area',
                            data: niftyData.oiData,
                            yAxis: 1,
                            visible: !!niftyData.oiData.length,
                            marker: {
                                enabled: false
                            },
                            color: {
                                linearGradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 0,
                                    y2: 1
                                },
                                stops: [
                                    [0, niftyOiChgColorBuildUp],
                                    [1, Highcharts.color(niftyOiChgColorBuildUp).setOpacity(0.1).get('rgba')],
                                ],
                            },
                        },
                    ],
                    xAxis: {
                        type: 'datetime',
                        labels: {
                            enabled: false
                        },
                        lineWidth: 0,
                        tickLength: 0,
                        crosshair: {
                            color: 'gray',
                            dashStyle: 'Dash'
                        },
                    },
                    yAxis: [{
                            min: Math.min(...data[0][2].filter(v => v !== 0)),
                            max: Math.max(...data[0][2]),
                            labels: {
                                enabled: false
                            },
                            tickAmount: 1,
                        },
                        {
                            min: Math.min(...data[0][3].filter(v => v !== 0)),
                            max: Math.max(...data[0][3]),
                            labels: {
                                enabled: false
                            },
                            tickAmount: 1,
                            opposite: true,
                        },
                    ],
                    tooltip: {
                        shared: true,
                        useHTML: true,

                        formatter: function() {
                            const pointIndex = this.points?.[0]?.point.index ?? 0;
                            return `
                <div class="tooltip-customs">
                    <div class="tooltip-custom_series">
                        <span class="tooltip-custom__namess">Price: </span>
                        <span class="tooltip-custom__values">
                            ${this.points?.[0]?.y ?? 'N/A'}
                        </span>
                    </div>
                    <div class="tooltip-custom_series">
                        <span class="tooltip-custom__namess">OI: </span>
                        <span class="tooltip-custom__values">
                            ${this.points?.[1]?.y ?? 'N/A'}
                        </span>
                    </div>
                    <div class="tooltip-custom_series">
                        <span class="tooltip-custom__namess">Time: </span>
                        <span class="tooltip-custom__values">
                            ${data[0][1][pointIndex]}
                        </span>
                    </div>
                    <div class="tooltip-custom_series">
                        <span class="tooltip-custom__namess">As On </span>
                        <span class="tooltip-custom__values">
                            ${data[0][4][0]}
                        </span>
                    </div>
                </div>
            `;
                        }
                    }
                });

                // ======== BANKNIFTY Chart Update ========
                chart2.update({
                    colors: [bankniftyPriceChgColor1, BankNiftyOiChgColorBuildUp],
                    series: [{
                            name: 'Price',
                            type: 'spline',
                            data: bankNiftyData.priceData,
                            yAxis: 0,
                            visible: !!bankNiftyData.priceData.length,
                            marker: {
                                enabled: false
                            },
                            lineWidth: 1,
                            zIndex: 1,
                        },
                        {
                            name: 'OI',
                            type: 'area',
                            data: bankNiftyData.oiData,
                            yAxis: 1,
                            visible: !!bankNiftyData.oiData.length,
                            marker: {
                                enabled: false
                            },
                            color: {
                                linearGradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 0,
                                    y2: 1
                                },
                                stops: [
                                    [0, BankNiftyOiChgColorBuildUp],
                                    [1, Highcharts.color(BankNiftyOiChgColorBuildUp).setOpacity(0.3).get('rgba')],
                                ],
                            },
                        },
                    ],
                    xAxis: {
                        type: 'datetime',
                        labels: {
                            enabled: false
                        },
                        crosshair: {
                            color: 'gray',
                            dashStyle: 'Dash'
                        },
                    },
                    yAxis: [{
                            min: Math.min(...data[1][2].filter(v => v !== 0)),
                            max: Math.max(...data[1][2]),
                            labels: {
                                enabled: false
                            },
                            tickAmount: 4,
                        },
                        {
                            min: Math.min(...data[1][3].filter(v => v !== 0)),
                            max: Math.max(...data[1][3]),
                            labels: {
                                enabled: false
                            },
                            tickAmount: 4,
                            opposite: true,
                        },
                    ],
                    tooltip: {
                        shared: true,
                        useHTML: true,
                        formatter: function() {
                            const pointIndex = this.points?.[0]?.point.index ?? 0;
                            return `
                <div class="tooltip-customs">
                    <div class="tooltip-custom_series">
                        <span class="tooltip-custom__namess">Price: </span>
                        <span class="tooltip-custom__values">
                            ${this.points?.[0]?.y ?? 'N/A'}
                        </span>
                    </div>
                    <div class="tooltip-custom_series">
                        <span class="tooltip-custom__namess">OI: </span>
                        <span class="tooltip-custom__values">
                            ${this.points?.[1]?.y ?? 'N/A'}
                        </span>
                    </div>
                    <div class="tooltip-custom_series">
                        <span class="tooltip-custom__namess">Time: </span>
                        <span class="tooltip-custom__values">
                            ${data[1][1][pointIndex]}
                        </span>
                    </div>
                    <div class="tooltip-custom_series">
                        <span class="tooltip-custom__namess">As On </span>
                        <span class="tooltip-custom__values">
                            ${data[0][4]}
                        </span>
                    </div>
                </div>
            `;
                        }
                    },
                });


                if (niftyIvChg === '-100.00') {
                    niftyIvChg = '-';
                }
                niftyDataHTML =
                    "<div class='px-4'><div class='niftypricedata grid xl:grid-cols-3 md:grid-cols-2 xl:gap-3 lg:gap-1'><h6 class='col-span-2'><span style='color:#898989'>Price : </span>&nbsp;<span title='NiftyPrice'> " +
                    niftyPrice +
                    "</span>&nbsp; <span title='NiftyPriceDifference' style='color:" +
                    niftyPriceDiffColor +
                    "'>" +
                    niftyPriceDiff +
                    "</span> &nbsp;<span title='NiftyPriceChg' style='color:" +
                    niftyPriceChgColor +
                    "'><i class='fa fa-arrow-trend-" +
                    niftyPriceChgIcon +
                    "'></i> (" +
                    niftyPriceChg +
                    "<i class='fa-light fa-percent'></i>)</span>&nbsp;</h6><h6 class='col-span-1'><span style='color:#898989'>OI : </span>&nbsp;<span title='NiftyOiChg' style='color:" +
                    niftyOiChgColor +
                    "'><i class='fa fa-arrow-trend-" +
                    niftyOiChgIcon +
                    "'></i> (" +
                    niftyOiChg +
                    "<i class='fa-light fa-percent'></i>)</span>&nbsp;</h6><h6 class='col-span-1'><span style='color:#898989'>IV : </span>&nbsp;<span title='NiftyIvChg' style='color:" +
                    niftyIvChgColor +
                    "'><i class='fa fa-arrow-trend-" +
                    niftyIvChgIcon +
                    "'></i> (" +
                    niftyIvChg +
                    "<i class='fa-light fa-percent'></i>)</span>&nbsp;</h6><h6 class='col-span-1'><span style='color:#898989'>Vol : </span>&nbsp;<span title='NiftyVol'>" +
                    niftyVol +
                    "</span></h6></div>" + "<h6 class='card-text'><span title='&copy;  www.icharts.in'style='font-size:13px;font-weight:BOLD'></span><small style='float:right'><span style='float:right;font-size:13px;'>" + '&copy;  www.icharts.in' + "</span></small></h6>" +
                    "<h6 class='card-text'><span title='Last Updated 'style='font-size:12px;font-weight:BOLD'> As On: </span><small style='float:center;'>&nbsp;<span title='Lastupdated' style='float:center;font-size:12px;font-weight:normal;'>" + Niftylastupdated + "</span></small></h6></div>";
                $(".niftyData").html(niftyDataHTML);


                pBankNiftyColor = bankniftyPriceChgColor1;
                areaBankNiftyColor = BankNiftyOiChgColorBuildUp;
                const priceData = data[1][2].map(value => (value === 0 ? null : value));
                const oiData = data[1][3].map(value => (value === 0 ? null : value));

                const isPriceVisible = priceData.some(value => value !== null);
                const isOiVisible = oiData.some(value => value !== null);

                /* chart2.update({
                    colors: [bankniftyPriceChgColor1, BankNiftyOiChgColorBuildUp],
                    series: [{
                            name: 'Price',
                            // type: 'line',
                            type: 'spline', // ? smooth line
                            data: priceData,
                            yAxis: 0,
                            visible: isPriceVisible, // mimic Apex visible flag
                            lineWidth: 1,
                            marker: {
                                enabled: false
                            },
                            step: false,
                            zIndex: 1, // Ensure price line is above the area
                        },
                        {
                            name: 'OI',
                            type: 'area',
                            data: oiData,
                            yAxis: 1,
                            visible: isOiVisible,
                            marker: {
                                enabled: false
                            },
                            color: {
                                linearGradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 0,
                                    y2: 1
                                },
                                stops: [
                                    [0, BankNiftyOiChgColorBuildUp],
                                    [1, Highcharts.color(BankNiftyOiChgColorBuildUp).setOpacity(0.5).get('rgba')]
                                ]
                            }
                        }
                    ],
                    xAxis: {
                        categories: data[1][1], // Time labels
                        labels: {
                            enabled: false
                        },
                        crosshair: {
                            color: 'gray',
                            dashStyle: 'Dash'
                        }
                    },
                    yAxis: [{
                            min: isPriceVisible ? Math.min(...data[1][2].filter(v => v !== 0)) : 0,
                            max: isPriceVisible ? Math.max(...data[1][2]) : 0,
                            labels: {
                                enabled: false
                            },
                            tickAmount: 4
                        },
                        {
                            min: isOiVisible ? Math.min(...data[1][3].filter(v => v !== 0)) : 0,
                            max: isOiVisible ? Math.max(...data[1][3]) : 0,
                            labels: {
                                enabled: false
                            },
                            tickAmount: 4,
                            opposite: true
                        }
                    ],
                    tooltip: {
                        shared: true,
                        useHTML: true,
                        formatter: function() {
                            const pointIndex = this.points?.[0]?.point.index ?? 0;
                            return `
                <div class="tooltip-customs">
                    <div class="tooltip-custom_series">
                        <span class="tooltip-custom__namess">Price: </span>
                        <span class="tooltip-custom__values">
                            ${this.points?.[0]?.y ?? 'N/A'}
                        </span>
                    </div>
                    <div class="tooltip-custom_series">
                        <span class="tooltip-custom__namess">OI: </span>
                        <span class="tooltip-custom__values">
                            ${this.points?.[1]?.y ?? 'N/A'}
                        </span>
                    </div>
                    <div class="tooltip-custom_series">
                        <span class="tooltip-custom__namess">Time: </span>
                        <span class="tooltip-custom__values">
                            ${data[1][1][pointIndex]}
                        </span>
                    </div>
                    <div class="tooltip-custom_series">
                        <span class="tooltip-custom__namess">As On </span>
                        <span class="tooltip-custom__values">
                            ${data[0][4]}
                        </span>
                    </div>
                </div>
            `;
                        }
                    }
                }); */

                if (bankniftyIvChg === '-100.00') {
                    bankniftyIvChg = '-';
                }

                bankniftyDataHTML =
                    "<div class='px-4'><div class='bankniftypricedata grid xl:grid-cols-3 md:grid-cols-2 xl:gap-3 lg:gap-1'><h6 class='col-span-2'><span style='color:#898989'>Price : </span>&nbsp;<span title='BankNiftyPrice'> " +
                    bankniftyPrice +
                    "</span>&nbsp; <span title='BankNiftyPriceDifference' style='color:" +
                    bankniftyPriceDiffColor +
                    "'>" +
                    bankniftyPriceDiff +
                    "</span>&nbsp; <span title='BankNiftyPriceChg' style='color:" +
                    bankniftyPriceChgColor +
                    "'><i class='fa fa-arrow-trend-" +
                    bankniftyPriceChgIcon +
                    "'></i> (" +
                    bankniftyPriceChg +
                    "<i class='fa-light fa-percent'></i>)</span>&nbsp;</h6><h6 class='col-span-1'><span style='color:#898989'>OI : </span>&nbsp;<span title='BankNiftyOiChg' style='color:" +
                    bankniftyOiChgColor +
                    "'><i class='fa fa-arrow-trend-" +
                    bankniftyOiChgIcon +
                    "'></i> (" +
                    bankniftyOiChg +
                    "<i class='fa-light fa-percent'></i>)</span>&nbsp;</h6><h6 class='col-span-1'><span style='color:#898989'>IV : </span>&nbsp;<span title='BankNiftyIvChg' style='color:" +
                    bankniftyIvChgColor +
                    "'><i class='fa fa-arrow-trend-" +
                    bankniftyIvChgIcon +
                    "'></i> (" +
                    bankniftyIvChg +
                    "<i class='fa-light fa-percent'></i>)</span>&nbsp;</h6><h6 class='col-span-1'><span style='color:#898989'>Vol : </span>&nbsp;<span title='BankNiftyVol'>" +
                    bankniftyVol +
                    "</span></h6></div>" + "<h6 class='card-text'><span title='&copy;  www.icharts.in'style='font-size:13px;font-weight:BOLD'></span><small style='float:right'><span style='float:right;font-size:13px;'>" + '&copy;  www.icharts.in' + "</span></small></h6>" +
                    "<h6 class='card-text'><span title='Last Updated 'style='font-size:12px;font-weight:BOLD'> As On: </span><small style='float:center;'>&nbsp;<span title='Lastupdated'style='float:center;font-size:12px;font-weight:normal;'>" + BankNiftylastupdated + "</span></small></h6></div>";
                $(".bankniftyData").html(bankniftyDataHTML);

                /*  var niftypcrvalue = ((data[12][9] - data[12][16]) / (data[12][17] - data[12][16])) * 100;
                 gauge1.updateOptions({
                   series: [niftypcrvalue],
                   labels: data[12][9],
                 });
                 var niftyPcrDataHTML =
                   "<div class='flex justify-between'><h6 title='Min PCR' class='min-maxgaugeData'>" +
                   data[12][16] +
                   "</h6><h6 title='Max PCR' class='min-maxgaugeData'>" +
                   data[12][17] +
                   "</h6></div><div><h6 class='gaugeData'>PCR&nbsp;<span title='NiftyPcrChg' style='color:" +
                   gaugeniftyPcrChgColor +
                   "'><i class='fa fa-arrow-trend-" +
                   gaugeniftyPcrChgIcon +
                   "'></i> (" +
                   gaugeniftyPcrChg +
                   "<i class='fa-light fa-percent'></i>)</span></h6></div>";
                 $(".niftyPcrData").html(niftyPcrDataHTML);
                 var niftyivvalue = ((data[12][6] - data[12][14]) / (data[12][15] - data[12][14])) * 100;
                 gauge2.updateOptions({
                   series: [niftyivvalue],
                   labels: [
                     data[12][6][0] === 0 ? "-" : String(data[12][6][0])
                   ]
                 });




                 var niftyIvDataHTML =
                   "<div class='flex justify-between'><h6 title='Min Iv' class='min-maxgaugeData'>" +
                   data[12][14] +
                   "</h6><h6 title='Max Iv' class='min-maxgaugeData'>" +
                   data[12][15] +
                   "</h6></div><div><h6 class='gaugeData'>IV&nbsp;<span title='NiftyIvChg' style='color:" +
                   gaugeniftyIvChgColor +
                   "'><i class='fa fa-arrow-trend-" +
                   gaugeniftyIvChgIcon +
                   "'></i> (" +
                   gaugeniftyIvChg +
                   "<i class='fa-light fa-percent'></i>)</span></h6></div>";

                 $(".niftyIvData").html(niftyIvDataHTML);

                 var bankniftypcrvalue =
                   ((data[13][9] - data[13][16]) / (data[13][17] - data[13][16])) * 100;
                 gauge3.updateOptions({
                   series: [bankniftypcrvalue],
                   labels: data[13][9],
                 });

                 var bankniftyPcrDataHTML =
                   "<div class='flex justify-between'><h6 title='Min PCR' class='min-maxgaugeData'>" +
                   data[13][16] +
                   "</h6><h6 title='Max PCR' class='min-maxgaugeData'>" +
                   data[13][17] +
                   "</h6></div><div><h6 class='gaugeData'>PCR&nbsp;<span title='BankNiftyPcrChg' style='color:" +
                   gaugebankniftyPcrChgColor +
                   "'><i class='fa fa-arrow-trend-" +
                   gaugebankniftyPcrChgIcon +
                   "'></i> (" +
                   gaugebankniftyPcrChg +
                   "<i class='fa-light fa-percent'></i>)</span></h6></div>";

                 $(".bankniftyPcrData").html(bankniftyPcrDataHTML);

                 var bankniftyivvalue =
                   ((data[13][6] - data[13][14]) / (data[13][15] - data[13][14])) * 100;
                 gauge4.updateOptions({
                   series: [bankniftyivvalue],
                   labels: [
                     data[13][6][0] === 0 ? "-" : String(data[13][6][0])
                   ],
                 });

                 var bankniftyIvDataHTML =
                   "<div class='flex justify-between'><h6 title='Min Iv' class='min-maxgaugeData'>" +
                   data[13][14] +
                   "</h6><h6 title='Max Iv' class='min-maxgaugeData'>" +
                   data[13][15] +
                   "</h6></div><div><h6 class='gaugeData'>IV&nbsp;<span title='BankNiftyIvChg' style='color:" +
                   gaugebankniftyIvChgColor +
                   "'><i class='fa fa-arrow-trend-" +
                   gaugebankniftyIvChgIcon +
                   "'></i> (" +
                   gaugebankniftyIvChg +
                   "<i class='fa-light fa-percent'></i>)</span></h6></div>";

                 $(".bankniftyIvData").html(bankniftyIvDataHTML); */

                //Gauges Updates
                updateGauges(data);

                if (data[2][0] != null) {
                    longbuildupname = data[2][0];
                    $(".longbuildup").text(longbuildupname);
                    longbuildup = data[2];
                    longbuildupdata = data[2][1];
                    positiveData1 = data[2][4].map((dataPoint) => Math.abs(dataPoint));
                    positiveData12 = data[2][2].map((dataPoint) => Math.abs(dataPoint));
                    positiveData13 = data[2][6].map((dataPoint) => Math.abs(dataPoint));
                    // console.log("1", positiveData1);

                    // maxNumber12 = Math.max(...positiveData12);
                    $("#bar1").empty();
                    for (var i = 0; i < longbuildupdata.length; i++) {
                        maxNumber1 = Math.max(positiveData1[i], positiveData12[i], positiveData13[i], 100);
                        if (longbuildup[4][i] > 0) {
                            barPriceChgIcon = "up";
                            barPriceChgColor = "#38c172";
                        } else {
                            barPriceChgIcon = "down";
                            barPriceChgColor = "#dc3030";
                        }
                        if (longbuildup[5][i] > 0) {
                            barOIChgIcon = "up";
                            barOIChgColor = "#38c172";
                        } else {
                            barOIChgIcon = "down";
                            barOIChgColor = "#dc3030";
                        }
                        if (longbuildup[6][i] > 0) {
                            barVolChgIcon = "up";
                            barVolChgColor = "#38c172";
                        } else {
                            barVolChgIcon = "down";
                            barVolChgColor = "#dc3030";
                        }
                        // Determine the bar color classes based on data values
                        var singleBar1Class = longbuildup[4][i] < 0 ? "negativeColor" : "positiveColor";
                        var singleBar2Class = longbuildup[2][i] < 0 ? "negativeColor" : "positiveColor";
                        var singleBar3Class = longbuildup[6][i] < 0 ? "negativeColor" : "positiveColor";

                        var symbol = longbuildupdata[i];
                        var imgSrc = "./assets_adq/images/icons/" + symbol + ".svg?v" + imgVer;
                        if (imgSrc == undefined || symbol == '' || symbol == 'BANKNIFTY' || symbol == 'NIFTY' || symbol == 'NIFTYNXT50' || symbol == 'FINNIFTY' || symbol == 'MIDCPNIFTY' || symbol == 'SENSEX' || symbol == 'BANKEX') {
                            imgSrc = "./assets_adq/images/logo.png";
                        }

                        var bar1HTML =
                            "<div class='bar-main'><div class='data-flex'><div class='image-div' ><img src=" + imgSrc + "  title=" + symbol + " class='img' alt='logo' style='height:30px; width:30px; '/></div><div class='bar-data'><div class='display-data'><h5 class='bar-title' style='font-size:13px; padding-top:2px; padding-bottom:2px;'>" +
                            longbuildupdata[i] +
                            "</h5></div><div class='singlebar1 " + singleBar1Class + "' title='Price Chg' style='border-radius:3px;border-top-left-radius:0px;border-bottom-left-radius:0px;top:5px;;margin-bottom:3px;fontFamily:Poppins, sans-serif;font-size:11px;height:14px;width: calc(" +
                            positiveData1[i] +
                            "/" +
                            maxNumber1 +
                            "*100%); '>" +
                            longbuildup[3][i] + "&nbsp;(" +
                            longbuildup[4][i] +
                            "%)</div><div class='singlebar2 " + singleBar2Class + "' title='OI Chg' style='border-radius:3px;border-top-left-radius:0px;border-bottom-left-radius:0px;top:5px;;margin-bottom:3px;font-size:11px;fontFamily:Poppins, sans-serif;height:14px;width: calc(" +
                            positiveData12[i] +
                            "/" +
                            maxNumber1 +
                            "*100%); '>" +
                            longbuildup[2][i] +
                            "%</div><div class='singlebar3 " + singleBar3Class + "' title='Vol Chg' style='border-radius:3px;border-top-left-radius:0px;border-bottom-left-radius:0px;top:5px;;margin-bottom:3px;font-size:11px;fontFamily:Poppins, sans-serif;height:14px;width: calc(" +
                            positiveData13[i] +
                            "/" +
                            maxNumber1 +
                            "*100%);'>" +
                            longbuildup[6][i] +
                            "%</div></div>";

                        $("#bar1").append(bar1HTML);
                    }

                } else {
                    $(".longbuildup").text("Long Buildup");
                    $("#bar1").css("height", "100%");
                    $("#bar1").html(
                        "<div class='flex justify-center items-center h-full'><h4 class='font-bold text-sm font-mono'>Data unavailable</h4></div>"
                    );
                }
                if (data[3][0] != null) {
                    shortcoveringname = data[3][0];
                    $(".shortcovering").text(shortcoveringname);
                    shortcovering = data[3];
                    shortcoveringdata = data[3][1];
                    positiveData2 = data[3][4].map((dataPoint) => Math.abs(dataPoint));
                    positiveData22 = data[3][2].map((dataPoint) => Math.abs(dataPoint));
                    positiveData23 = data[3][6].map((dataPoint) => Math.abs(dataPoint));
                    // console.log("2", positiveData2);

                    // maxNumber22 = Math.max(...positiveData22);
                    $("#bar2").empty();
                    for (var i = 0; i < shortcoveringdata.length; i++) {
                        maxNumber2 = Math.max(positiveData2[i], positiveData22[i], positiveData23[i], 100);
                        if (shortcovering[4][i] > 0) {
                            barPriceChgIcon = "up";
                            barPriceChgColor = "#38c172";
                        } else {
                            barPriceChgIcon = "down";
                            barPriceChgColor = "#dc3030";
                        }
                        if (shortcovering[5][i] > 0) {
                            barOIChgIcon = "up";
                            barOIChgColor = "#38c172";
                        } else {
                            barOIChgIcon = "down";
                            barOIChgColor = "#dc3030";
                        }
                        if (shortcovering[6][i] > 0) {
                            barVolChgIcon = "up";
                            barVolChgColor = "#38c172";
                        } else {
                            barVolChgIcon = "down";
                            barVolChgColor = "#dc3030";
                        }
                        singleBar1Class = shortcovering[4][i] < 0 ? "negativeColor" : "positiveColor";
                        singleBar2Class = shortcovering[2][i] < 0 ? "negativeColor" : "positiveColor";
                        singleBar3Class = shortcovering[6][i] < 0 ? "negativeColor" : "positiveColor";

                        var symbol1 = shortcoveringdata[i];
                        var imgSrc1 = "./assets_adq/images/icons/" + symbol1 + ".svg?v" + imgVer;
                        if (imgSrc1 == undefined || symbol1 == '' || symbol1 == 'BANKNIFTY' || symbol1 == 'NIFTY' || symbol1 == 'NIFTYNXT50' || symbol1 == 'FINNIFTY' || symbol1 == 'MIDCPNIFTY' || symbol1 == 'SENSEX' || symbol1 == 'BANKEX') {
                            imgSrc1 = "./assets_adq/images/logo.png";
                        }
                        $("#bar2").append(
                            "<div class='bar-main'><div class='data-flex'><div class='image-div'><img src=" + imgSrc1 + " title=" + symbol1 + " class='img' alt='logo' style='height:30px; width:30px; '/></div><div class='bar-data'><div class='display-data'><h5 class='bar-title'style='font-size:13px; padding-top:2px; padding-bottom:2px;'>" +
                            shortcoveringdata[i] +
                            "</h5></div><div class='singlebar1 " + singleBar1Class + "' title='Price Chg' style='border-radius:3px;border-top-left-radius:0px;border-bottom-left-radius:0px;top:5px;;margin-bottom:3px;font-size:11px;font-size:11px;height:14px;width: calc(" +
                            positiveData2[i] +
                            "/" +
                            maxNumber2 +
                            "*100%); '>" + shortcovering[3][i] + "&nbsp;(" +
                            shortcovering[4][i] +
                            "%)</div><div class='singlebar2 " + singleBar2Class + "' title='OI Chg' style='border-radius:3px;border-top-left-radius:0px;border-bottom-left-radius:0px;top:5px;;margin-bottom:3px;font-size:11px;font-size:11px;height:14px;width: calc(" +
                            positiveData22[i] +
                            "/" +
                            maxNumber2 +
                            "*100%); '>" +
                            shortcovering[2][i] +
                            "%</div><div class='singlebar3 " + singleBar3Class + "' title='Vol Chg' style='border-radius:3px;border-top-left-radius:0px;border-bottom-left-radius:0px;top:5px;;margin-bottom:3px;font-size:11px;font-size:11px;height:14px;width: calc(" +
                            positiveData23[i] +
                            "/" +
                            maxNumber2 +
                            "*100%); '>" +
                            shortcovering[6][i] +
                            "%</div></div>"
                        );
                    }
                } else {
                    $(".shortcovering").text("Short Covering");
                    $("#bar2").css("height", "100%");
                    $("#bar2").html(
                        "<div class='flex justify-center items-center h-full'><h4 class='font-bold text-sm font-mono'>Data unavailable</h4></div>"
                    );
                }
                if (data[4][0] != null) {
                    shortbuildupname = data[4][0];
                    $(".shortbuildup").text(shortbuildupname);
                    shortbuildup = data[4];
                    shortbuildupdata = data[4][1];
                    positiveData3 = data[4][4].map((dataPoint) => Math.abs(dataPoint));
                    positiveData32 = data[4][2].map((dataPoint) => Math.abs(dataPoint));
                    positiveData33 = data[4][6].map((dataPoint) => Math.abs(dataPoint));
                    // console.log("3", positiveData3);

                    // maxNumber32 = Math.max(...positiveData32);
                    $("#bar3").empty();
                    for (var i = 0; i < shortbuildupdata.length; i++) {
                        maxNumber3 = Math.max(positiveData3[i], positiveData32[i], positiveData33[i], 100);
                        if (shortbuildup[4][i] > 0) {
                            barPriceChgIcon = "up";
                            barPriceChgColor = "#38c172";
                        } else {
                            barPriceChgIcon = "down";
                            barPriceChgColor = "#dc3030";
                        }
                        if (shortbuildup[5][i] > 0) {
                            barOIChgIcon = "up";
                            barOIChgColor = "#38c172";
                        } else {
                            barOIChgIcon = "down";
                            barOIChgColor = "#dc3030";
                        }
                        if (shortbuildup[6][i] > 0) {
                            barVolChgIcon = "up";
                            barVolChgColor = "#38c172";
                        } else {
                            barVolChgIcon = "down";
                            barVolChgColor = "#dc3030";
                        }
                        singleBar1Class = shortbuildup[4][i] < 0 ? "negativeColor" : "positiveColor";
                        singleBar2Class = shortbuildup[5][i] < 0 ? "negativeColor" : "positiveColor";
                        singleBar3Class = shortbuildup[6][i] < 0 ? "negativeColor" : "positiveColor";
                        var symbol2 = shortbuildupdata[i];
                        var imgSrc2 = "./assets_adq/images/icons/" + symbol2 + ".svg?v" + imgVer;
                        if (imgSrc2 == undefined || symbol2 == '' || symbol2 == 'BANKNIFTY' || symbol2 == 'NIFTY' || symbol2 == 'NIFTYNXT50' || symbol2 == 'FINNIFTY' || symbol2 == 'MIDCPNIFTY' || symbol2 == 'SENSEX' || symbol2 == 'BANKEX') {
                            imgSrc2 = "./assets_adq/images/logo.png";
                        }

                        $("#bar3").append(
                            "<div class='bar-main'><div class='data-flex'><div class='image-div'><img src=" + imgSrc2 + "  title=" + symbol2 + " class='img' alt='logo' style='height:30px; width:30px; '/></div><div class='bar-data'><div class='display-data'><h5 class='bar-title'style='font-size:13px; padding-top:2px; padding-bottom:2px;'>" +
                            shortbuildupdata[i] +
                            "</h5></div><div class='singlebar1 " + singleBar1Class + "' title='Price Chg' style='border-radius:3px;border-top-left-radius:0px;border-bottom-left-radius:0px;top:5px;;margin-bottom:3px;font-size:11px;height:14px;width: calc(" +
                            positiveData3[i] +
                            "/" +
                            maxNumber3 +
                            "*100%); back'>" +
                            shortbuildup[3][i] + "&nbsp;(" +
                            shortbuildup[4][i] +
                            "%)</div><div class='singlebar2 " + singleBar2Class + "' title='OI Chg' style='border-radius:3px;border-top-left-radius:0px;border-bottom-left-radius:0px;top:5px;;margin-bottom:3px;font-size:11px;font-size:11px;height:14px;width: calc(" +
                            positiveData32[i] +
                            "/" +
                            maxNumber3 +
                            "*100%); '>" +
                            shortbuildup[5][i] +
                            "%</div><div class='singlebar3 " + singleBar3Class + "' title='Vol Chg' style='border-radius:3px;border-top-left-radius:0px;border-bottom-left-radius:0px;top:5px;;margin-bottom:3px;font-size:11px;font-size:11px;height:14px;width: calc(" +
                            positiveData33[i] +
                            "/" +
                            maxNumber3 +
                            "*100%);'>" +
                            shortbuildup[6][i] +
                            "%</div></div>"
                        );
                    }
                } else {
                    $(".shortbuildup").text("Short Buildup");
                    $("#bar3").css("height", "100%");
                    $("#bar3").html(
                        "<div class='flex justify-center items-center h-full'><h4 class='font-bold text-sm font-mono'>Data unavailable</h4></div>"
                    );
                }
                if (data[5][0] != null) {
                    longunwindingname = data[5][0];
                    $(".longunwinding").text(longunwindingname);
                    longunwinding = data[5];
                    longunwindingdata = data[5][1];
                    positiveData4 = data[5][4].map((dataPoint) => Math.abs(dataPoint));
                    positiveData42 = data[5][2].map((dataPoint) => Math.abs(dataPoint));
                    positiveData43 = data[5][6].map((dataPoint) => Math.abs(dataPoint));
                    // console.log("4", positiveData4);

                    // maxNumber42 = Math.max(...positiveData42);
                    $("#bar4").empty();
                    for (var i = 0; i < longunwindingdata.length; i++) {
                        maxNumber4 = Math.max(positiveData4[i], positiveData42[i], positiveData43[i], 100);
                        if (longunwinding[4][i] > 0) {
                            barPriceChgIcon = "up";
                            barPriceChgColor = "#38c172";
                        } else {
                            barPriceChgIcon = "down";
                            barPriceChgColor = "#dc3030";
                        }
                        if (longunwinding[5][i] > 0) {
                            barOIChgIcon = "up";
                            barOIChgColor = "#38c172";
                        } else {
                            barOIChgIcon = "down";
                            barOIChgColor = "#dc3030";
                        }
                        if (longunwinding[6][i] > 0) {
                            barVolChgIcon = "up";
                            barVolChgColor = "#38c172";
                        } else {
                            barVolChgIcon = "down";
                            barVolChgColor = "#dc3030";
                        }
                        singleBar1Class = longunwinding[4][i] < 0 ? "negativeColor" : "positiveColor";
                        singleBar2Class = longunwinding[2][i] < 0 ? "negativeColor" : "positiveColor";
                        singleBar3Class = longunwinding[6][i] < 0 ? "negativeColor" : "positiveColor";
                        var symbol3 = longunwindingdata[i];
                        var imgSrc3 = "./assets_adq/images/icons/" + symbol3 + ".svg?v" + imgVer;
                        if (imgSrc3 == undefined || symbol3 == '' || symbol3 == 'BANKNIFTY' || symbol3 == 'NIFTY' || symbol3 == 'NIFTYNXT50' || symbol3 == 'FINNIFTY' || symbol3 == 'MIDCPNIFTY' || symbol3 == 'SENSEX' || symbol3 == 'BANKEX') {
                            imgSrc3 = "./assets_adq/images/logo.png";
                        }
                        $("#bar4").append(
                            "<div class='bar-main'><div class='data-flex'><div class='image-div'><img src=" + imgSrc3 + "  title=" + symbol3 + " class='img' alt='logo' style='height:30px; width:30px; '/></div><div class='bar-data'><div class='display-data'><h5 class='bar-title'style='font-size:13px; padding-top:2px; padding-bottom:2px;'>" +
                            longunwindingdata[i] +
                            "</h5></div><div class='singlebar1 " + singleBar1Class + "' title='Price Chg' style='border-radius:3px;border-top-left-radius:0px;border-bottom-left-radius:0px;top:5px;;margin-bottom:3px;font-size:11px;height:14px;width: calc(" +
                            positiveData4[i] +
                            "/" +
                            maxNumber4 +
                            "*100%); '>" +
                            longunwinding[3][i] + "&nbsp;(" +
                            longunwinding[4][i] +
                            "%)</div><div class='singlebar2 " + singleBar2Class + "' title='OI Chg' style='border-radius:3px;border-top-left-radius:0px;border-bottom-left-radius:0px;top:5px;;margin-bottom:3px;font-size:11px;height:14px;width: calc(" +
                            positiveData42[i] +
                            "/" +
                            maxNumber4 +
                            "*100%); '>" +
                            longunwinding[2][i] +
                            "%</div><div class='singlebar3 " + singleBar3Class + "' title='Vol Chg' style='border-radius:3px;border-top-left-radius:0px;border-bottom-left-radius:0px;top:5px;;margin-bottom:3px;font-size:11px;height:14px;width: calc(" +
                            positiveData43[i] +
                            "/" +
                            maxNumber4 +
                            "*100%); '>" +
                            longunwinding[6][i] +
                            "%</div></div>"
                        );
                    }
                } else {
                    $(".longunwinding").text("Long Unwinding");
                    $("#bar4").css("height", "100%");
                    $("#bar4").html(
                        "<div class='flex justify-center items-center h-full'><h4 class='font-bold text-sm font-mono'>Data unavailable</h4></div>"
                    );
                }
                if (data[6][0] != null) {
                    pricegainersname = data[6][0];
                    $(".pricegainers").text(pricegainersname);
                    pricegainers = data[6];
                    pricegainersdata = data[6][1];
                    positiveData5 = data[6][4].map((dataPoint) => Math.abs(dataPoint));
                    positiveData51 = data[6][5].map((dataPoint) => Math.abs(dataPoint));
                    positiveData52 = data[6][6].map((dataPoint) => Math.abs(dataPoint));
                    //  console.log("5", positiveData51[i],100);

                    $("#bar5").empty();
                    for (var i = 0; i < pricegainersdata.length; i++) {
                        maxNumber5 = Math.max(positiveData5[i], positiveData51[i], positiveData52[i], 100);
                        if (pricegainers[4][i] > 0) {
                            barPriceChgIcon = "up";
                            barPriceChgColor = "#38c172";
                        } else {
                            barPriceChgIcon = "down";
                            barPriceChgColor = "#dc3030";
                        }
                        if (pricegainers[5][i] > 0) {
                            barOIChgIcon = "up";
                            barOIChgColor = "#38c172";
                        } else {
                            barOIChgIcon = "down";
                            barOIChgColor = "#dc3030";
                        }
                        if (pricegainers[6][i] > 0) {
                            barVolChgIcon = "up";
                            barVolChgColor = "#38c172";
                        } else {
                            barVolChgIcon = "down";
                            barVolChgColor = "#dc3030";
                        }
                        singleBar1Class = pricegainers[2][i] < 0 ? "negativeColor" : "positiveColor";
                        singleBar2Class = pricegainers[5][i] < 0 ? "negativeColor" : "positiveColor";
                        singleBar3Class = pricegainers[6][i] < 0 ? "negativeColor" : "positiveColor";
                        var symbol4 = pricegainersdata[i];
                        var imgSrc4 = "./assets_adq/images/icons/" + symbol4 + ".svg?v" + imgVer;
                        if (imgSrc4 == undefined || symbol4 == '' || symbol4 == 'BANKNIFTY' || symbol4 == 'NIFTY' || symbol4 == 'NIFTYNXT50' || symbol4 == 'FINNIFTY' || symbol4 == 'MIDCPNIFTY' || symbol4 == 'SENSEX' || symbol4 == 'BANKEX') {
                            imgSrc4 = "./assets_adq/images/logo.png";
                        }
                        $("#bar5").append(
                            "<div class='bar-main'><div class='data-flex'><div class='image-div'><img src=" + imgSrc4 + "  title=" + symbol4 + " class='img' alt='logo' style='height:30px; width:30px; '/></div><div class='bar-data'><div class='display-data'><h5 class='bar-title'style='font-size:13px; padding-top:2px; padding-bottom:2px;'>" +
                            pricegainersdata[i] +
                            "</h5></div><div class='singlebar1 " + singleBar1Class + "' title='Price Chg' style='border-radius:3px;border-top-left-radius:0px;border-bottom-left-radius:0px;top:5px;;margin-bottom:3px;font-size:11px;height:14px;width: calc(" +
                            positiveData5[i] +
                            "/" +
                            maxNumber5 +
                            "*100%); '>" +
                            pricegainers[3][i] + "&nbsp;(" +
                            pricegainers[2][i] +
                            "%)</div><div class='singlebar2 " + singleBar2Class + "' title='OI Chg' style='border-radius:3px;border-top-left-radius:0px;border-bottom-left-radius:0px;top:5px;;margin-bottom:3px;font-size:11px;height:14px;width: calc(" +
                            positiveData51[i] +
                            "/" +
                            maxNumber5 +
                            "*100%);'>" +
                            pricegainers[5][i] +
                            "%</div><div class='singlebar3 " + singleBar3Class + "' title='Vol Chg' style='border-radius:3px;border-top-left-radius:0px;border-bottom-left-radius:0px;top:5px;;margin-bottom:3px;font-size:11px;height:14px;width: calc(" +
                            positiveData52[i] +
                            "/" +
                            maxNumber5 +
                            "*100%);'>" +
                            pricegainers[6][i] +
                            "%</div></div>"
                        );
                    }
                } else {
                    $(".pricegainers").text("Price Gainers");
                    $("#bar5").css("height", "100%");
                    $("#bar5").html(
                        "<div class='flex justify-center items-center h-full'><h4 class='font-bold text-sm font-mono'>Data unavailable</h4></div>"
                    );
                }
                if (data[7][0] != null) {
                    pricelosersname = data[7][0];
                    $(".pricelosers").html(pricelosersname);
                    pricelosers = data[7];
                    pricelosersdata = data[7][1];
                    positiveData6 = data[7][4].map((dataPoint) => Math.abs(dataPoint));
                    positiveData61 = data[7][5].map((dataPoint) => Math.abs(dataPoint));
                    positiveData62 = data[7][6].map((dataPoint) => Math.abs(dataPoint));
                    // console.log("6", positiveData6);

                    $("#bar6").empty();
                    for (var i = 0; i < pricelosersdata.length; i++) {
                        maxNumber6 = Math.max(positiveData6[i], positiveData61[i], positiveData62[i], 100);
                        if (pricelosers[4][i] > 0) {
                            barPriceChgIcon = "up";
                            barPriceChgColor = "#38c172";
                        } else {
                            barPriceChgIcon = "down";
                            barPriceChgColor = "#dc3030";
                        }
                        if (pricelosers[5][i] > 0) {
                            barOIChgIcon = "up";
                            barOIChgColor = "#38c172";
                        } else {
                            barOIChgIcon = "down";
                            barOIChgColor = "#dc3030";
                        }
                        if (pricelosers[6][i] > 0) {
                            barVolChgIcon = "up";
                            barVolChgColor = "#38c172";
                        } else {
                            barVolChgIcon = "down";
                            barVolChgColor = "#dc3030";
                        }
                        singleBar1Class = pricelosers[4][i] < 0 ? "negativeColor" : "positiveColor";
                        singleBar2Class = pricelosers[5][i] < 0 ? "negativeColor" : "positiveColor";
                        singleBar3Class = pricelosers[6][i] < 0 ? "negativeColor" : "positiveColor";
                        var symbol5 = pricelosersdata[i];
                        var imgSrc5 = "./assets_adq/images/icons/" + symbol5 + ".svg?v" + imgVer;
                        if (imgSrc5 == undefined || symbol5 == '' || symbol5 == 'BANKNIFTY' || symbol5 == 'NIFTY' || symbol5 == 'NIFTYNXT50' || symbol5 == 'FINNIFTY' || symbol5 == 'MIDCPNIFTY' || symbol5 == 'SENSEX' || symbol5 == 'BANKEX') {
                            imgSrc5 = "./assets_adq/images/logo.png";
                        }
                        $("#bar6").append(
                            "<div class='bar-main'><div class='data-flex'><div class='image-div'><img src=" + imgSrc5 + "  title=" + symbol5 + " class='img' alt='logo' style='height:30px; width:30px; '/></div><div class='bar-data'><div class='display-data'><h5 class='bar-title'style='font-size:13px; padding-top:2px; padding-bottom:2px;'>" +
                            pricelosersdata[i] +
                            "</h5></div><div class='singlebar1 " + singleBar1Class + "' title='Price Chg' style='border-radius:3px;border-top-left-radius:0px;border-bottom-left-radius:0px;top:5px;;margin-bottom:3px;font-size:11px;height:14px;width: calc(" +
                            positiveData6[i] +
                            "/" +
                            maxNumber6 +
                            "*100%); '>" +
                            pricelosers[3][i] + "&nbsp;(" +
                            pricelosers[4][i] +
                            "%)</div><div class='singlebar2 " + singleBar2Class + "' title='OI Chg' style='border-radius:3px;border-top-left-radius:0px;border-bottom-left-radius:0px;top:5px;;margin-bottom:3px;font-size:11px;height:14px;width: calc(" +
                            positiveData61[i] +
                            "/" +
                            maxNumber6 +
                            "*100%); '>" +
                            pricelosers[5][i] +
                            "%</div><div class='singlebar3 " + singleBar3Class + "' title='Vol Chg' style='border-radius:3px;border-top-left-radius:0px;border-bottom-left-radius:0px;top:5px;;margin-bottom:3px;font-size:11px;height:14px;width: calc(" +
                            positiveData62[i] +
                            "/" +
                            maxNumber6 +
                            "*100%); '>" +
                            pricelosers[6][i] +
                            "%</div></div>"
                        );
                    }
                } else {
                    $(".pricelosers").text("Price Losers");
                    $("#bar6").css("height", "100%");
                    $("#bar6").html(
                        "<div class='flex justify-center items-center h-full'><h4 class='font-bold text-sm font-mono'>Data unavailable</h4></div>"
                    );
                }
                if (data[8][0] != null) {
                    oigainersname = data[8][0];
                    $(".oigainers").text(oigainersname);
                    oigainers = data[8];
                    oigainersdata = data[8][1];
                    positiveData7 = data[8][4].map((dataPoint) => Math.abs(dataPoint));
                    positiveData71 = data[8][5].map((dataPoint) => Math.abs(dataPoint));
                    positiveData72 = data[8][6].map((dataPoint) => Math.abs(dataPoint));
                    // console.log("7", positiveData7);

                    $("#bar7").empty();
                    for (var i = 0; i < oigainersdata.length; i++) {
                        maxNumber7 = Math.max(positiveData7[i], positiveData71[i], positiveData72[i], 100);
                        if (oigainers[4][i] > 0) {
                            barPriceChgIcon = "up";
                            barPriceChgColor = "#38c172";
                        } else {
                            barPriceChgIcon = "down";
                            barPriceChgColor = "#dc3030";
                        }
                        if (oigainers[5][i] > 0) {
                            barOIChgIcon = "up";
                            barOIChgColor = "#38c172";
                        } else {
                            barOIChgIcon = "down";
                            barOIChgColor = "#dc3030";
                        }
                        if (oigainers[6][i] > 0) {
                            barVolChgIcon = "up";
                            barVolChgColor = "#38c172";
                        } else {
                            barVolChgIcon = "down";
                            barVolChgColor = "#dc3030";
                        }
                        singleBar1Class = oigainers[4][i] < 0 ? "negativeColor" : "positiveColor";
                        singleBar2Class = oigainers[5][i] < 0 ? "negativeColor" : "positiveColor";
                        singleBar3Class = oigainers[6][i] < 0 ? "negativeColor" : "positiveColor";
                        var symbol6 = oigainersdata[i];
                        var imgSrc6 = "./assets_adq/images/icons/" + symbol6 + ".svg?v" + imgVer;
                        if (imgSrc6 == undefined || symbol6 == '' || symbol6 == 'BANKNIFTY' || symbol6 == 'NIFTY' || symbol6 == 'NIFTYNXT50' || symbol6 == 'FINNIFTY' || symbol6 == 'MIDCPNIFTY' || symbol6 == 'SENSEX' || symbol6 == 'BANKEX') {
                            imgSrc6 = "./assets_adq/images/logo.png";
                        }
                        $("#bar7").append(
                            "<div class='bar-main'><div class='data-flex'><div class='image-div'><img src=" + imgSrc6 + "  title=" + symbol6 + " class='img' alt='logo' style='height:30px; width:30px; '/></div><div class='bar-data'><div class='display-data'><h5 class='bar-title'style='font-size:13px; padding-top:2px; padding-bottom:2px;'>" +
                            oigainersdata[i] +
                            "</h5></div><div class='singlebar1 " + singleBar1Class + "' title='Price Chg' style='border-radius:3px;border-top-left-radius:0px;border-bottom-left-radius:0px;top:5px;;margin-bottom:3px;font-size:11px;height:14px;width: calc(" +
                            positiveData7[i] +
                            "/" +
                            maxNumber7 +
                            "*100%);'>" +
                            oigainers[3][i] + "&nbsp;(" +
                            oigainers[4][i] +
                            "%)</div><div class='singlebar2 " + singleBar2Class + "' title='OI Chg' style='border-radius:3px;border-top-left-radius:0px;border-bottom-left-radius:0px;top:5px;;margin-bottom:3px;font-size:11px;height:14px;width: calc(" +
                            positiveData71[i] +
                            "/" +
                            maxNumber7 +
                            "*100%); '>" +
                            oigainers[5][i] +
                            "%</div><div class='singlebar3 " + singleBar3Class + "' title='Vol Chg' style='border-radius:3px;border-top-left-radius:0px;border-bottom-left-radius:0px;top:5px;;margin-bottom:3px;font-size:11px;height:14px;width: calc(" +
                            positiveData72[i] +
                            "/" +
                            maxNumber7 +
                            "*100%);'>" +
                            oigainers[6][i] +
                            "%</div></div>"
                        );
                    }
                } else {
                    $(".oigainers").text("OI Gainers");
                    $("#bar7").css("height", "100%");
                    $("#bar7").html(
                        "<div class='flex justify-center items-center h-full'><h4 class='font-bold text-sm font-mono'>Data unavailable</h4></div>"
                    );
                }
                if (data[9][0] != null) {
                    oilosersname = data[9][0];
                    $(".oilosers").text(oilosersname);
                    oilosers = data[9];
                    oilosersdata = data[9][1];
                    positiveData8 = data[9][4].map((dataPoint) => Math.abs(dataPoint));
                    positiveData81 = data[9][5].map((dataPoint) => Math.abs(dataPoint));
                    positiveData82 = data[9][6].map((dataPoint) => Math.abs(dataPoint));
                    // console.log("8", positiveData8);

                    $("#bar8").empty();
                    for (var i = 0; i < oilosersdata.length; i++) {
                        maxNumber8 = Math.max(positiveData8[i], positiveData81[i], positiveData82[i], 100);
                        if (oilosers[4][i] > 0) {
                            barPriceChgIcon = "up";
                            barPriceChgColor = "#38c172";
                        } else {
                            barPriceChgIcon = "down";
                            barPriceChgColor = "#dc3030";
                        }
                        if (oilosers[5][i] > 0) {
                            barOIChgIcon = "up";
                            barOIChgColor = "#38c172";
                        } else {
                            barOIChgIcon = "down";
                            barOIChgColor = "#dc3030";
                        }
                        if (oilosers[6][i] > 0) {
                            barVolChgIcon = "up";
                            barVolChgColor = "#38c172";
                        } else {
                            barVolChgIcon = "down";
                            barVolChgColor = "#dc3030";
                        }
                        singleBar1Class = oilosers[4][i] < 0 ? "negativeColor" : "positiveColor";
                        singleBar2Class = oilosers[5][i] < 0 ? "negativeColor" : "positiveColor";
                        singleBar3Class = oilosers[6][i] < 0 ? "negativeColor" : "positiveColor";
                        var symbol7 = oilosersdata[i];
                        // symbol7 = "";
                        // console.log(symbol7);
                        var imgSrc7 = "./assets_adq/images/icons/" + symbol7 + ".svg?v" + imgVer;
                        if (imgSrc7 == undefined || symbol7 == '' || symbol7 == 'BANKNIFTY' || symbol7 == 'NIFTY' || symbol7 == 'NIFTYNXT50' || symbol7 == 'FINNIFTY' || symbol7 == 'MIDCPNIFTY' || symbol7 == 'SENSEX' || symbol7 == 'BANKEX') {
                            imgSrc7 = "./assets_adq/images/logo.png";
                        }
                        $("#bar8").append(
                            "<div class='bar-main'><div class='data-flex'><div class='image-div'><img src=" + imgSrc7 + "  title=" + symbol7 + " class='img' alt='logo' style='height:30px; width:30px; '/></div><div class='bar-data'><div class='display-data'><h5 class='bar-title'style='font-size:13px; padding-top:2px; padding-bottom:2px;'>" +
                            oilosersdata[i] +
                            "</h5></div><div class='singlebar1 " + singleBar1Class + "' title='Price Chg' style='border-radius:3px;border-top-left-radius:0px;border-bottom-left-radius:0px;top:5px;;margin-bottom:3px;font-size:11px;height:14px;width: calc(" +
                            positiveData8[i] +
                            "/" +
                            maxNumber8 +
                            "*100%); '>" +
                            oilosers[3][i] + "&nbsp;(" +
                            oilosers[4][i] +
                            "%)</div><div class='singlebar2 " + singleBar2Class + "' title='OI Chg' style='border-radius:3px;border-top-left-radius:0px;border-bottom-left-radius:0px;top:5px;;margin-bottom:3px;font-size:11px;height:14px;width: calc(" +
                            positiveData81[i] +
                            "/" +
                            maxNumber8 +
                            "*100%); '>" +
                            oilosers[5][i] +
                            "%</div><div class='singlebar3 " + singleBar3Class + "' title='Vol Chg' style='border-radius:3px;border-top-left-radius:0px;border-bottom-left-radius:0px;top:5px;;margin-bottom:3px;font-size:11px;height:14px;width: calc(" +
                            positiveData82[i] +
                            "/" +
                            maxNumber8 +
                            "*100%);'>" +
                            oilosers[6][i] +
                            "%</div></div>"
                        );
                    }
                } else {
                    $(".oilosers").text("OI Losers");
                    $("#bar8").css("height", "100%");
                    $("#bar8").html(
                        "<div class='flex justify-center items-center h-full'><h4 class='font-bold text-sm font-mono'>Data unavailable</h4></div>"
                    );
                }
                // if (data[10][0] != null) {
                //   ivrname = data[10][0];
                //   $(".ivr").text(ivrname);
                //   ivr = data[10];
                //   ivrdata = data[10][1];
                //   positiveData9 = data[10][4].map((dataPoint) => Math.abs(dataPoint));
                //   positiveData91 = data[10][5].map((dataPoint) => Math.abs(dataPoint));
                //   positiveData92 = data[10][6].map((dataPoint) => Math.abs(dataPoint));
                //   // console.log("9", positiveData9);

                //   $("#bar9").empty();
                //   for (var i = 0; i < ivrdata.length; i++) {
                //     maxNumber9 = Math.max(positiveData9[i],positiveData91[i],positiveData92[i],100);
                //     if (ivr[4][i] > 0) {
                //       barPriceChgIcon = "up";
                //       barPriceChgColor = "#38c172";
                //     } else {
                //       barPriceChgIcon = "down";
                //       barPriceChgColor = "#dc3030";
                //     }
                //     if (ivr[5][i] > 0) {
                //       barOIChgIcon = "up";
                //       barOIChgColor = "#38c172";
                //     } else {
                //       barOIChgIcon = "down";
                //       barOIChgColor = "#dc3030";
                //     }
                //     if (ivr[6][i] > 0) {
                //       barVolChgIcon = "up";
                //       barVolChgColor = "#38c172";
                //     } else {
                //       barVolChgIcon = "down";
                //       barVolChgColor = "#dc3030";
                //     }
                //     if (ivr[4][i] > 0) {
                //       barColor = " #089981";
                //     } else {
                //       barColor = "#FE6868";
                //     }
                //     if (ivr[5][i] > 0) {
                //       bar2Color = " #089981";
                //     } else {
                //       bar2Color = "#FE6868";
                //     }
                //     if (ivr[6][i] > 0) {
                //       bar3Color = " #089981";
                //     } else {
                //       bar3Color = "#FE6868";
                //     }
                //     var symbol8 = ivrdata[i];
                //     var imgSrc8 = "./assets_adq/images/icons/" + symbol8 + ".png";
                //     if(imgSrc8 == undefined || symbol8 == 'BANKNIFTY' || symbol8== 'NIFTY'  || symbol == 'NIFTYNXT50' || symbol8 == 'FINNIFTY' || symbol8 == 'MIDCPNIFTY'){
                //       imgSrc8 = "./assets_adq/images/logo.png";  
                //     }
                //     $("#bar9").append(
                //       "<div class='bar-main'><div class='data-flex'><div class='image-div'><img src="+imgSrc8+"  title="+ symbol8 +" class='img' alt='logo' style='height:30px; width:30px; '/></div><div class='bar-data'><div class='display-data'><h5 class='bar-title'style='font-size:13px; padding-top:2px; padding-bottom:2px;'>" +
                //         ivrdata[i] +
                //         "</h5></div><div class='singlebar' title='Price Chg' style='border-radius:3px;border-top-left-radius:0px;border-bottom-left-radius:0px;top:5px;;margin-bottom:3px;font-size:11px;height:14px;width: calc(" +
                //         positiveData9[i] +
                //         "/" +
                //         maxNumber9 +
                //         "*100%); background:" +
                //         barColor +
                //         ";'>" +
                //         ivr[3][i] +"&nbsp;("+
                //         ivr[4][i] +
                //         "%)</div><div class='singlebar' title='OI Chg' style='border-radius:3px;border-top-left-radius:0px;border-bottom-left-radius:0px;top:5px;;margin-bottom:3px;font-size:11px;height:14px;width: calc(" +
                //         positiveData91[i] +
                //         "/" +
                //         maxNumber9 +
                //         "*100%); background:" +
                //         bar2Color +
                //         ";'>" +
                //         ivr[5][i] +
                //         "%</div><div class='singlebar' title='Vol Chg' style='border-radius:3px;border-top-left-radius:0px;border-bottom-left-radius:0px;top:5px;;margin-bottom:3px;font-size:11px;height:14px;width: calc(" +
                //         positiveData92[i] +
                //         "/" +
                //         maxNumber9 +
                //         "*100%); background:" +
                //         bar3Color +
                //         ";'>" +
                //         ivr[6][i] +
                //         "%</div></div>"
                //     );
                //   }
                // } else {
                //   $(".ivr").text("IVR");
                //   $("#bar9").css("height", "100%");
                //   $("#bar9").html(
                //     "<div class='flex justify-center items-center h-full'><h4 class='font-bold text-sm font-mono'>Data unavailable</h4></div>"
                //   );
                // }
                // if (data[11][0] != null) {
                //   ivpname = data[11][0];
                //   $(".ivp").text(ivpname);
                //   ivp = data[11];
                //   ivpdata = data[11][1];
                //   positiveData10 = data[11][4].map((dataPoint) => Math.abs(dataPoint));
                //  positiveData101 = data[11][5].map((dataPoint) => Math.abs(dataPoint));
                //  positiveData102 = data[11][6].map((dataPoint) => Math.abs(dataPoint));
                //   // console.log("10", positiveData10);
                //   $("#bar10").empty();

                //   for (var i = 0; i < ivpdata.length; i++) {
                //     maxNumber10 = Math.max(positiveData10[i],positiveData101[i],positiveData102[i],100);
                //     if (ivp[4][i] > 0) {
                //       barPriceChgIcon = "up";
                //       barPriceChgColor = "#38c172";
                //     } else {
                //       barPriceChgIcon = "down";
                //       barPriceChgColor = "#dc3030";
                //     }
                //     if (ivp[5][i] > 0) {
                //       barOIChgIcon = "up";
                //       barOIChgColor = "#38c172";
                //     } else {
                //       barOIChgIcon = "down";
                //       barOIChgColor = "#dc3030";
                //     }
                //     if (ivp[6][i] > 0) {
                //       barVolChgIcon = "up";
                //       barVolChgColor = "#38c172";
                //     } else {
                //       barVolChgIcon = "down";
                //       barVolChgColor = "#dc3030";
                //     }
                //     if (ivp[4][i] > 0) {
                //       barColor = " #089981";
                //     } else {
                //       barColor = "#FE6868";
                //     }
                //     if (ivp[5][i] > 0) {
                //       bar2Color = " #089981";
                //     } else {
                //       bar2Color = "#FE6868";
                //     }
                //     if (ivp[6][i] > 0) {
                //       bar3Color = " #089981";
                //     } else {
                //       bar3Color = "#FE6868";
                //     }
                //     var symbol9 = ivpdata[i];
                //     var imgSrc9 = "./assets_adq/images/icons/" + symbol9 + ".png";
                //     if(imgSrc9 == undefined || symbol9 == 'BANKNIFTY' || symbol9== 'NIFTY'  || symbol == 'NIFTYNXT50' || symbol9 == 'FINNIFTY' || symbol9 == 'MIDCPNIFTY'){
                //       imgSrc9 = "./assets_adq/images/logo.png";  
                //     }
                //     $("#bar10").append(
                //       "<div class='bar-main'><div class='data-flex'><div class='image-div'><img src="+imgSrc9+"  title="+ symbol9 +" class='img' alt='logo' responsive style='height:30px; width:30px; '/></div><div class='bar-data'><div class='display-data'><h5 class='bar-title'style='font-size:13px; padding-top:2px; padding-bottom:2px;'>" +
                //         ivpdata[i] +
                //         "</h5></div><div class='singlebar' title='Price Chg' style='border-radius:3px;border-top-left-radius:0px;border-bottom-left-radius:0px;top:5px;;margin-bottom:3px;font-size:11px;height:14px;width: calc(" +
                //         positiveData10[i] +
                //         "/" +
                //         maxNumber10 +
                //         "*100%); background:" +
                //         barColor +
                //         ";'>" +
                //         ivp[3][i] +"&nbsp;("+
                //         ivp[4][i] +
                //         "%)</div><div class='singlebar' title='OI Chg' style='border-radius:3px;border-top-left-radius:0px;border-bottom-left-radius:0px;top:5px;;margin-bottom:3px;font-size:11px;height:14px;width: calc(" +
                //         positiveData101[i] +
                //         "/" +
                //         maxNumber10 +
                //         "*100%); background:" +
                //         bar2Color +
                //         ";'>" +
                //         ivp[5][i] +
                //         "%</div><div class='singlebar' title='Vol Chg' style='border-radius:3px;border-top-left-radius:0px;border-bottom-left-radius:0px;top:5px;;margin-bottom:3px;font-size:11px;height:14px;width: calc(" +
                //         positiveData102[i] +
                //         "/" +
                //         maxNumber10+
                //         "*100%); background:" +
                //         bar3Color +
                //         ";'>" +
                //         ivp[6][i] +
                //         "%</div></div>"
                //     );
                //   }
                // } else {
                //   $(".ivp").text("IVP");
                //   $("#bar10").css("height", "100%");
                //   $("#bar10").html(
                //     "<div class='flex justify-center items-center h-full'><h4 class='font-bold text-sm font-mono'>Data unavailable</h4></div>"
                //   );
                // }
            },
            error: function(xhr, status, error) {
                console.log(xhr.responseText);
                // $("#section").html(
                //   "<div class='flex justify-center items-center h-full'><h4 class='font-bold text-sm font-mono'>No internet connection available</h4></div>" 
                // );
            },
        });
    }
    loadDataAndUpdateChart();
    var chartlightOptions = {
        fill: {
            gradient: {
                gradientToColors: ["", ""],
            },
        },
    };
    var gaugelightOptions = {
        plotOptions: {
            radialBar: {
                track: {
                    background: "#d9dbdb",
                },
                dataLabels: {
                    name: {
                        color: "#000",
                    },
                },
            },
        },
    };
    var chartdarkOptions = {
        fill: {
            gradient: {
                gradientToColors: ["", ""],
            },
        },
    };
    var gaugedarkOptions = {
        plotOptions: {
            radialBar: {
                track: {
                    background: "#2e2e2e",
                },
                dataLabels: {
                    name: {
                        color: "#f6f8fa",
                    },
                },
            },
        },
    };

    function setDarkModeOptions() {
        if (pNiftyColor == '#000000') {
            pNiftyColor = "#FFFFFF";
        }
        if (pBankNiftyColor == '#000000') {
            pBankNiftyColor = "#FFFFFF";
        }
        // set options for charts and gauges in dark mode
        // chart.updateOptions(chartdarkOptions);
        // chart2.updateOptions(chartdarkOptions);

        chart.updateOptions({
            colors: [pNiftyColor, areaNiftyColor],
        });
        chart2.updateOptions({
            colors: [pBankNiftyColor, areaBankNiftyColor],
        });
        // gauge1.updateOptions(gaugedarkOptions);
        // gauge2.updateOptions(gaugedarkOptions);
        // gauge3.updateOptions(gaugedarkOptions);
        // gauge4.updateOptions(gaugedarkOptions);
    }

    function setLightModeOptions() {
        if (pNiftyColor == '#FFFFFF') {
            pNiftyColor = "#000000";
        }
        if (pBankNiftyColor == '#FFFFFF') {
            pBankNiftyColor = "#000000";
        }
        // set options for charts and gauges in light mode
        // chart.updateOptions(chartlightOptions);
        // chart2.updateOptions(chartlightOptions);

        chart.updateOptions({
            colors: [pNiftyColor, areaNiftyColor],
        });

        chart2.updateOptions({
            colors: [pBankNiftyColor, areaBankNiftyColor],
        });

        // gauge1.updateOptions(gaugelightOptions);
        // gauge2.updateOptions(gaugelightOptions);
        // gauge3.updateOptions(gaugelightOptions);
        // gauge4.updateOptions(gaugelightOptions);
    }
    $("#theme-toggle").click(function() {
        /*  if ($("body").hasClass("dark-theme")) {
           $("body").removeClass("dark-theme");
           localStorage.setItem("isDarkMode", false);
           isDarkMode = false;
           setLightModeOptions();
         } else {
           $("body").addClass("dark-theme");
           localStorage.setItem("isDarkMode", true);
           isDarkMode = true;
           setDarkModeOptions();
         } */



        if ($("body").hasClass("dark-theme")) {
            $("body").css("background-color", "#FFFFFF");
            $("body").removeClass("dark-theme");
            localStorage.setItem("isDarkMode", false);
            isDarkMode = false;
            setLightModeOptions();
        } else {
            $("body").css("background-color", "#151515");
            $("body").addClass("dark-theme");
            localStorage.setItem("isDarkMode", true);
            isDarkMode = true;
            setDarkModeOptions();
        }

    });
    setInterval(function() {
        loadDataAndUpdateChart();
    }, 30000);
});

// //swapping js
// // Get all the before and after elements
// var beforeElems = document.querySelectorAll(
//   ".bar1before, .bar2before, .bar3before, .bar4before, .bar5before,.bar6before, .bar7before, .bar8before, .bar9before, .bar10before"
// );
// var afterElems = document.querySelectorAll(
//   ".bar1after, .bar2after, .bar3after, .bar4after, .bar5after,.bar6after, .bar7after, .bar8after, .bar9after, .bar10after"
// );

// // Loop through all the before elements and add a click event listener to each one
// beforeElems.forEach(function (elem) {
//   elem.addEventListener("click", function () {
//     var beforeparent = elem.parentNode;
//     // Get the parent element of the clicked "before" element
//     var parentElem = beforeparent.parentNode;
//     // Get the index of the parent element within the container
//     var index = Array.prototype.indexOf.call(
//       parentElem.parentNode.children,
//       parentElem
//     );
//     // Get the element that comes before the parent element
//     var siblingElem = parentElem.previousElementSibling;
//     // Check if the parent element is the first child
//     if (index > 0) {
//       // Swap the positions of the parent element and the sibling element
//       parentElem.parentNode.insertBefore(parentElem, siblingElem);
//     }
//   });
// });

// // Loop through all the after elements and add a click event listener to each one
// afterElems.forEach(function (elem) {
//   elem.addEventListener("click", function () {
//     var afterparent = elem.parentNode;
//     // Get the parent element of the clicked "after" element
//     var parentElem = afterparent.parentNode;
//     // Get the index of the parent element within the container
//     var index = Array.prototype.indexOf.call(
//       parentElem.parentNode.children,
//       parentElem
//     );
//     // Get the element that comes after the parent element
//     var siblingElem = parentElem.nextElementSibling;
//     // Check if the parent element is the last child
//     if (index < parentElem.parentNode.children.length - 1) {
//       // Swap the positions of the parent element and the sibling element
//       parentElem.parentNode.insertBefore(siblingElem, parentElem);
//     }
//   });
// });

// Get all bars and their shift buttons
const bars = document.querySelectorAll(".bar");
const shiftButtons = document.querySelectorAll(".barbefore, .barafter");

// Initialize the preference order from local storage or use the default order
let preferenceOrder = JSON.parse(localStorage.getItem("preferenceOrder")) || [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
];

// Update the grid to match the preference order
bars.forEach((bar, i) => {
    const index = preferenceOrder.indexOf(i + 1);
    bar.style.order = index + 1;
    bar.dataset.index = index + 1;
});

// Add event listeners to the shift buttons
shiftButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const bar = button.parentNode.parentNode; // Get the parent bar element
        const index = parseInt(bar.dataset.index) - 1; // Get the current index of the bar
        const direction = button.classList.contains("barbefore") ? -1 : 1; // Determine the direction of the shift
        const newIndex = index + direction; // Calculate the new index of the bar
        if (newIndex >= 0 && newIndex < bars.length) {
            // Check if the new index is within bounds
            // Swap the position of the current and new bars in the preference order
            const temp = preferenceOrder[index];
            preferenceOrder[index] = preferenceOrder[newIndex];
            preferenceOrder[newIndex] = temp;
            localStorage.setItem("preferenceOrder", JSON.stringify(preferenceOrder)); // Store the new preference order in local storage
            // Update the position of the bars in the grid to match the new preference order
            bars.forEach((bar, i) => {
                const index = preferenceOrder.indexOf(i + 1);
                bar.style.order = index + 1;
                bar.dataset.index = index + 1;
            });
        }
    });
});