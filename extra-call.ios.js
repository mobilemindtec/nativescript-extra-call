var application = require("application");
var fs = require("file-system")
var imageSource = require("image-source")
var enums = require("ui/enums")

var mOnFailCallback
var imageViewDataSource

exports.registerFailCallback = function(onFailCallback){
  mOnFailCallback = onFailCallback
}

exports.withWhatsapp = function(args){

  try {

    var whats

    if(args.abid){
      whats = "whatsapp://send?abid=" + args.abid + "&text=" + args.message
    }
    else if(args.number){
      whats = "https://wa.me/" + args.number + "/?text="  + args.message
    }
    else{
      whats = "whatsapp://send?text=" //+ args.message
      console.log("for send to especify number, inform the contact id.. contact should be in contact list")
    }

    var whatsEncoded = NSString.stringWithString(whats).stringByAddingPercentEscapesUsingEncoding(NSUTF8StringEncoding)

    //console.log("## whatsEncoded+" + whatsEncoded)

    var nsUrl = NSURL.URLWithString(whatsEncoded)

    if(canOpenURL(nsUrl))
        openURL(nsUrl)
    else
        mOnFailCallback("cannot open whatsapp")

  }catch (error) {
    console.log(error)
    if(mOnFailCallback)
      mOnFailCallback(error)
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
    openURL(nsUrl)

  }catch (error) {
    console.log(error)
    if(mOnFailCallback)
      mOnFailCallback(error)
  }
}

exports.withPhone = function(number){
  try {

    var nsUrl = NSURL.URLWithString("tel:" + number)
    openURL(nsUrl)

  }catch (error) {
    console.log(error)
    if(mOnFailCallback)
      mOnFailCallback(error)
  }
}

exports.withWeb = function(url){
  try {

    if(url.indexOf('http') == -1)
      url = 'http://' + url

    var nsUrl = NSURL.URLWithString(url)
    openURL(nsUrl)

  }catch (error) {
    console.log(error)
    if(mOnFailCallback)
      mOnFailCallback(error)
  }
}

exports.withVideo = function(path){
  try {

    var url

    if(path.indexOf("http") == -1)
      url = NSURL.fileURLWithPath(path)
    else
      url = NSURL.URLWithString(path)

    var player = AVPlayer.playerWithURL(url)
    var playerViewController = AVPlayerViewController.alloc().init()
    playerViewController.player = player
    application.ios.rootController.presentViewControllerAnimatedCompletion(playerViewController, true, null)

  }catch (error) {
    console.log(error)
    if(mOnFailCallback)
      mOnFailCallback(error)
  }
}

// supports path or a json object {callback: , path: }
// when is image from web, do download and save temp file. call callback after image view open
// register fail callback to handler error
exports.withImage = function(args){

  var path = undefined
  var callback = undefined

  if(args.callback){
    callback = args.callback
    path = args.path
  } else {
    path = args
  }

  try {

    downloadAndSaveTempImage(path, function(imagePath) {

			var qlookclass = NSClassFromString("QLPreviewController");

			if(qlookclass){

        if(!imageViewDataSource){
          var DataSource = createImageViewDataSource()
          imageViewDataSource = DataSource.new()
        }

        console.log("image path " + imagePath)
        imageViewDataSource.setImagePath(imagePath)

				var quickLookPreview = qlookclass.alloc().init()
				quickLookPreview.dataSource = imageViewDataSource
				application.ios.rootController.presentViewControllerAnimatedCompletion(quickLookPreview, true, null)

        if(callback)
          callback()

			}else{

				console.log("QLPreviewController not found")
        if(mOnFailCallback)
          mOnFailCallback("QLPreviewController not found")

			}

		}, function(error){
      console.log(error)
      if(mOnFailCallback)
        mOnFailCallback(error)
    })

  }catch (error) {
    console.log(error)
    if(mOnFailCallback)
      mOnFailCallback(error)
  }


}

function openURL(url) {
  if(typeof UIApplication.sharedApplication === 'function'){
      UIApplication.sharedApplication().openURL(url)
  } else {
    UIApplication.sharedApplication.openURL(url)
  }
}

function canOpenURL(url) {
  if(typeof UIApplication.sharedApplication === 'function'){
      return UIApplication.sharedApplication().canOpenURL(url)
  } else {
    return UIApplication.sharedApplication.canOpenURL(url)
  }
}

function createImageViewDataSource() {

	var DataSource = (function(_super){

		__extends(DataSource, _super)
		function DataSource() {
			_super.applay(this, arguments)
		}

    DataSource.prototype.setImagePath = function(imagePath){
      this.imagePath = imagePath
    }

		DataSource.prototype.numberOfPreviewItemsInPreviewController = function(controller){
			return 1
		}

		DataSource.prototype.previewControllerPreviewItemAtIndex = function(controller, index){
      console.log("this.imagePath=" + this.imagePath)
			return NSURL.fileURLWithPath(this.imagePath)
		}

		DataSource.ObjCProtocols  = [QLPreviewControllerDataSource]
		return DataSource
	})(NSObject)

	return DataSource
}

function downloadAndSaveTempImage(imageUrl, successCallback, errorCallback){

  // is not http url
  if(imageUrl.indexOf('http') == -1){
    successCallback(imageUrl)
    return
  }

  // save temp file
	imageSource.fromUrl(imageUrl).then(function (img) {

		var temp = fs.knownFolders.temp()
		var splited = imageUrl.split("/")
		var fileName = splited[splited.length-2]
		var fileType = splited[splited.length-1]
		var format = enums.ImageFormat.png

		if(fileType.toUpperCase() == "JPG"){
			format = enums.ImageFormat.jpg
		} else if(fileType.toUpperCase() == "JPEG"){
			format = enums.ImageFormat.jpeg
		}

		var path = fs.path.join(temp.path, fileName + "." + fileType)

		img.saveToFile(path, format)

		successCallback(path)

	}, function (error) {
					console.log(error)
          errorCallback(error)
	})
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
