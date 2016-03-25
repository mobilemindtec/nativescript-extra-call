var Contacts = require("nativescript-contacts")

exports.loaded = function(){

	console.log("### loaded")

}

exports.onWebCall = function(){
	console.log("## onWebCall")
	
    var url = "https://twitter.com/intent/tweet?text=NativeScript!&url=http://mobilemind.com.br/&via=mobilemindtec"


	Contacts.withWeb(url)
}

exports.onCallPhone = function() {
	var phone = "555499767081"
	Contacts.withPhone(phone)
}

exports.onEmailSender = function(){

	var to = "suporte@mobilemind.com.br" 
	var textMessage = "I'm testing nativescript plugins!!"
	var subject = "Nativescript plugin test"
	Contacts.withEmail({
		to: to,
		message: textMessage,
		subject: subject
	})
}

exports.onWhatsAppAdd = function(){
	var phone = "555499767081"
	Contacts.withWhatsapp({
		message: "Nativescript plugin test"
	})
}