HOOKS = ["https://discordapp.com/api/webhooks/625193379147415582/SwEX_X5Z0PbnDNTGtLrtK6OMluC4cLJ4NGvrRLfajeL7JRG1w9XajRbA5H6950mEp-f3",
        "https://discordapp.com/api/webhooks/625193747231014982/d_0y8M_e2P7oJe_tjRLiQdEYpR8i7iWVzZOsNVRpdiOMO9M6TQjjPUTPCmdr8eg8DCsT",
        "https://discordapp.com/api/webhooks/625193887010521109/8btOPmwAy4ONwrJPvzQOuqSA-TaOA2krTxjkDiulVdk838o9HRAAyrcQ1qb4ovcBNOrY",
        "https://discordapp.com/api/webhooks/625194015549292565/K1oH-HwPQ32t_s7kogABZMkwEZotAsewhg7MG93uYnCaxTIba_bMWkg51LoRXw5c2yVn",
        "https://discordapp.com/api/webhooks/626993970899189760/LdN8i-DLrlLG2Ntg48K_OdXYD4YFbbezpch3T1Jrlm11xL4_LhEjT3Bth64LRUJG0Mje",
        "https://discordapp.com/api/webhooks/633320995008151575/4FMi-X-G0YN3X6S47AJGNrt-UerjKzkzYPjfZu8FpmzPo9CK48Y2BI8Dl_bP7JHceUQp"]

NAMES = ["Everybody",
         "Cryusade",
         "Eristocracy",
         "Chronspiracy"]

DRIVE_URL = "https://drive.google.com/uc?export=download&id="

var message = "No result yet."

/**
Dial 0 for everyone.
1 for Cryusade
2 for Eristocracy
3 for Chronspiracy
4 for the Battleship channel
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
  for(var i = 0; i<24; i++){
    Logger.log(prob(1.0/24.0));
  }
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
  send("Measurement (Daily) - last poster gets a point.");
}

function hourly() {
  if(prob(1.0/24.0)){
    send("Measurement (Random) - last poster gets a point.");
  }
}

// Functions below this line are specific to a given week
// ------------------------------------------------------

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

function checkCode(code, destination) {
  var range = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1XX-nmvd0Efw8RGEpLo0SFoOWpDKwBnyDFfgrRsHSkBI/edit").getSheets()[0].getDataRange();
  var data = range.getValues();
  var lower = code.toLowerCase();
  for(var i = 0; i<data.length; i++) {
    if(data[i][0].toLowerCase() == lower) {
      if(data[i][destination] != 1) {
        scores = getScores();
        send("**"+NAMES[destination]+"** has claimed code **#"+(i+1)+"** and now has **"+(scores[destination-1]+1)+"** points!", 0);
        send("**"+data[i][0]+"** has been claimed.", destination);
        setScore(scores[destination-1]+1, destination);
        data[i][destination] = 1;
        range.setValues(data);
        return;
      }
      else{
        send("Your team has already claimed code #"+(i+1), destination);
        return;
      }
    }
  }
  send("**"+lower+"** is invalid.", destination);
}

function countCode() {
  var range = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1XX-nmvd0Efw8RGEpLo0SFoOWpDKwBnyDFfgrRsHSkBI/edit").getSheets()[0].getDataRange();
  var data = range.getValues();
  send("There are currently **"+data.length+"** codes active.", 0)
}

function battleship() {
  var range = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1pCrCKXG5rPLpx4TsdrDIbM8NPs5h5Ik66cQ_p4SVKzw/edit").getSheets()[0].getDataRange();
  var data = range.getValues();
  var shots = readShots();
  result="Evaluating "+shots.length+" shot(s)";
  for(var i = 0; i<shots.length; i++){
    var shot = shots[i];
    if(data[shot[0]][shot[1]] >= 0){
      if(data[shot[0]][shot[1]] == 0){
        data[shot[0]][shot[1]] = -1;
        result += "\n**"+shot[2]+"** is a **miss**";
      }
      else{
        result += "\n**"+shot[2]+"** is a **hit**";
        data[shot[0]][shot[1]] = -2;
      }
    }
  }
  Logger.log(shots);
  Logger.log(data);
  Logger.log(result);
  range.setValues(data);
  send(result+getMap(data, 4),4,"DRADIS");
  send(getMap(data, 1),1,"DRADIS");
  send(getMap(data, 2),2,"DRADIS");
  send(getMap(data, 3),3,"DRADIS");
}

function readShots() {
  var body = DocumentApp.openByUrl("https://docs.google.com/document/d/1sguJyBx2i8VGvOgVs83HdWg8LubX3iHdcRhoSSIhF_w/edit").getBody();
  var paragraphs = body.getParagraphs();
  var regex = new RegExp("\\w\\d+");
  var result = [];
  for(var i = 0; i<paragraphs.length; i++){
    var text = paragraphs[i].getText();
    if(regex.test(text)){
      var a = "ABCDEFGHIJKLMNOP".indexOf(text.charAt(0));
      var b = text.substring(1)-1;
      result.push([b,a,text]);
      body.removeChild(paragraphs[i]);
    }
  }
  return result;
}

function getMap(data, destination) {
  var result = "```   A B C D E F G H I J K L M N O P";
  var hp = [0,0,0];
  for(var i = 0; i<data.length; i++){
    result += "\n"+(i+1);
    if(i<9){
      result += " ";
    }
    for(var j = 0; j<data[i].length; j++){
      result += " ";
      if(data[i][j] == -2){
        result += "X";
      }
      else if (data[i][j] == -1){
        result += "+";
      }
      else if (destination == 5){
        switch(data[i][j]){
          case 1:
            result += "R";
            break;
          case 2:
            result += "E";
            break;
          case 3:
            result += "C";
            break;
          default:
            result += "·";
        }
      }
      else if (data[i][j] == destination && destination != 0){
        result += "O";
      }
      else{
        result += "·";
      }
      if(data[i][j]>0){
        hp[data[i][j]-1] += 1;
      }
    }
  }
  result+="```";
  for(var i=0; i<3; i++){
    if(destination == i+1 || destination == 5) {
      result+="\n"+NAMES[i+1]+" health: **"+hp[i]+"**";
    }
  }
  return result;
}

function sendChallenge(destination) {
  var position = getScores()[destination-1]; //The one they've just finished, 1 indexed
  var startMessage = "";
  if(position > 0){
    startMessage += "**You have finished Door "+position+"**";
  }
  var next = readRegex(position);
  if(next == null){
    send(startMessage+"\nThat's the last Door for now.",destination);
  }
  else{
    setScore(position+1,destination);
    startMessage += "\n**Beginning Door "+(position+1)+"**";
    var regexArray = readRegex(position);
    var regex = regexArray[0];
    var words = regexArray[1].split(" ");
    evaluate(words,regex,destination,startMessage+"\n");
  }
}

function evaluate(strings,regex,destination,message){
  var re = new RegExp(regex);
  var result = message;
  for(var i=0; i<strings.length; i++){
    string = strings[i].toLowerCase();
    if(re.test(string)){
      result += string+" **passes** this door.\n";
      message = string+" passes this door.";
    }
    else{
      result += string+" **does not pass** this door.\n";
      message = string+" does not pass this door.";
    }
  }
  send(result.substring(0, result.length-1),destination);
}

function readRegex(i) {
  var body = DocumentApp.openByUrl("https://docs.google.com/document/d/1KDnIQh_W3xjhrwpyUJ47Rgs0o5Ju1wFhCEvwdQnQANI/edit").getBody();
  var paragraphs = body.getParagraphs();
  if(paragraphs.length < i*2+1) {
    return null;
  }
  return [paragraphs[i*2].getText(),paragraphs[i*2+1].getText()];
}
