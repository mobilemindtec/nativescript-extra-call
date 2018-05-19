# nativescript-extra-call

fast access tool 

- Access external browser
- Call a phone number
- Send a email
- Call whatsapp

# examples

demo app ./demo

## configure package

`"nativescript-extra-call": "https://github.com/mobilemindtec/nativescript-extra-call.git"`

## declare

`var ExtraCall = require("nativescript-extra-call")`

## handler error

`ExtraCall.registerFailCallback(failCallback)`

## open external browser

`ExtraCall.withWeb(url)`

## call a phone number

`ExtraCall.withPhone(phone)`

## send a email wiht external email client

`	ExtraCall.withEmail({
		to: to,
		message: textMessage,
		subject: subject
	})`
	
## send whatsapp message

### ios
	
	`	ExtraCall.withWhatsapp({
			message: "Nativescript plugin test",
			abid: abid
		})` 
	
#### android 

	` ExtraCall.withWhatsapp({
			message: "Nativescript plugin test",
			number: phone
		})
		`
