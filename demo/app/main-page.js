var application = require("application")
var ExtraCall = require("nativescript-extra-call")
var contacts = require( "nativescript-contacts" );
var dialogs = require("ui/dialogs")

exports.loaded = function(){

	console.log("### loaded")

	ExtraCall.registerFailCallback(failCallback)
}

function failCallback(error){
	alert(error)
}

exports.onWebCall = function(){
	console.log("## onWebCall")	
    var url = "https://twitter.com/intent/tweet?text=NativeScript!&url=http://mobilemind.com.br/&via=mobilemindtec"
	ExtraCall.withWeb(url)
}

exports.onCallPhone = function() {
	console.log("## onCallPhone")	
	var phone = "555499767081"
	ExtraCall.withPhone(phone)
}

exports.onEmailSender = function(){
	console.log("## onEmailSender")
	var to = "suporte@mobilemind.com.br" 
	var textMessage = "I'm testing nativescript plugins!!"
	var subject = "Nativescript plugin test"
	ExtraCall.withEmail({
		to: to,
		message: textMessage,
		subject: subject
	})
}

exports.onWhatsAppAdd = function(){
	console.log("## onWhatsAppAdd")
	if(application.ios){
		console.log("## ios")
		var phone = "99008894"
		var name = "Alan"

		getOrCreateContact({
			name: name,
			number: phone
		})

	}else{
		console.log("## android")
		var phone = "555499008894"
		ExtraCall.withWhatsapp({
			message: "Nativescript plugin test",
			number: phone
		})
	}
}

function getOrCreateContact(args){
	
	ExtraCall.findABContact(args.number, function(obj){
		console.log(".. found abid=" + obj.abid)

		ExtraCall.withWhatsapp({
			message: "Nativescript plugin test",
			abid: obj.abid
		})

	}, function(){
		console.log(".. not found")

		dialogs.confirm("Contact does not exists. Register a new contact?")
		.then(function (result) {
		  if(result){
		  	register(args)
		  	getOrCreateContact(args)
		  }
		});
	})

}

function register(args){
	var newContact = new contacts.Contact();
	newContact.name.given = args.name;
	newContact.phoneNumbers.push({ label: contacts.KnownLabel.MOBILE, value: args.number });
	newContact.save();	
}