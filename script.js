try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
  }
  catch(e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
  }

//var noteTextarea = $('#note-textarea');
var notesList = $('ul#notes');
var noteContent = '';
var arr = ['olivia', 'Olivia', 'olivia,', 'Olivia,'];
var olivia;
var overAllNotes = '';

//input variables
var sendText;

var AIO_KEY = "7a453252f35d40c5b9a401a454dff1ee";//get this from your account
var channelGroup = "listening";
var channel1 = "overheard";
var channel2 = "recorded";

//This must match the channel you set up in your function

$('#stop-record-btn').hide();
    
/*-----------------------------
      Voice Recognition 
------------------------------*/

// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses. 

recognition.continuous = true;
//console.log(recognition.continuous)
// This block is called every time the Speech APi captures a line. 
recognition.onresult = function(event) {

   // event is a SpeechRecognitionEvent object.
  // It holds all the lines we have captured so far. 
  // We only need the current one.
  var current = event.resultIndex;

  // Get a transcript of what was said.
  var transcript = event.results[current][0].transcript;
  
  overAllNotes += transcript;

  //noteTextarea.val(overAllNotes);
  console.log('in here');
  console.log('T: '+ transcript);
  olivia = contains(transcript, arr);

  if (olivia) {
    olivia = "true";
    sendData(olivia, transcript);
  }
  // Add the current transcript to the contents of our Note.
  // There is a weird bug on mobile, where everything is repeated twice.
  // There is no official solution so far so we have to handle an edge case.
  var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

  if(!mobileRepeatBug) {
   // noteContent += transcript;
    //noteTextarea.val(noteContent);
  }
  recognition.continuous = true;

};

recognition.onstart = function() { 
  console.log("starting");
  // instructions.text('Voice recognition activated. Try speaking into the microphone.');
}
recognition.onend = function() {
  console.log('on end');

  recognition.start();
}
recognition.onspeechend = function() {
  console.log('You were quiet for a while so voice recognition turned itself off.');
  $('#stop-record-btn').hide();
  $('#start-record-btn').show();
  recognition.start();

}

recognition.onerror = function(event) {
  if(event.error == 'no-speech') {
      recognition.start();
  };
}

/*-----------------------------
      App buttons and input 
------------------------------*/

$('#start-record-btn').on('click', function(e) {
  console.log('start');

  if (noteContent.length) {
    noteContent += ' ';
  }
  recognition.start();
  $('#start-record-btn').hide();
  $('#stop-record-btn').show();

});

$('#stop-record-btn').on('click', function(e) {
    recognition.stop();
    $('#stop-record-btn').hide();
    $('#start-record-btn').show();

    if(!noteContent.length) {
    }
    else {
        overAllNotes = '';
    }
        
  })

  // function that sees if the text contains the string olivia... 
function contains(target, pattern){
    var value = 0;
    pattern.forEach(function(word){
      value = value + target.includes(word);
    });
    return (value === 1)
}


function sendData(data1, data2) {
        console.log(data1);
        console.log(data2);
        var url = ("https://io.adafruit.com/api/v1/groups/"+channelGroup+"/send.json?x-aio-key=" + AIO_KEY + "&"+channel1+"=" + data1+ "&"+channel2+"=" + data2);
        var oReq = new XMLHttpRequest()
        oReq.addEventListener("load", reqListener)
        oReq.open("POST", url)
        oReq.send()
        readOutLoud();
        olivia = false;
}
function reqListener(inputdata)
{
	console.log(inputdata);
}

// read the text out loud to let the talkers know that a text has been sent... 
function readOutLoud() {
	var speech = new SpeechSynthesisUtterance();
    var message = "Alert, alert! A notification has been sent informing O Prior that her name came up in conversation! Alert, alert! A notification has been sent informing O Prior that her name came up in conversation.";
  // Set the text and voice attributes.
	speech.text = message;
	speech.volume = 1;
	speech.rate = 1;
	speech.pitch = 1;
    window.speechSynthesis.speak(speech);
    $('#textarea-flex').hide();
    $('#alert').show();
    setTimeout(removeGif, 15000);
}

function removeGif() {
    $('#alert').hide();
    $('#textarea-flex').show();

}
