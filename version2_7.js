var bounds = {
  left: 90,
  right: 980,
  top: 50 + 130 + 30,
  bottom: 490 + 130 + 30
};
var CAPTION_TEXT = 'The chart below shows the progression of officially-ratified world records in the running events of track and field since 1965.\nExplore different events to visualize how world records times have changed during the past decades and learn about record-breaking performances.';
var tableDict = {}
var recordData = {};
var EVENT_DICT = {'MA100M': "Men's 100 Meters", 'MA200M': "Men's 200 Meters", 'MA400M': "Men's 400 Meters", 'MA800M': "Men's 800 Meters",
  'MA1500M': "Men's 1500 Meters", 'MA5000M': "Men's 5000 Meters", 'MA10000M': "Men's 10,000 Meters", 'FE100M': "Women's 100 Meters", 
  'FE200M': "Women's 200 Meters", 'FE400M': "Women's 400 Meters", 'FE800M': "Women's 800 Meters", 'FE1500M': "Women's 1500 Meters",
  'FE5000M': "Women's 5000 Meters", 'FE10000M': "Women's 10,000 Meters"};
var currDataPoints = [];
var eventTimeMinMax = {'MA100M': [9, 10], 'MA200M': [19, 20], 'MA400M': [42.5, 44.5], 'MA800M': [100, 105], 'MA1500M': [200, 220], 
  'MA5000M': [720, 840], 'MA10000M': [1560, 1680], 'FE100M': [10, 11.4], 'FE200M': [21, 23], 'FE400M': [47, 51], 'FE800M': [112, 122],
  'FE1500M': [220, 260], 'FE5000M': [840, 960], 'FE10000M': [1740, 1950]};
var EVENT_GAPS = {'MA100M': [0.2, 0.05], 'MA200M': [0.2, 0.05], 'MA400M': [0.5, 0.1], 'MA800M': [1, 0.2], 'MA1500M': [5, 1], 
  'MA5000M': [30, 5], 'MA10000M': [30, 5], 'FE100M': [0.2, 0.05], 'FE200M': [0.5, 0.1], 'FE400M': [1, 0.2], 'FE800M': [2, 0.5],
  'FE1500M': [5, 1], 'FE5000M': [30, 5], 'FE10000M': [30, 5]};
var currentEvent = 'MA100M';
var buttons = [];
var MEN_BUTTON_NAMES_DICT = {'MA100M': "100 Meters", 'MA200M': "200 Meters", 'MA400M': "400 Meters", 'MA800M': "800 Meters",
  'MA1500M': "1500 Meters", 'MA5000M': "5000 Meters", 'MA10000M': "10,000 Meters"};
var WOMEN_BUTTON_NAMES_DICT = {'FE100M': "100 Meters", 'FE200M': "200 Meters", 'FE400M': "400 Meters", 'FE800M': "800 Meters",
  'FE1500M': "1500 Meters", 'FE5000M': "5000 Meters", 'FE10000M': "10,000 Meters"};
var buttons = {};
var countryCounts = {};
var countryDivs = {};
var hoveredBar = null;
var COUNTRY_NAMES_DICT = { 'USA': 'USA',  'JAM': 'Jamaica', 'ITA': 'Italy', 'CAN': 'Canada', 
  'ZAF': 'South Africa', 'DEN': 'Denmark', 'KEN': 'Kenya', 'CUB': 'Cuba', 'GBR': 'Great Britain', 'AUS': 'Australia', 
  'MAR': 'Morocco', 'ETH': 'Ethiopia', 'FIN': 'Finland', 'BEL': 'Belgium', 'NZL': 'New Zealand', 'POR': 'Portugal', 
  'MEX': 'Mexico', 'FRG': 'West Germany', 'GDR': 'East Germany', 'POL': 'Poland', 'TCH': 'Czechoslovakia', 
  'URS': 'Soviet Union', 'YUG': 'Yugoslavia', 'BUL': 'Bulgaria', 'HOL': 'Netherlands', 'CHN': 'China', 'NOR': 'Norway', 
  'TUR': 'Turkey', 'TAN': 'Tanzania', 'ALG': 'Algeria' };
var countryFlags = {};
var COUNTRY_COLORS_DICT = { 'USA': '#3c3b6e',  'JAM': '#fed100', 'ITA': '#00b458', 'CAN': '#ff0000', 
  'ZAF': '#007a4d', 'DEN': '#73081d', 'KEN': '#003400', 'CUB': '#002a8f', 'GBR': '#cf142b', 'AUS': '#ff4444', 
  'MAR': '#006233', 'ETH': '#fcdd09', 'FIN': '#003580', 'BEL': '#000000', 'NZL': '#0041e2', 'POR': '#ffff00', 
  'MEX': '#dbad6c', 'FRG': '#dd0000', 'GDR': '#ffce00', 'POL': '#d4213d', 'TCH': '#1a64b5', 
  'URS': '#c7a306', 'YUG': '#00286a', 'BUL': '#00966e', 'HOL': '#fe9900', 'CHN': '#f15f4b', 'NOR': '#3568b8', 
  'TUR': '#730b12', 'TAN': '#00a3dd', 'ALG': '#14ad64' };
var genderSelected = 'Men'; // 0 = Men, 1 = Women
var eventSelected = '100 Meters';
var eventToggleCoords = {};
var genderToggleCoords = {};
var EVENT_CODE_DICT = {'Men': {"100 Meters": 'MA100M', "200 Meters": 'MA200M', "400 Meters": 'MA400M', "800 Meters": 'MA800M',
  "1500 Meters": 'MA1500M', "5000 Meters": 'MA5000M', "10,000 Meters": 'MA10000M'}, 'Women': {"100 Meters": 'FE100M', 
  "200 Meters": 'FE200M', "400 Meters": 'FE400M', "800 Meters": 'FE800M', "1500 Meters": 'FE1500M', "5000 Meters": 'FE5000M', "10,000 Meters": 'FE10000M'}};
var roboto;
var robotoThin;
var robotoBold;

function preload() {
  Object.keys(EVENT_DICT).forEach(function(eventCode) {
    tableDict[eventCode] = loadTable("data/" + eventCode + ".csv", "header");
  });
  Object.keys(COUNTRY_NAMES_DICT).forEach(function(countryCode) {
    countryFlags[countryCode] = loadImage('img/' + countryCode + '.png');
  });
  roboto = loadFont('font/Roboto/Roboto-Regular.ttf');
  robotoThin = loadFont('font/Roboto/Roboto-Thin.ttf');
  robotoBold = loadFont('font/Roboto/Roboto-Medium.ttf');
}

function setup() {
  textFont(roboto);
  createCanvas(windowWidth, windowHeight);
  importData();
  var mensEventCodes = Object.keys(MEN_BUTTON_NAMES_DICT);
  var xRight = width - 50;
  background(255);
  drawPlot();
  drawCountries();
  drawHeader();
  drawCurrRecordHolder();
  drawEventSelection();
}

function drawHeader() {
  textAlign(CENTER, CENTER);
  fill(0);
  textSize(30);
  text('A Visual History of Track & Field World Records', width/2, 38 + 8);
  //textAlign(RIGHT, CENTER);
  textSize(14);
  text(CAPTION_TEXT, width/2, 80 + 10);
}

function drawEventSelection() {
  textSize(16);
      textAlign(LEFT, CENTER);
  var mensEventCodes = Object.keys(MEN_BUTTON_NAMES_DICT);
  var selectionWidth = 907;
  var leftXSoFar = width/2 - selectionWidth/2;
  rectMode(CORNER);

  var xMeasure = 0;
  var men = "Men";
  var menWidth = textWidth(men);
  if (genderSelected == men) {
    fill('#E0E0E0');
    textFont(robotoBold);
  } else {
    fill(255);
    textFont(roboto);
  }
  stroke('#E0E0E0');
  rect(leftXSoFar, bounds.top - 50 - 10, menWidth + 22, 32);
  genderToggleCoords[men] = [leftXSoFar, bounds.top - 50 - 10, leftXSoFar + menWidth + 22, bounds.top -50 + 32];
  fill(0);
  noStroke();
  text(men, leftXSoFar + 11, bounds.top -50 + 15 - 10);
  var women = "Women";
  var womenWidth = textWidth(women);
  leftXSoFar += menWidth + 22;
  xMeasure += menWidth + 22;
  if (genderSelected == women) {
    fill('#E0E0E0');
    textFont(robotoBold);
  } else {
    fill(255);
    textFont(roboto);
  }
  stroke('#E0E0E0');

  rect(leftXSoFar, bounds.top - 50 - 10, womenWidth + 22, 32);
  genderToggleCoords[women] = [leftXSoFar, bounds.top - 50 - 10, leftXSoFar + womenWidth + 22, bounds.top - 50 + 32];
  fill(0);
  noStroke();
  text(women, leftXSoFar + 11, bounds.top - 50 + 15 - 10);
  leftXSoFar += womenWidth + 22 + 30;
  xMeasure += womenWidth + 22 + 25;
  for (var i=0; i<mensEventCodes.length; i++) {
    var label = MEN_BUTTON_NAMES_DICT[mensEventCodes[i]];
    var labelWidth = textWidth(label);
    if (eventSelected == label) {
      fill('#E0E0E0');
      textFont(robotoBold);
    } else {
      fill(255);
      textFont(roboto);
    }
    stroke('#E0E0E0');
    rect(leftXSoFar, bounds.top - 50 - 10, labelWidth + 22, 32);
    eventToggleCoords[label] = [leftXSoFar, bounds.top - 50 - 10, leftXSoFar + labelWidth + 22, bounds.top - 50 + 32];
    fill(0);
    noStroke();
    text(label, leftXSoFar + 11, bounds.top - 50 + 15 - 10);
    leftXSoFar += labelWidth + 22;
    xMeasure += labelWidth + 22;
  }
  textFont(roboto);
}

function mouseClicked() {
  Object.keys(genderToggleCoords).forEach(function(gender) {
    var coords = genderToggleCoords[gender];
    if (mouseX >= coords[0] && mouseX <= coords[2] && mouseY >= coords[1] && mouseY <= coords[3]) {
      if (gender != genderSelected) {
        genderSelected = gender;
        updateCurrentEvent();
        background(255);
        drawPlot();
        drawCountries();
        drawHeader();
        drawCurrRecordHolder();
        drawEventSelection();
      }
    }
  });
  Object.keys(eventToggleCoords).forEach(function(event) {
    var coords = eventToggleCoords[event];
    if (mouseX >= coords[0] && mouseX <= coords[2] && mouseY >= coords[1] && mouseY <= coords[3]) {
      if (event != eventSelected) {
        eventSelected = event;
        updateCurrentEvent();
        background(255);
        drawPlot();
        drawCountries();
        drawHeader();
        drawCurrRecordHolder();
        drawEventSelection();
      } 
    }
  });
}

function updateCurrentEvent() {
  currentEvent = EVENT_CODE_DICT[genderSelected][eventSelected];
}

function importData() {
  Object.keys(tableDict).forEach(function(eventCode) {
    var table = tableDict[eventCode];
    var rows = table.getRows();
    var records = [];
    var countryCount = {};
    for (var r = 0; r < rows.length - 2; r++) {
      var row = rows[r];
      var time = row.get('Time');
      var athlete = row.get('Athlete');
      var nationality = row.get('Nationality');
      if (nationality in countryCount) {
        countryCount[nationality] += 1;
      } else {
        countryCount[nationality] = 1;
      }
      var location = row.get('Location');
      var date = new Date(row.get('Date'));
      var endDate = new Date();
      if (r !== rows.length - 3) {
        endDate = new Date(rows[r+1].get('Date'));
      }
      records.push(new WorldRecord(time, athlete, nationality, location, date, endDate));
    }
    countryCounts[eventCode] = countryCount;
    recordData[eventCode] = new EventHistory(eventCode, records);
  });  
}

function mouseMoved() {
  var hovering = false;
  currDataPoints.forEach(function(dataBar) {
    if (mouseX >= dataBar.x && mouseX <= dataBar.endX && abs(mouseY - dataBar.y) <= 4) {
      hovering = true;
      if (hoveredBar != dataBar) {
        if (hoveredBar != null) {
          background(255);
          drawPlot();
          drawHeader()
          drawCurrRecordHolder();
          drawEventSelection();
          drawCountries();
        }
        hoveredBar = dataBar;
        var boxCenterX = dataBar.x + (dataBar.endX - dataBar.x)/2;
        var boxCenterY = dataBar.y + 55;
        textSize(14);
        var record = hoveredBar.record;
        var timeString = record.time.getTimeString();
        var athlete = record.athlete;
        var dateString = formatDate(record.date);
        var location = record.location
        var locWidth = textWidth(location);
        var athleteWidth = textWidth(athlete);
        var boxWidth = 150;
        var boxHeight = 85;
        if (locWidth > boxWidth - 20) {
          boxWidth = locWidth + 20;
        } else if (athleteWidth > boxWidth - 20) {
          boxWidth = athleteWidth + 20;
        }
        rectMode(CENTER);
        fill(255);
        stroke('#505050');
        rect(boxCenterX, boxCenterY, boxWidth, boxHeight);
        fill(0);
        noStroke();
        textAlign(LEFT, TOP);
        textSize(20);
        text(timeString, boxCenterX - boxWidth/2 + 10, boxCenterY - boxHeight/2 + 5);
        textFont(roboto);
        textSize(14);
        text(athlete, boxCenterX - boxWidth/2 + 10, boxCenterY - 14+2);
        text(dateString, boxCenterX - boxWidth/2 + 10, boxCenterY + 1+2);
        text(location, boxCenterX - boxWidth/2 + 10, boxCenterY + 17+2);
        var countryFlag = countryFlags[record.nationality];
        var factor = 20 / countryFlag.height;
        var imgWidth = countryFlag.width * factor;
        image(countryFlags[record.nationality], boxCenterX + boxWidth/2 - 8 - imgWidth, boxCenterY - boxHeight/2 + 5, imgWidth, 20);
      }
    }
  });
  if (!hovering && hoveredBar != null) {
    hoveredBar = null;
    background(255);
    drawPlot();
    drawHeader();
    drawCurrRecordHolder();
    drawEventSelection();
    drawCountries();
  }
}

function formatDate(date) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return monthNames[monthIndex] + ' ' + day +  ', ' + year;
}

function drawPlot() {
  drawAxes();
  textSize(12);
  currDataPoints = [];
  fill(255);
  stroke(0);
  rectMode(CORNERS);
  var eventHistory = recordData[currentEvent];
  var date1965 = new Date('01/01/1965');
  var dateNow = new Date();
  eventHistory.records.forEach(function(record) {
    var x = map(record.date, date1965, dateNow, bounds.left, bounds.right);
    var endX = map(record.endDate, date1965, dateNow, bounds.left, bounds.right);
    var y = map(record.time.getSeconds(), eventTimeMinMax[currentEvent][0], eventTimeMinMax[currentEvent][1], bounds.bottom, bounds.top);
    var dataPoint = new DataBar(record, x, y, endX);
    currDataPoints.push(dataPoint);
    dataPoint.display();
  });  
  
}

function drawAxes() {
  noStroke();
  textSize(17);
  textAlign(CENTER, BOTTOM);
  var date1965 = new Date('01/01/1965');
  var dateNow = new Date();
  for (var year = 1965; year < 2017; year += 5) {
    var yearDate = new Date('01/01/' + year);
    var x = map(yearDate, date1965, dateNow, bounds.left + 10, bounds.right);
    textAlign(CENTER, TOP);
    fill(0);
    text(year, x, bounds.bottom + 5);
    stroke('#E0E0E0');
    line(x, bounds.bottom, x, bounds.top);
  }
  var yBottom = eventTimeMinMax[currentEvent][0];
  var yTop = eventTimeMinMax[currentEvent][1];
  var majorGap = EVENT_GAPS[currentEvent][0];
  var minorGap = EVENT_GAPS[currentEvent][1];
  for (var time = yBottom; time.toFixed(1) <= yTop; time += minorGap) {
    textAlign(RIGHT, CENTER);
    fill(0);
    var y = map(time, yBottom, yTop, bounds.bottom - 10, bounds.top + 10);
    stroke('#E0E0E0');
    strokeWeight(0.5);
    if (abs(majorGap - time % majorGap) <= 0.0005 || abs(time % majorGap) <= 0.0005) {
      var timeFromSec = getTimeStringFromSeconds(time);
      if ((timeFromSec + "").indexOf(":") == -1) {
        timeFromSec = timeFromSec.toFixed(1);
      } else {
        time = round(time, 0);
        timeFromSec = getTimeStringFromSeconds(time);
      }
      var timeText = timeFromSec + "";
      if (timeText.indexOf(':') === -1) {
        timeText += ' s';
      }
      text(timeText, bounds.left - 3, y);
      stroke('#C0C0C0');
      strokeWeight(1);
    }
    line(bounds.left, y, bounds.right, y);
  }
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function drawCurrRecordHolder() {
  textAlign(LEFT, TOP);
  textSize(20);
  text('Current Record', bounds.right + 25, bounds.top + 10);
  var record = currDataPoints[currDataPoints.length - 1].record;
  rectMode(CORNERS);
  fill(255);
  stroke('#E0E0E0');
  
  noStroke();
  fill(0);
  textSize(24);
  text(record.time.getTimeString(), bounds.right + 30 + 10, bounds.top + 26 + 10 + 10 - 5);
  textSize(16);
  text(record.athlete, bounds.right + 30 + 10, bounds.top + 26 + 10 + 24 + 9 );
  text(formatDate(record.date), bounds.right + 30 + 10, bounds.top + 26 + 10 + 24 + 5 + 23 );
  text(record.location, bounds.right + 30 + 10, bounds.top + 26 + 10 + 24 + 5 + 23 + 21 );
  var countryFlag = countryFlags[record.nationality];
  var factor = 24 / countryFlag.height;
  var imgWidth = countryFlag.width * factor;
  image(countryFlags[record.nationality], width - 50 - 10 - imgWidth, bounds.top + 26 + 10 + 10 - 5, imgWidth, 24);
}

function drawCountries() {
  var currentCountriesDict = countryCounts[currentEvent]; // TODO move to global
  var sortedCountries = Object.keys(currentCountriesDict).sort(function(a,b){
    return currentCountriesDict[b] - currentCountriesDict[a];
  });

  textAlign(LEFT, TOP);
  textSize(20);
  fill(0);
  text('Records per Country', bounds.right + 25, bounds.top + 150 + 10);
  rectMode(CORNERS);
  stroke(255);
  
  fill(0);
  textSize(16);
  sortedCountries.forEach(function(countryCode, i) {
    rectMode(CORNERS);
    fill(COUNTRY_COLORS_DICT[countryCode]);
    stroke(255);
    rect(bounds.right + 30 + 10, bounds.top + 175 + 10 + i*22 + 10, bounds.right + 30 + 10 + 16, bounds.top + 175 + 10 + i*22 + 16 + 10, 3);
    fill(0);
    noStroke();
    var countryText = COUNTRY_NAMES_DICT[countryCode] + ": " + currentCountriesDict[countryCode];
    var textObj = text(countryText, bounds.right + 30 + 10 + 22, bounds.top + 175 + 10 + i*22 + 10);
    var countryTextWidth = textWidth(countryText);
  });
}

function ElapsedTime(timeStringInit) {
  var timeString = timeStringInit;
  
  this.getTimeString = function() {
    if (timeString.indexOf('0') == 0) {
      return timeString.slice(1, timeString.length);
    }
    return timeString;
  }
  
  this.getSeconds = function() {
    if (timeString.indexOf(":") === -1) {
      return parseFloat(timeString);
    } else {
      var split = timeString.split(":");
      return 60*parseFloat(split[0]) + parseFloat(split[1]);
    }
  }
}

function getTimeStringFromSeconds(seconds) {
  if (seconds < 60) {
    return seconds;
  } else {
    var minutes = Math.floor(seconds / 60);
    var leftSeconds = seconds % 60;
    if (leftSeconds < 10) {
      leftSeconds = "0" + leftSeconds;
    }
    return minutes + ":" + leftSeconds;
  }
}

function EventHistory(eventCode, records) {
  this.eventCode = eventCode;
  this.eventName = EVENT_DICT[eventCode];
  this.records = records;
}

function WorldRecord(time, athlete, nationality, location, date, endDate) {
  this.time = new ElapsedTime(time);
  this.athlete = athlete;
  this.nationality = nationality;
  this.location = location;
  this.date = date;
  this.endDate = endDate;
}

function DataBar(record, x, y, endX) {
  this.record = record;
  this.x = x;
  this.y = y;
  this.endX = endX;
  
  this.display = function() {
    rectMode(CORNERS);
    noStroke();
    var barColor = COUNTRY_COLORS_DICT[this.record.nationality]
    fill(barColor);
    rect(this.x, this.y-5, this.endX, this.y+5, 4);
  };
}