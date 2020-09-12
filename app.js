// ----- " initiate new user " -----
var _id = "fuck" + Math.floor(Math.random() * 10);
const peer = new Peer(_id);

// ----- " Init Peer " -----
peer.on("open", (id) => {
  _id = id;
  document.getElementById("peerid").value = _id;
  console.log("peer id: " + id);
});

// ----- " Receiver " -----
// when the connection is enstablihed
peer.on("connection", (connected) => {
  console.log("the user are calling");
  // received the data sent by the sender
  connected.on("data", data => console.log(data))
});

peer.on("error", (error) => {
  console.log(error);
});

// ----- " Sender " -----
var conn; // init the conn
function onClickBtnCall() {
  // call the end user
  let callerId = document.getElementById("peertocall").value;
  conn = peer.connect(callerId);
}

// send fuck you to end
function sendFuck() {
  console.log(conn);
  conn.send({peer: conn.peer, data: "fuck you", to: conn.provider._id})
}
