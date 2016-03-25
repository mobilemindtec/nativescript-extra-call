var application = require("application");


var mOnFailCallback

exports.registerFailCallback = function(onFailCallback){
  mOnFailCallback = onFailCallback
}

exports.withWhatsapp = function(args){

  try {    
    
    var whats 

    if(args.abid)
      whats = "whatsapp://send?abid=" + args.abid + "&text=" + args.message
    else{
      whats = "whatsapp://send?text=" //+ args.message
      console.log("for send to especify number, inform the contact id.. contact should be in contact list")
    }

    var whatsEncoded = NSString.stringWithString(whats).stringByAddingPercentEscapesUsingEncoding(NSUTF8StringEncoding)
    
    //console.log("## whatsEncoded+" + whatsEncoded)

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

    var nsUrl = NSURL.URLWithString("tel:" + number)
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

exports.findABContact = function(number, foundCallback, notFoundCallback){
  var error;  
  var addressBook = ABAddressBookCreateWithOptions(null, error).takeRetainedValue();
  var allPeople = ABAddressBookCopyArrayOfAllPeople(addressBook).takeRetainedValue();
  var numberOfPeople = ABAddressBookGetPersonCount(addressBook);
  var found = false;

  for(var i = 0; i < numberOfPeople; i++) {

    if(found) break

      var person = CFArrayGetValueAtIndex( allPeople, i );      
      //var lastName = ABRecordCopyValue(person, kABPersonLastNameProperty).takeRetainedValue();
      var phoneNumbers = ABRecordCopyValue(person, kABPersonPhoneProperty).takeRetainedValue();

      var numberOfPhoneNumbers = ABMultiValueGetCount(phoneNumbers)
      
      for (var j = 0; j < numberOfPhoneNumbers; j++) {
          var phoneNumber = ABMultiValueCopyValueAtIndex(phoneNumbers, j).takeRetainedValue();

          var phoneNumberReplaced = phoneNumber.replace("-", "").replace(" ", "")         

          if(phoneNumberReplaced.indexOf(number) > -1){

            var firstName = ABRecordCopyValue(person, kABPersonFirstNameProperty).takeRetainedValue();
            var abid = NSNumber.numberWithInteger(ABRecordGetRecordID(person));
            
          found = true
            foundCallback({
              abid: abid,
              firstName: firstName
            })

            break
          }         
      }     
  } 

  if(!found)
    notFoundCallback()
}