var application = require("application");


var mOnFailCallback

exports.registerFailCallback = function(onFailCallback){
  mOnFailCallback = onFailCallback
}

exports.withWhatsapp = function(number, textMessage){

  try {    
    var uri = android.net.Uri.parse("smsto:+" + number);
    var intent = new android.content.Intent(android.content.Intent.ACTION_SENDT, uri);
    intent.setPackage("com.whatsapp");
    intent.putExtra("sms_body", textMessage);
    intent.putExtra("chat",true);      
   
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
      mOnFailCallback()
  }    
}

exports.withEmail = function(to, textMessage){

  try {    
    var uri = android.net.Uri.parse("mailto:" + to);
    var intent = new android.content.Intent(android.content.Intent.ACTION_SENDT, uri);    
    intent.putExtra(android.content.Intent.EXTRA_SUBJECT, "Contato SigTurismo");
    intent.putExtra(android.content.Intent.EXTRA_TEXT, textMessage);
    intent.setType("message/rfc822");
    
    /*
    var addresses = []
    if(to.indexOf(';') > -1){
      addresses = to.split(';')
    }else{
      addresses.push(to)
    }
    intent.putExtra(android.content.Intent.EXTRA_EMAIL, addresses);
    */

    application.android.currentContext.startActivity(br.content.Intent.createChooser(intent, "Enviar email..."));

  }catch (e) {
    console.log(e)
    if(mOnFailCallback)
      mOnFailCallback()
  }    
}

exports.withPhone = function(number){
  try {    
    var uri = android.net.Uri.parse("tel:" + number);
    var intent = new android.content.Intent(android.content.Intent.ACTION_CALL);    
    intent.setData(uri);
    intent.setFlags(android.content.Intent.FLAG_ACTIVITY_NEW_TASK); 
            
    application.android.currentContext.startActivity(intent);

  }catch (e) {
    console.log(e)
    if(mOnFailCallback)
      mOnFailCallback()
  }    
}