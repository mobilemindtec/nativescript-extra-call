var application = require("@nativescript/core/application")


var mOnFailCallback

exports.registerFailCallback = function(onFailCallback){
  mOnFailCallback = onFailCallback
}

function whatsAppIsInstalled(uri){

  var whatsAppPackages = [
    "com.whatsapp.w4b",
    "com.whatsapp.wb4",
    "com.whatsapp"
  ]

  for(var i in whatsAppPackages){

    var package = whatsAppPackages[i]

    var intent = new android.content.Intent(android.content.Intent.ACTION_VIEW)
    intent.setPackage(package)
    intent.setData(uri)
    intent.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK); 

    var activity = application.android.foregroundActivity || application.android.startActivity
    
    if (intent.resolveActivity(activity.getPackageManager()) != null) {          
      return intent
    }
  }


  var browserIntent = new android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse("market://details?id=com.whatsapp"));        
  activity.startActivity(browserIntent);            


  return false

}

exports.withWhatsapp = function(args){

  try {        
    var uri = new android.net.Uri.parse("https://api.whatsapp.com/send?phone=" + args.number + "&text=" + args.message)
    var intent = whatsAppIsInstalled(uri)
    var activity = application.android.foregroundActivity || application.android.startActivity
    if (intent) {          
      activity.startActivity(intent);
    }
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

    var uri = android.net.Uri.parse("mailto:" + args.to);
    var intent = new android.content.Intent(android.content.Intent.ACTION_SENDT, uri);    
    intent.putExtra(android.content.Intent.EXTRA_SUBJECT, args.subject);
    intent.putExtra(android.content.Intent.EXTRA_TEXT, args.message);
    intent.setType("message/rfc822");
    intent.setFlags(android.content.Intent.FLAG_ACTIVITY_NO_HISTORY); 
    
    /*
    var addresses = []
    if(to.indexOf(';') > -1){
      addresses = to.split(';')
    }else{
      addresses.push(to)
    }
    intent.putExtra(android.content.Intent.EXTRA_EMAIL, addresses);
    */

    var activity = application.android.foregroundActivity || application.android.startActivity
    activity.startActivity(android.content.Intent.createChooser(intent, "Enviar email..."));

  }catch (e) {
    console.log(e)
    if(mOnFailCallback)
      mOnFailCallback(e)
  }    
}

exports.withPhone = function(number){
  try {    
    var uri = android.net.Uri.parse("tel:" + number);
    var intent = new android.content.Intent(android.content.Intent.ACTION_DIAL);    
    intent.setData(uri);
    intent.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK); 
    
    var activity = application.android.foregroundActivity || application.android.startActivity
    activity.startActivity(intent);

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

    var uri = android.net.Uri.parse(url);
    var intent = new android.content.Intent(android.content.Intent.ACTION_VIEW, uri);
    intent.setFlags(android.content.Intent.FLAG_ACTIVITY_NO_HISTORY); 

    var activity = application.android.foregroundActivity || application.android.startActivity
    activity.startActivity(intent);


  }catch (e) {
    console.log(e)
    if(mOnFailCallback)
      mOnFailCallback(e)
  }    
}

exports.withVideo = function(path) { 

  try {    

      if(path.indexOf('/') == 0)
        path = 'file://' + path

    var intent = new android.content.Intent(android.content.Intent.ACTION_VIEW);
    var uri = android.net.Uri.parse(path);
    intent.setDataAndType(uri, "video/*");

    var activity = application.android.foregroundActivity || application.android.startActivity
    activity.startActivity(intent); 


  }catch (e) {
    console.log(e)
    if(mOnFailCallback)
      mOnFailCallback(e)
  }  
   
}

exports.withImage = function(path) {  
  try {    

    if(path.indexOf('/') == 0)
      path = 'file://' + path
    
    var intent = new android.content.Intent(android.content.Intent.ACTION_VIEW);
    var uri = android.net.Uri.parse(path);
    intent.setDataAndType(uri, "image/*");

    var activity = application.android.foregroundActivity || application.android.startActivity
    activity.startActivity(intent); 


  }catch (e) {
    console.log(e)
    if(mOnFailCallback)
      mOnFailCallback(e)
  }  
}
