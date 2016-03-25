var application = require("application");


var mOnFailCallback

exports.registerFailCallback = function(onFailCallback){
  mOnFailCallback = onFailCallback
}

exports.withWhatsapp = function(args){

  try {    
    
    var whats = "whatsapp://send=" + args.message

    if(args.id)
      whats += "&abid=" + args.id
    else
      console.log("for send to especify number, inform the contact id.. contact should be in contact list")

    var whatsEncoded = NSString.stringWithString(whats).stringByAddingPercentEscapesUsingEncoding(NSUTF8StringEncoding)
    
    var nsUrl = NSURL.URLWithString(whatsEncoded)

    if(UIApplication.sharedApplication().canOpenURL(nsUrl))
        UIApplication.sharedApplication().openURL(nsUrl)
    else
        mOnFailCallback("cannot open whatsapp")

  }catch (e) {
    console.log(e)
    if(mOnFailCallback)
      mOnFailCallback(e)
  }    
}

exports.withEmail = function(args){
  try {    

    args = args || {}
    args.subject = args.subject || ""
    args.message = args.message || ""

    if(!args.to){
        console.log("## email to is empty")
        return
    }

    var email = "mailto:" + args.to + "?subject=" + args.subject + "&body=" + args.message
    var emailUrl = NSString.stringWithString(email).stringByAddingPercentEscapesUsingEncoding(NSUTF8StringEncoding)
    var nsUrl = NSURL.URLWithString(emailUrl)
    UIApplication.sharedApplication().openURL(nsUrl)

  }catch (e) {
    console.log(e)
    if(mOnFailCallback)
      mOnFailCallback(e)
  }    
}

exports.withPhone = function(number){
  try {    

    var nsUrl = NSURL.URLWithString("tel:" + phone)
    UIApplication.sharedApplication().openURL(nsUrl)

  }catch (e) {
    console.log(e)
    if(mOnFailCallback)
      mOnFailCallback(e)
  }    
}

exports.withWeb = function(url){
  try {    

    if(url.indexOf('http') == -1)
      url = 'http://' + url

    var nsUrl = NSURL.URLWithString(url)
    UIApplication.sharedApplication().openURL(nsUrl)

  }catch (error) {
    console.log(error)
    if(mOnFailCallback)
      mOnFailCallback(e)
  }    
}