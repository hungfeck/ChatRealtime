// Initialize variables
var socket = io.connect("http://localhost:3701");
var message = document.getElementById("message");
var handle = document.getElementById("handle");
var btn = document.getElementById("send");
var output = document.getElementById("output");
var feedback = document.getElementById("feedback");
var $window = $(window);
var btnAddUser = document.getElementById("addUser");
var sendtohungfeck = document.getElementById("sendtohungfeck");
var announce = document.getElementById("announce");
var timeout;
var username = ""

//Login
$('.btn_login').click(function(){
	var username = $('.username').val();
	var password = $('.password').val();
	login(username, password);
});
function login(username, password, socketId){
	socket.emit("login",{username: username,password: password, socketId: socket.id});
}
socket.on("login", function(data){
	if(data.username == null || data.username == "")
	{
		$('.loginfail').css("display", "block");
	}
	else{
		$('.wrapper_login').css("display", "none");
	}
});
// joinchat
$('.btnJoin').click(function(){
	var username = $('.username').val();
	var phone = $('.phone').val();
	joinchat(username, phone);
});
function joinchat(username, phone, socketId){
	socket.emit("joinchat",{username: username,phone: phone, socketId: socket.id});
}
socket.on("joinchat", function(data){
	if(data.username == null || data.username == "")
	{
	}
	else{
		$('.wrapper_login').css("display", "none");
	}
});


//join room
// var room = 'room'+randomIntFromInterval(1,2);
// socket.emit('create', room);
// function randomIntFromInterval(min,max)
// {
    // return Math.floor(Math.random()*(max-min+1)+min);
// }

// typing
function timeoutFunction() {
    socket.emit("typing", {username: '', status:false});
}
socket.on("typing",function(data)
{
	if(data.status)
		feedback.innerHTML = '<p><em>' +data.username+ ' đang gõ... </em></p>';
	else
		feedback.innerHTML = '';
});
$('.message').keyup(function() {
    console.log('happening');
    socket.emit('typing', {username: handle.value, status: true});
    timeout = setTimeout(timeoutFunction, 2000);
  });

// Keyboard events
$window.keydown(function (event) {
	// When the client hits ENTER on their keyboard
    if (event.which === 13) {
		socket.emit('send', {message:message.value, handle:handle.value});
	}
});

$('#send').click(function(){
	socket.emit('send', {message:message.value, handle:handle.value});
});
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


/****Add User****/
// btnAddUser.addEventListener("click",function(){
	// socket.emit("addUser", {username: handle.value, id: socket.id});
// })

socket.on("addUser", function(data){
	output.innerHTML += '<center><p><strong>' +data.username+ '</strong> đã tham gia hội thoại</p></center>';
	
});
/****End User****/

/*****Remove User****/


socket.on("disconnect", function(data){
	
})
/*****End Remove User****/





//typing

//announce
socket.on("announce",function(data){
	announce.innerHTML = '<center><p>' +data+ ' người đang tham gia hội thoại</p></center>';
});


function close_window() {
  if (confirm("Close Window?")) {
    close();
  }
}

// Send to hungfeck
 // sendtohungfeck.addEventListener("click",function(){
	// socket.emit("sendtohungfeck", {message: message.value, user: handle.value});
// })

socket.on("sendtohungfeck", function(data){
	output.innerHTML += '<p><strong>' +data.user+ ':</strong>'+ data.message +'</p>';
});






