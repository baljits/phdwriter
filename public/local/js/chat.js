/* Function that makes a post request to the server to add a new message
to the chat queue, so that all participants get the message
*/
function sendChatMessage()
{
	var chatMessage = $("#chatInput").val();

	console.log(documentID + " " + chatMessage);
	chatMessage = $.trim(chatMessage);

	/* Making sure the message is not 'empty' */
	if(chatMessage != '')
	{
		var addMessageRequest = $.ajax({
			type: "POST",
			url: "/addChatMessage",
			data: {_csrf: csrfToken, documentID:documentID, message: chatMessage},
			cache: false
		}).done(function(res){
			$("#chatInput").val('');
			$("#chatHistory").append('<div>'+res.username+': '+ res.message+'</div>');
			$("#chatHistory")[0].scrollTop = $("#chatHistory")[0].scrollHeight;
		});
	}
}

/* Function that periodically polls for new messages on the server,
and renders the new messages appropriately.
*/
function getChatHistory()
{
	var getChatHistoryRequest = $.ajax({
		type: "POST",
		url: "/getHistory",
		data: {_csrf: csrfToken, documentID:documentID},
	}).done(function(res){
		//console.log(res.chatHistory + ' ' + res.error);
		$("#chatHistory").children().remove();
		if(res.error == 'No error')
			for(var i=0; i<res.chatHistory.length; i++)
				$("#chatHistory").append('<div>'+res.chatHistory[i].sourceName+': '+ res.chatHistory[i].text+'</div>');
			$("#chatHistory")[0].scrollTop = $("#chatHistory")[0].scrollHeight;
			setTimeout(getChatHistory, 1000);
		});
}

$(document).ready(function() {
	setTimeout(getChatHistory, 1000);

	$("#chatInput").keyup(function(event){
		if(event.keyCode == 13){
			$("#chatSend").click();
		}
	});
});