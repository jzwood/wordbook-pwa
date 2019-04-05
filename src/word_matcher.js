var dictionary;
var reversedDictionary;
var min = 0;
var max;
var point;

//immediately caches word list array in var dictionary
//defines regex functions used below
window.onload = function main(){
  //regex endsWith function
  String.prototype.endsWith = function(str)
  {return (this.match(str+"$")==str);}
  //regex startsWith function
  String.prototype.startsWith = function(str)
  {return (this.match("^"+str)==str);}
  dictionary = getWordList();
  max = dictionary.length-1;
  point = Math.ceil((min+max)/2);

  tempDictionary = [];
  for(var i=0; i<= max; i++){
    tempDictionary.push(reverse(dictionary[i]));
  }
  reversedDictionary = tempDictionary.sort();
}

//reverses string
function reverse(letters){
  var reversed="";
  for(var i=letters.length-1;i>=0;i--){
    reversed += letters[i];
  }
  return reversed;
}

//searches dictionary array for words that match user criteria
function matchWords(){
  var front = document.getElementById("start").value.toLowerCase().trim(),
  back = document.getElementById("end").value.toLowerCase().trim(),
  numLetters = Number(document.getElementById("letters").value),
  matches = "";
  if (back.length > front.length) {//optimized search -> scanning reversed dictionary w/ intellegent alphabetical search
    var endAt = endsIndex(reverse(back), min, max, point);
    front = reverse(front);
    back = reverse(back);
    matchList = [];
    if (endAt > -1) {
      var entry = reversedDictionary[endAt];
      while(entry.startsWith(back) && endAt < max){
        if (entry.endsWith(front)){
          matchList.push(reverse(entry));
        }entry = reversedDictionary[++endAt];
      }
      for(var i = matchList.length-1; i>=0; i--){
        var candidate = matchList[i];
        if(candidate.length === numLetters || numLetters === -1){
          matches += candidate + "&nbsp;&nbsp;  ";
        }else if(numLetters === 7 && candidate.length > 7){
          matches += candidate + "&nbsp;&nbsp; ";
        }
      }
    }
  }else if (front.length > 0) {//optimized search -> scanning dictionary w/ intellegent alphabetical search
    var startAt = beginsIndex(front,min, max, point);
    if (startAt > -1) {
      var entry = dictionary[startAt];
      while(entry.startsWith(front) && startAt < max){
        if (entry.endsWith(back)){
          // matches += entry + "\n";
          if(entry.length === numLetters || numLetters === -1){
            matches += entry + "&nbsp;&nbsp; ";
          }else if(numLetters === 7 && entry.length > 7){
            matches += entry + "&nbsp;&nbsp; ";
          }
        }entry = dictionary[++startAt];
      }
    }
  }
  document.getElementById("matchedWords").innerHTML = matches;
}

//returns true is <word> comes before <dictWord> alphabetically
function isLessThan(word, dictWord){
  return [word, dictWord].sort()[0] == word;
}

//returns the index of the first word to match startsWith criteria from the dictionary
function beginsIndex(startswith, lowLim, upLim, pointer) {
  var pointerWord = dictionary[pointer];
  if (pointerWord.startsWith(startswith)) {
    while(pointerWord.startsWith(startswith) && pointer > 0) {
      var pointerWord = dictionary[--pointer];
    }
    if (pointer == 0) {return pointer;}//implicit else--> edge case of pointer = 0
    return pointer+1;
  }
  if(upLim - lowLim < 2){
    return -1;
  }
  if (isLessThan(startswith,pointerWord)) {
    return beginsIndex(startswith, lowLim, pointer, Math.floor((lowLim + pointer)/2));
  }
  return beginsIndex(startswith, pointer, upLim, Math.ceil((pointer+upLim)/2));
}

//returns the index of the first word to match endsWith criteria from the dictionary
function endsIndex(startswith, lowLim, upLim, pointer) {
  var pointerWord = reversedDictionary[pointer];
  if (pointerWord.startsWith(startswith)) {
    while(pointerWord.startsWith(startswith) && pointer > 0) {
      var pointerWord = reversedDictionary[--pointer];
    }
    if (pointer == 0) {return pointer;}//implicit else--> edge case of pointer = 0
    return pointer+1;
  }
  if(upLim - lowLim < 2){
    return -1;
  }
  if (isLessThan(startswith,pointerWord)) {
    return endsIndex(startswith, lowLim, pointer, Math.floor((lowLim + pointer)/2));
  }
  return endsIndex(startswith, pointer, upLim, Math.ceil((pointer+upLim)/2));
}

//returns true iff word is in dictionary
function isWord(word, lowLim, upLim, pointer) {
  var pointerWord = dictionary[pointer];
  if (word === pointerWord) {
    return true;
  }
  if(upLim - lowLim < 2){
    return false;
  }
  if (isLessThan(word,pointerWord)) {
    return isWord(word, lowLim, pointer, Math.floor((lowLim + pointer)/2));
  }
  return isWord(word, pointer, upLim, Math.ceil((pointer+upLim)/2));
}

//colors output to show user result of isWord query.
function setValidity() {
  var inputWord = document.getElementById("isWord").value.toLowerCase().trim();
  if (inputWord === "") {
    document.getElementById("YN").innerHTML = '???';
    document.getElementById("YN").setAttribute("style","color:black");
  }
  else if (isWord(inputWord,min,max,point)) {
    document.getElementById("YN").innerHTML = "Yes"
    document.getElementById("YN").setAttribute("style","color:green");
  }else{
    document.getElementById("YN").innerHTML = "No"
    document.getElementById("YN").setAttribute("style","color:red");
  }
}
