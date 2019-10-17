HOOKS = ["https://discordapp.com/api/webhooks/625193379147415582/SwEX_X5Z0PbnDNTGtLrtK6OMluC4cLJ4NGvrRLfajeL7JRG1w9XajRbA5H6950mEp-f3",
        "https://discordapp.com/api/webhooks/625193747231014982/d_0y8M_e2P7oJe_tjRLiQdEYpR8i7iWVzZOsNVRpdiOMO9M6TQjjPUTPCmdr8eg8DCsT",
        "https://discordapp.com/api/webhooks/625193887010521109/8btOPmwAy4ONwrJPvzQOuqSA-TaOA2krTxjkDiulVdk838o9HRAAyrcQ1qb4ovcBNOrY",
        "https://discordapp.com/api/webhooks/625194015549292565/K1oH-HwPQ32t_s7kogABZMkwEZotAsewhg7MG93uYnCaxTIba_bMWkg51LoRXw5c2yVn",
        "https://discordapp.com/api/webhooks/626993970899189760/LdN8i-DLrlLG2Ntg48K_OdXYD4YFbbezpch3T1Jrlm11xL4_LhEjT3Bth64LRUJG0Mje",
        "https://discordapp.com/api/webhooks/633320995008151575/4FMi-X-G0YN3X6S47AJGNrt-UerjKzkzYPjfZu8FpmzPo9CK48Y2BI8Dl_bP7JHceUQp"]

NAMES = ["Everybody",
         "Cryusade",
         "Eristocracy",
         "Chronspiracy",
        "Codeman and IMPP show"]

DRIVE_URL = "https://drive.google.com/uc?export=download&id="

var message = "No result yet."

/**
Dial 0 for everyone.
1 for Cryusade
2 for Eristocracy
3 for Chronspiracy
4 for the Battleship channel/Jackasses
5 for the Tower
This is how it goes even if "everyone" doesn't make sense.
*/

function send(message, destination) {
  send(message, destination, "Announcements");
}

function send(message, destination, name) {
  // Make a POST request with a JSON payload.
  var data = {
  "username": name,
  "content": message
  };
  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    // Convert the JavaScript object to a JSON string.
    'payload' : JSON.stringify(data)
  };
  UrlFetchApp.fetch(HOOKS[destination], options);
  Logger.log(message);
}

function sendImage(image, message, destination, name) {
  Logger.log(image);
  var data = {
  "username": name,
  "content": message,
  "embeds": [{
    "image": {
      "url": image
    }
  }]
  };
  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    // Convert the JavaScript object to a JSON string.
    'payload' : JSON.stringify(data)
  };
//  UrlFetchApp.fetch(HOOKS[destination], options);
  Logger.log(options);
  Logger.log(message);
}

function driveSend(filename, message) {
  var files = DriveApp.getFilesByName(filename);
  if(files.hasNext()){
    var file = files.next()
    send(message+"\n"+DRIVE_URL+file.getId(), 4, "Announcer");
  }
}

function test() {
  send("This is yet another test run.",0);
  daily();
}

function doGet(e) {
  if(typeof e.parameter.test !== "undefined"){
    checkCode(e.parameter.test, e.parameter.destination);
  }
  return HtmlService.createTemplateFromFile("Week1.html").evaluate();
}

// From https://stackoverflow.com/a/26271988

function prob(n){
  return Math.random() <= n;
}

function daily() {
  send("Measurement (Daily) - last poster gets a point.",5);
  addMeasurement();
  Logger.log("Daily fired.");
}

function hourly() {
  if(prob(1.0/12.0)){
    send("Measurement (Random) - last poster gets a point.",5);
    addMeasurement();
    Logger.log("Hourly chosen.");
  }
  else{
    Logger.log("Hourly not chosen.");
  }
}

function getScores() {
  var data = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1BZYB3tvqrVfwKceXdJZMhdSI_kEOQtn1B5NGJjSfLVA/edit#gid=0").getSheets()[0].getDataRange().getValues();
  var result = [0, 0, 0];
  for(var i=0; i<3; i++){
    result[i] = data[i][0];
  }
  return result;
}

function setScore(value, destination) {
  var sheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1BZYB3tvqrVfwKceXdJZMhdSI_kEOQtn1B5NGJjSfLVA/edit#gid=0").getSheets()[0];
  sheet.getRange(destination, 1).setValue(value);
}

// Functions below this line are specific to a given week
// ------------------------------------------------------

function addMeasurement() {
  var sheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/18AHHVxc5YHf3pWKFcumS0Ut3vYjAqk96EVGUS4Rrl6A/edit").getSheets()[0];
  var date = new Date();
  sheet.appendRow([date.toLocaleString(),0,1]);
}

function checkMeasurement() {
  var data = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/18AHHVxc5YHf3pWKFcumS0Ut3vYjAqk96EVGUS4Rrl6A/edit").getSheets()[0].getDataRange().getValues();
  var scores = [0,0,0,0,0];
  var number = [0,0,0,0,0];
  for(var i = 0; i<data.length; i++){
    scores[data[i][1]] += data[i][2];
    number[data[i][1]] += 1;
  }
  var results = "**Current scores:** \n";
  for(var i = 1; i<5; i++){
    results+="\nThe "+NAMES[i]+" has **"+scores[i]+"** point(s)";
    if(number[i]!=scores[i]){
      results+=", including **"+(scores[i]-number[i])+"** bonus point(s).";
    }
  }
  results+="\n"+scores[0]+" point(s) have not yet been evaluated.";
  if(number[0]!=scores[0]){
      results+=" (including "+(scores[0]-number[0])+" bonus point(s).)";
    }
  send(results, 0);
}

START = new Date("10/12/2019");

function getDay() {
  string = (((new Date())-START)/(1000 * 3600 * 24)+1)+"";
  return string.substring(0,1);
}

function first() {
  day = getDay();
  driveSend(day+"a.png","First image for day "+day);
}

function second() {
  day = getDay();
  driveSend(day+"b.png","Second image for day "+day);
}
