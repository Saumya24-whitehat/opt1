$(document).ready(function() {
    var isDarkMode;
	var PriceLineVisible = true;
    var VWAPLineVisible = true;
    var OILineVisible = true;
    var VolumeLineVisible = true;
    var IVLineVisible = true;
    var PCRLineVisible = true;
//oi stats	
	var CEOIStatsVisible = true;
	var PEOIStatsVisible = true;
	var CEOIChgStatsVisible = true;
	var PEOIChgStatsVisible = true;
//max oi stats	
	var MaxCEOIStatsVisible = true;
	var MaxPEOIStatsVisible = true;
	var MaxCEOIChgStatsVisible = true;
	var MaxPEOIChgStatsVisible = true;
	get_legends_visible();

	    
	
    isDarkMode = localStorage.getItem("isDarkMode") === "true";
    if (isDarkMode === true) {
        $("body").addClass("dark-theme");
        $("#theme-toggle").prop("checked", true);
    }
    function format_number(number) { 
        var crore = 10000000;
        var lakh = 100000;
        var thousand = 1000;
        if (number <= -crore) {
            return (number / crore).toFixed(2) + " Cr";
        } else if (number <= -lakh) {
            return (number / lakh).toFixed(2) + " L";
        } else if (number <= -thousand) {
            return (number / thousand).toFixed(2) + " K";
        } else if (number >= crore) {
            return (number / crore).toFixed(2) + " Cr";
        } else if (number >= lakh) {
            return (number / lakh).toFixed(2) + " L";
        } else if (number >= thousand) {
            return (number / thousand).toFixed(2) + " K";
        } else {
            return number;
        }
    }
    var rootfile = "http://localhost:5000/opt/api/dashboard/ApiCommonfiles/";
    var rdDataType = $("#rdDataType").val();
    if (rdDataType == "latest") {
        $("#txtDate-div").hide();
    }
    $("#optExpDate").change(function() {
        
            get_current_page_function();
    });
	
	
	 $("#optExpDate_hist").change(function() {
      
            getHistDate();
		
    }); 
    $("#optSymbol").change(function() {
        savePreferences();
        Expiry_Dates();
		
    });



    function savePreferences() {
        var userName = $('#userName').val(); 
        //08Nov21***
        var pageName = $("#pageName").val();
        var sID = $("#sessionID").val();
        var user_pref = JSON.stringify({
            symbol:$("#optSymbol").val(),
			 legendsVisibility: {
				PriceLineVisible, VWAPLineVisible, OILineVisible,
									VolumeLineVisible, IVLineVisible, PCRLineVisible,
									CEOIStatsVisible, PEOIStatsVisible,
									CEOIChgStatsVisible, PEOIChgStatsVisible,
									MaxCEOIStatsVisible, MaxPEOIStatsVisible,
									MaxCEOIChgStatsVisible, MaxPEOIChgStatsVisible
			} 
        });
        //08Nov21***
        var urlSave = "/opt/hcharts/stx8req/php/Save_Volume_Oi_Spikes_Input_Data.php";
        $.post(urlSave, {
                un: userName,
                user_setting: user_pref,
                pageName: pageName,
                sID: sID,
            },
            function(data, status) {

            });
    }

    
    function getHistDate() {
        var symbol = $("#optSymbol").val();
        var optExpDate = $("#optExpDate_hist").val();
        var url = rootfile + "ExpTradingDate_Api.php";
        $.post(url, {
            sym: symbol,
            optExpDate: optExpDate,
        }, function(json) {
            if (json === null) {
                DefaultCalenderData();
            } else {
                $("#txtDate").val(json);
                get_current_page_function();
            }
        }, "json");
    }
    function DefaultCalenderData() {
        $("#txtDate").empty();
        $.getJSON(rootfile + "getCommonData.php", function(json) {
            var prev_trading_day = json[0].Prev_Trading_Date;
            $("#txtDate").val(prev_trading_day);
            get_current_page_function();
        });
    }
    // function onloadData() {
    //     $("#optSymbol").empty();
    //     $("#optSymbolfocus").removeClass("is-focused");
    //     var options = "";
    //     $.getJSON("api/dashboard/ApiCommonfiles/SymNamesApi_v5.php", function(data) {
    //         var groupedSymbols = {};
    //         $.each(data, function(index, item) {
    //             if (!(item.symbol_type in groupedSymbols)) {
    //                 groupedSymbols[item.symbol_type] = [];
    //             }
    //             groupedSymbols[item.symbol_type].push(item);
    //         });
    //         $.each(groupedSymbols, function(symbolType, symbols) {
    //             options += '<optgroup label="' + symbolType + '">';
    //             $.each(symbols, function(index, item) {
    //                 options += '<option value="' + item.symbol + '">' + item.symbol + '</option>';
    //             });
    //             options += '</optgroup>';
    //         });
    //         $("#optSymbol").append(options);
    //         $('#optSymbol').fSelect({
    //             searchText: 'Search',
    //             numDisplayed: 1,
    //         });
    //         $("#optSymbolfocus").addClass("is-focused");
    //         Expiry_Dates();
    //         $("#optSymbol").fSelect("reload");
    //     });
    // }


    function fetchSelectedSymbol() { 
        return new Promise((resolve, reject) => {
            let requestData = { pageName: $("#pageName").val() };
    
            $.ajax({
                url: "/opt/hcharts/stx8req/php/getUserInputsSymbolDashboard.php",
                type: "POST",  
                data: requestData,
                dataType: "json",
                success: function (response) { 
                    // console.log("API Response:", response);
                    let optSymbol = response?.symbol || null; // Ensure optSymbol is defined
    
                    resolve(optSymbol); // Resolve with the symbol or null
                },
                error: function (xhr, status, error) {
                    console.error("Error fetching selected symbol:", error);
                    reject(error);
                }
            });
        });
    }
async function onloadData() {
    try {
        $("#optSymbol").empty();
        $("#optSymbolfocus").removeClass("is-focused");

        // Wait for fetchSelectedSymbol to complete before fetching symbols
        let selectedSymbol = await fetchSelectedSymbol();

        let options = "";
        $.getJSON("api/dashboard/ApiCommonfiles/SymNamesApi_v5.php", function (data) {
            let groupedSymbols = {};
            let firstSymbol = null; // Track the first symbol in the list

            $.each(data, function (index, item) {
                if (!(item.symbol_type in groupedSymbols)) {
                    groupedSymbols[item.symbol_type] = [];
                }
                groupedSymbols[item.symbol_type].push(item);
                // Store the first available symbol
                if (!firstSymbol) {
                    firstSymbol = item.symbol;
                }
            });

            $.each(groupedSymbols, function (symbolType, symbols) {
                options += '<optgroup label="' + symbolType + '">';
                $.each(symbols, function (index, item) {
                    options += '<option value="' + item.symbol + '">' + item.symbol + '</option>';
                });
                options += '</optgroup>';
            });
            $("#optSymbol").append(options);

            // If selectedSymbol is null, use the first available symbol
            if (!selectedSymbol && firstSymbol) {
                selectedSymbol = firstSymbol;
            }
			
			// Initialize fSelect plugin for dropdown
            $('#optSymbol').fSelect({
                searchText: 'Search',
                numDisplayed: 1,
            });

            $("#optSymbolfocus").addClass("is-focused");


            // Ensure the correct symbol is selected
            $("#optSymbol").val(selectedSymbol);
            // console.log("Final Selected Symbol:", selectedSymbol);

            
            // Reload the fSelect dropdown after setting the value
            $("#optSymbol").fSelect("reload");
			

            // Call Expiry_Dates only after the dropdown is updated
            Expiry_Dates();
			
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.error("Error fetching symbols:", textStatus, errorThrown);
        });

    } catch (error) {
        console.error("Error in onloadData:", error);
    }
}


    function Expiry_Dates() {
    $("#optExpDate").empty();
    $("#optExpDate_hist").empty();
    $("#optExpDatefocus").removeClass("is-focused");

    var symbol = $("#optSymbol").val();
    var rdDataType = $("#rdDataType").val();
    var url = rootfile + "SymExpDatesApi_v4.php";

    $.post(url, {
        sym: symbol,
        rdDataType: rdDataType, 
    }, function(json) {
        var options = "";
        var expiry_json = json[0];
        var defaultExpDate = json[1]["defaultExpDate"];
        var currMonthExpDate = json[1]["currMonthExpDate"];
        let selectedExpiry = '';

        $.each(expiry_json, function(key, value) {
            var expiry_dates = value.expiry_dates;
            var selectedval = "";
            if (expiry_dates === defaultExpDate || expiry_dates === currMonthExpDate) {
                selectedval = "selected";
                selectedExpiry = expiry_dates;
            }
            options += '<option value="' + expiry_dates + '" ' + selectedval + '>' + expiry_dates + '</option>';
        });

        if (rdDataType === "latest") {
            // Show latest, hide hist
            $("#optExpDate_container").show();
            $("#optExpDate_hist_container").hide();

            $("#optExpDate").html(options).val(selectedExpiry);

            get_current_page_function();
        } else {
            // Show hist, hide latest
            $("#optExpDate_container").hide();
            $("#optExpDate_hist_container").show();

            $("#optExpDate_hist").html(options).val(selectedExpiry);

            // Initialize fSelect with search
            $("#optExpDate_hist").fSelect({
                searchText: 'Search',
                numDisplayed: 1,
            });

		$("#optExpDate_hist").fSelect("reload");
            getHistDate();
        }
    }, "json");
}



    var root_url = "http://localhost:5000/opt/api/dashboard/php/";
    function get_current_page_function() {
        TrendingTable2();
        getoianalysislist();
        SymbolFutureChart(0);
        TrendingTable();
        calldata = getcallData(0);
        return calldata;
    }
    var table;
    onloadData();
    var form = document.getElementById("frmOptChain");
    document.getElementById("hist").addEventListener("click", function() {
        document.getElementById("rdDataType").value = "hist";
        $("#txtDate-div").show();
        onloadData();
    });
    document.getElementById("latest").addEventListener("click", function() {
        document.getElementById("rdDataType").value = "latest";
        $("#txtDate-div").hide();
        onloadData();
    });
    $("#txtDate").change(function() {
        get_current_page_function();
    });
    var gauge5 = new ApexCharts(document.querySelector("#gauge5"),{
        chart: {
            type: "radialBar",
            height: 130,
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
                        fontSize: "15px",
                        fontWeight: "bold",
                        fontFamily: "Poppins, sans-serif",
                        color: isDarkMode ? "#f6f8fa" : "#000",
                    },
                    value: {
                        show: false,
                        fontSize: "50px",
                        fontWeight: "bold",
                    },
                },
            },
        },
        stroke: {
            lineCap: "round",
        },
        series: [],
        labels: [],
        colors: ["#38c172"],
    });
    gauge5.render();
    var gauge6 = new ApexCharts(document.querySelector("#gauge6"),{
        chart: {
            type: "radialBar",
            height: 130,
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
                        fontSize: "15px",
                        fontWeight: "bold",
                        fontFamily: "Poppins, sans-serif",
                        color: isDarkMode ? "#f6f8fa" : "#000",
                    },
                    value: {
                        show: false,
                        fontSize: "50px",
                        fontWeight: "bold",
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
    gauge6.render();
    var gauge7 = new ApexCharts(document.querySelector("#gauge7"),{
        chart: {
            type: "radialBar",
            height: 130,
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
                        fontSize: "15px",
                        fontWeight: "bold",
                        fontFamily: "Poppins, sans-serif",
                        color: isDarkMode ? "#f6f8fa" : "#000",
                    },
                    value: {
                        show: false,
                        fontSize: "50px",
                        fontWeight: "bold",
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
    gauge7.render();
    var gauge8 = new ApexCharts(document.querySelector("#gauge8"),{
        chart: {
            type: "radialBar",
            height: 130,
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
                        fontSize: "15px",
                        fontWeight: "bold",
                        fontFamily: "Poppins, sans-serif",
                        color: isDarkMode ? "#f6f8fa" : "#000",
                    },
                    value: {
                        show: false,
                        fontSize: "50px",
                        fontWeight: "bold",
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
    gauge8.render();
    function TrendingTable2() {
        var data = "";
        var rdDataType = $("#rdDataType").val();
        var optSymbol = $("#optSymbol").val();
        var optExpDate;
		if(rdDataType === 'hist'){
			optExpDate = $("#optExpDate_hist").val();
		}else{
			optExpDate = $("#optExpDate").val();
		}
        var txtDate = $("#txtDate").val();
        $.ajax({
            type: "POST",
            url: root_url + "getSymbolDashboard_v6.php",
            data: {
                optSymbol: optSymbol,
                optExpDate: optExpDate, 
                rdDataType: rdDataType,
                txtDate: txtDate,
            },
            success: function(data) {
                if (data == null) {
                    $("#symbolDetails").html("<div class='flex justify-center items-center' ><h6 class='text-black font-bold font-mono py-2'>Data not available</h6></div>");
                    rollover = 0;
                    gauge5.updateOptions({
                        series: [rollover],
                        labels: ["null"],
                    });
                    mwpl = 0;
                    gauge6.updateOptions({
                        series: [mwpl],
                        labels: ["null"],
                    });
                    iv = 0;
                    gauge7.updateOptions({
                        series: [iv],
                        labels: ["null"],
                    });
                    pcr = 0;
                    gauge8.updateOptions({
                        series: [pcr],
                        labels: ["null"],
                    });
                    $("#gaugeData").html("<div class='xs:grid xs:grid-cols-3 md:flex xl:gap-3 lg:gap-2  gap-3 xl:px-3 lg:px-1 xl:pt-1 lg:pt-2' > <h6>IVR:&nbsp;<span>null</span></h6><h6>IVP:&nbsp;<span>null</span></h6><h6>Max Pain:&nbsp;<span>null</span></h6></div>");
                    $("#gaugesData").html("<div class='flex justify-center items-center' ><h6 class='text-black font-bold font-mono py-2'>Data not available</h6></div>");
                } else {
                    var currentPriceChg = data.Current_Month_PriceChg;
                    var currentOiChg = data.Current_Month_OIChg;
                    var currentPriceChgIcon;
                    var currentPriceChgColor;
                    var currentOiChgIcon;
                    var currentOiChgColor;
                    if (currentPriceChg > 0) {
                        currentPriceChgIcon = "up";
                        currentPriceChgColor = "#38c172";
                    } else {
                        currentPriceChgIcon = "down";
                        currentPriceChgColor = "#dc3030";
                    }
                    if (currentOiChg > 0) {
                        currentOiChgIcon = "up";
                        currentOiChgColor = "#38c172";
                    } else {
                        currentOiChgIcon = "down";
                        currentOiChgColor = "#dc3030";
                    }
                    var nextPriceChg = data.Next_Month_PriceChg;
                    var nextOiChg = data.Next_Month_OIChg;
                    var nextPriceChgIcon;
                    var nextPriceChgColor;
                    var nextOiChgIcon;
                    var nextOiChgColor;
                    if (nextPriceChg > 0) {
                        nextPriceChgIcon = "up";
                        nextPriceChgColor = "#38c172";
                    } else {
                        nextPriceChgIcon = "down";
                        nextPriceChgColor = "#dc3030";
                    }
                    if (nextOiChg > 0) {
                        nextOiChgIcon = "up";
                        nextOiChgColor = "#38c172";
                    } else {
                        nextOiChgIcon = "down";
                        nextOiChgColor = "#dc3030";
                    }
                    var farPriceChg = data.Far_Month_PriceChg;
                    var farOiChg = data.Far_Month_OIChg;
                    var farPriceChgIcon;
                    var farPriceChgColor;
                    var farOiChgIcon;
                    var farOiChgColor;
                    if (farPriceChg > 0) {
                        farPriceChgIcon = "up";
                        farPriceChgColor = "#38c172";
                    } else {
                        farPriceChgIcon = "down";
                        farPriceChgColor = "#dc3030";
                    }
                    if (farOiChg > 0) {
                        farOiChgIcon = "up";
                        farOiChgColor = "#38c172";
                    } else {
                        farOiChgIcon = "down";
                        farOiChgColor = "#dc3030";
                    }
                    var peceoiDiff = data.PE_CE_OIChg_DIFF;
                    var peceoiDiffColor;
                    var farOiChgIcon;
                    var farOiChgColor;
                    if (peceoiDiff > 0) {
                        peceoiDiffColor = "#38c172";
                    } else {
                        peceoiDiffColor = "#dc3030";
                    }
                    var farPriceChg = data.Far_Month_PriceChg;
                    var farPriceChgCellContent = farPriceChg === '-' ? '-' : format_number(farPriceChg.toFixed(2)) + '%';
                    var farPriceChgCell = '<td style="white-space:nowrap;text-align:right;padding-right:10px;color:' + (farPriceChg === '-' ? 'initial' : farPriceChgColor) + '"><i class="fa fa-arrow-trend-' + farPriceChgIcon + '"></i>&nbsp;' + farPriceChgCellContent + '</td>';
                    var far_price_chg_col = '<td style="text-align:right;padding-right:10px;">' + farPriceChgCellContent + '</td>'
                    var final_price_chg = farPriceChg != '-' && farPriceChg != null ? farPriceChgCell : far_price_chg_col
                    var currPriceChg = data.Current_Month_PriceChg;
                    var currPriceChgCellContent = currPriceChg === '-' ? '-' : format_number(currPriceChg.toFixed(2)) + '%';
                    var currPriceChgCell = '<td style="white-space:nowrap;text-align:right;padding-right:10px;color:' + (currPriceChg === '-' ? 'initial' : currentPriceChgColor) + '"><i class="fa fa-arrow-trend-' + currentPriceChgIcon + '"></i>&nbsp;' + currPriceChgCellContent + '</td>';
                    var curr_price_chg_col = '<td style="text-align:right;padding-right:10px;">' + currPriceChgCellContent + '</td>'
                    var final_curr_price_chg = currPriceChg != '-' && currPriceChg != null ? currPriceChgCell : curr_price_chg_col
                    var nextPriceChg = data.Next_Month_PriceChg;
                    var nextPriceChgCellContent = nextPriceChg === '-' ? '-' : format_number(nextPriceChg.toFixed(2)) + '%';
                    var nextPriceChgCell = '<td style="white-space:nowrap;text-align:right;padding-right:10px;color:' + (nextPriceChg === '-' ? 'initial' : nextPriceChgColor) + '"><i class="fa fa-arrow-trend-' + nextPriceChgIcon + '"></i>&nbsp;' + nextPriceChgCellContent + '</td>';
                    var next_price_chg_col = '<td style="text-align:right;padding-right:10px;">' + nextPriceChgCellContent + '</td>'
                    var final_next_price_chg = nextPriceChg != '-' && nextPriceChg != null ? nextPriceChgCell : next_price_chg_col
                    var currOiChg = data.Current_Month_OIChg;
                    var currOiChgCellContent = currOiChg === '-' ? '-' : format_number(currOiChg.toFixed(2)) + '%';
                    var currOiChgCell = '<td style="white-space:nowrap;text-align:right;padding-right:05px;color:' + (currOiChg === '-' ? 'initial' : currentOiChgColor) + '"><i class="fa fa-arrow-trend-' + currentOiChgIcon + '"></i>&nbsp;' + currOiChgCellContent + '</td>';
                    var curr_Oi_chg_col = '<td style="text-align:right;padding-right:10px;">' + currOiChgCellContent + '</td>'
                    var final_curr_Oi_chg = currOiChg != '-' && currOiChg != null ? currOiChgCell : curr_Oi_chg_col
                    var nextOiChg = data.Next_Month_OIChg;
                    var nextOiChgCellContent = nextOiChg === '-' ? '-' : format_number(nextOiChg.toFixed(2)) + '%';
                    var nextOiChgCell = '<td style="white-space:nowrap;text-align:right;padding-right:05px;color:' + (nextOiChg === '-' ? 'initial' : nextOiChgColor) + '"><i class="fa fa-arrow-trend-' + nextOiChgIcon + '"></i>&nbsp;' + nextOiChgCellContent + '</td>';
                    var next_Oi_chg_col = '<td style="text-align:right;padding-right:10px;">' + nextOiChgCellContent + '</td>'
                    var final_next_Oi_chg = nextOiChg != '-' && nextOiChg != null ? nextOiChgCell : next_Oi_chg_col
                    var farOiChg = data.Far_Month_OIChg;
                    var farOiChgCellContent = farOiChg === '-' ? '-' : format_number(farOiChg.toFixed(2)) + '%';
                    var farOiChgCell = '<td style="white-space:nowrap;text-align:right;padding-right:05px;color:' + (farOiChg === '-' ? 'initial' : farOiChgColor) + '"><i class="fa fa-arrow-trend-' + farOiChgIcon + '"></i>&nbsp;' + farOiChgCellContent + '</td>';
                    var far_Oi_chg_col = '<td style="text-align:right;padding-right:10px;">' + farOiChgCellContent + '</td>'
                    var final_far_Oi_chg = farOiChg != '-' && farOiChg != null ? farOiChgCell : far_Oi_chg_col
                    var curr_mon = data.curr_mon != null ? data.curr_mon : '-';
                    var far_mon = data.far_mon != null ? data.far_mon : '-';
                    var next_mon = data.next_mon != null ? data.next_mon : '-';
                    var fairPriceText = data.FairPrice != null ? data.FairPrice : '-';
                    var FairPriceExpDate = data.FairPriceExpDate != null ? data.FairPriceExpDate : '-';
                    var curr_mon_price = data.Current_Month_Price != null ? data.Current_Month_Price : '-';
                    var next_mon_price = data.Next_Month_Price != null ? data.Next_Month_Price : '-';
                    var far_mon_price = data.Far_Month_Price != null ? data.Far_Month_Price : '-';
                    var lot_size = data.lot_size != null ? data.lot_size : '-';
                    var options = "<div><h6 style='text-align:center; font-size: 15px;'> Symbol : " + optSymbol + "</h6><table class='table-bordered' style='border-collapse: collapse;width:100%'><tr><th style='padding:15px;width:15%;'>Expiry Date</th style='padding:25px;width:15%'><th>Price</th><th style='padding:25px;width:15%'>Price Chg</th><th style='padding:25px;width:15%'>Volume</th><th style='padding:25px'>OI</th><th style='padding:25px;width:15%'>OI Chg</th></tr><tr><td style='text-align:left;width:15%;padding-Left:10px'>" + curr_mon + "</td><td style='text-align:right;padding-right:2%;'>" + curr_mon_price + "</td>" + final_curr_price_chg + "<td style='text-align:right;padding-right:20px;'>" + format_number(data.Current_Month_Volume) + "</td><td style='text-align:right;padding-right:30px;'>" + format_number(data.Current_Month_OI) + "</td>" + final_curr_Oi_chg + "</tr><tr><td style='text-align:left;width:15%;padding-Left:10px'>" + next_mon + "</td><td style='text-align:right;padding-right:2%;'>" + next_mon_price + "</td>" + final_next_price_chg + "<td style='text-align:right;padding-right:20px;'>" + format_number(data.Next_Month_Volume) + "</td><td style='text-align:right;padding-right:30px;'>" + format_number(data.Next_Month_OI) + "</td>" + final_next_Oi_chg + "</tr><tr><td style='text-align:left;width:15%;padding-Left:10px'>" + far_mon + "</td><td style='text-align:right;padding-right:2%;'>&nbsp;" + far_mon_price + "</td>" + final_price_chg + "<td style='text-align:right;padding-right:20px;'>" + format_number(data.Far_Month_Volume) + "</td><td style='text-align:right;padding-right:30px;'>" + format_number(data.Far_Month_OI) + "</td>" + final_far_Oi_chg + "</tr></table><div class='grid xl:grid-cols-6 lg:grid-cols-2 md:grid-cols-3 xs:grid-cols-2' style='padding:10px'><h6>Fair Price <span>(" + FairPriceExpDate + ") :&nbsp;" + fairPriceText + "</span></h6><h6>Lot Size :&nbsp;<span>" + lot_size + "</span></h6></div></div>";
                    $("#symbolDetails").html(options);
                    var rollover = data.Rollover;
                    var mwpl = data.mwpl;
                    var iv = ((data.iv - data.sym_Min_iv) / (data.sym_Max_iv - data.sym_Min_iv)) * 100;
                    var pcr = ((data.pcr - data.sym_Min_Pcr) / (data.sym_Max_Pcr - data.sym_Min_Pcr)) * 100;
                    const rolloverlabel = data.Rollover != null ? data.Rollover.toString() : "-";
                    const mwpllabel = data.mwpl != null ? data.mwpl.toString() : "-";
                    const ivlabel = data.iv != null ? data.iv.toString() : "-";
                    const pcrlabel = data.pcr != null ? data.pcr.toString() : "-";
                    if (rollover == null) {
                        rollover = 0;
                        gauge5.updateOptions({
                            series: [rollover],
                            labels: [rolloverlabel],
                        });
                    } else {
                        gauge5.updateOptions({
                            series: [rollover],
                            labels: [rolloverlabel],
                        });
                    }
                    if (mwpl == null) {
                        mwpl = 0;
                        gauge6.updateOptions({
                            series: [mwpl],
                            labels: [mwpllabel],
                        });
                    } else {
                        gauge6.updateOptions({
                            series: [mwpl],
                            labels: [mwpllabel],
                        });
                    }
                    if (iv == null) {
                        iv = 0;
                        gauge7.updateOptions({
                            series: [iv],
                            labels: [ivlabel],
                        });
                    } else {
                        gauge7.updateOptions({
                            series: [iv],
                            labels: [ivlabel],
                        });
                    }
                    if (pcr == null) {
                        pcr = 0;
                        gauge8.updateOptions({
                            series: [pcr],
                            labels: [pcrlabel],
                        });
                    } else {
                        gauge8.updateOptions({
                            series: [pcr],
                            labels: [pcrlabel],
                        });
                    }
                    $("#gauge7Content").html("<div class='flex justify-between guageContent'><h6 title='Min IV' class='min-maxgaugeData'>" + data.sym_Min_iv + "</h6><h6 title='Max IV' class='min-maxgaugeData'>" + data.sym_Max_iv + "</h6></div>");
                    $("#gauge8Content").html("<div class='flex justify-between guageContent'><h6 title='Min Pcr' class='min-maxgaugeData'>" + data.sym_Min_Pcr + "</h6><h6 title='Max Pcr' class='min-maxgaugeData'>" + data.sym_Max_Pcr + "</h6></div>");
                    $("#gaugeData").html("<div class='xs:grid xs:grid-cols-3 md:flex xl:gap-3 lg:gap-2  gap-3 xl:px-3 lg:px-1 xl:pt-1 lg:pt-2' > <h6>IVR:&nbsp;<span>" + format_number(data.ivr.toFixed(2)) + "</span></h6><h6>IVP:&nbsp;<span>" + format_number(data.ivp.toFixed(2)) + "</span></h6><h6>Max Pain:&nbsp;<span>" + data.MaxPain + "</span></h6></div>");
                    var max_pe_oi_chg_strike = data.highest_put_oi_chg_strike != false ? data.highest_put_oi_chg_strike : '-';
                    ;var max_ce_oi_chg_strike = data.highest_call_oi_chg_strike != false ? data.highest_call_oi_chg_strike : '-';
                    ;var max_ce_oi_strike = data.highest_call_oi_strike != null ? data.highest_call_oi_strike : '-';
                    var max_pe_oi_strike = data.highest_put_oi_strike != null ? data.highest_put_oi_strike : '-';
                    var Total_Call_OI = data.Total_Call_OI != null ? format_number(data.Total_Call_OI) : '-';
                    var Total_Put_OI = data.Total_Put_OI != null ? format_number(data.Total_Put_OI) : '-';
                    $("#gaugesData").html("<div><h6 class='text-black font-bold font-mono py-2'>Last Updated at :&nbsp;<span>" + formatLastUpdated(data.last_updated) + "</span></h6><div class='flex gap-4 justify-between pt-1'><ul class='list-none'><li class='text-black font-bold font-mono py-2'>Total CE OI :&nbsp;<span>" + Total_Call_OI + "</span></li><li class='text-black font-bold font-mono py-2'>Total PE OI :&nbsp;<span>" + Total_Put_OI + "</span></li><li class='text-black font-bold font-mono py-2'>Diff PE-CE OI :&nbsp;<span>" + format_number(data.PE_CE_OI_DIFF) + "</span></li><li class='text-black font-bold font-mono py-2'>Trend OI :&nbsp;<span>" + data.OI_Trend + "</span></li><li class='text-black font-bold font-mono py-2'>Max CE OI Strike :&nbsp;<span>" + max_ce_oi_strike + "</span></li><li class='text-black font-bold font-mono py-2'>Max CE OI Chg Strike :&nbsp;<span>" + max_ce_oi_chg_strike + "</span></li></ul><ul class='list-none'><li class='text-black font-bold font-mono py-2'>Total CE OI Chg :&nbsp;<span>" + format_number(data.Total_Call_OIChg) + "</span></li><li class='text-black font-bold font-mono py-2'>Total PE OI Chg :&nbsp;<span>" + format_number(data.Total_Put_OIChg) + "</span></li><li class='text-black font-bold font-mono py-2'>Diff PE-CE OI Chg :&nbsp;<span style='color:" + peceoiDiffColor + "'>" + format_number(data.PE_CE_OIChg_DIFF) + "</span></li><li class='text-black font-bold font-mono py-2'>Trend OI Chg :&nbsp;<span>" + data.OIChg_Trend + "</span></li><li class='text-black font-bold font-mono py-2'>Max PE OI Strike :&nbsp;<span>" + max_pe_oi_strike + "</span></li><li class='text-black font-bold font-mono py-2'>Max PE OI Chg Strike :&nbsp;<span>" + max_pe_oi_chg_strike + "</span></li></ul></div></div>");
                }
            },
        });
    }
    $.fn.dataTable.ext.errMode = "none";
    var call_iv_col = [0];
    var call_oi_chg_col = [1];
    var call_oi_col = [2];
    var call_price_col = [3];
    var StrikePrice = [4];
    var put_price_col = [5];
    var put_oi_col = [6];
    var put_oi_chg_col = [7];
    var put_iv_col = [8];
    function getoianalysislist() {
        var strikepriceColumn = 4;
        var strikePriceATMvalue;
        if ($.fn.DataTable.isDataTable("#sort_table")) {
            $("#sort_table").DataTable().destroy();
            $("#sort_table tbody").empty();
        }
        var rdDataType = $("#rdDataType").val();
        var optSymbol = $("#optSymbol").val();
        // var optExpDate = $("#optExpDate").val();
		var optExpDate;
		if(rdDataType === 'hist'){
			optExpDate = $("#optExpDate_hist").val();
		}else{
			optExpDate = $("#optExpDate").val();
		}
        var txtDate = $("#txtDate").val();
        table = $("#sort_table").DataTable({
            dom: "Bfrtip",
            fixedHeader: true,
            searchDelay: 0,
            paging: false,
            bFilter: false,
            buttons: [],
            order: [],
            autoWidth: false,
            ajax: {
                url: root_url + "getOptionChainData_commFunc_v2.php",
                type: "POST",
                data: {
                    optSymbol: optSymbol,
                    optExpDate: optExpDate,
                    rdDataType: rdDataType,
                    txtDate: txtDate,
                },
                cache: false,
            },
            infoCallback: function(settings, start, end, max, total, pre) {
                return "";
            },
            language: {
                emptyTable: "No Data Available",
            },
            columnDefs: [{
                targets: call_iv_col,
                className: "dt-body-center",
                render: function(data, type, row, meta) {
					
                    if (data === null || data == "0.00" || data == "" || data == 0.00)
					{
						data = "-";
					}
                    return ("<div style='font-weight:bold;white-space: nowrap;'>" + data + "<div>");
                },
            }, {
                targets: call_oi_chg_col,
                className: "dt-body-center",
                render: function(data, type, row, meta) {
                    if (type == "sort" || type == 'type')
                        return data;
                    if (data === null)
                        data = "-";
                    if (data > 0) {
                        return ("<div style='font-weight:bold;white-space: nowrap;color:#7bc862'>" + format_number(data) + "<div>");
                    } else if (data < 0) {
                        return ("<div style='font-weight:bold;white-space: nowrap;color:#dc143c'>" + format_number(data) + "<div>");
                    } else {
                        return ("<div style='font-weight:bold;white-space: nowrap;>" + format_number(data) + "<div>");
                    }
                },
            }, {
                targets: call_oi_col,
                className: "dt-body-center",
                render: function(data, type, row, meta) {
                    if (type == "sort" || type == 'type')
                        return data;
                    if (data === null)
                        data = "-";
                    return ("<div style='font-weight:bold;white-space: nowrap;'>" + format_number(data) + "<div>");
                },
            }, {
                targets: call_price_col,
                className: "dt-body-center",
                render: function(data, type, row, meta) {
                    if (data === null)
                        data = "-";
                    return ("<div style='font-weight:bold;white-space: nowrap;'>" + data + "<div>");
                },
            }, {
                targets: StrikePrice,
                className: "dt-body-center",
                render: function(data, type, row, meta) {
                    if (data === null)
                        data = "-";
                    $(table.row(meta.row).nodes()).find("td:eq(" + strikepriceColumn + ")").addClass("khaki");
                    if (row[strikepriceColumn] == meta.settings.json.strikePriceATM) {
                        $(table.row(meta.row).nodes()).addClass("khaki");
                        return ("<div style='font-weight:bold;white-space: nowrap;'>" + data + "<div>");
                    } else if (parseFloat(row[strikepriceColumn]) < meta.settings.json.strikePriceATM) {
                        $(table.row(meta.row).nodes()).find("td:eq(0)").addClass("itmhighlight");
                        $(table.row(meta.row).nodes()).find("td:eq(1)").addClass("itmhighlight");
                        $(table.row(meta.row).nodes()).find("td:eq(2)").addClass("itmhighlight");
                        $(table.row(meta.row).nodes()).find("td:eq(3)").addClass("itmhighlight");
                        return ("<div style='font-weight:bold;white-space: nowrap;'>" + data + "<div>");
                    } else if (parseFloat(row[strikepriceColumn]) > meta.settings.json.strikePriceATM) {
                        $(table.row(meta.row).nodes()).find("td:eq(5)").addClass("itmhighlight");
                        $(table.row(meta.row).nodes()).find("td:eq(6)").addClass("itmhighlight");
                        $(table.row(meta.row).nodes()).find("td:eq(7)").addClass("itmhighlight");
                        $(table.row(meta.row).nodes()).find("td:eq(8)").addClass("itmhighlight");
                        return ("<div style='font-weight:bold;white-space: nowrap;'>" + data + "<div>");
                    }
                },
            }, {
                targets: put_price_col,
                className: "dt-body-center",
                render: function(data, type, row, meta) {
                    if (data === null)
                        data = "-";
                    return ("<div style='font-weight:bold;white-space: nowrap;'>" + data + "<div>");
                },
            }, {
                targets: put_oi_col,
                className: "dt-body-center",
                render: function(data, type, row, meta) {
                    if (type == "sort" || type == 'type')
                        return data;
                    if (data === null)
                        data = "-";
                    return ("<div style='font-weight:bold;white-space: nowrap;'>" + format_number(data) + "<div>");
                },
            }, {
                targets: put_oi_chg_col,
                className: "dt-body-center",
                render: function(data, type, row, meta) {
                    if (type == "sort" || type == 'type')
                        return data;
                    if (data === null)
                        data = "-";
                    if (data > 0) {
                        return ("<div style='font-weight:bold;white-space: nowrap;color:#7bc862'>" + format_number(data) + "<div>");
                    } else if (data < 0) {
                        return ("<div style='font-weight:bold;white-space: nowrap;color:#dc143c'>" + format_number(data) + "<div>");
                    } else {
                        return ("<div style='font-weight:bold;white-space: nowrap;>" + format_number(data) + "<div>");
                    }
                },
            }, {
                targets: put_iv_col,
                className: "dt-body-center",
                render: function(data, type, row, meta) {
                    if (data === null || data == "0.00" || data == "" || data == 0.00)
					{
						data = "-";
					}
                    return ("<div style='font-weight:bold;white-space: nowrap;'>" + data + "<div>");
                },
            }, ],
        });
    }
    var labels = '{"Call_Price_OI_Chg": "Call Price","Put_Price_OI_Chg": "Put Price","Call_Price_OI": "Call Price","Put_Price_OI": "Put Price","Max_CE_OI": "Max CE OI","Max_PE_OI": "Max PE OI","CE_OI": "CE OI","PE_OI": "PE OI","Max_CE_OI_Chg": "Max CE OI Chg","Max_PE_OI_Chg": "Max PE OI Chg","CE_OI_Chg": "CE OI Chg","PE_OI_Chg": "PE OI Chg"}';
    var label_names = JSON.parse(labels);
    var oi_hc;
    var oichg_hc;
    var CallPutColorsValue;
    function searchPoint(event, chart) {
        var points = chart.series[0].points, len = points.length, x = chart.axes[0].toValue(event.chartX), range = 0.2, pointX, i;
        for (i = 0; i < len; i++) {
            pointX = points[i].x;
            if (x - range < pointX && pointX < x + range) {
                return points[i];
            }
        }
    }
    $("#mainContainer").bind("mousemove touchmove touchstart", function(e) {
        var chart, point, i, event;
        $(".sync-zoom").each(function() {
            chart = $(this).highcharts();
            if (typeof chart !== "undefined") {
                event = chart.pointer.normalize(e.originalEvent);
                point = searchPoint(event, chart);
                if (point) {
                    point.highlight(e);
                }
            }
        });
    });
    function syncExtremes(e) {
        var thisChart = this.chart;
        const shouldShowResetZoom = !(e.min === undefined && e.max === undefined);
        if (e.trigger !== "syncExtremes") {
            $(".sync-zoom").each(function() {
                chart = $(this).highcharts();
                if (typeof chart !== "undefined") {
                    if (chart !== thisChart) {
                        if (chart.xAxis[0].setExtremes) {
                            chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, {
                                trigger: "syncExtremes",
                            });
                        }
                    }
                    if (shouldShowResetZoom && !chart.resetZoomButton) {
                        chart.showResetZoom();
                    } else if (!shouldShowResetZoom && chart.resetZoomButton) {
                        chart.resetZoomButton = chart.resetZoomButton.destroy();
                    }
                }
            });
        }
    }
    $("#mainContainer").bind("mouseleave mouseout ", function(e) {
        var chart, point, i, event;
        for (i = 0; i < Highcharts.charts.length; i = i + 1) {
            chart = Highcharts.charts[i];
            if (typeof chart !== "undefined") {
                if (chart.index % 2 == 0 || chart.index % 2 == 1) {
                    event = chart.pointer.normalize(e.originalEvent);
                    chart.series.forEach(function(s) {
                        point = s.searchPoint(event, true);
                        if (point) {
                            point.setState("");
                        }
                    });
                    chart.tooltip.hide();
                    chart.xAxis[0].hideCrosshair();
                }
            }
        }
    });
    function getHighchart(calldata, is_refresh) {
        if (is_refresh == 1) {
            if (calldata.allstrikes.length > 0) {
                var index_val = calldata.allstrikes.indexOf(calldata.rtstrikeprice);
                oi_hc.series[0].setData(calldata.CallPrice_data, true, true, false);
                oi_hc.series[1].setData(calldata.PutPrice_data, true, true, false);
                oi_hc.series[2].setData(calldata.callMaxOI_data_qty, true, true, false);
                oi_hc.series[3].setData(calldata.putMaxOI_data_qty, true, true, false);
                oi_hc.series[4].setData(calldata.call_oi_data_qty, true, true, false);
                oi_hc.series[5].setData(calldata.put_oi_data_qty, true, true, false);
                oichg_hc.series[0].setData(calldata.CallPriceChg_data, true, true, false);
                oichg_hc.series[1].setData(calldata.PutPriceChg_data, true, true, false);
                oichg_hc.series[2].setData(calldata.MaxoiChangeCall_data_qty, true, true, false);
                oichg_hc.series[3].setData(calldata.MaxoiChangePut_data_qty, true, true, false);
                oichg_hc.series[4].setData(calldata.call_oi_change_data_qty, true, true, false);
                oichg_hc.series[5].setData(calldata.put_oi_change_data_qty, true, true, false);
                oi_hc.xAxis[0].options.plotLines[0].value = index_val;
                oi_hc.xAxis[0].options.plotLines[0].label.text = calldata.rtstrikeprice;
                oichg_hc.xAxis[0].options.plotLines[0].value = index_val;
                oichg_hc.xAxis[0].options.plotLines[0].label.text = calldata.rtstrikeprice;
                oi_hc.xAxis[0].update({
                    categories: calldata.allstrikes,
                });
                oichg_hc.xAxis[0].update({
                    categories: calldata.allstrikes,
                });
            }
        } else if (is_refresh == 2) {
            showloadingall();
            if (calldata.allstrikes.length > 0) {
                var index_val = calldata.allstrikes.indexOf(calldata.rtstrikeprice);
                oi_hc.series[0].setData(calldata.callMaxOI_data_qty, true, true, false);
                oi_hc.series[1].setData(calldata.putMaxOI_data_qty, true, true, false);
                oi_hc.series[2].setData(calldata.call_oi_data_qty, true, true, false);
                oi_hc.series[3].setData(calldata.put_oi_data_qty, true, true, false);
                oichg_hc.series[0].setData(calldata.CallPriceChg_data, true, true, false);
                oichg_hc.series[1].setData(calldata.PutPriceChg_data, true, true, false);
                oichg_hc.series[2].setData(calldata.MaxoiChangeCall_data_qty, true, true, false);
                oichg_hc.series[3].setData(calldata.MaxoiChangePut_data_qty, true, true, false);
                oichg_hc.series[4].setData(calldata.call_oi_change_data_qty, true, true, false);
                oichg_hc.series[5].setData(calldata.put_oi_change_data_qty, true, true, false);
                oi_hc.xAxis[0].options.plotLines[0].value = index_val;
                oi_hc.xAxis[0].options.plotLines[0].label.text = calldata.rtstrikeprice;
                oichg_hc.xAxis[0].options.plotLines[0].value = index_val;
                oichg_hc.xAxis[0].options.plotLines[0].label.text = calldata.rtstrikeprice;
                oi_hc.xAxis[0].update({
                    categories: calldata.allstrikes,
                });
                oichg_hc.xAxis[0].update({
                    categories: calldata.allstrikes,
                });
                hideloadingall();
            }
        } else {
            $(".loader").hide();
            var index_val = calldata.allstrikes.indexOf(calldata.rtstrikeprice);
            var calldata_callMaxOI_data = calldata.callMaxOI_data_qty;
            var calldata_putMaxOI_data = calldata.putMaxOI_data_qty;
            var calldata_call_oi_data = calldata.call_oi_data_qty;
            var calldata_put_oi_data = calldata.put_oi_data_qty;
            var calldata_call_price_data = calldata.CallPrice_data;
            var calldata_put_price_data = calldata.PutPrice_data;
            var calldata_colorprefer_data = calldata.colorPrefer_data;
            if (calldata_colorprefer_data == 0) {
                preferCallColor = "#7BC862";
                preferPutColor = "#dc143c";
            } else {
                preferPutColor = "#7BC862";
                preferCallColor = "#dc143c";
            }
            var calldata_MaxoiChangeCall_data = calldata.MaxoiChangeCall_data_qty;
            var calldata_MaxoiChangePut_data = calldata.MaxoiChangePut_data_qty;
            var calldata_call_oi_change_data = calldata.call_oi_change_data_qty;
            var calldata_put_oi_change_data = calldata.put_oi_change_data_qty;
            var calldata_call_price_oi_change_data = calldata.CallPriceChg_data;
            var calldata_put_price_oi_change_data = calldata.PutPriceChg_data;
            oi_hc = Highcharts.chart("oichart_hc", {
                chart: {
                    type: "column",
                    zoomType: "xy",
                    backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
                    marginTop: 20,
                },
                title: {
                    text: "",
                },
                navigator: {
                    series: {
                        showInNavigator: false,
                        color: "#fff",
                        lineWidth: 0,
                    },
                    height: 5,
                    margin: 20,
                    enabled: true,
                    yAxis: {
                        visible: true,
                    },
                    xAxis: {
                        visible: false,
                    },
                },
                scrollbar: {
                    height: 3,
                },
                subtitle: {
                    align: "left",
                    x: 20,
                    y: 0,
                    style: {
                        color: "black",
                        fontSize: "12px",
                    },
                },
                xAxis: {
                    categories: calldata.allstrikes,
                    tickInterval: 3,
                    lineColor: isDarkMode ? "#434348" : "#f0f0f0",
                    labels: {
                        style: {
                            color: isDarkMode ? "#f6f8fa" : "#000",
                            fontWeight: "bold",
                            fontFamily: "Poppins, sans-serif",
                        },
                    },
                    events: {
                        setExtremes: syncExtremes,
                    },
                    plotLines: [{
                        color: "#898989",
                        fillOpacity: 0.2,
                        lineWidth: 1.5,
                        dashStyle: "shortdot",
                        value: index_val,
                        label: {
                            text: calldata.rtstrikeprice,
                            align: "center",
                            rotation: 0,
                            style: {
                                fontSize: "11.5px",
                                fontWeight: "bold",
                                fontFamily: "Poppins, sans-serif",
                                color: "#898989",
                            },
                        },
                        zIndex: 1000,
                    }, ],
                },
                tooltip: {
                    crosshairs: {
                        color: "#cdcdcd",
                    },
                    shared: true,
                    pointFormatter: function() {
                        var data = parseFloat(this.y);
                        var LastTimeStamp = $("#LastTimeStamp").val();
                        var Max_CE_OI_tt = this.series.chart.series[2].data[this.index].y;
                        var Max_PE_OI_tt = this.series.chart.series[3].data[this.index].y;
                        var CE_OI_tt = this.series.chart.series[4].data[this.index].y;
                        var PE_OI_tt = this.series.chart.series[5].data[this.index].y;
                        var CE_Unwinding = Max_CE_OI_tt - CE_OI_tt;
                        var PE_Unwinding = Max_PE_OI_tt - PE_OI_tt;
                        CE_Unwinding = isNaN(CE_Unwinding) ? "-" : format(CE_Unwinding);
                        PE_Unwinding = isNaN(PE_Unwinding) ? "-" : format(PE_Unwinding);
                        if (this.series.name == label_names.Call_Price_OI) {
                            return ('<span style="color:' + preferCallColor + '">- </span>' + this.series.name + ": " + "<b>" + format(data) + "</b><br>");
                        } else if (this.series.name == label_names.Put_Price_OI) {
                            return ('<span style="color:' + preferPutColor + '">- </span>' + this.series.name + ": " + "<b>" + format(data) + "</b><br>");
                        } else if (this.series.name == label_names.Max_CE_OI) {
                            return ('<span style="color:' + preferCallColor + '">\u25CB</span>' + this.series.name + ": " + "<b>" + format(data) + "</b><br>");
                        } else if (this.series.name == label_names.Max_PE_OI) {
                            return ('<span style="color:' + preferPutColor + '">\u25CB</span>' + this.series.name + ": " + "<b>" + format(data) + "</b><br>");
                        } else if (this.series.name == label_names.CE_OI) {
                            return ('<span style="color:' + preferCallColor + '">\u25CF</span>' + this.series.name + ": " + "<b>" + format(data) + "</b><br>");
                        } else {
                            return ('<span style="color:' + preferPutColor + '">\u25CF</span>' + this.series.name + ": " + "<b>" + format(data) + "</b><br>" + "CE Unwinding: " + '<span style="font-weight:bold">' + CE_Unwinding + "</span><br>" + "PE Unwinding: " + '<span style="font-weight:bold">' + PE_Unwinding + "</span><br>" + "As On:" + '<span style="font-weight:bold">' + LastTimeStamp + "</span>");
                        }
                    },
                },
                plotOptions: {
                    column: {
                        grouping: false,
                    },
                    series: {
                        point: {
                            events: {},
                        },
                        pointPadding: 0.1,
                        maxPointWidth: 20,
                        events: {
                            legendItemClick: function() {
                                var visibility = this.visible ? "visible" : "hidden";
                                var series = this.series;
								
                                if (visibility == "hidden") {
                                    if (this.name == label_names.Call_Price_OI)
                                        $(this.legendSymbol.element).attr("stroke", preferCallColor);
                                    else if (this.name == label_names.Put_Price_OI)
                                        $(this.legendSymbol.element).attr("stroke", preferPutColor);
                                    else if (this.name == label_names.Max_CE_OI)
                                        $(this.legendSymbol.element).attr("stroke", preferCallColor);
                                    else if (this.name == label_names.Max_PE_OI)
                                        $(this.legendSymbol.element).attr("stroke", preferPutColor);
                                    else if (this.name == label_names.CE_OI)
                                        $(this.legendSymbol.element).attr("stroke", preferCallColor);
                                    else if (this.name == label_names.PE_OI)
                                        $(this.legendSymbol.element).attr("stroke", preferPutColor);
                                } else {
                                    if (this.name == label_names.Call_Price_OI)
                                        $(this.legendSymbol.element).attr("stroke", "#cccccc");
                                    else if (this.name == label_names.Put_Price_OI)
                                        $(this.legendSymbol.element).attr("stroke", "#cccccc");
                                    if (this.name == label_names.Max_CE_OI)
                                        $(this.legendSymbol.element).attr("stroke", "#cccccc");
                                    else if (this.name == label_names.Max_PE_OI)
                                        $(this.legendSymbol.element).attr("stroke", "#cccccc");
                                    else if (this.name == label_names.CE_OI)
                                        $(this.legendSymbol.element).attr("stroke", "#cccccc");
                                    else if (this.name == label_names.PE_OI)
                                        $(this.legendSymbol.element).attr("stroke", "#cccccc");
                                }
								var visible = !this.visible;
								if (this.name === label_names.CE_OI) CEOIStatsVisible = visible;
								if (this.name === label_names.PE_OI) PEOIStatsVisible = visible;
								if (this.name === label_names.Max_CE_OI) MaxCEOIStatsVisible = visible;
								if (this.name === label_names.Max_PE_OI) MaxPEOIStatsVisible = visible;
								
								 set_legends_visible(
									PriceLineVisible, VWAPLineVisible, OILineVisible,
									VolumeLineVisible, IVLineVisible, PCRLineVisible,
									CEOIStatsVisible, PEOIStatsVisible,
									CEOIChgStatsVisible, PEOIChgStatsVisible,
									MaxCEOIStatsVisible, MaxPEOIStatsVisible,
									MaxCEOIChgStatsVisible, MaxPEOIChgStatsVisible
								);

								
                            },
                        },
                    },
                },
                yAxis: {
                    plotLines: [{
                        dashStyle: "solid",
                        width: 1,
                        value: 0,
                    }, ],
                    tickAmount: 5,
                    min: null,
                    max: null,
                    startOnTick: false,
                    endOnTick: false,
                    gridLineColor: "rgba(204,204,204,0.3)",
                    title: {
                        text: calldata.callsymbol + "<br>OI",
                        style: {
                            color: isDarkMode ? "#f6f8fa" : "#000",
                            fontWeight: "bold",
                            fontFamily: "Poppins, sans-serif",
                        },
                    },
                    labels: {
                        style: {
                            color: isDarkMode ? "#f6f8fa" : "#000",
                            fontWeight: "bold",
                            fontFamily: "Poppins, sans-serif",
                        },
                        formatter: function() {
                            var formatedvalues;
                            var finalvalue = this.value;
                            if (finalvalue >= 1000 && finalvalue < 100000) {
                                formatedvalues = this.value / 1000;
                                return formatedvalues + " K ";
                            } else if (finalvalue >= 100000 && finalvalue < 10000000) {
                                formatedvalues = this.value / 100000;
                                return formatedvalues + " L ";
                            } else if (finalvalue >= 10000000) {
                                formatedvalues = this.value / 10000000;
                                return formatedvalues + " Cr ";
                            } else if (finalvalue <= -1000 && finalvalue > -100000) {
                                formatedvalues = this.value / 1000;
                                return formatedvalues + " K ";
                            } else if (finalvalue <= -100000 && finalvalue > -10000000) {
                                formatedvalues = this.value / 100000;
                                return formatedvalues + " L ";
                            } else if (finalvalue <= -10000000) {
                                formatedvalues = this.value / 10000000;
                                return formatedvalues + " Cr ";
                            } else {
                                formatedvalues = this.value;
                                return formatedvalues;
                            }
                        },
                    },
                },
                legend: {
                    align: "right",
                    enabled: true,
                    verticalAlign: "top",
                    x: 0,
                    y: -15,
                    itemStyle: {
                        color: "#898989",
                        fontWeight: "bold",
                        fontFamily: "Poppins, sans-serif",
                    },
					itemHoverStyle: {
						color: isDarkMode ? "#ffffff" : "#000" // SAME AS itemStyle
					},

                },
                credits: {
                    enabled: false,
                },
                series: [{
                    name: label_names.Call_Price_OI,
                    color: "transparent",
                    borderColor: preferCallColor,
                    data: calldata_call_price_data,
                    zIndex: 3,
                    pointPadding: 0.3,
                    pointPlacement: -0.2,
                    showInLegend: false
                }, {
                    name: label_names.Put_Price_OI,
                    color: "transparent",
                    borderColor: preferPutColor,
                    data: calldata_put_price_data,
                    zIndex: 3,
                    pointPadding: 0.3,
                    pointPlacement: -0.2,
                    showInLegend: false
                }, {
                    name: label_names.Max_CE_OI,
                    color: "transparent",
                    borderColor: preferCallColor,
                    data: calldata_callMaxOI_data,
                    zIndex: 3,
                    pointPadding: 0.3,
                    pointPlacement: -0.2,
					visible:MaxCEOIStatsVisible
                }, {
                    name: label_names.Max_PE_OI,
                    color: "transparent",
                    borderColor: preferPutColor,
                    data: calldata_putMaxOI_data,
                    zIndex: 3,
                    pointPadding: 0.3,
                    pointPlacement: 0.2,
					visible:MaxPEOIStatsVisible
                }, {
                    name: label_names.CE_OI,
                    color: preferCallColor,
                    borderColor: preferCallColor,
                    data: calldata_call_oi_data,
                    pointPadding: 0.3,
                    pointPlacement: -0.2,
                    zIndex: 3,
					visible:CEOIStatsVisible
                }, {
                    name: label_names.PE_OI,
                    color: preferPutColor,
                    borderColor: preferPutColor,
                    data: calldata_put_oi_data,
                    pointPadding: 0.3,
                    pointPlacement: 0.2,
                    zIndex: 3,
					visible:PEOIStatsVisible
                }, ],
            }, function(chart) {
                var series = chart.series;
                $.each(series, function(i, ser) {
                    if (ser.legendSymbol !== null && ser.legendSymbol !== "" && ser.legendSymbol !== undefined) {
                        if (ser.visible) {
                            if (this.name == label_names.Max_CE_OI)
                                $(ser.legendSymbol.element).attr("stroke", preferCallColor);
                            else if (ser.name == label_names.Max_PE_OI)
                                $(ser.legendSymbol.element).attr("stroke", preferPutColor);
                            else if (ser.name == label_names.Call_Price_OI)
                                $(ser.legendSymbol.element).attr("stroke", preferCallColor);
                            else if (ser.name == label_names.CE_OI)
                                $(ser.legendSymbol.element).attr("stroke", preferCallColor);
                            else if (ser.name == label_names.PE_OI)
                                $(ser.legendSymbol.element).attr("stroke", preferPutColor);
                        }
                    }
                });
            });
            oichg_hc = Highcharts.chart("oichangechart_hc", {
                chart: {
                    type: "column",
                    zoomType: "xy",
                    backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
                    marginTop: 20,
                },
                title: {
                    text: "",
                },
                navigator: {
                    series: {
                        showInNavigator: false,
                        color: "#fff",
                        lineWidth: 0,
                    },
                    height: 5,
                    margin: 20,
                    enabled: true,
                    yAxis: {
                        visible: true,
                    },
                    xAxis: {
                        visible: false,
                    },
                },
                scrollbar: {
                    height: 3,
                },
                subtitle: {
                    align: "left",
                    x: 20,
                    y: 0,
                    style: {
                        color: "black",
                        fontSize: "12px",
                    },
                },
                xAxis: {
                    categories: calldata.allstrikes,
                    tickInterval: 3,
                    lineColor: isDarkMode ? "#434348" : "#f0f0f0",
                    labels: {
                        style: {
                            color: isDarkMode ? "#f6f8fa" : "#000",
                            fontWeight: "bold",
                            fontFamily: "Poppins, sans-serif",
                        },
                    },
                    events: {
                        setExtremes: syncExtremes,
                    },
                    plotLines: [{
                        color: "#898989",
                        fillOpacity: 0.2,
                        lineWidth: 1.5,
                        dashStyle: "shortdot",
                        value: index_val,
                        label: {
                            text: calldata.rtstrikeprice,
                            align: "center",
                            rotation: 0,
                            style: {
                                fontSize: "11.5px",
                                fontWeight: "bold",
                                fontFamily: "Poppins, sans-serif",
                                color: "#898989",
                            },
                        },
                        zIndex: 1000,
                    }, ],
                },
                tooltip: {
                    shared: true,
                    crosshairs: {
                        color: "#cdcdcd",
                    },
                    pointFormatter: function() {
                        var data = parseFloat(this.y);
                        var LastTimeStamp = $("#LastTimeStamp").val();
                        var delayed_tf = $("#interval").val();
                        var Max_CE_OI_Chg_tt = this.series.chart.series[2].data[this.index].y;
                        var Max_PE_OI_Chg_tt = this.series.chart.series[3].data[this.index].y;
                        var CE_OI_Chg_tt = this.series.chart.series[4].data[this.index].y;
                        var PE_OI_Chg_tt = this.series.chart.series[5].data[this.index].y;
                        var CE_OI_Chg_Unwinding = Max_CE_OI_Chg_tt - CE_OI_Chg_tt;
                        var PE_OI_Chg_Unwinding = Max_PE_OI_Chg_tt - PE_OI_Chg_tt;
                        CE_OI_Chg_Unwinding = isNaN(CE_OI_Chg_Unwinding) ? "-" : format(CE_OI_Chg_Unwinding);
                        PE_OI_Chg_Unwinding = isNaN(PE_OI_Chg_Unwinding) ? "-" : format(PE_OI_Chg_Unwinding);
                        if (delayed_tf == "3min") {
                            if (this.series.name == label_names.Call_Price_OI_Chg) {
                                return ('<span style="color:' + preferCallColor + '">\u25CF</span>' + this.series.name + ": " + "<b>" + format(data) + "</b><br>");
                            } else if (this.series.name == label_names.Put_Price_OI_Chg) {
                                return ('<span style="color:' + preferPutColor + '">\u25CF</span>' + this.series.name + ": " + "<b>" + format(data) + "</b><br>");
                            } else if (this.series.name == label_names.CE_OI_Chg) {
                                return ('<span style="color:' + preferCallColor + '">\u25CF</span>' + this.series.name + ": " + "<b>" + format(data) + "</b><br>");
                            } else if (this.series.name == label_names.PE_OI_Chg) {
                                return ('<span style="color:' + preferPutColor + '">\u25CF</span>' + this.series.name + ": " + "<b>" + format(data) + "</b><br>" + "As On:" + '<span style="font-weight:bold">' + LastTimeStamp + "</span>");
                            }
                        } else {
                            if (this.series.name == label_names.Call_Price_OI_Chg) {
                                return ('<span style="color:' + preferCallColor + '">- </span>' + this.series.name + ": " + "<b>" + format(data) + "</b><br>");
                            } else if (this.series.name == label_names.Put_Price_OI_Chg) {
                                return ('<span style="color:' + preferPutColor + '">- </span>' + this.series.name + ": " + "<b>" + format(data) + "</b><br>");
                            } else if (this.series.name == label_names.Max_CE_OI_Chg) {
                                return ('<span style="color:' + preferCallColor + '">\u25CB</span>' + this.series.name + ": " + "<b>" + format(data) + "</b><br>");
                            } else if (this.series.name == label_names.Max_PE_OI_Chg) {
                                return ('<span style="color:' + preferPutColor + '">\u25CB</span>' + this.series.name + ": " + "<b>" + format(data) + "</b><br>");
                            } else if (this.series.name == label_names.CE_OI_Chg) {
                                return ('<span style="color:' + preferCallColor + '">\u25CF</span>' + this.series.name + ": " + "<b>" + format(data) + "</b><br>");
                            } else {
                                return ('<span style="color:' + preferPutColor + '">\u25CF</span>' + this.series.name + ": " + "<b>" + format(data) + "</b><br>" + "CE Unwinding: " + '<span style="font-weight:bold">' + CE_OI_Chg_Unwinding + "</span><br>" + "PE Unwinding: " + '<span style="font-weight:bold">' + PE_OI_Chg_Unwinding + "</span><br>" + "As On:" + '<span style="font-weight:bold">' + LastTimeStamp + "</span>");
                            }
                        }
                    },
                },
                plotOptions: {
                    column: {
                        grouping: false,
                    },
                    series: {
                        point: {
                            events: {},
                        },
                        events: {
                            legendItemClick: function() {
                                var visibility = this.visible ? "visible" : "hidden";
                                var series = this.series;
                                if (visibility == "hidden") {
                                    if (this.name == label_names.Call_Price_OI_Chg)
                                        $(this.legendSymbol.element).attr("stroke", preferCallColor);
                                    else if (this.name == label_names.Put_Price_OI_Chg)
                                        $(this.legendSymbol.element).attr("stroke", preferPutColor);
                                    else if (this.name == label_names.Max_CE_OI_Chg)
                                        $(this.legendSymbol.element).attr("stroke", preferCallColor);
                                    else if (this.name == label_names.Max_PE_OI_Chg)
                                        $(this.legendSymbol.element).attr("stroke", preferPutColor);
                                    else if (this.name == label_names.CE_OI_Chg)
                                        $(this.legendSymbol.element).attr("stroke", preferCallColor);
                                    else if (this.name == label_names.PE_OI_Chg)
                                        $(this.legendSymbol.element).attr("stroke", preferPutColor);
                                } else {
                                    if (this.name == label_names.Call_Price_OI_Chg)
                                        $(this.legendSymbol.element).attr("stroke", "#cccccc");
                                    else if (this.name == label_names.Put_Price_OI_Chg)
                                        $(this.legendSymbol.element).attr("stroke", "#cccccc");
                                    else if (this.name == label_names.Max_CE_OI_Chg)
                                        $(this.legendSymbol.element).attr("stroke", "#cccccc");
                                    else if (this.name == label_names.Max_PE_OI_Chg)
                                        $(this.legendSymbol.element).attr("stroke", "#cccccc");
                                    else if (this.name == label_names.CE_OI_Chg)
                                        $(this.legendSymbol.element).attr("stroke", "#cccccc");
                                    else if (this.name == label_names.PE_OI_Chg)
                                        $(this.legendSymbol.element).attr("stroke", "#cccccc");
                                }
								var visible = !this.visible;
								if (this.name === label_names.Max_CE_OI_Chg) MaxCEOIChgStatsVisible = visible;
								if (this.name === label_names.Max_PE_OI_Chg) MaxPEOIChgStatsVisible = visible;
								if (this.name === label_names.CE_OI_Chg) CEOIChgStatsVisible = visible;
								if (this.name === label_names.PE_OI_Chg) PEOIChgStatsVisible = visible;

								
								set_legends_visible(
									PriceLineVisible, VWAPLineVisible, OILineVisible,
									VolumeLineVisible, IVLineVisible, PCRLineVisible,
									CEOIStatsVisible, PEOIStatsVisible,
									CEOIChgStatsVisible, PEOIChgStatsVisible,
									MaxCEOIStatsVisible, MaxPEOIStatsVisible,
									MaxCEOIChgStatsVisible, MaxPEOIChgStatsVisible
								);
                            },
                        },
                    },
                },
                yAxis: {
                    plotLines: [{
                        dashStyle: "solid",
                        width: 1,
                        value: 0,
                    }, ],
                    tickAmount: 5,
                    min: null,
                    max: null,
                    startOnTick: false,
                    endOnTick: false,
                    gridLineColor: "rgba(204,204,204,0.3)",
                    title: {
                        text: calldata.callsymbol + "<br>OI Change",
                        style: {
                            color: isDarkMode ? "#f6f8fa" : "#000",
                            fontWeight: "bold",
                            fontFamily: "Poppins, sans-serif",
                        },
                    },
                    labels: {
                        style: {
                            color: isDarkMode ? "#f6f8fa" : "#000",
                            fontWeight: "bold",
                            fontFamily: "Poppins, sans-serif",
                        },
                        formatter: function() {
                            var formatedvalues;
                            var finalvalue = this.value;
                            if (finalvalue >= 1000 && finalvalue < 100000) {
                                formatedvalues = this.value / 1000;
                                return formatedvalues + " K ";
                            } else if (finalvalue >= 100000 && finalvalue < 10000000) {
                                formatedvalues = this.value / 100000;
                                return formatedvalues + " L ";
                            } else if (finalvalue >= 10000000) {
                                formatedvalues = this.value / 10000000;
                                return formatedvalues + " Cr ";
                            } else if (finalvalue <= -1000 && finalvalue > -100000) {
                                formatedvalues = this.value / 1000;
                                return formatedvalues + " K ";
                            } else if (finalvalue <= -100000 && finalvalue > -10000000) {
                                formatedvalues = this.value / 100000;
                                return formatedvalues + " L ";
                            } else if (finalvalue <= -10000000) {
                                formatedvalues = this.value / 10000000;
                                return formatedvalues + " Cr ";
                            } else {
                                formatedvalues = this.value;
                                return formatedvalues;
                            }
                        },
                    },
                },
                legend: {
                    align: "right",
                    enabled: true,
                    verticalAlign: "top",
                    x: 0,
                    y: -15,
					
                    itemStyle: {
                        color: "#898989",
                        fontWeight: "bold",
                        fontFamily: "Poppins, sans-serif",
                    },
					// itemHoverStyle: {
							// color: "#ffffff"  // legend text turns white on hover
					// }, 
					itemHoverStyle: {
						color: isDarkMode ? "#ffffff" : "#000" // SAME AS itemStyle
					},
                },
                credits: {
                    enabled: false,
                },
                series: [{
                    name: label_names.Call_Price_OI_Chg,
                    color: "transparent",
                    borderColor: preferCallColor,
                    data: calldata_call_price_oi_change_data,
                    zIndex: 3,
                    pointPadding: 0.3,
                    pointPlacement: -0.2,
                    showInLegend: false
					
                }, {
                    name: label_names.Put_Price_OI_Chg,
                    color: "transparent",
                    borderColor: preferPutColor,
                    data: calldata_put_price_oi_change_data,
                    zIndex: 3,
                    pointPadding: 0.3,
                    pointPlacement: -0.2,
                    showInLegend: false
                }, {
                    name: label_names.Max_CE_OI_Chg,
                    color: "transparent",
                    borderColor: preferCallColor,
                    data: calldata_MaxoiChangeCall_data,
                    zIndex: 3,
                    pointPadding: 0.3,
                    pointPlacement: -0.2,
                    showInLegend: calldata.CallOiChgshowInLegend,
					visible:MaxCEOIChgStatsVisible
                }, {
                    name: label_names.Max_PE_OI_Chg,
                    color: "transparent",
                    borderColor: preferPutColor,
                    data: calldata_MaxoiChangePut_data,
                    zIndex: 3,
                    pointPadding: 0.3,
                    pointPlacement: 0.2,
                    showInLegend: calldata.PutOiChgshowInLegend,
					visible:MaxPEOIChgStatsVisible
                }, {
                    name: label_names.CE_OI_Chg,
                    color: preferCallColor,
                    borderColor: preferCallColor,
                    data: calldata_call_oi_change_data,
                    pointPadding: 0.3,
                    pointPlacement: -0.2,
                    zIndex: 3,
					visible:CEOIChgStatsVisible
                }, {
                    name: label_names.PE_OI_Chg,
                    color: preferPutColor,
                    borderColor: preferPutColor,
                    data: calldata_put_oi_change_data,
                    pointPadding: 0.3,
                    pointPlacement: 0.2,
                    zIndex: 3,
					visible:PEOIChgStatsVisible
                }, ],
            }, function(chart) {
                var series = chart.series;
                $.each(series, function(i, ser) {
                    if (ser.legendSymbol !== null && ser.legendSymbol !== "" && ser.legendSymbol !== undefined) {
                        if (ser.visible) {
                            if (this.name == label_names.Max_CE_OI_Chg)
                                $(ser.legendSymbol.element).attr("stroke", preferCallColor);
                            else if (ser.name == label_names.Max_PE_OI_Chg)
                                $(ser.legendSymbol.element).attr("stroke", preferPutColor);
                            else if (ser.name == label_names.CE_OI_Chg)
                                $(ser.legendSymbol.element).attr("stroke", preferCallColor);
                            else if (ser.name == label_names.Call_Price_OI_Chg)
                                $(ser.legendSymbol.element).attr("stroke", preferCallColor);
                            else if (ser.name == label_names.Put_Price_OI_Chg)
                                $(ser.legendSymbol.element).attr("stroke", preferPutColor);
                            else if (ser.name == label_names.PE_OI_Chg)
                                $(ser.legendSymbol.element).attr("stroke", preferPutColor);
                        }
                    }
                });
            });
        }
    }
    function showloadingall() {
        if (typeof oi_hc !== "undefined") {
            oi_hc.showLoading();
        }
        if (typeof oichg_hc !== "undefined") {
            oichg_hc.showLoading();
        }
    }
    function hideloadingall() {
        if (typeof oi_hc !== "undefined") {
            oi_hc.hideLoading();
        }
        if (typeof oichg_hc !== "undefined") {
            oichg_hc.hideLoading();
        }
    }
    function emptycharts() {
        if (typeof oi_hc !== "undefined") {
            oi_hc.destroy();
        }
        if (typeof oichg_hc !== "undefined") {
            oichg_hc.destroy();
        }
    }
    function format(data) {
        data = parseFloat(data);
        var finalvalue = data;
        if (finalvalue >= 1000 && finalvalue < 100000) {
            formatedvalues = data / 1000;
            return ("<span>" + formatedvalues.toFixed(2) + " K " + "&nbsp;" + "</span>");
        } else if (finalvalue >= 100000 && finalvalue < 10000000) {
            formatedvalues = data / 100000;
            return ("<span>" + formatedvalues.toFixed(2) + " L " + "&nbsp;" + "</span>");
        } else if (finalvalue >= 10000000) {
            formatedvalues = data / 10000000;
            return ("<span>" + formatedvalues.toFixed(2) + " Cr " + "&nbsp;" + "</span>");
        } else if (finalvalue <= -1000 && finalvalue > -100000) {
            formatedvalues = data / 1000;
            return ("<span>" + formatedvalues.toFixed(2) + " K " + "&nbsp;" + "</span>");
        } else if (finalvalue <= -100000 && finalvalue > -10000000) {
            formatedvalues = data / 100000;
            return ("<span>" + formatedvalues.toFixed(2) + " L " + "&nbsp;" + "</span>");
        } else if (finalvalue <= -10000000) {
            formatedvalues = data / 10000000;
            return ("<span >" + formatedvalues.toFixed(2) + " Cr " + "&nbsp;" + "</span>");
        } else {
            formatedvalues = data.toLocaleString("en-IN");
            return formatedvalues;
        }
    }
    var calldata;
    var putdata;
    var calloption;
    var putoption;
    var oioption;
    var oichangeoption;
    function getcallData(value) {
        var rdDataType = $("#rdDataType").val();
        //var optExpDate = $("#optExpDate").val();
		var optExpDate;
		if(rdDataType === 'hist'){
			optExpDate = $("#optExpDate_hist").val();
		}else{
			optExpDate = $("#optExpDate").val();
		}
        var optSymbol = $("#optSymbol").val();
        var HistDate = $("#txtDate").val();
        if (rdDataType == "hist") {
            var callsymbol = optSymbol + "-" + optExpDate;
        } else {
            var callsymbol = optSymbol + "-" + optExpDate;
        }
        var rtstrikeprice;
        var CallPriceArr_qty = [];
        var PutPriceArr_qty = [];
        var CallPriceChgArr_qty = [];
        var PutPriceChgArr_qty = [];
        var CallOIArr_qty = [];
        var PutOIArr_qty = [];
        var callMaxOIArr_qty = [];
        var putMaxOIArr_qty = [];
        var CallOIChangeArr_qty = [];
        var PutOIChangeArr_qty = [];
        var MaxoiChangeCallArr_qty = [];
        var MaxoiChangePutArr_qty = [];
        var keys = [];
        var LastTimestampArr = [];
        $.ajax({
            url: root_url + "getDataForOptionOIStatsBeta_commFunc_v2.php",
            type: "POST",
            cache: false,
            data: {
                rdDataType: rdDataType,
                optSymbol: optSymbol,
                optExpDate: optExpDate,
                txtDate: HistDate,
            },
            success: function(data) {
                result = JSON.parse(data);
                var buttontype = $("#buttontype").val();
                var btn_result_qty = "_Qty";
                var CallOIChange_qty = "CallOIChange" + btn_result_qty;
                var PutOIChange_qty = "PutOIChange" + btn_result_qty;
                var MaxoiChangeCall_qty = "MaxoiChangeCall" + btn_result_qty;
                var MaxoiChangePut_qty = "MaxoiChangePut" + btn_result_qty;
                var Calls_qty = "Calls" + btn_result_qty;
                var Puts_qty = "Puts" + btn_result_qty;
                var callMaxOI_qty = "callMaxOI" + btn_result_qty;
                var putMaxOI_qty = "putMaxOI" + btn_result_qty;
                if (result[0] !== null && result[0] !== "" && result[0] !== undefined) {
                    rtstrikeprice = result[2];
                    var latesttimestamp = result[5];
                    var colorPrefer = result[14];
                    var SymbType = result[8];
                    $("#LastTimeStamp").val(latesttimestamp);
                    $("#colorPrefer").val(colorPrefer);
                    for (var j = 0; j < result[0].length; j++) {
                        keys.push(result[0][j]);
                    }
                    if (keys !== null && keys !== "" && keys !== undefined) {
                        for (var j = 0; j < keys.length; j++) {
                            pdr = keys[j];
                            if (result[1][pdr] !== null && result[1][pdr] !== "" && result[1][pdr] !== undefined) {
                                CallPriceArr_qty.push(result[1][pdr]["Calls_Price"]);
                            }
                            if (result[1][pdr] !== null && result[1][pdr] !== "" && result[1][pdr] !== undefined) {
                                PutPriceArr_qty.push(result[1][pdr]["Puts_Price"]);
                            }
                            if (result[1][pdr] !== null && result[1][pdr] !== "" && result[1][pdr] !== undefined) {
                                CallPriceChgArr_qty.push(result[1][pdr]["Calls_Price_Chg"]);
                            }
                            if (result[1][pdr] !== null && result[1][pdr] !== "" && result[1][pdr] !== undefined) {
                                PutPriceChgArr_qty.push(result[1][pdr]["Puts_Price_Chg"]);
                            }
                            if (result[1][pdr] !== null && result[1][pdr] !== "" && result[1][pdr] !== undefined) {
                                CallOIArr_qty.push(result[1][pdr][Calls_qty]);
                            }
                            if (result[1][pdr] !== null && result[1][pdr] !== "" && result[1][pdr] !== undefined) {
                                PutOIArr_qty.push(result[1][pdr][Puts_qty]);
                            }
                            if (result[1][pdr] !== null && result[1][pdr] !== "" && result[1][pdr] !== undefined) {
                                CallOIChangeArr_qty.push(result[1][pdr][CallOIChange_qty]);
                            }
                            if (result[1][pdr] !== null && result[1][pdr] !== "" && result[1][pdr] !== undefined) {
                                PutOIChangeArr_qty.push(result[1][pdr][PutOIChange_qty]);
                            }
                            if (result[1][pdr] !== null && result[1][pdr] !== "" && result[1][pdr] !== undefined) {
                                LastTimestampArr.push(result[1][pdr]["maxtimestamp"]);
                            }
                            if (result[1][pdr] !== null && result[1][pdr] !== "" && result[1][pdr] !== undefined) {
                                callMaxOIArr_qty.push(result[1][pdr][callMaxOI_qty]);
                            }
                            if (result[1][pdr] !== null && result[1][pdr] !== "" && result[1][pdr] !== undefined) {
                                putMaxOIArr_qty.push(result[1][pdr][putMaxOI_qty]);
                            }
                            if (result[1][pdr] !== null && result[1][pdr] !== "" && result[1][pdr] !== undefined) {
                                MaxoiChangeCallArr_qty.push(result[1][pdr][MaxoiChangeCall_qty]);
                            }
                            if (result[1][pdr] !== null && result[1][pdr] !== "" && result[1][pdr] !== undefined) {
                                MaxoiChangePutArr_qty.push(result[1][pdr][MaxoiChangePut_qty]);
                            }
                        }
                    }
                }
                callobj = {
                    colorPrefer_data: colorPrefer ? colorPrefer : 0,
                    call_p_date_data: keys ? keys : 0,
                    allstrikes: keys ? keys : 0,
                    lasttimestampdata: LastTimestampArr ? LastTimestampArr : 0,
                    CallPrice_data: CallPriceArr_qty ? CallPriceArr_qty : 0,
                    PutPrice_data: PutPriceArr_qty ? PutPriceArr_qty : 0,
                    CallPriceChg_data: CallPriceChgArr_qty ? CallPriceChgArr_qty : 0,
                    PutPriceChg_data: PutPriceChgArr_qty ? PutPriceChgArr_qty : 0,
                    call_oi_data_qty: CallOIArr_qty ? CallOIArr_qty : 0,
                    put_oi_data_qty: PutOIArr_qty ? PutOIArr_qty : 0,
                    callMaxOI_data_qty: callMaxOIArr_qty ? callMaxOIArr_qty : 0,
                    putMaxOI_data_qty: putMaxOIArr_qty ? putMaxOIArr_qty : 0,
                    call_oi_change_data_qty: CallOIChangeArr_qty ? CallOIChangeArr_qty : 0,
                    put_oi_change_data_qty: PutOIChangeArr_qty ? PutOIChangeArr_qty : 0,
                    MaxoiChangeCall_data_qty: MaxoiChangeCallArr_qty ? MaxoiChangeCallArr_qty : 0,
                    MaxoiChangePut_data_qty: MaxoiChangePutArr_qty ? MaxoiChangePutArr_qty : 0,
                    callsymbol: callsymbol,
                    rtstrikeprice: rtstrikeprice,
                };
                getHighchart(callobj, value);
            },
        });
    }
    function format_data_api(data, decimals) {
        data = parseFloat(data);
        return data.toLocaleString("en-IN", {
            minimumFractionDigits: decimals,
        });
    }
    /* function set_legends_visible(PriceLineVisible, VWAPLineVisible, OILineVisible, VolumeLineVisible, IVLineVisible, PCRLineVisible) {
        var userName = $("#userName").val();
        var pageName = $("#pageName").val();
        // var user_pref = JSON.stringify({
            // PriceLineVisible: PriceLineVisible,
            // VWAPLineVisible: VWAPLineVisible,
            // OILineVisible: OILineVisible,
            // VolumeLineVisible: VolumeLineVisible,
            // IVLineVisible: IVLineVisible,
            // PCRLineVisible: PCRLineVisible
        // });
		var user_pref = JSON.stringify({
            symbol:$("#optSymbol").val(),
			legendsVisibility: {
				PriceLineVisible: PriceLineVisible,
				VWAPLineVisible: VWAPLineVisible,
				OILineVisible: OILineVisible,
				VolumeLineVisible: VolumeLineVisible,
				IVLineVisible: IVLineVisible, 
				PCRLineVisible: PCRLineVisible
			}
        });
        $.ajax({
            type: "POST",
            url: "/opt/api/dashboard/php/setSymbolDashboardInputs.php",
            data: {
                un: userName,
                pageName: pageName,
                user_setting: user_pref,
            },
            success: function(response) {},
            error: function(xhr, status, error) {
                console.error("Error saving parameters:", error);
            }
        });
    } */
	function set_legends_visible(
    PriceLineVisible, VWAPLineVisible, OILineVisible,
    VolumeLineVisible, IVLineVisible, PCRLineVisible,
    CEOIStatsVisible, PEOIStatsVisible,
    CEOIChgStatsVisible, PEOIChgStatsVisible,
    MaxCEOIStatsVisible, MaxPEOIStatsVisible,
    MaxCEOIChgStatsVisible, MaxPEOIChgStatsVisible
) {
    var userName = $("#userName").val();
    var pageName = $("#pageName").val();

    var user_pref = JSON.stringify({
        symbol: $("#optSymbol").val(),
        legendsVisibility: {
            // main chart
            PriceLineVisible,
            VWAPLineVisible,
            OILineVisible,
            VolumeLineVisible,
            IVLineVisible,
            PCRLineVisible,

            // OI stats
            CEOIStatsVisible,
            PEOIStatsVisible,
            CEOIChgStatsVisible,
            PEOIChgStatsVisible,

            // Max OI stats
            MaxCEOIStatsVisible,
            MaxPEOIStatsVisible,
            MaxCEOIChgStatsVisible,
            MaxPEOIChgStatsVisible
        }
    });

    $.ajax({
        type: "POST",
        url: "/opt/api/dashboard/php/setSymbolDashboardInputs.php",
        data: {
            un: userName,
            pageName: pageName,
            user_setting: user_pref
        }
    });
}

    // function get_legends_visible() {
        // var userName = $("#userName").val();
        // var pageName = $("#pageName").val();
        // $.ajax({
            // type: "POST",
            // url: "/opt/api/dashboard/php/getSymbolDashboardInputs.php",
            // data: {
                // un: userName,
                // pageName: pageName,
            // },
            // success: function(response) {
                // var legendVisibilityData = JSON.parse(response);
				
                // PriceLineVisible = legendVisibilityData.PriceLineVisible;
                // VWAPLineVisible = legendVisibilityData.VWAPLineVisible;
                // OILineVisible = legendVisibilityData.OILineVisible;
                // VolumeLineVisible = legendVisibilityData.VolumeLineVisible;
                // IVLineVisible = legendVisibilityData.IVLineVisible;
                // PCRLineVisible = legendVisibilityData.PCRLineVisible; 
            // },
            // error: function(xhr, status, error) {
                // console.error("Error saving parameters:", error);
            // }
        // });
    // }
    function SymbolFutureChart(return_val) {
        var userName = $("#userName").val();
        var pageName = $("#pageName").val();
        var data = "";
        var rdDataType = $("#rdDataType").val();
        var optSymbol = $("#optSymbol").val();
        //var optExpDate = $("#optExpDate").val();
		
		var optExpDate;
		if(rdDataType === 'hist'){
			optExpDate = $("#optExpDate_hist").val();
		}else{
			optExpDate = $("#optExpDate").val();
		}
        var txtDate = $("#txtDate").val();
        $.ajax({
            type: "POST",
            url: root_url + "getFutureChartApi_SD.php",
            data: {
                optSymbol: optSymbol,
                optExpDate: optExpDate,
                rdDataType: rdDataType,
                txtDate: txtDate,
            },
            success: function(data) {
                var SymbolArr = data.FutureChartArr;
                if (SymbolArr !== null) {
                    if (Object.keys(SymbolArr).length === 0) {
                        Chart_Arr.series[0].setData([], true, true, false);
                        Chart_Arr.series[1].setData([], true, true, false);
                        Chart_Arr.series[2].setData([], true, true, false);
                        Chart_Arr.series[3].setData([], true, true, false);
                        Chart_Arr.series[4].setData([], true, true, false);
                        Chart_Arr.series[5].setData([], true, true, false);
                    } else {
                        Object.keys(SymbolArr).forEach(function(key) {
                            var PriceArr = SymbolArr[key]["Price"].filter(point => point !== null);
                            var OIArr = SymbolArr[key]["OI"].filter(point => point !== null);
                            var VolArr = SymbolArr[key]["Volume"].filter(point => point !== null);
                            var ivArr = SymbolArr[key]["iv"].filter(point => point !== null);
                            var pcrArr = SymbolArr[key]["pcr"].filter(point => point !== null);
                            // if (optSymbol !== 'SENSEX' && optSymbol !== 'BANKEX') {
                                // var VWAPArr = SymbolArr[key]["VWAP"];
                            // } 
							var VWAPArr = SymbolArr[key]["VWAP"];


                            var chartname = Futchart;
                            var VwapshowInLegend;
                            if (return_val == 0) {
                                Chart_Arr = [];
                                // if (optSymbol !== 'SENSEX' && optSymbol !== 'BANKEX') {
                                    VwapshowInLegend = true;
                                    getHighChartsData(chartname, PriceArr, OIArr, VolArr, ivArr, pcrArr, VWAPArr, VwapshowInLegend);
                                // } else {
                                    // VwapshowInLegend = false;
                                    // getHighChartsData(chartname, PriceArr, OIArr, VolArr, ivArr, pcrArr, VWAPArr, VwapshowInLegend);
                                // }
                            } else {
                                // if (optSymbol !== 'SENSEX' && optSymbol !== 'BANKEX') {
                                    Chart_Arr.series[0].setData(PriceArr, true, true, false);
                                    PriceVisible = Chart_Arr.series[0].visible;
                                    Chart_Arr.series[1].setData(VWAPArr, true, true, false);
                                    VWAPVisible = Chart_Arr.series[1].visible;
                                    Chart_Arr.series[2].setData(OIArr, true, true, false);
                                    OIVisible = Chart_Arr.series[2].visible;
                                    Chart_Arr.series[3].setData(VolArr, true, true, false);
                                    VolumeVisible = Chart_Arr.series[3].visible;
                                    Chart_Arr.series[4].setData(ivArr, true, true, false);
                                    IVVisible = Chart_Arr.series[4].visible;
                                    Chart_Arr.series[5].setData(pcrArr, true, true, false);
                                    PCRVisible = Chart_Arr.series[5].visible;
                                // } else {
                                    // Chart_Arr.series[0].setData(PriceArr, true, true, false);
                                    // PriceVisible = Chart_Arr.series[0].visible;
                                    // Chart_Arr.series[1].setData(VWAPArr, true, true, false);
                                    // VWAPVisible = Chart_Arr.series[1].visible;
                                    // Chart_Arr.series[2].setData(OIArr, true, true, false);
                                    // OIVisible = Chart_Arr.series[2].visible;
                                    // Chart_Arr.series[3].setData(VolArr, true, true, false);
                                    // VolumeVisible = Chart_Arr.series[3].visible;
                                    // Chart_Arr.series[4].setData(ivArr, true, true, false);
                                    // IVVisible = Chart_Arr.series[4].visible;
                                    // Chart_Arr.series[5].setData(pcrArr, true, true, false);
                                    // PCRVisible = Chart_Arr.series[5].visible;
                                // }
                            }
                        });
                    }
                } else {
                    Chart_Arr = [];
                }
            },
        });
    }
    Highcharts.setOptions({
        global: {
            timezone: "Asia/Kolkata",
        },
        lang: {
            noData: "No Data Available",
            thousandsSep: "",
        },
    });
    var Chart_Arr = [];
	

    // /* function getHighChartsData(id, PriceArr, OIArr, VolArr, ivArr, pcrArr, VWAPArr, VwapshowInLegend) {
		
		// Check if all VWAP values are 0
		// const isPriceArrAllZero = PriceArr.every(([_, value]) => value === 0);
		// const isOIArrAllZero = OIArr.every(([_, value]) => value === 0);
		// const isVolArrAllZero = VolArr.every(([_, value]) => value === 0);
		// const isIvArrAllZero = ivArr.every(([_, value]) => value === 0);
		// const isPcrArrAllZero = pcrArr.every(([_, value]) => value === 0);
		// const isVWAPAllZero = VWAPArr.every(([_, value]) => value === 0);
		
		
		

       // /*  var PriceLineVisible = true;
        // var VWAPLineVisible = true;
        // var OILineVisible = true;
        // var VolumeLineVisible; 
        // var IVLineVisible = true;
        // var PCRLineVisible = true; */
        // get_legends_visible();
        // var userName = $("#userName").val();
        // var pageName = $("#pageName").val();
        // $.ajax({
            // type: "POST",
            // url: "/opt/api/dashboard/php/getSymbolDashboardInputs.php",
            // data: {
                // un: userName,
                // pageName: pageName,
            // },
            // success: function(response) {
                // if (response != '') 
				// { 
                    // /* var legendVisibilityData = JSON.parse(response).legendsVisibility;
					// PriceLineVisible = legendVisibilityData?.PriceLineVisible ?? true;
					// VWAPLineVisible = legendVisibilityData?.VWAPLineVisible ?? true;
					// OILineVisible = legendVisibilityData?.OILineVisible ?? true;
					// VolumeLineVisible = legendVisibilityData?.VolumeLineVisible ?? true;
					// IVLineVisible = legendVisibilityData?.IVLineVisible ?? true;
					// PCRLineVisible = legendVisibilityData?.PCRLineVisible ?? true; */
					// var legendVisibilityData = JSON.parse(response).legendsVisibility || {};
					// PriceLineVisible  = legendVisibilityData.PriceLineVisible ?? true;
					// VWAPLineVisible   = legendVisibilityData.VWAPLineVisible ?? true;
					// OILineVisible     = legendVisibilityData.OILineVisible ?? true;
					// VolumeLineVisible = legendVisibilityData.VolumeLineVisible ?? true;
					// IVLineVisible     = legendVisibilityData.IVLineVisible ?? true;
					// PCRLineVisible    = legendVisibilityData.PCRLineVisible ?? true;
					// OI stats
					// CEOIStatsVisible      = legendVisibilityData.CEOIStatsVisible ?? true;
					// PEOIStatsVisible      = legendVisibilityData.PEOIStatsVisible ?? true;
					// CEOIChgStatsVisible   = legendVisibilityData.CEOIChgStatsVisible ?? true;
					// PEOIChgStatsVisible   = legendVisibilityData.PEOIChgStatsVisible ?? true;
					// Max OI stats
					// MaxCEOIStatsVisible    = legendVisibilityData.MaxCEOIStatsVisible ?? true;
					// MaxPEOIStatsVisible    = legendVisibilityData.MaxPEOIStatsVisible ?? true;
					// MaxCEOIChgStatsVisible = legendVisibilityData.MaxCEOIChgStatsVisible ?? true;
					// MaxPEOIChgStatsVisible = legendVisibilityData.MaxPEOIChgStatsVisible ?? true;
					// console.log(MaxCEOIStatsVisible);

                // }
                // Highcharts.setOptions({
                    // global: {
                        // timezone: "Asia/Kolkata",
                        // useUTC: true
                    // },
                    // lang: {
                        // thousandsSep: ' ,',
                        // decimalPoint: '.'
                    // }
                // });
                // Chart_Arr = Highcharts.stockChart("Futchart", {
                    // chart: {
                        // zoomType: "xy",
                        // backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
                        // height: window.screen.height - 480,
                    // },
                    // rangeSelector: {
                        // selected: 1,
                        // enabled: false,
                    // },
                    // navigator: {
                        // series: {
                            // color: "#1a1a1a",
                            // lineWidth: 0,
                        // },
                        // enabled: true,
                        // yAxis: {
                            // visible: true,
                        // },
                        // xAxis: {
                            // visible: false,
                        // },
                        // height: 5,
                    // },
                    // scrollbar: {
                        // enabled: false,
                    // },
                    // tooltip: {
                        // split: true,
                        // padding: 3,
                    // },
                    // credits: {
                        // enabled: false,
                    // },
                    // legend: {
                        // margin: 1, 
                        // padding: 5,
                        // align: "center",
                        // enabled: true,
                        // verticalAlign: "top",
                        // itemStyle: {
                            // color: isDarkMode ? "#f6f8fa" : "#000",
                            // fontWeight: "bold",
                            // fontFamily: "Poppins, sans-serif",
                        // },
						// itemHoverStyle: {
							// color: "#ffffff"  // legend text turns white on hover
						// },
                        // x: 0,
                        // y: 0,
                    // },
                    // xAxis: {
                        // type: "datetime",
                        // crosshair: {
                            // color: "#898989",
                        // },
                        // lineColor: isDarkMode ? "#434348" : "#f0f0f0",
                        // labels: {
                            // style: {
                                // color: isDarkMode ? "#f6f8fa" : "#000",
                                // fontWeight: "bold",
                                // fontFamily: "Poppins, sans-serif",
                            // },
                        // },
                    // },
                    // plotOptions: {
                        // series: {
                            // connectNulls: true,
                            // marker: {
                                // enabled: false,
                            // },
                            // events: {
                                // legendItemClick: function(event) {
                                    // const legendName = this.name;
									// Prevent legend click if all values are zero
									// if ((legendName === 'Price' && isPriceArrAllZero) ||(legendName === 'VWAP' && isVWAPAllZero) ||(legendName === 'OI' && isOIArrAllZero) ||(legendName === 'Volume' && isVolArrAllZero) ||(legendName === 'IV' && isIvArrAllZero) ||(legendName === 'PCR' && isPcrArrAllZero))
									// {
										// return false; // Prevents toggling visibility
									// }
                                    // const visibility = !event.target.visible;
                                    // this.chart.series.forEach(function(series) {
                                        // if (series.name != legendName) {
											
                                            // if (series.name == 'Price') {
                                                // PriceLineVisible = series.visible;
                                            // }
                                            // if (series.name == 'VWAP') {
                                                // VWAPLineVisible = series.visible;
                                            // }
                                            // if (series.name == 'OI') {
                                                // OILineVisible = series.visible;
                                            // }
                                            // if (series.name == 'Volume') {
                                                // VolumeLineVisible = series.visible;
                                            // }
                                            // if (series.name == 'IV') {
                                                // IVLineVisible = series.visible;
                                            // }
                                            // if (series.name == 'PCR') {
                                                // PCRLineVisible = series.visible;
                                            // }
                                        // } else {
                                            // if (legendName == 'Price') {
                                                // PriceLineVisible = visibility;
                                            // }
                                            // if (legendName == 'VWAP') {
                                                // VWAPLineVisible = visibility;
                                            // }
                                            // if (legendName == 'OI') {
                                                // OILineVisible = visibility;
                                            // }
                                            // if (legendName == 'Volume') {
                                                // VolumeLineVisible = visibility;
                                            // }
                                            // if (legendName == 'IV') {
                                                // IVLineVisible = visibility;
                                            // }
                                            // if (legendName == 'PCR') {
                                                // PCRLineVisible = visibility;
                                            // }
                                        // }
                                    // });
                                    // set_legends_visible(PriceLineVisible, VWAPLineVisible, OILineVisible, VolumeLineVisible, IVLineVisible, PCRLineVisible)
                                // },
                            // },
                        // },
                    // },
                    // yAxis: [{
                        // offset: 5,
                        // plotLines: [{
                            // dashStyle: "Dot",
                            // width: 2,
                            // value: 0,
                        // }, ],
                        // min: null,
                        // max: null,
                        // opposite: false,
                        // startOnTick: false,
                        // endOnTick: false,
                        // tickAmount: 5,
                        // title: {
                            // text: "Price",
                            // style: {
                                // color: isDarkMode ? "#f6f8fa" : "#000",
                                // fontWeight: "bold",
                                // fontFamily: "Poppins, sans-serif",
                            // },
                        // },
                        // gridLineColor: "rgba(204,204,204,0.3)",
                        // gridLineWidth: 1,
                        // lineWidth: 0,
                        // resize: {
                            // enabled: true,
                            // lineWidth: 2
                        // },
                        // labels: {
                            // style: {
                                // color: isDarkMode ? "#f6f8fa" : "#000",
                                // fontWeight: "bold",
                                // fontFamily: "Poppins, sans-serif",
                            // },
                        // },
                    // }, {
                        // offset: 5,
                        // plotLines: [{
                            // dashStyle: "Dot",
                            // width: 2,
                            // value: 0,
                        // }, ],
                        // min: null,
                        // max: null,
                        // opposite: false,
                        // startOnTick: false,
                        // endOnTick: false,
                        // tickAmount: 3,
                        // gridLineColor: "rgba(204,204,204,0.3)",
                        // gridLineWidth: 1,
                        // lineWidth: 0,
                        // resize: {
                            // enabled: true,
                            // lineWidth: 2,
                        // },
                    // }, {
                        // plotLines: [{
                            // dashStyle: "Dot",
                            // width: 2,
                            // value: 0,
                        // }, ],
                        // offset: 5,
                        // crosshair: {
                            // dashStyle: "longdash",
                            // color: "#898989",
                        // },
                        // gridLineColor: "rgba(204,204,204,0.3)",
                        // lineWidth: 0,
                        // min: null,
                        // max: null,
                        // startOnTick: false,
                        // endOnTick: false,
                        // labels: {
                            // x: 2,
                            // y: 0,
                            // style: {
                                // color: isDarkMode ? "#f6f8fa" : "#000",
                                // fontWeight: "bold",
                                // fontFamily: "Poppins, sans-serif",
                            // },
                            // align: "left",
                        // },
                        // gridLineWidth: 0,
                    // }, {
                        // plotLines: [{
                            // dashStyle: "Dot",
                            // color: "#898989",
                            // width: 2,
                            // value: 0,
                        // }, ],
                        // visible: false,
                        // min: null,
                        // max: null,
                        // startOnTick: false,
                        // endOnTick: false,
                        // gridLineWidth: 1,
                        // top: "73%",
                        // height: "27%",
                    // }, {
                        // visible: false,
                        // min: null,
                        // max: null,
                        // startOnTick: false,
                        // endOnTick: false,
                        // gridLineWidth: 1,
                    // }, {
                        // visible: false,
                        // min: null,
                        // max: null,
                        // startOnTick: false,
                        // endOnTick: false,
                        // gridLineWidth: 1,
                        // height: "70%",
                        // top: "01%",
                    // }, {
                        // visible: false,
                        // min: null,
                        // max: null,
                        // startOnTick: false,
                        // endOnTick: false,
                        // gridLineWidth: 1,
                    // }, {
                        // offset: 5,
                        // min: null,
                        // max: null,
                        // startOnTick: false,
                        // endOnTick: false,
                        // tickAmount: 4,
                        // visible: false,
                        // gridLineColor: "rgba(204,204,204,0.3)",
                        // gridLineWidth: 1,
                        // lineWidth: 2,
                        // resize: {
                            // enabled: true,
                            // lineWidth: 2,
                        // },
                    // }, ],
                    // series: [{
                        // type: "line",
                        // name: "Price",
                        // lineWidth: 1,
                        // color: isDarkMode ? "white" : "black",
                        // data: PriceArr,
						
                        // tooltip: {
                            // valueDecimals: 2,
                        // },
                        // dataGrouping: {
                            // enabled: false,
                            // forced: true,
                            // units: [["minute", 1]],
                        // },
						// visible: isPriceArrAllZero ? false :PriceLineVisible,
                        // opacity: 2,
                        // connectNulls: true,
                    // }, {
                        // name: "VWAP",
                        // data: VWAPArr,
                        // color: "#6600FF",
                        // lineWidth: 1,
						// visible: isVWAPAllZero ? false :VWAPLineVisible,
                        // tooltip: {
                            // valueDecimals: 0,
                        // },
                        // dataGrouping: {
                            // enabled: false,
                            // forced: true,
                            // units: [["minute", 1]],
                        // },
                    // }, {
                        // type: "line",
                        // name: "OI",
                        // color: "red",
                        // lineWidth: 1,
                        // yAxis: 2,
                        // data: OIArr,
                        // tooltip: {
                            // valueDecimals: 0,
                        // },
                        // dataGrouping: {
                            // enabled: false,
                            // forced: true,
                            // units: [["minute", 1]],
                        // },
                        // visible: OILineVisible,
						// visible: isOIArrAllZero ? false :OILineVisible,
                        // opacity: 2,
                        // connectNulls: true,
                    // }, {
                        // type: "column",
                        // name: "Volume",
                        // data: VolArr,
                        // color: "blue",
                        // yAxis: 3,
                        // lineWidth: 1,
                        // visible: VolumeLineVisible,
						// visible: isVolArrAllZero ? false :VolumeLineVisible,
                        // opacity: 0.6,
                        // dataGrouping: {
                            // enabled: false,
                            // forced: true,
                            // units: [["minute", 1]],
                        // },
                    // }, {
                        // type: "line",
                        // name: "IV",
                        // color: "#FBBC05",
                        // lineWidth: 1,
                        // data: ivArr,
                        // yAxis: 4,
                        // visible: IVLineVisible,
						// visible: isIvArrAllZero ? false :IVLineVisible,
                        // tooltip: {
                            // valueDecimals: 2,
                        // },
                        // dataGrouping: {
                            // enabled: false,
                            // forced: true,
                            // units: [["minute", 1]],
                        // },
                    // }, {
                        // name: "PCR",
                        // data: pcrArr,
                        // color: "#219EFF",
                        // yAxis: 6,
                        // lineWidth: 1,
                        // visible: PCRLineVisible,
						// visible: isPcrArrAllZero ? false :PCRLineVisible,
                        // tooltip: {
                            // valueDecimals: 2,
                        // },
                        // dataGrouping: {
                            // enabled: false,
                            // forced: true,
                            // units: [["minute", 1]],
                        // },
                        // step: true,
                    // }, ].filter(series => series !== null),
                // });
            // },
            // error: function(xhr, status, error) {
                // console.error("Error saving parameters:", error);
            // }
        // });
    // } */
	function get_legends_visible() {
    $.ajax({
        type: "POST",
        url: "/opt/api/dashboard/php/getSymbolDashboardInputs.php",
        data: {
            un: $("#userName").val(),
            pageName: $("#pageName").val()
        },
        success: function (response) {
            if (response) {
                const data = JSON.parse(response);
				
                LegendsVisibility = data.legendsVisibility
				var legendVisibilityData = JSON.parse(response).legendsVisibility || {};
				PriceLineVisible  = legendVisibilityData.PriceLineVisible ?? true;
				VWAPLineVisible   = legendVisibilityData.VWAPLineVisible ?? true;
				OILineVisible     = legendVisibilityData.OILineVisible ?? true;
				VolumeLineVisible = legendVisibilityData.VolumeLineVisible ?? true;
				IVLineVisible     = legendVisibilityData.IVLineVisible ?? true;
				PCRLineVisible    = legendVisibilityData.PCRLineVisible ?? true;
				//OI stats
				CEOIStatsVisible      = legendVisibilityData.CEOIStatsVisible ?? true;
				PEOIStatsVisible      = legendVisibilityData.PEOIStatsVisible ?? true;
				CEOIChgStatsVisible   = legendVisibilityData.CEOIChgStatsVisible ?? true;
				PEOIChgStatsVisible   = legendVisibilityData.PEOIChgStatsVisible ?? true;
				//Max OI stats
				MaxCEOIStatsVisible    = legendVisibilityData.MaxCEOIStatsVisible ?? true;
				MaxPEOIStatsVisible    = legendVisibilityData.MaxPEOIStatsVisible ?? true;
				MaxCEOIChgStatsVisible = legendVisibilityData.MaxCEOIChgStatsVisible ?? true;
				MaxPEOIChgStatsVisible = legendVisibilityData.MaxPEOIChgStatsVisible ?? true; 
            }

            if (typeof callback === "function") {
                callback();
            }
        }
    });
}

	function getHighChartsData(id, PriceArr, OIArr, VolArr, ivArr, pcrArr, VWAPArr, VwapshowInLegend) {
		// Check if all VWAP values are 0
		const isPriceArrAllZero = PriceArr.every(([_, value]) => value === 0);
		const isOIArrAllZero = OIArr.every(([_, value]) => value === 0);
		const isVolArrAllZero = VolArr.every(([_, value]) => value === 0);
		const isIvArrAllZero = ivArr.every(([_, value]) => value === 0);
		const isPcrArrAllZero = pcrArr.every(([_, value]) => value === 0);
		const isVWAPAllZero = VWAPArr.every(([_, value]) => value === 0);
        var userName = $("#userName").val();
        var pageName = $("#pageName").val();
       Highcharts.setOptions({
           global: {
               timezone: "Asia/Kolkata",
               useUTC: true
           },
           lang: {
               thousandsSep: ' ,',
               decimalPoint: '.'
                    }
        });
        Chart_Arr = Highcharts.stockChart("Futchart", {
            chart: {
                zoomType: "xy",
                backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
                height: window.screen.height - 480,
            },
            rangeSelector: {
                selected: 1,
                enabled: false,
            },
            navigator: {
                series: {
                    color: "#1a1a1a",
                    lineWidth: 0,
                },
                enabled: true,
                yAxis: {
                    visible: true,
                },
                xAxis: {
                    visible: false,
                },
                height: 5,
            },
            scrollbar: {
                enabled: false,
            },
            tooltip: {
                split: true,
                padding: 3,
            },
            credits: {
                enabled: false,
            },
            legend: {
                margin: 1, 
                padding: 5,
                align: "center",
                enabled: true,
                verticalAlign: "top",
                itemStyle: {
                    color: isDarkMode ? "#f6f8fa" : "#000",
                    fontWeight: "bold", 
                    fontFamily: "Poppins, sans-serif",
                },
				/* itemHoverStyle: {
					color: "#ffffff"  // legend text turns white on hover
				}, */
				itemHoverStyle: {
						color: isDarkMode ? "#ffffff" : "#000" // SAME AS itemStyle
					},
                x: 0,
                y: 0,
            },
            xAxis: {
                type: "datetime",
                crosshair: {
                    color: "#898989",
                },
                lineColor: isDarkMode ? "#434348" : "#f0f0f0",
                labels: {
                    style: {
                        color: isDarkMode ? "#f6f8fa" : "#000",
                        fontWeight: "bold",
                        fontFamily: "Poppins, sans-serif",
                    },
                },
            },
            plotOptions: {
                series: {
                    connectNulls: true,
                    marker: {
                        enabled: false,
                    },
                    events: {
                        legendItemClick: function(event) {
                            const legendName = this.name;
							// Prevent legend click if all values are zero
							if ((legendName === 'Price' && isPriceArrAllZero) ||(legendName === 'VWAP' && isVWAPAllZero) ||(legendName === 'OI' && isOIArrAllZero) ||(legendName === 'Volume' && isVolArrAllZero) ||(legendName === 'IV' && isIvArrAllZero) ||(legendName === 'PCR' && isPcrArrAllZero))
							{
								return false; // Prevents toggling visibility
							}
                            const visibility = !event.target.visible;
                            this.chart.series.forEach(function(series) {
                                if (series.name != legendName) {
									
                                    if (series.name == 'Price') {
                                        PriceLineVisible = series.visible;
                                    }
                                    if (series.name == 'VWAP') {
                                        VWAPLineVisible = series.visible;
                                    }
                                    if (series.name == 'OI') {
                                        OILineVisible = series.visible;
                                    }
                                    if (series.name == 'Volume') {
                                        VolumeLineVisible = series.visible;
                                    }
                                    if (series.name == 'IV') {
                                        IVLineVisible = series.visible;
                                    }
                                    if (series.name == 'PCR') {
                                        PCRLineVisible = series.visible;
                                    }
                                } else {
                                    if (legendName == 'Price') {
                                        PriceLineVisible = visibility;
                                    }
                                    if (legendName == 'VWAP') {
                                        VWAPLineVisible = visibility;
                                    }
                                    if (legendName == 'OI') {
                                        OILineVisible = visibility;
                                    }
                                    if (legendName == 'Volume') {
                                        VolumeLineVisible = visibility;
                                    }
                                    if (legendName == 'IV') {
                                        IVLineVisible = visibility;
                                    }
                                    if (legendName == 'PCR') {
                                        PCRLineVisible = visibility;
                                    }
                                }
                            });
                            set_legends_visible(PriceLineVisible, VWAPLineVisible, OILineVisible, VolumeLineVisible, IVLineVisible, PCRLineVisible)
                        },
                    },
                },
            },
            yAxis: [{
                offset: 5,
                plotLines: [{
                    dashStyle: "Dot",
                    width: 2,
                    value: 0,
                }, ],
                min: null,
                max: null,
                opposite: false,
                startOnTick: false,
                endOnTick: false,
                tickAmount: 5,
                title: {
                    text: "Price",
                    style: {
                        color: isDarkMode ? "#f6f8fa" : "#000",
                        fontWeight: "bold",
                        fontFamily: "Poppins, sans-serif",
                    },
                },
                gridLineColor: "rgba(204,204,204,0.3)",
                gridLineWidth: 1,
                lineWidth: 0,
                resize: {
                    enabled: true,
                    lineWidth: 2
                },
                labels: {
                    style: {
                        color: isDarkMode ? "#f6f8fa" : "#000",
                        fontWeight: "bold",
                        fontFamily: "Poppins, sans-serif",
                    },
                },
            }, {
                offset: 5,
                plotLines: [{
                    dashStyle: "Dot",
                    width: 2,
                    value: 0,
                }, ],
                min: null,
                max: null,
                opposite: false,
                startOnTick: false,
                endOnTick: false,
                tickAmount: 3,
                gridLineColor: "rgba(204,204,204,0.3)",
                gridLineWidth: 1,
                lineWidth: 0,
                resize: {
                    enabled: true,
                    lineWidth: 2,
                },
            }, {
                plotLines: [{
                    dashStyle: "Dot",
                    width: 2,
                    value: 0,
                }, ],
                offset: 5,
                crosshair: {
                    dashStyle: "longdash",
                    color: "#898989",
                },
                gridLineColor: "rgba(204,204,204,0.3)",
                lineWidth: 0,
                min: null,
                max: null,
                startOnTick: false,
                endOnTick: false,
                labels: {
                    x: 2,
                    y: 0,
                    style: {
                        color: isDarkMode ? "#f6f8fa" : "#000",
                        fontWeight: "bold",
                        fontFamily: "Poppins, sans-serif",
                    },
                    align: "left",
                },
                gridLineWidth: 0,
            }, {
                plotLines: [{
                    dashStyle: "Dot",
                    color: "#898989",
                    width: 2,
                    value: 0,
                }, ],
                visible: false,
                min: null,
                max: null,
                startOnTick: false,
                endOnTick: false,
                gridLineWidth: 1,
                top: "73%",
                height: "27%",
            }, {
                visible: false,
                min: null,
                max: null,
                startOnTick: false,
                endOnTick: false,
                gridLineWidth: 1,
            }, {
                visible: false,
                min: null,
                max: null,
                startOnTick: false,
                endOnTick: false,
                gridLineWidth: 1,
                height: "70%",
                top: "01%",
            }, {
                visible: false,
                min: null,
                max: null,
                startOnTick: false,
                endOnTick: false,
                gridLineWidth: 1,
            }, {
                offset: 5,
                min: null,
                max: null,
                startOnTick: false,
                endOnTick: false,
                tickAmount: 4,
                visible: false,
                gridLineColor: "rgba(204,204,204,0.3)",
                gridLineWidth: 1,
                lineWidth: 2,
                resize: {
                    enabled: true,
                    lineWidth: 2,
                },
            }, ],
            series: [{
                type: "line",
                name: "Price",
                lineWidth: 1,
                color: isDarkMode ? "white" : "black",
                data: PriceArr,
				
                tooltip: {
                    valueDecimals: 2,
                },
                dataGrouping: {
                    enabled: false,
                    forced: true,
                    units: [["minute", 1]],
                },
				visible: isPriceArrAllZero ? false :PriceLineVisible,
                opacity: 2,
                connectNulls: true,
            }, {
                name: "VWAP",
                data: VWAPArr,
                color: "#6600FF",
                lineWidth: 1,
				visible: isVWAPAllZero ? false :VWAPLineVisible,
                tooltip: {
                    valueDecimals: 0,
                },
                dataGrouping: {
                    enabled: false,
                    forced: true,
                    units: [["minute", 1]],
                },
            }, {
                type: "line",
                name: "OI",
                color: "red",
                lineWidth: 1,
                yAxis: 2,
                data: OIArr,
                tooltip: {
                    valueDecimals: 0,
                },
                dataGrouping: {
                    enabled: false,
                    forced: true,
                    units: [["minute", 1]],
                },
                // visible: OILineVisible,
				visible: isOIArrAllZero ? false :OILineVisible,
                opacity: 2,
                connectNulls: true,
            }, {
                type: "column",
                name: "Volume",
                data: VolArr,
                color: "blue",
                yAxis: 3,
                lineWidth: 1,
                // visible: VolumeLineVisible,
				visible: isVolArrAllZero ? false :VolumeLineVisible,
                opacity: 0.6,
                dataGrouping: {
                    enabled: false,
                    forced: true,
                    units: [["minute", 1]],
                },
            }, {
                type: "line",
                name: "IV",
                color: "#FBBC05",
                lineWidth: 1,
                data: ivArr,
                yAxis: 4,
                // visible: IVLineVisible,
				visible: isIvArrAllZero ? false :IVLineVisible,
                tooltip: {
                    valueDecimals: 2,
                },
                dataGrouping: {
                    enabled: false,
                    forced: true,
                    units: [["minute", 1]],
                },
            }, {
                name: "PCR",
                data: pcrArr,
                color: "#219EFF",
                yAxis: 6,
                lineWidth: 1,
                // visible: PCRLineVisible,
				visible: isPcrArrAllZero ? false :PCRLineVisible,
                tooltip: {
                    valueDecimals: 2,
                },
                dataGrouping: {
                    enabled: false,
                    forced: true,
                    units: [["minute", 1]],
                },
                step: true,
            }, ].filter(series => series !== null),
        });
        
    }
    function TrendingTable() {
        var rdDataType = $("#rdDataType").val();
        var optSymbol = $("#optSymbol").val();
        // var optExpDate = $("#optExpDate").val();
		var optExpDate;
		if(rdDataType === 'hist'){
			optExpDate = $("#optExpDate_hist").val();
		}else{
			optExpDate = $("#optExpDate").val();
		}
        var txtDate = $("#txtDate").val();
        $.ajax({
            type: "POST",
            url: root_url + "getTrendingOIAndOIchg_commFunc.php",
            data: {
                optSymbol: optSymbol,
                optExpDate: optExpDate,
                rdDataType: rdDataType,
                txtDate: txtDate,
            },
            success: function(data) {
                if (data.get_Trending_OI == null && data.get_Trending_OI_Chg == null) {
                    $("#trendingoitable").html("<div class='flex justify-center items-center' ><h6 class='text-black font-bold font-mono py-2'>Data not available</h6></div>");
                    $("#trendingoichgtable").html("<div class='flex justify-center items-center' ><h6 class='text-black font-bold font-mono py-2'>Data not available</h6></div>");
                } else {
                    $("#trendingoitable").empty();
                    $("#trendingoichgtable").empty();
                    var get_Trending_oi_Arr = data.get_Trending_OI;
                    var get_Trending_oiChg_Arr = data.get_Trending_OI_Chg;
                    var oi_options = "";
                    oi_options += "<tr ><th colspan=2 class='text-center p-1'>" + "Trending OI" + "</th>" + "</tr>";
                    oi_options += "<tr><th class='p-1 w-1/2'>" + "Strikes" + "</th>" + "<th class='p-1  w-1/2'>" + "OI" + "</th></tr>";
                    Object.keys(get_Trending_oi_Arr).forEach(function(key) {
                        var trending_oi = get_Trending_oi_Arr[key]["oi"];
                        oi_options += "<tr><td class='p-1 text-center'>" + key + "</td>" + "<td class='p-1 text-center'>" + format_number(trending_oi) + "</td></tr>";
                    });
                    $("#trendingoitable").html(oi_options);
                    var oi_chg_options = "";
                    oi_chg_options += "<tr ><th colspan=2 class='text-center p-1'>" + "Trending OI Chg" + "</th>" + "</tr>";
                    oi_chg_options += "<tr><th class='p-1  w-1/2'>" + "Strikes" + "</th>" + "<th class='p-1  w-1/2'>" + "OI Chg" + "</th></tr>";
                    Object.keys(get_Trending_oiChg_Arr).forEach(function(key) {
                        var trending_oi_chg = get_Trending_oiChg_Arr[key]["oi_chg"];
                        oi_chg_options += "<tr><td class='p-1 text-center'>" + key + "</td>" + "<td class='p-1 text-center'>" + format_number(trending_oi_chg) + "</td></tr>";
                    });
                    $("#trendingoichgtable").html(oi_chg_options);
                }
            },
        });
    }
    TrendingTable();
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
    var lineChartlightOptions = {
        chart: {
            backgroundColor: "#ffffff",
        },
        legend: {
            itemStyle: {
                color: "#000",
            },
        },
        xAxis: {
            lineColor: "#f0f0f0",
            labels: {
                style: {
                    color: "#000",
                },
            },
        },
        yAxis: [{
            title: {
                style: {
                    color: "#000",
                },
            },
            labels: {
                style: {
                    color: "#000",
                },
            },
        }, {
            gridLineColor: "rgba(204,204,204,0.3)",
        }, {
            labels: {
                style: {
                    color: "#000",
                },
            },
        }, {
            visible: false,
        }, {
            visible: false,
        }, {
            visible: false,
        }, {
            visible: false,
        }, {
            gridLineColor: "rgba(204,204,204,0.3)",
        }, ],
        series: [{
            color: "black",
        }, ],
    };
    var lineChartdarkOptions = {
        chart: {
            backgroundColor: "#1a1a1a",
        },
        legend: {
            itemStyle: {
                color: "#f6f8fa",
            },
        },
        xAxis: {
            lineColor: "#434348",
            labels: {
                style: {
                    color: "#f6f8fa",
                },
            },
        },
        yAxis: [{
            title: {
                style: {
                    color: "#f6f8fa",
                },
            },
            labels: {
                style: {
                    color: "#f6f8fa",
                },
            },
        }, {
            gridLineColor: "rgba(204,204,204,0.3)",
        }, {
            labels: {
                style: {
                    color: "#f6f8fa",
                },
            },
        }, {
            visible: false,
        }, {
            visible: false,
        }, {
            visible: false,
        }, {
            visible: false,
        }, {
            gridLineColor: "rgba(204,204,204,0.3)",
        }, ],
        series: [{
            color: "white",
        }, ],
    };
    var barChartlightOptions = {
        chart: {
            backgroundColor: "#ffffff",
        },
        xAxis: {
            lineColor: "#f0f0f0",
            labels: {
                style: {
                    color: "#000",
                },
            },
        },
        yAxis: {
            title: {
                style: {
                    color: "#000",
                },
            },
            labels: {
                style: {
                    color: "#000",
                },
            },
        },
    };
    var barChartdarkOptions = {
        chart: {
            backgroundColor: "#1a1a1a",
        },
        xAxis: {
            lineColor: "#434348",
            labels: {
                style: {
                    color: "#f6f8fa",
                },
            },
        },
        yAxis: {
            title: {
                style: {
                    color: "#f6f8fa",
                },
            },
            labels: {
                style: {
                    color: "#f6f8fa",
                },
            },
        },
    };
    function setDarkModeOptions() {
        gauge5.updateOptions(gaugedarkOptions);
        gauge6.updateOptions(gaugedarkOptions);
        gauge7.updateOptions(gaugedarkOptions);
        gauge8.updateOptions(gaugedarkOptions);
        Chart_Arr.update(lineChartdarkOptions);
        oi_hc.update(barChartdarkOptions);
        oichg_hc.update(barChartdarkOptions);
    }
    function setLightModeOptions() {
        gauge5.updateOptions(gaugelightOptions);
        gauge6.updateOptions(gaugelightOptions);
        gauge7.updateOptions(gaugelightOptions);
        gauge8.updateOptions(gaugelightOptions);
        Chart_Arr.update(lineChartlightOptions);
        oi_hc.update(barChartlightOptions);
        oichg_hc.update(barChartlightOptions);
    }
	function formatLastUpdated(input) {
		const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
		if (input.includes("EOD")) {
			// Extract date part only
			const datePart = input.replace("EOD", "").trim();
			return `${datePart} EOD`;
	  } else {
		// Normal datetime
		const [day, month, rest] = input.split("-");
		const [year, time] = rest.split(" ");
		return `${day}-${months[parseInt(month) - 1]}-${year} ${time}`;
	  }
	}
    $("#theme-toggle").click(function() {
      /*   if ($("body").hasClass("dark-theme")) {
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
        var rdDataType = $("#rdDataType").val();
        if (rdDataType == "latest") {
            TrendingTable2();
            SymbolFutureChart(1);
            table.ajax.reload();
            calldata = getcallData(1);
            TrendingTable();
        }
    }, 30000);
});