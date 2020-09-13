// defining the getUserMedia --- src: https://github.com/twinysam/VoiceApp/blob/master/index.html
var getUserMedia = (function () {
	if (navigator.getUserMedia) {
		return navigator.getUserMedia.bind(navigator)
	}
	if (navigator.webkitGetUserMedia) {
	 return navigator.webkitGetUserMedia.bind(navigator)
	}
	if (navigator.mozGetUserMedia) {
		return navigator.mozGetUserMedia.bind(navigator)
	}
})();
// end of difining getUserMedia

// ----- " INITIATE NEW USER " -----
var _id = "fuck" + Math.floor(Math.random() * 1000);                                  // user id to init
var conn;                                                                             // the guy who will received
var nobodyconnected = true;                                                           // make sure that nobody is connected to user
const peer = new Peer(_id);                                                           // init the peer(user) to generate id

// ----- " INIT PEER " -----
peer.on("open", (id) => {
  _id = id;                                                                           // let the id is fetched by the server
  document.getElementById("peerid").value = _id;                                      // put the "id" to the DOM 
  console.log("peer id: " + id);
});

// ----- " RECEIVER " -----
// when the data connection is enstablished
peer.on("connection", (connected) => {
  let caller = connected.peer;                                                        // the guy who received take the info of caller(user) 
  console.log(caller + " are data connected");
  document.getElementById('info').innerText = "you are connected to " + caller;       // set the guy who received DOM who is calling

  if(nobodyconnected){                                                                // let the user know that the guy who received has been connected
    (async () => { try{ conn = await peer.connect(caller); nobodyconnected = false;}  // IIFE with Async
     catch(err){console.log(err)} })();
  }
  
  // received the data sent by the sender
  connected.on("data", data => console.log(data));
});

// in order to peer to received the call and passback the media to the caller
peer.on("call", call => {
  if(!confirm(`${call.peer} is calling, Answer?`)){return ;}                          // allow or reject the call received

  getUserMedia({audio: true, video: false}, (media) => {                              // passing peer media to the caller
    console.log("you hit someone else to pass your media");
    call.answer(media);
  })

  console.log(`${call.peer} is calling to you`)

  call.on('stream', (media)=>{                                                        // passing the caller media to DOM
    console.log("you are stream now")
    let mediasource = document.getElementById("audiostream");
    mediasource.srcObject = media;
    mediasource.play();
  })
})

// any connection error debugger
peer.on("error", (error) => {                                                         
  document.getElementById("infoerror").innerHTML = `${error.type} - ${error}`;
  console.log("fuck error: " + error.type);
});

// ----- " SENDER " -----
function onErrorMediaCallback(){                                                      // error getUserMedia() handler
  console.log("error on navigator.getUserMedia()");
}

function onClickBtnCall() {                                                           // user calling the id of the guy
  // call the end user
  let callerId = document.getElementById("peertocall").value;                         // get the id input form the DOM 
  conn = peer.connect(callerId);                                                      // try to connect data

  // ---- " calling using audio " -----
  getUserMedia({video: false,audio: true}, function(stream){
    conn = peer.call(callerId, stream);
    console.log("success getUserMedia");

    // trying to listen for the answer of the guy intended to call
    conn.on("stream", (media)=>{
      // if the guy anwer, pass his media to our dom
      console.log("you hit peer stream")
      let mediasource = document.getElementById("audiostream");
      mediasource.srcObject = media;
      mediasource.play();
    })

  }, onErrorMediaCallback)
  console.log("trying to call...");
}

// send fuck you to end
function sendFuck() {
  // console.log(conn);                                                               
  conn.send({from: conn.provider._id , message: "fuck you", to: conn.peer})               // send fuck to end user
}
