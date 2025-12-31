
$(document).ready(function () {
  // ------------------dark theme---------
  var isDarkMode;
  var optType = "indexFutures";
  var ExpirydateSelected;
  // console.log(optType);
  isDarkMode = localStorage.getItem("isDarkMode") === "true";
  if (isDarkMode === true) {
    $("body").css("background-color", "#151515");
    $("body").addClass("dark-theme");
    $("#theme-toggle").prop("checked", true);
  }else{
    $("body").css("background-color", "#FFFFFF");
  }

  $('#loader').hide();
  $('#mloader').hide();
  var isTableRender = true;

  var rootfile = "/opt/api/dashboard/ApiCommonfiles/";
  var rdDataType = $("#rdDataType").val();
  // console.log(rdDataType);
  if (rdDataType == "latest") { 
    $("#txtDate-div").hide();
   
  }
  $("#optExpDate").change(function () {
    var rdDataType = $("#rdDataType").val();
    if (rdDataType == "hist") getHistDate();
    else get_current_page_function();
  });
  $("#optSymbol").change(function () {
    Expiry_Dates();
  });
  function getHistDate() {
    // console.log('entered  in hist')
    var symbol = "NIFTY";
    var deloptExpDate = $("#deloptExpDate").val();
    // console.log(optExpDate,'optExpDate')
    var url = rootfile + "ExpTradingDate_Api.php";
    // var url="hcharts/stx8req/php/getExpiryTradingDate_Curr.php";
    $.post(
      url,
      {
        sym: symbol,
        deloptExpDate: deloptExpDate,
      },
      function (json) {
        // console.log(json,"json inside exptradd")
        if (json === null) {
          DefaultCalenderData();
        } else {
          $("#txtDate").val(json);
          get_current_page_function();
        }
        // console.log(calldata,'calldata')
      },
      "json"
    );
  }


  function DefaultCalenderData() {
    $("#txtDate").empty();
    $.getJSON(rootfile + "getCommonData.php", function (json) {
      if (json && json[0] !== undefined && json[0] !== null) {
        var prev_trading_day = json[0].Prev_Trading_Date;
        // Use prev_trading_day here
    }

      $("#txtDate").val(prev_trading_day);
       //var optType =$('#optType').val();
      if(optType == "indexOptions"){
        Expiry_Dates();
      }else{
        getExpiryDatesdMYForNearNextFar();
      }

      // calldata = getcallData(0);
      get_current_page_function();
    });
  }

  

  function onloadData() {
    $("#optSymbol").empty();
    $("#optSymbolfocus").removeClass("is-focused");

    var options = "";

   // $.getJSON("api/dashboard/ApiCommonfiles/SymNamesApi_v3.php", function (data) {
	   $.getJSON(rootfile + "SymNamesApi_v3.php", function (data) {
        // Group symbols by symbol_type
        var groupedSymbols = {};
        $.each(data, function (index, item) {
            if (!(item.symbol_type in groupedSymbols)) {
                groupedSymbols[item.symbol_type] = [];
            }
            groupedSymbols[item.symbol_type].push(item);
        });

        // Construct options with optgroups
        $.each(groupedSymbols, function (symbolType, symbols) {
            options += '<optgroup label="' + symbolType + '">';
            $.each(symbols, function (index, item) {
                options += '<option value="' + item.symbol + '">' + item.symbol + '</option>';
            });
            options += '</optgroup>';
        });
		//console.log(options);

        $("#optSymbol").append(options);

        // Initialize the fSelect plugin
        $('#optSymbol').fSelect({
            searchText: 'Search',
            numDisplayed: 1,
        });

        $("#optSymbolfocus").addClass("is-focused");
        Expiry_Dates();

        // Reload the fSelect plugin
        $("#optSymbol").fSelect("reload");
    });
}


  function Expiry_Dates() {
    $("#optExpDate").empty();
    $("#optExpDatefocus").removeClass("is-focused");

 

   
    var symbol = 'NIFTY';
    var rdDataType = $("#rdDataType").val();
    var txtDate =$('#txtDate').val();
    // console.log(rdDataType,'rdDataType')
    // var url = rootfile + "SymExpDatesApi_v4.php";
  var url = "api/dashboard/ApiCommonfiles/getNearNextFarExpDatesForIndexOption.php";
	
    $.post(
      url,
      {
        sym: symbol,
        rdDataType: rdDataType,
        txtDate:txtDate
      },
      function (json) {
        var options = "";
        if (json && json[0] !== undefined && json[0] !== null) {
        var expiry_json = json[0];
        ExpirydateSelected = json[0];
      }

        // Extract the first three expiry dates
    // var firstThreeExpiryDates = Object.values(expiry_json).slice(0, 3);


    // Assign the first three expiry dates to labels
    if (expiry_json && expiry_json[0] !== undefined && expiry_json[0] !== null) {
      document.getElementById('nearExpiryDate').textContent = expiry_json[0].expiry_dates ;
  
      $('#deloptExpDate').val(expiry_json[0].expiry_dates);
    }
    if (expiry_json && expiry_json[1] !== undefined && expiry_json[1] !== null) {
      document.getElementById('nextExpiryDate').textContent = expiry_json[1].expiry_dates;
    }
    if (expiry_json && expiry_json[2] !== undefined && expiry_json[2] !== null) {
      document.getElementById('farExpiryDate').textContent = expiry_json[2].expiry_dates;
    }

        var defaultExpDate = json[1]["defaultExpDate"];
        var currMonthExpDate = json[1]["currMonthExpDate"];
        // console.log(defaultExpDate,'defaultExpDate')
        $.each(expiry_json, function (key, value) {
          var expiry_dates = value.expiry_dates;

          if (expiry_dates === defaultExpDate) selectedval = "selected";
          else if (expiry_dates === currMonthExpDate) selectedval = "selected";
          else selectedval = "";

          options +=
            '<option value="' +
            expiry_dates +
            '" ' +
            selectedval +
            ">" +
            expiry_dates +
            "</option>";
        });

       
        if (rdDataType == "latest") {
          $("#optExpDate").append(options);
          $("#optExpDatefocus").addClass("is-focused");
          // $('#optExpDate option:eq(0)').prop('selected', 'selected');
          // SymbolFutureChart(0)
          // calldata = getcallData(0);
          get_current_page_function();
        } else {
          // (function ($) {
          //   $(function () {
          //     $("#optExpDate").fSelect({
          //       searchText: "Search",
          //       // placeholder: 'Select some options',
          //       placeholder: "Select Expiry",
          //       numDisplayed: 1,
          //     });
          //   });
          // })(jQuery);
          // $("#optExpDate").fSelect("reload");
          $("#optExpDate").html(options);
          // $("#optExpDate").fSelect("reload");
          // getHistDate();
        }

        // componentHandler.upgradeElements($('#optExpDate').get());
        // getoianalysislist();
      },
      "json"
    );
  

  }
  getExpiryDatesdMYForNearNextFar();
  function getExpiryDatesdMYForNearNextFar(){
    var SymbType = "FNO";
    var txtDate = $('#txtDate').val();
    var rdDataType = $('#rdDataType').val();
    var url = "/opt/hcharts/stx8req/php/getExpiryDatesdMYForNearNextFar.php";
    $.post(
      url,
      {
        SymbType:SymbType,
        txtDate: txtDate,
        rdDataType: rdDataType,
      },
      function (json) {
        // console.log(json[0],"expiry dates json");
        

        // Extract the first three expiry dates
    // var firstThreeExpiryDates = Object.values(expiry_json).slice(0, 3);


    // Assign the first three expiry dates to labels
    if (json && json[0] !== undefined && json[0] !== null && json[1] !== undefined && json[1] !== null && json[2] !== undefined && json[2] !== null) {
    document.getElementById('nearExpiryDate').textContent = json[0] ;
    document.getElementById('nextExpiryDate').textContent = json[1];
    document.getElementById('farExpiryDate').textContent = json[2];
    $('#deloptExpDate').val(json[0]);
    ExpirydateSelected = json;

    }
      },"json");
  }


  
  
  // $("#optSymbol").change(function () {
  //   Expiry_Dates();
  // });

  // -------------- End Of Symbol Info----------------

  // var root_url = "/opt/api/dashboard/php/";
  // function get_current_page_function() {
  //   // TrendingTable2();
  //   // getoianalysislist();
  //   // SymbolFutureChart(0);
  //   // TrendingTable();
  //   // calldata = getcallData(0);
  //   // return calldata;
  // }

  var table;
    
  // Get references to the buttons
const btn1day = document.getElementById('btn1day');
const btn3day = document.getElementById('btn3day');
const btn7day = document.getElementById('btn7day');
const btn15day = document.getElementById('btn15day');

btn1day.textContent = "1day";
btn1day.style.fontSize = "12px";
btn1day.style.textAlign = "center"; // Adjusting text alignment

btn3day.textContent = "3days";
btn3day.style.fontSize = "12px";
btn3day.style.textAlign = "center"; // Adjusting text alignment

btn7day.textContent = "7days";
btn7day.style.fontSize = "12px";
btn7day.style.textAlign = "center"; // Adjusting text alignment

btn15day.textContent = "15days";
btn15day.style.fontSize = "12px";
btn15day.style.textAlign = "center"; // Adjusting text alignment


// var optTypeSelect = document.getElementById("optType");
var optExpDate ;
var checktoSaveFilters= false;
var sort =  document.getElementById("sort");
// var  sortBy = "oichgper";
// sort.value= "oichgper";

  var form = document.getElementById("frmOptChain");
  document.getElementById("hist").addEventListener("click", function () {
   
    document.getElementById("rdDataType").value = "hist";
   
    // form.submit();
    // setTimeout(function() {
    var rdDataType = $("#rdDataType").val();
    // console.log(rdDataType,"select rddatatype");
     //var optType =$('#optType').val();
     checktoSaveFilters = true;
     savemutiplestrikes();
   
    TopTenTable();
  //  $('#loader').show();
    DefaultCalenderData();
    if(optType == "indexOptions"){
      Expiry_Dates();
    }else{
      getExpiryDatesdMYForNearNextFar();
    }
    $("#txtDate-div").show();
   
    if (window.matchMedia("(max-width: 1473px)").matches) {
      $('#mloader').show();
    } else {
      $('#loader').show();
    }
  // }, 750);
  });

  document.getElementById("latest").addEventListener("click", function () {
    
    document.getElementById("rdDataType").value = "latest";
    // console.log("**********");
    // setTimeout(function() {
    var rdDataType = $("#rdDataType").val();
    $("#txtDate-div").hide();
   
     
     
    // console.log(rdDataType,"select rddatatype");
    //   form.submit();
     //var optType =$('#optType').val();
    if(optType == "indexOptions"){
      Expiry_Dates();
    }else{
      getExpiryDatesdMYForNearNextFar();
    }
    checktoSaveFilters = true;
    savemutiplestrikes();
    
    TopTenTable();
    if (window.matchMedia("(max-width: 1473px)").matches) {
      $('#mloader').show();
    } else {
      $('#loader').show();
    }
  //  $('#loader').show();
  // }, 750);
  });
  $("#txtDate").change(function () {
    get_current_page_function();
    var optType = $('#optType').val();
    // console.log(optType);
    if(optType == "indexOptions"){
      Expiry_Dates();
    }else{
      getExpiryDatesdMYForNearNextFar();
    }
    if (window.matchMedia("(max-width: 1473px)").matches) {
      $('#mloader').show();
    } else {
      $('#loader').show();
    }
    
  });

  document.getElementById("near").addEventListener("click", function () {
    optExpDate = document.getElementById("near").value = "near";
    // setTimeout(function() {
      savemutiplestrikes();
    TopTenTable();
  //  $('#loader').show();
  // }, 750);
  if (window.matchMedia("(max-width: 1473px)").matches) {
    $('#mloader').show();
  } else {
    $('#loader').show();
  }
  });
   
  document.getElementById("next").addEventListener("click", function () {
    optExpDate = document.getElementById("next").value = "next";
    // setTimeout(function() {
      checktoSaveFilters = true;
      savemutiplestrikes();
    TopTenTable();
  //  $('#loader').show();
  // }, 750);
  if (window.matchMedia("(max-width: 1473px)").matches) {
    $('#mloader').show();
  } else {
    $('#loader').show();
  }
  });

  document.getElementById("far").addEventListener("click", function () {
    optExpDate = document.getElementById("far").value = "far";
    // setTimeout(function() {
      checktoSaveFilters = true;
      savemutiplestrikes();
    TopTenTable();
  //  $('#loader').show();
  // }, 750);
  if (window.matchMedia("(max-width: 1473px)").matches) {
    $('#mloader').show();
  } else {
    $('#loader').show();
  }
  });
  
  function getCheckedValue() {
    const checkedRadio = document.querySelector('input[name="optExpdate"]:checked');
    if (checkedRadio) {
      return checkedRadio.value;
    }
    return null;
  }
  optExpDate = getCheckedValue();


  let setTimeoutId;
$("#symList").change(function() {
    clearTimeout(setTimeoutId);
    setTimeoutId = setTimeout(function() {

        savemutiplestrikes(); // Save user settings
        TopTenTable();
        if (window.matchMedia("(max-width: 1473px)").matches) {
          $('#mloader').show();
        } else {
          $('#loader').show();
        }
    }, 500);
});



var btnclicked;

btn1day.addEventListener('click', function() {
  startptime = 15;
  btnclicked = "day1";

 
  btn3day.disabled = true;
  btn7day.disabled = true;
  btn15day.disabled = true;
  checktoSaveFilters = true;
  savemutiplestrikes();
  TopTenTable();
//  $('#loader').show();
  highlightButton(this); // Highlight the clicked button
  if (window.matchMedia("(max-width: 1473px)").matches) {
    $('#mloader').show();
  } else {
    $('#loader').show();
  }
});

btn3day.addEventListener('click', function() {
  startptime = 30;
  btnclicked = "day3";
 
  btn1day.disabled = true;
  
  btn7day.disabled = true;
  btn15day.disabled = true;
  checktoSaveFilters = true;
  savemutiplestrikes();
  TopTenTable();
//  $('#loader').show();
  highlightButton(this); // Highlight the clicked button
  if (window.matchMedia("(max-width: 1473px)").matches) {
    $('#mloader').show();
  } else {
    $('#loader').show();
  }
});

btn7day.addEventListener('click', function() {
  startptime = 60;
  btnclicked = "day7";

  btn1day.disabled = true;
  btn3day.disabled = true;
 
  btn15day.disabled = true;
  checktoSaveFilters = true;
  savemutiplestrikes();
  TopTenTable();
//  $('#loader').show();
  highlightButton(this); // Highlight the clicked button
  if (window.matchMedia("(max-width: 1473px)").matches) {
    $('#mloader').show();
  } else {
    $('#loader').show();
  }
});

btn15day.addEventListener('click', function() {
  startptime = 24 * 60;
  btnclicked = "day15";

  btn1day.disabled = true;
  btn3day.disabled = true;
  btn7day.disabled = true;

  checktoSaveFilters = true;
  savemutiplestrikes();
  TopTenTable();
//  $('#loader').show();
  highlightButton(this); // Highlight the clicked button
  if (window.matchMedia("(max-width: 1473px)").matches) {
    $('#mloader').show();
  } else {
    $('#loader').show();
  }
});

function getClickedButton() {
  const buttons = document.querySelectorAll('.mdl-button');
  buttons.forEach(function(btn) {
    btn.classList.remove('highlight');
});
  buttons.forEach(button => {
    if (button.getAttribute('data-btnclicked') === 'true') {
      // Do something with the button
      // console.log(button.id + ' was clicked initially.');
      // You can also trigger a click event or add a class to visually indicate the selection
      button.classList.add('btn-selected');
    
      button.classList.add('highlight');
      // highlightButton(this);
      if(button.id == "btn1day"){
         btnclicked = "day1";
       }else if(button.id == "btn3day"){
        btnclicked = "day3";
       }else if(button.id == "btn7day"){
        btnclicked = "day7";
       }else if(button.id == "btn15day"){
        btnclicked = "day15";
        
       }
    }
  });
}

getClickedButton();

function highlightButton(button) {
  // Remove highlighting from all buttons
 
  var buttons = document.querySelectorAll('.mdl-button--raised');
  buttons.forEach(function(btn) {
      btn.classList.remove('highlight');
  });

  // Add highlighting to the clicked button
  button.classList.add('highlight');
}

var inputData = {};
// var filters ={};
function savemutiplestrikes(){
  
  var rdDataType = $("#rdDataType").val();
  var userName = $("#username").val();
  var pageName=  $("#pageName").val();
  var selectList = $("#symList").val();
  if(rdDataType == "latest"){
    var txtDate = "";
  }else{
    var txtDate = $('#txtDate').val();
  }
  

  var storageKey = "uptrend-table-filters";
  var selector = "#bar1";

  // if(checktoSaveFilters){
 // Iterate over each search input field and save its value with the index
 $(selector + ' .column-search').each(function (index) {
  inputData[storageKey+'_column_' + index] = $(this).val().trim(); // Store the value with column index as the key
});
  // }
  

var selector = "#bar2";
var storageKey = "downtrend-table-filters";

// Iterate over each search input field and save its value with the index
$(selector + ' .column-search').each(function (index) {
  inputData[storageKey+'_column_' + index] = $(this).val().trim(); // Store the value with column index as the key
});



  // var optExpDate = $("#optExpDate").val();
  // console.log(btnclicked,rdDataType,optExpDate,userName,pageName,txtDate);
        
  var user_pref=JSON.stringify({rdDataType:rdDataType,btnclicked:btnclicked,optExpDate:optExpDate,txtDate:txtDate,selectList:selectList,filters:inputData});

      // alert(user_pref);
      var urlSave="hcharts/stx8req/php/Save_Multi_CE_PE_Charts.php";
      $.post(urlSave,
          {
              un: userName,
              user_setting: user_pref,
              pageName : pageName,
              
          },
          function(data, status){
          // console.log(data);
          });
}

function format2decimals(number){
  if(number== "-"){
    return "-";
  }
  
  let formattedNumber = Number(number).toFixed(2);
  
  return formattedNumber+"%";
}
function formatdecimals(number){
  if(number == "-"){
    return "-";
  }
  let formattedNumber = Number(number).toFixed(0);
  
  return formattedNumber;
}

var search_input_type = 'text';
var check_Mobile_val = check_isMobile();
//var check_Mobile_val=0;
if (check_Mobile_val == 1) {
  search_input_type = 'search';
}

var fixedHeaderval = true;
if (check_Mobile_val == 1) {
   fixedHeaderval = false;
}


var allTables = [];
var dataArrays = [];


var filenameval;
$('#initloading').show();
$('#initloading2').show();
// Main function
function TopTenTable() {
 

  var rdDataType = $("#rdDataType").val();
  var optType = "indexFutures";
  var txtDate = $('#txtDate').val();
  var sID = $("#sessionID").val();
  var userName = $("#username").val();
  var selectList = $("#symList").val();
  
  if (btnclicked === "day1") {
    highlightButton(btn1day);
    btnclicked = "day1";
  }
 
  if (btnclicked == 'day1') {
    var dayvalue = "1 Day"
   }else if (btnclicked == 'day3'){
      var dayvalue = "3 Days" 
     }else if (btnclicked == 'day7'){
        var dayvalue = "7 Days"
       }else{
         var dayvalue = "15 Days" 
       }
      
    //    if (rdDataType === 'hist' && txtDate === '') {
    //     // alert("Please select a valid date for historical data.");
    //     return; // Prevent the AJAX request if the condition is not met
    // }

  $.ajax({
     type: "POST",
    url: "/opt/hcharts/stx8req/php/getDataForScripsInUptrendDowntrend_v20.php",
    method: "POST",
    data: {
      rdDataType: rdDataType,
      txtDate: txtDate,
      optType: optType,
      optExpDate: optExpDate,
      btnclicked: btnclicked,
      sID:sID,
      userName:userName,
      symList:selectList,
  },
    success: function (data) {
  
  
      
      $('#loader').hide();
      $('#mloader').hide();

            // **Destroy old DataTable instances to free up memory**
  if ($.fn.DataTable.isDataTable("#bar1")) $("#bar1").DataTable().clear().destroy();
  if ($.fn.DataTable.isDataTable("#bar2")) $("#bar2").DataTable().clear().destroy();
// **Clear previous data completely before fetching new**
$("#bar1").empty();
$("#bar2").empty();
$("#bullishValue").text("");
$("#bearishValue").text("");
$("#updateddate").text("");
clearTables();

      var UptrendTable = renderTable(data[0]["Scrips in Uptrend"], "#bar1", "Scrips in Uptrend",data[2]);
      var DowntrendTable = renderTable(data[1]["Scrips in Downtrend"], "#bar2", "Scrips in Downtrend",data[2]);

      // console.log(data[0]["Scrips in Uptrend"],data[1]["Scrips in Downtrend"]);
      var allTablesdata = [UptrendTable, DowntrendTable];
      var bullishbearesh = data[2];
      dataArrays = [data[0]["Scrips in Uptrend"],data[1]["Scrips in Downtrend"],bullishbearesh];


      function renderTable(data, selector, title,BullBearDATA) {
        // if(selector == "#bar1"){
        //   data = [];
        // }
        // console.log(BullBearDATA[0]?.bullish);
        // console.log(BullBearDATA[0]?.bearish);
        // console.log(BullBearDATA[0]?.lastupdated);
        if(BullBearDATA[0]?.lastupdated === "01-Jan-1970 15:30"){
          $("#bullishValue").text("");
          $("#bearishValue").text("");
          $("#updateddate").text("");

        }else{
           // if(BullBearDATA[0]?.bullish || BullBearDATA[0]?.bearish){
            $("#bullishValue").text(BullBearDATA[0]?.bullish);
            $("#bearishValue").text(BullBearDATA[0]?.bearish);
            $("#updateddate").text(BullBearDATA[0]?.lastupdated);
        // }

        }

       

        $('#initloading').hide();
        $('#initloading2').hide();
    
        const idPrefix = (title === 'Scrips in Uptrend') ? 'Uptrend' : 'Downtrend'; // Prefix for search inputs
        const fragment = document.createDocumentFragment(); // Create a document fragment
    
        // Create the table element
        const table = document.createElement('table');
        table.className = 'tableborder'; // Add table class
    
        // Create thead
        const thead = document.createElement('thead');
    
        // Add title row
        // const titleRow = document.createElement('tr');
        // titleRow.className = 'itmhighlight tableborder';
        // const titleCell = document.createElement('th');
        // titleCell.colSpan = 11;
        // titleCell.className = 'p-1 w-1/2 font-mono tableborder tabletitle';
        // titleCell.style.fontSize = '14px';
        // titleCell.textContent = title;
        // titleRow.appendChild(titleCell);
        // thead.appendChild(titleRow);
    
        // Add header row
        const headerRow = document.createElement('tr');
        headerRow.className = 'itmhighlight tableborder';
        const headers = [
            'Rank', 'Symbol', 'Price', 'Chg % (Since Open)', `Chg % <br>(${dayvalue})`,
            (title === 'Scrips in Uptrend') ? 'Max High' : 'Min Low',
            (title === 'Scrips in Uptrend') ? 'Dist from High(%)' : 'Dist from Low(%)',
            'OI Chg', 'OI Chg(%)', 'Buildup', 'Trend\nScore'
        ];
    
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.className = 'font-mono';
            th.style.fontSize = '12.5px';
            th.style.backgroundColor = '#F9FAFB';
            th.innerHTML = headerText;
            th.setAttribute('onmouseenter', 'closeMiniChart(event);');
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
    
        // Add search row
        const searchRow = document.createElement('tr');
        searchRow.className = `font-mono search-row tableborder ${title}-table`;
        const searchInputs = [
            `${idPrefix}_Rank`, `${idPrefix}_Symbol`, `${idPrefix}_Price`, `${idPrefix}_ChgPerSinceToday`,
            `${idPrefix}_ChgPer`, (title === 'Scrips in Uptrend') ? `${idPrefix}_MaxHigh` : `${idPrefix}_MinLow`,
            (title === 'Scrips in Uptrend') ? `${idPrefix}_DistFromHighPer` : `${idPrefix}_DistFromLowPer`,
            `${idPrefix}_OiChg`, `${idPrefix}_OiChgPer`, `${idPrefix}_Buildup`, `${idPrefix}_TrendScore`
        ];
    
        searchInputs.forEach(inputId => {
            const th = document.createElement('th');
            const input = document.createElement('input');
            input.id = inputId;
            input.style.fontSize = '11.5px';
            input.type = search_input_type;
            input.className = 'font-mono column-search';
            input.placeholder = inputId.includes('Symbol') ? 'Search' : '';
            th.appendChild(input);
            searchRow.appendChild(th);
        });
        thead.appendChild(searchRow);
    
        // Append thead to table
        table.appendChild(thead);
    
        // Create tbody
        const tbody = document.createElement('tbody');
    
        if (data.length === 0) {
            const noDataRow = document.createElement('tr');
            noDataRow.className = 'tableborder';
            const noDataCell = document.createElement('td');
            noDataCell.colSpan = 11;
            noDataCell.className = 'p-1 text-center font-mono';
            noDataCell.style.fontSize = '12px';
            noDataCell.textContent = 'No Data Available';
            noDataRow.appendChild(noDataCell);
            tbody.appendChild(noDataRow);
            // renderButtons([]);
        } else {
          
            data.forEach((item, index) => {
                const row = document.createElement('tr');
                row.className = 'tableborder even-row highlighthover';
    
                // Add cells to the row
               const cells = [
                                  { content: item.Sno, align: 'left', paddingLeft: '1.5%' },
                                  { content: createSymbolCell(item), align: 'left' },
                                  { content: item.price, align: 'right', paddingRight: '1.5%' },
                                  { content: format2decimals(item.price_change_Pct_today), align: 'right', paddingRight: '1.5%', className: getColorClass(item.price_change_Pct_today) },
                                  { content: format2decimals(item.priceChg_Pct), align: 'right', paddingRight: '1.5%', className: getColorClass(item.priceChg_Pct) },
                                  { content: (title === 'Scrips in Uptrend') ? item.max_phigh : item.min_plow, align: 'right', paddingRight: '1.5%' },
                                  { 
                                      content: format2decimals((title === 'Scrips in Uptrend') ? item.dist_from_high_Pct : item.dist_from_low_Pct), 
                                      align: 'right', 
                                      paddingRight: '1.5%', 
                                      className: getColorClass((title === 'Scrips in Uptrend') ? item.dist_from_high_Pct : item.dist_from_low_Pct)
                                  },
                                  { content: formatdecimals(item.oi_change), align: 'right', paddingRight: '1.5%', className: getColorClass(item.oi_change) },
                                  { content: format2decimals(item.oi_change_Pct), align: 'right', paddingRight: '1.5%', className: getColorClass(item.oi_change_Pct) },
                                  { content: `<span class="buildup" style="background-color:${getBuildupColor(item.buildup).bg}; color:${getBuildupColor(item.buildup).color};">${item.buildup}</span>`, align: 'center' }, 
                                  { content: item.TrendScore.toFixed(2), align: 'right', paddingRight: '1.5%' }
                              ];


    
                cells.forEach(cell => {
                    const td = document.createElement('td');
                    td.className = `p-1 font-mono border-right ${cell.className || ''}`;
                    td.style.textAlign = cell.align;
                    td.style.fontSize = '12.5px';
                    td.style.paddingRight = cell.paddingRight || '';
                    td.style.paddingLeft = cell.paddingLeft || '';
                    td.style.color = cell.color || '';
                    td.style.backgroundColor = cell.backgroundColor || '';
                    // td.textContent = cell.content;

                    
                    let tempDiv = document.createElement('div');
                    tempDiv.innerHTML = cell.content;
                
                    let uTag = tempDiv.querySelector('u');
                    let anchorTag = tempDiv.querySelector('a');
                    let chartIconContainer = tempDiv.querySelector('.chartIcon-container');
                
                    if (uTag && anchorTag) {
                        let symbol = uTag.textContent.trim();
                        let href = anchorTag.getAttribute('href');
                        let onClickAttr = chartIconContainer ? chartIconContainer.getAttribute('onclick') : '';
                
                        // Construct the full cell content
                        td.innerHTML = `
                            <div class='symbol-container'>
                                <a href='${href}' target='_blank'>
                                    <u>${symbol}</u>
                                </a>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <span class='chartIcon-container' onclick='${onClickAttr}'>
                                    <div class="chartIcon-wrapper">
                                      <img src='/opt/assets_adq/images/finance.png' class='chart-background'/>
                                      <span class='material-symbols-outlined chartIcon'>show_chart</span>
                                    </div>
                                </span>
                            </div>
                        `;
                
                        // Maintain additional functionalities
                        td.className = 'p-1 font-mono  symbol-cell';
                        td.style.cssText = 'font-size:12px;white-space: nowrap;';
                        td.setAttribute('onmouseenter', 'openMiniChartScripsInUpDownTrend(event);');
                       
                        td.setAttribute('onclick', 'closeMiniChart(event);');
                    } else {
                       if (typeof cell.content === 'string' && cell.content.includes('<span')) {
                         td.innerHTML = cell.content; // for buildup span
                       } else {
                           td.textContent = cell.content;
                       }
                        td.setAttribute('onmouseenter', 'closeMiniChart(event);');
                    }
                  
                  

                    row.appendChild(td);
                });
    
                tbody.appendChild(row);
            });
        }
    
        // Append tbody to table
        table.appendChild(tbody);
    
        // Append table to fragment
        fragment.appendChild(table);
    
        // Append fragment to the selector
        const container = document.querySelector(selector);
        container.innerHTML = ''; // Clear existing content
        container.appendChild(fragment);
    
        // Enable buttons
        btn1day.disabled = false;
        btn3day.disabled = false;
        btn7day.disabled = false;
        btn15day.disabled = false;
    
        // Initialize DataTable if data exists
       if(data.length > 0) initializeDataTable(selector, table.outerHTML, title, dayvalue);
    
        isTableRender = false;
    }
   
    
    function createSymbolCell(item) {
      // Format dates and expiry
      const downloaddate = GetFormattedDate(item.lastupdated);
      const dt = GetFormattedDateForURL(item.lastupdated);
      const expiry = (item.symbol_withExpiry && item.symbol_withExpiry !== "-") ? formatExpiryDate(item.symbol_withExpiry) : '-';
    if(optExpDate === "near"){
      var expiryDate =  ExpirydateSelected[0]
    }else if(optExpDate === "next"){
      var expiryDate =  ExpirydateSelected[1]
    }else if(optExpDate === "far"){
      var expiryDate =  ExpirydateSelected[2]
    }
      
      filenameval = "ScripsInUptrendDowntrend_"+expiryDate+"_" + downloaddate;
	  var rdDataType = $("#rdDataType").val();
  
      // Create the symbol cell HTML
      const symbolCellHTML = `
          <div class='symbol-container'>
              <a href='/opt/OptionChain.php?symbol=${encodeURIComponent(item.symbol)}-${expiry}&d=${txtDate}&rdDataType=${rdDataType}' target='_blank'>
                  <u>${item.symbol}</u>
              </a>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span class='chartIcon-container' onclick='getQuickChartPageScripsInUpDownTrend("${encodeURIComponent(item.symbol_withExpiry)}", "${dt}")'>
                  <div class="chartIcon-wrapper">
                   <img src='/opt/assets_adq/images/finance.png' class='chart-background'/>
                   <span class='material-symbols-outlined chartIcon'>show_chart</span>
                   div>
              </span>
          </div>
      `;
  
      return symbolCellHTML; // Return the HTML string
  }
    
    // Helper function to get buildup color
    function getBuildupColor(buildup) {
        switch (buildup) {
            case 'LB': return { bg: '#027A48', color: 'white' };
            case 'SC': return { bg: '#17CD06', color: 'white' };
            case 'SB': return { bg: '#B42318', color: 'white' };
            case 'LU': return { bg: '#F98484', color: 'white' };
            default: return { bg: '', color: '' };
        }
    }
    function getColorClass(value) {
    return value > 0 ? 'color-positive' : 'color-negative';
   }


    },
    error: function (xhr, status, error) {
    console.log("RESPONSE:", xhr.responseText);
    var res = xhr.responseText.trim();
    if (res === "Invalid Session !") {
       check_Session_and_Logout(res);
    }

    btn1day.disabled = false;
    btn3day.disabled = false;
    btn7day.disabled = false;
    btn15day.disabled = false;
}

  });
}
TopTenTable();


function cleanupDetachedNodes() {
  // Step 1: Use MutationObserver to detect removed nodes
  const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
          mutation.removedNodes.forEach((node) => {
              if (node.nodeType === 1) { // Check if it's an element node
                  // console.log('Detached node found:', node);

                  // Step 2: Remove event listeners
                  $(node).off(); // Remove all jQuery event listeners

                  // Step 3: Nullify references
                  node = null; // Allow garbage collection
                  // console.log('Detached node found:removed', node);
              }
          });
      });
  });

  // Step 4: Start observing the document body for removed nodes
  observer.observe(document.body, { childList: true, subtree: true });
}


function clearTables() {


  // Call the cleanup function
// cleanupDetachedNodes();

  // Destroy and clean up existing DataTable instances
  if ($.fn.DataTable.isDataTable("#bar1")) {
      $("#bar1").DataTable().off().clear().destroy();
     
  }
  if ($.fn.DataTable.isDataTable("#bar2")) {
      $("#bar2").DataTable().off().clear().destroy();


  }

  // Clear DOM elements
  $("#bar1").off().empty();
  $("#bar2").off().empty();


  // Clear global variables
  allTables = [];
  dataArrays = [];

}



 // Initialize DataTable and manage saving, restoring, and conditional search
 function initializeDataTable(selector, tableHTML,title,dayvalue) {

  var storageKey = (selector === "#bar1") ? "uptrend-table-filters" : "downtrend-table-filters";

  // Destroy the previous DataTable instance if it exists
  if ($.fn.DataTable.isDataTable(selector)) {
    $(selector).DataTable().clear().destroy();
    // console.log(selector,"destroyed");
    // console.log(tableHTML,"tableHTML");
  }

  // if ($.fn.DataTable.isDataTable(selector)) {
  //    var tableInstance = $(selector).DataTable();
  // }else{
      // Initialize DataTable with search feature enabled
  var tableInstance = $(selector).html(tableHTML).DataTable({
    paging: false,
    searching: true,
    ordering: true,
    info: false,
    autoWidth: false,
    stateSave: true,
    stateDuration: -1, 
    orderCellsTop: true,
		// fixedHeader: true,
    language: {
        "emptyTable": "<h1 colspan='11' style='text-align:center;' class='font-mono'>No matching records found</h1>"
    },
    columns: [
        { title: "Rank", data: "Sno",orderDataType: 'custom-numeric' },
        { title: "Symbol", data: "symbol", orderDataType: 'custom-text' },
        { title: "Price", data: "price",orderDataType: 'custom-numeric' },
        { title: "Chg % (Since Open)", data: "price_change_Pct_today" ,orderDataType: 'custom-numeric'},
        { title: "Chg %  (" + dayvalue + ")", data: "priceChg_Pct",orderDataType: 'custom-numeric' },
        { title: selector === "#bar1" ? "Max High" : "Min Low", data: selector === "#bar1" ? "max_phigh" : "min_plow",orderDataType: 'custom-numeric' },
        { title: selector === "#bar1" ? "Dist from High (%)" : "Dist from Low (%)", data: selector === "#bar1" ? "dist_from_high_Pct" : "dist_from_low_Pct",orderDataType: 'custom-numeric' },
        { title: "OI Chg", data: "oi_change" ,orderDataType: 'custom-numeric'},
        { title: "OI Chg (%)", data: "oi_change_Pct" ,orderDataType: 'custom-numeric'},
        { title: "Buildup", data: "buildup", orderDataType: 'custom-text' },
        { title: "Trend Score", data: "TrendScore" ,orderDataType: 'custom-numeric'}
    ]
});


// Store table instance in the global array
if (selector == "#bar1") {
  allTables[0] = tableInstance;

  // console.log("bar1 initialized",tableInstance);
} else if (selector == "#bar2") {
  allTables[1] = tableInstance;
 
  // console.log("bar2 initialized",tableInstance);
}

// Check if both tables are initialized and render the buttons
// if (allTables[0] && allTables[1]) {
  // console.log("Both tables initialized", allTables);
  renderButtons(allTables);
// }
  // }

// tableInstance = $(selector).DataTable();
// console.log(tableInstance,"tableInstance");
  // Restore saved filter values from localStorage
  restoreFilterValues(selector, tableInstance, storageKey,title);

  // isTableRender = false;
  // if(isTableRender){
    // console.log("isTableRender",isTableRender);
        // Unbind the previous keyup event handler to avoid multiple bindings
        $(selector + ' .column-search').off('keyup');
     
       // Apply the custom search only when the Enter key is pressed
       $(selector + ' .column-search').on('keyup', debounce(function (event) {
       savemutiplestrikes();
       checktoSaveFilters = true;
       // Save the input value in localStorage
       saveFilterValues(selector, storageKey);
       // Check if the Enter key is pressed
       if (event.key === 'Enter' || event.keyCode === 13) {
             applyConditionalSearch(tableInstance,title);
       }
       },300));
  // }

  function debounce(func, delay) {
    let debounceTimer;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  }


// Listen for sorting event triggered by click on DataTable headers
$(selector + ' thead th').on('click', function () {
  // Check if the column is orderable (some columns might not be sortable)
  if (!$(this).hasClass('sorting_disabled')) {
    // Call applyConditionalSearch when a column header is clicked
    applyConditionalSearch(tableInstance, title);
  }
});


}

function applyConditionalSearch(tableInstance, title) {
  var searchConditions = [];
  var idPrefix = (title === 'Scrips in Uptrend') ? 'Uptrend' : 'Downtrend'; // or any other condition

  var columnIdToIndex = {
      [`${idPrefix}_Rank`]: 0,
      [`${idPrefix}_Symbol`]: 1,
      [`${idPrefix}_Price`]: 2,
      [`${idPrefix}_ChgPerSinceToday`]: 3,
      [`${idPrefix}_ChgPer`]: 4,
      [`${idPrefix}_MaxHigh`]: 5,
      [`${idPrefix}_DistFromHighPer`]: 6,
      [`${idPrefix}_MinLow`]: 5,
      [`${idPrefix}_DistFromLowPer`]: 6,
      [`${idPrefix}_OiChg`]: 7,
      [`${idPrefix}_OiChgPer`]: 8,
      [`${idPrefix}_Buildup`]: 9,
      [`${idPrefix}_TrendScore`]: 10
  };

  if (title === 'Scrips in Uptrend') {
      delete columnIdToIndex[`${idPrefix}_MinLow`];
      delete columnIdToIndex[`${idPrefix}_DistFromLowPer`];
  } else {
      delete columnIdToIndex[`${idPrefix}_MaxHigh`];
      delete columnIdToIndex[`${idPrefix}_DistFromHighPer`];
  }

  for (var id in columnIdToIndex) {
      if (columnIdToIndex.hasOwnProperty(id)) {
          var columnIndex = columnIdToIndex[id];
          var searchValue = $('#' + id).val();
          searchValue = searchValue ? searchValue.trim() : '';

          if (searchValue.match(/^[<>]=?|==|=/)) {
            // Match comparison operators and numbers, even if they start with a dot (e.g., >.1)
            var match = searchValue.match(/^([<>]=?|==|=)\s*(-?\d*\.?\d+)/);  // Accept numbers that can start with a dot
            if (match) {
                let value = match[2];
        
                // If the value starts with a ".", normalize it to "0.x"
                if (value.startsWith('.')) {
                    value = '0' + value;
                }
        
                searchConditions.push({
                    columnIndex: columnIndex,
                    operator: match[1],
                    value: parseFloat(value)
                });
            }
        } else if (!isNaN(searchValue) && searchValue !== '') {
            // If it's a standalone number, normalize and accept values starting with "."
            if (searchValue.startsWith('.')) {
                searchValue = '0' + searchValue;
            }
        
            searchConditions.push({
                columnIndex: columnIndex,
                operator: '==',
                value: parseFloat(searchValue)
            });
        } else if (columnIndex === 1 || columnIndex === 9) {
            searchConditions.push({
                columnIndex: columnIndex,
                operator: 'contains',
                value: searchValue
            });
        }
        
      }
  }

  $.fn.dataTable.ext.search.length = 0;

  // Apply custom search logic and mark rows as visible/invisible
  $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
      var matches = searchConditions.every(function (cond) {
        // console.log("column :",data[cond.columnIndex],"operator :",data[cond.operator],"value:",data[cond.value])
          var cellValue = data[cond.columnIndex];


          // If the condition is 'contains', handle it for string matching
          if (cond.operator === 'contains') {
              return cellValue.toLowerCase().includes(cond.value.toLowerCase());
          } else {
              // Normalize conditions like <.1 or >.2 to <0.1 or >0.2
              let normalizedValue = cond.value.toString();

              // Add leading zero if value starts with a decimal point
              if (normalizedValue.startsWith('.')) {
                  normalizedValue = '0' + normalizedValue;
              }

              // console.log("Normalized Value:", normalizedValue);

              // Try to convert the cell value to a numeric value, handling possible formatting
              var numericValue = parseFloat(cellValue.replace(/[^\d.-]/g, ''));

              // If the numeric value is NaN (not a number), return false
              if (isNaN(numericValue)) return false;

              // Handle the condition based on the operator
              switch (cond.operator) {
                  case '>':
                      return numericValue > parseFloat(normalizedValue);
                  case '>=':
                      return numericValue >= parseFloat(normalizedValue);
                  case '<':
                      return numericValue < parseFloat(normalizedValue);
                  case '<=':
                      return numericValue <= parseFloat(normalizedValue);
                  case '==':
                  case '=':
                      return numericValue == parseFloat(normalizedValue);
                  default:
                      return true;
              }
          }
      });

      // If the row matches, add a class or flag to make it visible for export
      var rowNode = tableInstance.row(dataIndex).node();
      if (matches) {
          $(rowNode).addClass('visible-row');  // Mark as visible
          return true;
      } else {
          $(rowNode).removeClass('visible-row');  // Remove visibility mark
          return false;
      }
  });

  tableInstance.draw();
}



// Function to save filter values in localStorage
function saveFilterValues(selector, storageKey) {
  var filterValues = {};
  // Iterate over each search input field and save its value with the index
  $(selector + ' .column-search').each(function (index) {
      filterValues[storageKey+'_column_' + index] = $(this).val().trim(); // Store the value with column index as the key
  });
  // localStorage.setItem(storageKey, JSON.stringify(filterValues)); // Save to localStorage
  // console.log(storageKey + ' saved values:', filterValues);
}

// Function to restore filter values from localStorage for a specific table
  function restoreFilterValues(selector, tableInstance, storageKey,title) {
    var pageName = $('#pageName').val();
    $.ajax({
        url: '/opt/hcharts/stx8req/php/getFiltersForScripsInUpDownTrend.php', 
        method: 'GET',
        data:{
          pageName:pageName
        },
        dataType: 'json',
        success: function(data) {
          // console.log("getdata file data",data);
             // Loop through saved filter values and apply to the table
        $.each(data, function (key, value) {
          // Extract the column index from the key (e.g., 'column_0' -> '0')
          var index = key.replace(storageKey+'_column_', '');

          // Restore the input value in the column search input
          $(selector + ' .column-search').eq(index).val(value);

            // Simulate pressing the "Enter" key to trigger custom behavior
          var event = new $.Event('keyup', { key: 'Enter', keyCode: 13 });
          $(selector + ' .column-search').eq(index).trigger(event);
      });

      // After all filters are applied, redraw the table to show filtered results
      tableInstance.draw();
      applyConditionalSearch(tableInstance, title); 
        },
        error: function(xhr, status, error) {
            
        }
    });
    

  }


// Clear filters for both uptrend and downtrend tables
$('#clear-filters').on('click', function () {
  // Clear all the search inputs for both tables
  ['#bar1', '#bar2'].forEach(function (selector) {
      var storageKey = (selector === "#bar1") ? "uptrend-table-filters" : "downtrend-table-filters";
      var title = (selector === "#bar1") ? "Scrips in Uptrend" : "Scrips in Downtrend";
      
      // Clear all the search inputs
      $(selector + ' thead input').each(function () {
          $(this).val(''); // Empty the input field
      });

      // Clear saved filters from localStorage
      // localStorage.removeItem(storageKey);

      // Reset the DataTable search and redraw
      var tableInstance = $(selector).DataTable();
      tableInstance.columns().search('').draw();
      savemutiplestrikes();
      checktoSaveFilters = true;
      applyConditionalSearch(tableInstance, title); 
  });
  
 
});


  function renderButtons() {
    $('#buttons').empty();
    $.fn.dataTable.ext.errMode = 'none';
  
    // Check each table and render buttons only once for available table
    const availableTables = allTables.filter(Boolean);
  
    if (availableTables.length === 0) return; // no tables to attach buttons to
  
    // Use the first available table to create and attach buttons
    const tableInstance = availableTables[0];
  
    new $.fn.dataTable.Buttons(tableInstance, {
      buttons: [{
        extend: 'excel',
        exportOptions: {
          orthogonal: 'export',
          columns: ':visible',
          rows: function (idx, data, node) {
            return tableInstance.rows({ filter: 'applied' }).indexes().toArray().indexOf(idx) !== -1;
          }
        },
        filename: filenameval,
        text: '<i class="fa-solid fa-file-excel"></i>',
        className: 'mdl-button mdl-js-button mdl-button--raised mdl-button--accent mdl-js-ripple-effect small-mdl-button',
        titleAttr: 'Download Excel',
        action: function () {
          generateExcel();
        }
      }, {
        extend: 'csv',
        className: 'custom-button',
        exportOptions: {
          orthogonal: 'export',
          columns: ':visible',
          rows: function (idx, data, node) {
            return tableInstance.rows({ filter: 'applied' }).indexes().toArray().indexOf(idx) !== -1;
          }
        },
        customize: function (csv) {
          let dayvalue = getDayValue(btnclicked);
          let appendedCsv = "";
  
          if (allTables[0]) appendedCsv += addUptrendDataToCsv(dayvalue) + '\n\n';
          if (allTables[1]) appendedCsv += addDowntrendDataToCsv(dayvalue);
  
          return appendedCsv;
        },
        filename: function () {
          return filenameval;
        },
        text: '<i class="fa-solid fa-file-csv"></i>',
        className: 'mdl-button mdl-js-button mdl-button--raised mdl-button--accent mdl-js-ripple-effect small-mdl-button',
        titleAttr: 'Download CSV'
      }]
    }).container().appendTo($('#buttons'));
  }
  
  // Function to get the day value based on the clicked button
  function getDayValue(btnclicked) {
    switch (btnclicked) {
      case 'day1':
        return '1 Day';
      case 'day3':
        return '3 Days';
      case 'day7':
        return '7 Days';
      default:
        return '15 Days';
    }
  }
  
  // Add custom header for the CSV
  function addCustomCsvHeader(dayvalue) {
    let bullishbearish = dataArrays[2];
    let header = `Bullish Count: ${bullishbearish[0].bullish}  Last updated: ${bullishbearish[0].lastupdated}\n`;
    header += '           Scrips in Uptrend\n';
    let headings = ['Rank', 'Symbol', 'Price', `Chg % (Since Open)`, `Chg % (${dayvalue})`, 'Max High', 'Dist from High(%)', 'OI', 'OI Change(%)', 'Buildup', 'TrendScore'];
    return header + headings.join(',') + '\n';
  }
  
// Add Downtrend data for CSV
function addDowntrendDataToCsv(dayvalue) {
  let bearish = dataArrays[2][0].bearish;
  let header = `                                                                    Bearish Count: ${bearish}\n                                                                Scrips in Downtrend\n`;
  let headings2 = ['Rank', 'Symbol', 'Price', `Chg % (Since Open)`, `Chg % (${dayvalue})`, 'Min Low', 'Dist from Low(%)', 'OI', 'OI Change(%)', 'Buildup', 'TrendScore'];
  
  // Fetch only filtered data
  let filteredData = allTables[1].rows({ filter: 'applied' }).data().toArray();
  
  
  let rows = filteredData.map(item => {
    let symbolText = decodeHtmlEntities(item.symbol)
      .replace(/<\/?[^>]+(>|$)/g, "") // Remove any remaining HTML tags
      .replace(/show_chart/g, "") // Remove specific text like 'show_chart'
      .trim(); // Trim any extra whitespace

      // Clean buildup value (e.g., extract "SC" from span)
      let buildupText = item.buildup
      ? decodeHtmlEntitiesBuildup(item.buildup).replace(/<\/?[^>]+(>|$)/g, '').trim()
      : '';

    return [
      item.Sno, symbolText, item.price, item.price_change_Pct_today || '', item.priceChg_Pct,
      item.min_plow, item.dist_from_low_Pct, item.oi_change, item.oi_change_Pct || '',
      buildupText, item.TrendScore || ''
    ].join(',');
  }).join('\n');
  
  return header + headings2.join(',') + '\n' + rows;
}

// Add Uptrend data for CSV
function addUptrendDataToCsv(dayvalue) {
  let bullishbearish = dataArrays[2][0];
  let header = `                                                                 Bullish Count: ${bullishbearish.bullish}    Last updated: ${bullishbearish.lastupdated}\n                                                                            Scrips in Uptrend\n`;
  let headings = ['Rank', 'Symbol', 'Price', `Chg % (Since Open)`, `Chg % (${dayvalue})`, 'Max High', 'Dist from High(%)', 'OI', 'OI Change(%)', 'Buildup', 'TrendScore'];
  
  // Fetch only filtered data
  let filteredData = allTables[0].rows({ filter: 'applied' }).data().toArray();
  


  let rows = filteredData.map(item => {
    
  let symbolText = decodeHtmlEntities(item.symbol)
  .replace(/<\/?[^>]+(>|$)/g, "") // Remove any remaining HTML tags
  .replace(/show_chart/g, "") // Remove specific text like 'show_chart'
  .trim(); // Trim any extra whitespace

  // Clean buildup value (e.g., extract "SC" from span)
  let buildupText = item.buildup
  ? decodeHtmlEntitiesBuildup(item.buildup).replace(/<\/?[^>]+(>|$)/g, '').trim()
  : '';

    return [
      item.Sno, symbolText, item.price, item.price_change_Pct_today || '', item.priceChg_Pct,
      item.max_phigh, item.dist_from_high_Pct, item.oi_change, item.oi_change_Pct || '',
      buildupText, item.TrendScore || ''
    ].join(',');
  }).join('\n');
  
  return header + headings.join(',') + '\n' + rows;
}


  async function generateExcel() {
    const workbook = new ExcelJS.Workbook();
    const sheet1 = workbook.addWorksheet('Scrips in Uptrend');
    const sheet2 = workbook.addWorksheet('Scrips in Downtrend');
    
    let dayvalue = getDayValue(btnclicked);
    let bullishbearish = dataArrays[2];
  
    sheet1.addRow([`                                                                Bullish Count: ${bullishbearish[0].bullish}             Last updated: ${bullishbearish[0].lastupdated}`]);
    sheet1.addRow(['                                                              Scrips in Uptrend']);
    sheet2.addRow([`                                                                Bearish Count: ${bullishbearish[0].bearish}              Last updated: ${bullishbearish[0].lastupdated}`]);
    sheet2.addRow(['                                                               Scrips in Downtrend']);
  
    // Add headers
    let headings1 = ['Rank', 'Symbol', 'Price', `Chg % (Since Open)`, `Chg % (${dayvalue})`, 'Max High', 'Dist from High(%)', 'OI', 'OI Change(%)', 'Buildup', 'TrendScore'];
    let headings2 = ['Rank', 'Symbol', 'Price', `Chg % (Since Open)`, `Chg % (${dayvalue})`, 'Min Low', 'Dist from Low(%)', 'OI', 'OI Change(%)', 'Buildup', 'TrendScore'];
    sheet1.addRow(headings1);
    sheet2.addRow(headings2);
  
    // Get filtered data (only visible rows)
    let uptrendVisibleData = (allTables[0]) ? allTables[0].rows({ filter: 'applied' }).data().toArray() : [];
    let downtrendVisibleData = (allTables[1])  ?  allTables[1].rows({ filter: 'applied' }).data().toArray() :  [];
  
    // Add filtered data to Excel sheets
    addExcelData(sheet1, uptrendVisibleData, 'uptrend');
    addExcelData(sheet2, downtrendVisibleData, 'downtrend');
  
    // Generate and download the Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filenameval + '.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  
  // Helper function to format numbers
function formatNumberWithDigits(value) {
  if (typeof value === 'number') {
    // Format the number as needed, e.g., with a specific number of decimal places
    return value.toFixed(2);
  }
  return value; // Return the value as is if it's not a number
}

  // Helper function to decode HTML entities
function decodeHtmlEntitiesBuildup(text) {
  let textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}
 // Helper function to add data to Excel
function addExcelData(sheet, data, type) {

  if (!Array.isArray(data) || data.length === 0) {
    // Optionally add a message row or just return silently
    sheet.addRow([`                                                        No ${type} data available`]);
    return;
  }

  data.forEach(item => {
    // Clean and decode symbol text
    let symbolText = decodeHtmlEntities(item.symbol)
      .replace(/<\/?[^>]+(>|$)/g, "") // Remove any remaining HTML tags
      .replace(/show_chart/g, "") // Remove specific text like 'show_chart'
      .trim(); // Trim any extra whitespace

      // Clean buildup value (e.g., extract "SC" from span)
      let buildupText = item.buildup
      ? decodeHtmlEntitiesBuildup(item.buildup).replace(/<\/?[^>]+(>|$)/g, '').trim()
      : '';


    // Prepare row data with appropriate formatting
    let row = [
      item.Sno, 
      symbolText, // Use the cleaned symbol text
      formatNumberWithDigits(item.price), 
      item.price_change_Pct_today || '', 
      item.priceChg_Pct,
      type === 'uptrend' ? item.max_phigh : item.min_plow,
      type === 'uptrend' ? item.dist_from_high_Pct : item.dist_from_low_Pct,
      item.oi_change, 
      item.oi_change_Pct || '', 
      buildupText, 
      item.TrendScore || ''
    ];

    // Add row to the sheet
    let excelRow = sheet.addRow(row);

    // Format cells based on data type
    excelRow.eachCell((cell, colNumber) => {
      if (typeof cell.value === 'number') {
        // Format as number with specific precision if needed
        cell.numFmt = '0.00'; // Example: format as decimal with 2 places
      } else {
        // Format as text for non-numeric cells
        cell.numFmt = '@'; // Format as text
      }
    });
  });

  // Set font size to 11 for all cells
  sheet.eachRow({ includeEmpty: true }, row => {
    row.eachCell({ includeEmpty: true }, cell => {
      cell.font = { size: 11 };
    });
  });
}

function decodeHtmlEntities(str) {
  let txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}


  
      function GetFormattedDate(dateString) {
        // Convert month name to month number
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        // Extract components from the dateString
        const dateParts = dateString.split(" ");
        const day = dateParts[0].split("-")[0];
        const month = monthNames.indexOf(dateParts[0].split("-")[1]) + 1;
        const year = dateParts[0].split("-")[2];
    
        // Ensure month is two digits
        const monthString = month < 10 ? "0" + month : month;
    
        // Return formatted date
        return `${day}_${monthString}_${year}`;
    }

    function GetFormattedDateForURL(dateString) {
      // Convert month name to month number
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
      // Extract components from the dateString
      const dateParts = dateString.split(" ");
      const day = dateParts[0].split("-")[0];
      const month = monthNames.indexOf(dateParts[0].split("-")[1]) + 1;
      const year = dateParts[0].split("-")[2];
  
      // Ensure month is two digits
      const monthString = month < 10 ? "0" + month : month;
  
      // Return formatted date
      return `${year}-${monthString}-${day}`;
  }

  function formatExpiryDate(symbolDate) {
    // Extract the last part after the last hyphen
    const parts = symbolDate.split('-');
    const datePart = parts[parts.length - 1];


    return datePart;
}
      
  // var root_url = "/opt/api/dashboard/php/";
  function get_current_page_function() {
    TopTenTable();
  //  $('#loader').show();
    
  //  var calldata = getcallData(0);
    // return calldata;
  }

  function handleMouseEnter(event) {
    // Check if the mouse is over the show_chart icon or its container
    if (event.target.closest('.chartIcon')) {
        return; // Skip function if the mouse is over the chartIcon or its container
    }
    
    // Remove the show_chart icon if it is inside the cell and execute the function
    const cell = event.currentTarget; // The <td> element
    const chartIcon = cell.querySelector('.chartIcon');
    if (chartIcon) {
        chartIcon.remove(); // Remove the show_chart icon
    }
    
    openMiniChart(event); // Execute the openMiniChart function
}



  
 
  $("#theme-toggle").click(function () {
    if ($("body").hasClass("dark-theme")) {
      $("body").removeClass("dark-theme");
      localStorage.setItem("isDarkMode", false);
      $("body").css("background-color", "#FFFFFF");
      isDarkMode = false;
     
    } else {
      $("body").addClass("dark-theme");
      $("body").css("background-color", "#151515");


      localStorage.setItem("isDarkMode", true);
      isDarkMode = true;
      
    }
  });



  // console.log(buttons1);
  // ----------------End Of Trending Js---------------
  setInterval(function () {
    var rdDataType = $("#rdDataType").val();
    //console.log(rdDataType, "rdDataType");
    if (rdDataType == "latest") {
      // TrendingTable2();
      // SymbolFutureChart(1);
      // table.ajax.reload();
      // calldata = getcallData(1);
      TopTenTable();
    }
  }, 40000);
});


