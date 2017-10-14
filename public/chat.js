// Initialize variables
var socket = io.connect("http://localhost:3701");
var message = document.getElementById("message-to-send").value;
var mess = "";
var handle = document.getElementById("handle");
var btn = document.getElementById("send");
var output = document.getElementById("output");
var listConnect = document.getElementById("listConnect");
var feedback = document.getElementById("feedback");
var $window = $(window);
var btnAddUser = document.getElementById("addUser");
var sendtohungfeck = document.getElementById("sendtohungfeck");
var announce = document.getElementById("announce");
var timeout;
var username = "";
var usernameto = ""; //chat voi
var socketIdto = "";

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
		username = data.username;
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
		socketIdto = data.socketIdto;
		username = data.username;
		$('.chat-with').html("Trò chuyện với "+data.chatto);
	}
});
socket.on("addConnect", function(data){
	var str = "";
	str +=	'<li class="clearfix '+data.socketId+'" onclick="switchChat(\''+data.socketId+'\',\''+data.username+'\')">';
	str +=		'<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/chat_avatar_01.jpg" alt="avatar" />';
	str +=		'<div class="about">';
    str +=        '<div class="name">'+data.username+'</div>';
    str +=        '<div class="status">';
	str +=		'<i class="fa fa-circle online"></i> online';
    str +=        '</div>';
	str +=		'</div>';
	str +=		'</li>';
	listConnect.innerHTML = str + listConnect.innerHTML;
});
socket.on("deleteConnect", function(data){
	$('.'+data.connectId+'').remove();
});
function switchChat(socketId,username){
	socketIdto = socketId;
	usernameto = username;
	$('.chat-with').html("Trò chuyện với "+username);
	socket.emit("switchChat",{socketIdto: socketId, mysocketId: socket.id}); // Lấy lịch sử
}
socket.on("switchChat", function(data){
	var strAll = "";
	if(data  != null){
		data.forEach(function(e) {
			if(e.from != socket.id)
			{
				// Khách
				var strOut = "";
				strOut += 	'<li> ';
				strOut +=		'<div class="message-data">';
				strOut +=			'<span class="message-data-name"><i class="fa fa-circle online"></i>'+usernameto+'</span> ';
				strOut +=	  	'	<span class="message-data-time" > Today</span> &nbsp; &nbsp;'; 
				strOut +=	 	'</div> ';
				strOut +=	 	'<div class="message my-message">'+e.content+'</div> ';
				strOut += 	'</li> ';
				strAll += strOut;
			}
			else{
					var strOut = "";
					strOut += 	'<li class="clearfix"> ';
					strOut +=		'<div class="message-data align-right">';
					strOut +=	  	'<span class="message-data-time" > Today</span> &nbsp; &nbsp;'; 
					// strOut +=	 	'<span class="message-data-name" >Olia</span> <i class="fa fa-circle me"></i>';
					strOut +=	 	'</div> ';
					strOut +=	 	'<div class="message other-message float-right">'+e.content+'</div> ';
					strOut += 	'</li> ';
					strAll += strOut;
				}
		});
		output.innerHTML = strAll;
	}
	else{
		output.innerHTML = strAll;
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

// $('.message').keyup(function() {
    // console.log('happening');
    // socket.emit('typing', {username: handle.value, status: true});
    // timeout = setTimeout(timeoutFunction, 2000);
  // });

// Keyboard events
$window.keydown(function (event) {
	// When the client hits ENTER on their keyboard
    if (event.which === 13) {
		socket.emit('send', {message:message.value, handle:handle.value});
	}
});

$('#send').click(function(){
	mess = $('textarea#message-to-send').val();
	socket.emit('send', {message:mess, username:username, socketIdto: socketIdto, mySocketId: socket.id });
	 $('textarea#message-to-send').val("");
});
// Tin nhắn tự động chỉ cho người gửi

socket.on("automessage", function(data){
	$('.wrapper_login').css("display", "none");
	output.innerHTML = data.mess; 
})

// Chỉ cho người gửi
socket.on("message", function (data) {
	if(data.message) {
			var today = new Date();
			var h = today.getHours();
			var m = today.getMinutes();
			var s = today.getSeconds();
			var strOut = "";
			strOut += 	'<li class="clearfix"> ';
			strOut +=		'<div class="message-data align-right">';
			strOut +=	  	'<span class="message-data-time" >'+ h +':'+ m +', Today</span> &nbsp; &nbsp;'; 
			strOut +=	 	'</div> ';
			strOut +=	 	'<div class="message other-message float-right">'+data.message+'</div> ';
			strOut += 	'</li> ';
			output.innerHTML += strOut;
			// message.value = '';
        } else {
            console.log("There is a problem:", data);
        }
});
// Cho đối tác
socket.on("messageto", function (data) {
	if(data.mySocketId == socketIdto)
	{
		if(data.message) {
			var today = new Date();
			var h = today.getHours();
			var m = today.getMinutes();
			var s = today.getSeconds();
			var strOut = "";
			strOut += 	'<li> ';
			strOut +=		'<div class="message-data">';
			strOut +=			'<span class="message-data-name"><i class="fa fa-circle online"></i>'+data.username+'</span> ';
			strOut +=	  	'	<span class="message-data-time" >'+ h +':'+ m +', Today</span> &nbsp; &nbsp;'; 
			strOut +=	 	'</div> ';
			strOut +=	 	'<div class="message my-message">'+data.message+'</div> ';
			strOut += 	'</li> ';
			output.innerHTML += strOut;
			// message.value = '';
		} else {
			console.log("There is a problem:", data);
		}
	}
	else
	{
		alert("Có tin nhắn nhưng ko phải màn hình người này");
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






