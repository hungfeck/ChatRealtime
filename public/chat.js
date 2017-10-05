// Initialize variables
var socket = io.connect("http://localhost:3701");
var message = document.getElementById("message");
var handle = document.getElementById("handle");
var btn = document.getElementById("send");
var output = document.getElementById("output");
var feedback = document.getElementById("feedback");
var $window = $(window);
var btnAddUser = document.getElementById("addUser");


// Keyboard events
$window.keydown(function (event) {
	// When the client hits ENTER on their keyboard
    if (event.which === 13) {
		socket.emit('send', {message:message.value, handle:handle.value});
	}
});

btn.addEventListener("click",clickE);
function clickE(event)
{
	socket.emit("chat",{message:message.value, handle:handle.value});
	socket.emit('send', {message:message.value, handle:handle.value});
}

/****Add User****/
btnAddUser.addEventListener("click",function(){
	socket.emit("addUser", handle.value);
})

socket.on("addUser", function(data){
	output.innerHTML += '<center><p><strong>' +data.username+ '</strong> đã tham gia hội thoại</p></center>';
	output.innerHTML += '<center><p>' +data.countUser+ ' người đang tham gia hội thoại</p></center>';
});
/****End User****/

/*****Remove User****/
socket.on("disconnect", function(data){
	
})
/*****End Remove User****/

socket.on("message", function (data) {
	if(data.handle != "")
	{
        if(data.message) {
            output.innerHTML += '<p><strong>' +data.handle+ ':</strong>'+ data.message +'</p>';
			message.value = '';
        } else {
            console.log("There is a problem:", data);
        }
	}
	else{
		alert("Please type your name!");
	}
});

message.addEventListener("keypress",function(){
		socket.emit('typing',handle.value);
		$window.close();
	});
socket.on("typing",function(data)
{
	feedback.innerHTML = '<p><em>' +dataRes+ 'is typing a message... </em></p>';
});

function close_window() {
  if (confirm("Close Window?")) {
    close();
  }
}







