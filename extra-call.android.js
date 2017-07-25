var application = require("application");


var mOnFailCallback

exports.registerFailCallback = function(onFailCallback){
  mOnFailCallback = onFailCallback
}

exports.withWhatsapp = function(args){

  try {    
    var uri = android.net.Uri.parse("smsto:+" + args.number);
    var intent = new android.content.Intent(android.content.Intent.ACTION_SENDT, uri);
    intent.setType("text/plain");
    intent.setPackage("com.whatsapp");
    intent.putExtra(android.content.Intent.EXTRA_TEXT, args.message);
    intent.putExtra("chat",true);     
    intent.setFlags(android.content.Intent.FLAG_ACTIVITY_NO_HISTORY); 
   
    if (intent.resolveActivity(application.android.context.getPackageManager()) != null) {          
      application.android.currentContext.startActivity(intent);
    }else{
      //as not app whatsapp api
      var browserIntent = new android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse("market://details?id=com.whatsapp"));        
      application.android.currentContext.startActivity(browserIntent);        
    
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

    application.android.currentContext.startActivity(android.content.Intent.createChooser(intent, "Enviar email..."));

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
            
    application.android.currentContext.startActivity(intent);

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
    application.android.currentContext.startActivity(intent);


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
    application.android.currentContext.startActivity(intent); 


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
    application.android.currentContext.startActivity(intent); 


  }catch (e) {
    console.log(e)
    if(mOnFailCallback)
      mOnFailCallback(e)
  }  
}
