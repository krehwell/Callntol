// ----- " initiate new user " -----
var _id = "fuck" + Math.floor(Math.random() * 10);                                    // user id to init
var conn;                                                                             // the guy who will received
var nobodyconnected = true;                                                           // make sure that nobody is connected to user
const peer = new Peer(_id);                                                           // init the peer(user) to generate id

// ----- " Init Peer " -----
peer.on("open", (id) => {
  _id = id;                                                                           // let the id is fetched by the server
  document.getElementById("peerid").value = _id;                                      // put the "id" to the DOM 
  console.log("peer id: " + id);
});

// ----- " Receiver " -----
// when the connection is enstablihed
peer.on("connection", (connected) => {
  let caller = connected.peer;                                                        // the guy who received take the info of caller(user) 
  console.log(caller + " are calling");
  document.getElementById('info').innerText = "you are connected to " + caller        // set the guy who received DOM who is calling

  if(nobodyconnected){                                                                // let the user know that the guy who received has been connected
    (async () => { try{ conn = await peer.connect(caller); nobodyconnected = false;}  // IIFE with Async
     catch(err){console.log(err)} })();
  }
  
  // received the data sent by the sender
  connected.on("data", data => console.log(data))
});

peer.on("error", (error) => {                                                         // TODO: gotta handle error better
  console.log(error);
});

// ----- " Sender " -----
function onClickBtnCall() {                                                           // user calling the id of the guy
  // call the end user
  let callerId = document.getElementById("peertocall").value;                         // get the id input form the DOM 
  conn = peer.connect(callerId);                                                      // try to connect
}

// send fuck you to end
function sendFuck() {
  // console.log(conn);                                                               
  conn.send({peer: conn.peer, data: "fuck you", to: conn.provider._id})               // send fuck to end user
}
