// ----- " initiate new user " -----
const peer = new Peer();
var _id;

// ----- " Init Peer " -----
peer.on("open", (id) => {
  _id = id;
  document.getElementById("peerid").value = id;
  console.log(id);

  peer.on("data", (data) => {
    console.log("Data received: " + data);
  });

  // peer.send("fuck you");
});

// ----- " Receiver " -----
// when the connection is enstablihed
peer.on("connection", (conn) => {
  console.log("the user are calling");
  conn.send("fuck")
});

peer.on("error", (error)=> {
  console.log(error)
})

// ----- " Sender " -----
function onClickBtnCall() {
  let callerId = document.getElementById("peertocall").value;
  var conn = peer.connect(callerId);
}
