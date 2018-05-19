var application = require("application")
var ExtraCall = require("nativescript-extra-call")
var contacts = require( "nativescript-contacts" );
var dialogs = require("ui/dialogs")
var fs = require("file-system")

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

exports.onVideoLocal = function() {
	var current = fs.knownFolders.currentApp()
	var videoPath = fs.path.join(current.path, 'res/big_buck_bunny.mp4')
	ExtraCall.withVideo(videoPath)
}

exports.onVideoWeb = function() {
	var videoUrl = "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
	ExtraCall.withVideo(videoUrl)
}

exports.onImageLocal = function(args) {
	var current = fs.knownFolders.currentApp()
	var imagePath = fs.path.join(current.path, 'res/mobilemind.png')
	ExtraCall.withImage(imagePath)
}

exports.onImageWeb = function(args) {
	var imageUrl = "https://www.google.com/images/errors/logo_sm_2.png"
	ExtraCall.withImage(imageUrl)
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
