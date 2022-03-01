function loadAffilateTrackingScript(){
var CheckAffiliateScript = setInterval(function () {
    clearInterval(CheckAffiliateScript);
    if (!window.jQuery || (typeof jQuery === 'undefined') || (parseFloat(jQuery.fn.jquery) < 1.7)) {
        loadScript('https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', function () {
            jQuery191 = jQuery.noConflict(true);
            //jQuery = jQuery191;
            //$ = jQuery191;
            LoadAffiliateScript(jQuery191);
            LoadShareCartScript(jQuery191);
        });
    }
    else {
        LoadAffiliateScript(jQuery);
        LoadShareCartScript(jQuery);
    }
}, 100);
}
var loadScript = function (url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";

    // If the browser is Internet Explorer.
    if (script.readyState) {
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
        // For any other browser.
    } else {
        script.onload = function () {
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);

};

function closePopup() {
    document.getElementsByClassName("sr_popup")[0].style.display = "none";
}

function LoadAffiliateScript($) {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var repId = url.searchParams.get("ambassador");
    var linkValidity = url.searchParams.get("v") || url.searchParams.get("V");
    console.log("linkValidity", linkValidity);
    if (!repId) {
        var cookieArr = document.cookie.split(";");
        for (var i = 0; i < cookieArr.length; i++) {
            var salesrep = cookieArr[i].split("=");

            if ("SR_RepId" == salesrep[0].trim()) {
                repId = salesrep[1].trim();
                break;
            }
        }
        repId = repId || url.searchParams.get("AMBASSADOR");
    }
    console.log("ambassador = " + repId);
    if (repId) {
        var data = 'attributes[rep]=' + repId;
        $.ajax({
            type: 'POST',
            url: '/cart/update.js',
            dataType: 'json',
            data: data,
            success: function (res) {
                console.log("Added repId to cart note");
            },

        });
    }

    if (repId) {
        var rep_id = repId.replace(/[^\d]/g, '');
        var repname = repId.replace(/\d+/g, '');
        console.log(rep_id);
        console.log(repname);

        if (linkValidity != null && parseInt(linkValidity) != 0) {
            var date = new Date();
            date.setTime(date.getTime() + (linkValidity * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
            document.cookie = "SR_RepId=" + repId + expires;
        }

        var urlVal = "/apps/SalesRep?customerId=" + rep_id + "&customerName=" + repname + "&affiliateCodeString=" + rep_id + "&data=6";
        $.ajax({
            url: urlVal,
            type: 'GET',
            dataType: 'json',
            success: function (data, status) {  
                if(data.rep_info != null || typeof data.rep_info != "undefined")
                {
                    var closeButton = document.createElement("DIV");
                    closeButton.setAttribute('id', 'sr_closebtn');
                    closeButton.innerHTML = "X";
                    closeButton.setAttribute('style', 'margin-bottom: 18em;margin-top: -15em;padding-bottom: -10em;color: white;margin-left: -1rem;cursor: pointer;');
                    closeButton.setAttribute("onclick","closePopup()");
                    if (data.rep_info.bioStyle == "" || data.rep_info.bioStyle == null || data.rep_info.bioStyle == "Bottom Right") {
                        var div = document.createElement("DIV");
                        div.setAttribute('class', 'sr_popup');
                        div.setAttribute('style', 'position: fixed;bottom: 0;right: 0;height: 20px;z-index: 9999 !important;');

                        var div1 = document.createElement("DIV");
                        div1.setAttribute('style', 'position: fixed;bottom: 0;right: 0;');
                        div1.setAttribute('class', 'popupavtar');
                        div1.setAttribute('id', 'myavtar');
                        div1.setAttribute('style', 'animation-delay:0s;animation-direction:normal;animation-duration:1s;animation-fill-mode:none;animation-iteration-count:1;animation-name:fadeIn;animation-play-state:running;' +
                            'animation-timing-function:ease;background-color:rgb(85, 85, 85);border-bottom-left-radius:6px;border-bottom-right-radius:6px; border-top-left-radius:6px;border-top-right-radius:6px;bottom:25px;box-sizing:border-box;' +
                            'color:rgb(255, 255, 255);cursor:pointer;display:block;font-family:"Work Sans", HelveticaNeue, "Helvetica Neue",sans-serif; font-size:16px;left:0px;line-height:24px;margin-left:-270px;padding-bottom:8px;' +
                            'padding-left:0px; padding-right:0px;padding-top:8px;position:absolute;text-align:center ;text-size-adjust: 100%;user-select:none;visibility:visible;width:250px;z-index: 9999 !important;-webkit-font-smoothing:antialiased;');

                        var div2 = document.createElement("DIV");
                        div2.setAttribute('class', 'popuptext');
                        div2.setAttribute('id', 'myPopup');
                        div2.setAttribute('style', 'animation-delay:0s;animation-direction:normal;animation-duration:1s;animation-fill-mode:none;animation-iteration-count:1;animation-name:fadeIn;animation-play-state:running;' +
                            'animation-timing-function:ease;background-color:rgb(85, 85, 85);border-bottom-left-radius:6px;border-bottom-right-radius:6px; border-top-left-radius:6px;border-top-right-radius:6px;bottom:25px;box-sizing:border-box;' +
                            'color:rgb(255, 255, 255);cursor:pointer;display:block;font-family:"Work Sans", HelveticaNeue, "Helvetica Neue",sans-serif; font-size:16px;left:0px;line-height:24px;margin-left:-270px;padding-bottom:8px;' +
                            'padding-left:0px; padding-right:0px;padding-top:8px;position:absolute;text-align:center ;text-size-adjust: 100%;user-select:none;visibility:visible;width:250px;z-index: 9999 !important;-webkit-font-smoothing:antialiased;');

                    }
                    else {
                        if (data.rep_info.bioStyle == "Bottom Left") {
                            var div = document.createElement("DIV");
                            div.setAttribute('class', 'sr_popup');
                            div.setAttribute('style', 'bottom: 0;right: 0;height: 20px;z-index: 9999 !important;');

                            var div1 = document.createElement("DIV");
                            div1.setAttribute('style', 'position: fixed;bottom: 0;right: 0;');
                            div1.setAttribute('class', 'popupavtar');
                            div1.setAttribute('id', 'myavtar');
                            div1.setAttribute('style', 'animation-delay:0s;animation-direction:normal;animation-duration:1s;animation-fill-mode:none;animation-iteration-count:1;animation-name:fadeIn;animation-play-state:running;' +
                                'animation-timing-function:ease;background-color:rgb(85, 85, 85);border-bottom-left-radius:6px;border-bottom-right-radius:6px; border-top-left-radius:6px;border-top-right-radius:6px;bottom:25px;box-sizing:border-box;' +
                                'color:rgb(255, 255, 255);cursor:pointer;display:block;font-family:"Work Sans", HelveticaNeue, "Helvetica Neue",sans-serif; font-size:16px;left:0px;line-height:24px;margin-left:-270px;padding-bottom:8px;' +
                                'padding-left:0px; padding-right:0px;padding-top:8px;position:absolute;text-align:center ;text-size-adjust: 100%;user-select:none;visibility:visible;width:250px;z-index: 9999 !important;-webkit-font-smoothing:antialiased;');

                            var div2 = document.createElement("DIV");
                            div2.setAttribute('class', 'popuptext');
                            div2.setAttribute('id', 'myPopup');
                            div2.setAttribute('style', 'animation-delay:0s;animation-direction:normal;animation-duration:1s;animation-fill-mode:none;animation-iteration-count:1;animation-name:fadeIn;animation-play-state:running;' +
                                'animation-timing-function:ease;background-color:rgb(85, 85, 85);border-bottom-left-radius:6px;border-bottom-right-radius:6px; border-top-left-radius:6px;border-top-right-radius:6px;bottom:25px;box-sizing:border-box;' +
                                'color:rgb(255, 255, 255);cursor:pointer;display:block;font-family:"Work Sans", HelveticaNeue, "Helvetica Neue",sans-serif; font-size:16px;left:0px;line-height:24px;padding-bottom:8px;' +
                                'padding-left:0px; padding-right:0px;padding-top:8px;position:absolute;text-align:center ;text-size-adjust: 100%;user-select:none;visibility:visible;width:250px;z-index: 9999 !important;-webkit-font-smoothing:antialiased;float:left;');

                        }
                        if (data.rep_info.bioStyle == "Bottom Middle") {
                            var div = document.createElement("DIV");
                            div.setAttribute('class', 'sr_popup');
                            div.setAttribute('style', 'bottom: 0;right: 0;height: 20px;z-index: 9999 !important;');
                            var div1 = document.createElement("DIV");
                            div1.setAttribute('style', 'position: fixed;bottom: 0;right: 0;height: 500px; width:500px');
                            div1.setAttribute('class', 'popupavtar');
                            div1.setAttribute('id', 'myavtar');
                            div1.setAttribute('style', 'animation-delay:0s;animation-direction:normal;animation-duration:1s;animation-fill-mode:none;animation-iteration-count:1;animation-name:fadeIn;animation-play-state:running;' +
                                'animation-timing-function:ease;background-color:rgb(85, 85, 85);border-bottom-left-radius:6px;border-bottom-right-radius:6px; border-top-left-radius:6px;border-top-right-radius:6px;bottom:25px;box-sizing:border-box;' +
                                'color:rgb(255, 255, 255);cursor:pointer;display:block;font-family:"Work Sans", HelveticaNeue, "Helvetica Neue",sans-serif; font-size:16px;left:0px;line-height:24px;margin-left:-270px;padding-bottom:8px;' +
                                'padding-left:0px; padding-right:0px;padding-top:8px;position:absolute;text-align:center ;text-size-adjust: 100%;user-select:none;visibility:visible;width:250px;z-index: 9999 !important;-webkit-font-smoothing:antialiased;');

                            var div2 = document.createElement("DIV");
                            div2.setAttribute('class', 'popuptext');
                            div2.setAttribute('id', 'myPopup');
                            div2.setAttribute('style', 'animation-delay:0s;animation-direction:normal;animation-duration:1s;animation-fill-mode:none;animation-iteration-count:1;animation-name:fadeIn;animation-play-state:running;' +
                                'animation-timing-function:ease;background-color:rgb(85, 85, 85);border-bottom-left-radius:6px;border-bottom-right-radius:6px; border-top-left-radius:6px;border-top-right-radius:6px;bottom:25px;box-sizing:border-box;' +
                                'color:rgb(255, 255, 255);cursor:pointer;display:block;font-family:"Work Sans", HelveticaNeue, "Helvetica Neue",sans-serif; font-size:16px;left:0px;line-height:24px;margin-left:40%;padding-bottom:8px;' +
                                'padding-left:0px; padding-right:0px;padding-top:8px;position:absolute;text-align:center ;text-size-adjust: 100%;user-select:none;visibility:visible;width:250px;z-index: 9999 !important;-webkit-font-smoothing:antialiased;float:left;');

                        }
                        if (data.rep_info.bioStyle == "Top Left") {
                            var div = document.createElement("DIV");
                            div.setAttribute('class', 'sr_popup');
                            div.setAttribute('style', 'bottom: 0;right: 0;height: 20px;z-index: 9999 !important;');
                            var div1 = document.createElement("DIV");
                            div1.setAttribute('style', 'position: fixed;bottom: 0;right: 0;');
                            div1.setAttribute('class', 'popupavtar');
                            div1.setAttribute('id', 'myavtar');
                            div1.setAttribute('style', 'animation-delay:0s;animation-direction:normal;animation-duration:1s;animation-fill-mode:none;animation-iteration-count:1;animation-name:fadeIn;animation-play-state:running;' +
                                'animation-timing-function:ease;background-color:rgb(85, 85, 85);border-bottom-left-radius:6px;border-bottom-right-radius:6px; border-top-left-radius:6px;border-top-right-radius:6px;bottom:25px;box-sizing:border-box;' +
                                'color:rgb(255, 255, 255);cursor:pointer;display:block;font-family:"Work Sans", HelveticaNeue, "Helvetica Neue",sans-serif; font-size:16px;left:0px;line-height:24px;margin-left:-270px;padding-bottom:8px;' +
                                'padding-left:0px; padding-right:0px;padding-top:8px;position:absolute;text-align:center ;text-size-adjust: 100%;user-select:none;visibility:visible;width:250px;z-index: 9999 !important;-webkit-font-smoothing:antialiased;');

                            var div2 = document.createElement("DIV");
                            div2.setAttribute('class', 'popuptext');
                            div2.setAttribute('id', 'myPopup');
                            div2.setAttribute('style', 'animation-delay:0s;animation-direction:normal;animation-duration:1s;animation-fill-mode:none;animation-iteration-count:1;animation-name:fadeIn;animation-play-state:running;' +
                                'animation-timing-function:ease;background-color:rgb(85, 85, 85);border-bottom-left-radius:6px;border-bottom-right-radius:6px; border-top-left-radius:6px;border-top-right-radius:6px;box-sizing:border-box;' +
                                'color:rgb(255, 255, 255);cursor:pointer;display:block;font-family:"Work Sans", HelveticaNeue, "Helvetica Neue",sans-serif; font-size:16px;left:0px;line-height:24px;padding-bottom:8px;' +
                                'padding-left:0px; padding-right:0px;padding-top:8px;position:absolute;text-align:center ;text-size-adjust: 100%;user-select:none;visibility:visible;width:250px;z-index: 9999 !important;-webkit-font-smoothing:antialiased;float:left;top:50px;');

                        }
                        if (data.rep_info.bioStyle == "Top Right") {
                            var div = document.createElement("DIV");
                            div.setAttribute('class', 'sr_popup');
                            div.setAttribute('style', 'position: fixed;bottom: 0;right: 0;height: 20px;z-index: 9999 !important;');
                            var div1 = document.createElement("DIV");
                            div1.setAttribute('style', 'position: fixed;bottom: 0;right: 0;');
                            div1.setAttribute('class', 'popupavtar');
                            div1.setAttribute('id', 'myavtar');
                            div1.setAttribute('style', 'animation-delay:0s;animation-direction:normal;animation-duration:1s;animation-fill-mode:none;animation-iteration-count:1;animation-name:fadeIn;animation-play-state:running;' +
                                'animation-timing-function:ease;background-color:rgb(85, 85, 85);border-bottom-left-radius:6px;border-bottom-right-radius:6px; border-top-left-radius:6px;border-top-right-radius:6px;bottom:25px;box-sizing:border-box;' +
                                'color:rgb(255, 255, 255);cursor:pointer;display:block;font-family:"Work Sans", HelveticaNeue, "Helvetica Neue",sans-serif; font-size:16px;left:0px;line-height:24px;margin-left:-270px;padding-bottom:8px;' +
                                'padding-left:0px; padding-right:0px;padding-top:8px;position:absolute;text-align:center ;text-size-adjust: 100%;user-select:none;visibility:visible;width:250px;z-index: 9999 !important;-webkit-font-smoothing:antialiased;');

                            var div2 = document.createElement("DIV");
                            div2.setAttribute('class', 'popuptext');
                            div2.setAttribute('id', 'myPopup');
                            div2.setAttribute('style', 'animation-delay:0s;animation-direction:normal;animation-duration:1s;animation-fill-mode:none;animation-iteration-count:1;animation-name:fadeIn;animation-play-state:running;' +
                                'animation-timing-function:ease;background-color:rgb(85, 85, 85);border-bottom-left-radius:6px;border-bottom-right-radius:6px; border-top-left-radius:6px;border-top-right-radius:6px;bottom:527px;box-sizing:border-box;' +
                                'color:rgb(255, 255, 255);cursor:pointer;display:block;font-family:"Work Sans", HelveticaNeue, "Helvetica Neue",sans-serif; font-size:16px;left:0px;line-height:24px;margin-left:-270px;padding-bottom:8px;' +
                                'padding-left:0px; padding-right:0px;padding-top:8px;position:absolute;text-align:center ;text-size-adjust: 100%;user-select:none;visibility:visible;width:250px;z-index: 9999 !important;-webkit-font-smoothing:antialiased;');

                        }
                    }

                    document.body.appendChild(div);
                    var profileImageUrl = data.rep_info.ProfileImagePath || "";
                    if (profileImageUrl != null && profileImageUrl != "") {
                        div.appendChild(div1);
                        $("#myavtar").html('<img src=' + profileImageUrl + ' alt="Profile" height="150px" width="150px" style="border-radius:50%;margin-bottom: 10%;">');
                    }
                    if (data.rep_info.bio != null && data.rep_info.bio != "") {
                        div.appendChild(closeButton);
                        div.appendChild(div2);
                        document.getElementById("myPopup").innerHTML = data.rep_info.bio;
                        var popup = document.getElementById("myPopup");
                        popup.classList.toggle("sr_show");
                    }
                }
            }
        });
    }
}

function LoadShareCartScript($) {

    //code to add spinner.
    var div = document.createElement("DIV");
    div.setAttribute('id', 'sr_sharedcartspinner');
    div.setAttribute('style','position:fixed;border: 16px solid #f3f3f3;  border-top: 16px solid #3498db;  border-radius: 50%; width: 120px; height: 120px; animation: spin 2s linear infinite;top: 50%;right: 50%;bottom: 50%;left: 50%;z-index: 9999 !important;');
  	document.body.appendChild(div);

    var url_string = window.location.href;
    var url = new URL(url_string);
    var cartUniqueId = "";
    cartUniqueId = url.searchParams.get("mycart") || url.searchParams.get("MYCART");
    var addSalesRepIdToCart = false;
    var repId = "";
    var splitCartId = cartUniqueId != null && cartUniqueId != "" ? cartUniqueId.split("-") : [];
    console.log("cartUniqueId", cartUniqueId);

    var cookieArr = document.cookie.split(";");
    for (var i = 0; i < cookieArr.length; i++) {
        var salesrep = cookieArr[i].split("=");

        if ("SR_RepId" == salesrep[0].trim()) {
            repId = salesrep[1].trim();
            break;
        }
    }

	if (repId == "") {
      addSalesRepIdToCart = true;
      repId = splitCartId[1];
     }

    if (repId && cartUniqueId != null && cartUniqueId != "") {
        var rep_id = repId.replace(/[^\d]/g, '');
        var repname = repId.replace(/\d+/g, '');

        var urlVal = "/apps/SalesRep?customerId=" + rep_id + "&customerName=" + repname + "&data=28&cartuniqueid=" + cartUniqueId;
        $.ajax({
            url: urlVal,
            type: 'GET',
            dataType: 'json',
            success: function (data, status) {
                console.log(data);
                var spinnerDiv = document.getElementById("sr_sharedcartspinner");
			    spinnerDiv.remove();
                var productDetails = data != null ? JSON.parse(data.CartProductDetails) : [];
                if (productDetails.length != 0) {
                  
                var productAvailability = {};
                  
                for (var i = 0; i < productDetails.length; i++) {
                  if(productDetails[i].handle != undefined && productDetails[i].handle != null && productDetails[i].handle != ""){
                    var jsonResp = getProductByHandle(productDetails[i].handle, productAvailability, productDetails[i].id);
                  }
				}
                  
          for (var i = 0; i < productDetails.length; i++) {
          if(productDetails[i].handle != undefined && productDetails[i].handle != null && productDetails[i].handle != ""){
			if (productAvailability != undefined && (productAvailability[productDetails[i].id] == undefined || productAvailability[productDetails[i].id] == false)) {
				//delete productDetails[i];
				productDetails.splice(i, 1);3
				i--;
			}
          }
		}

                    var dataObj = {
                        "items": productDetails
                    }

                    $.ajax({
                        type: 'POST',
                        url: '/cart/clear.js',
						data: '',
    				   dataType: 'json',
                     success: function(data){
                       console.log("token",data.token);
                    $.ajax({
                        type: 'POST',
                        url: '/cart/add.js',
                        dataType: 'json',
                        data: dataObj,
                      success: function(){
                        console.log("ambassador = " + repId);
                    if (repId && addSalesRepIdToCart) {
                        var data = 'attributes[rep]=' + repId +'&attributes[cartId]=' + cartUniqueId +'&attributes[repOrderType]=SharedCart';
                        $.ajax({
                            type: 'POST',
                            url: '/cart/update.js',
                            dataType: 'json',
                            data: data,
                            success: function (res) {
							window.setTimeout(function () { 
                            window.location = "/cart";
                            }, 5);
                                console.log("Added repId to cart note");
                            }
                        });
                    }
                      }
                    });
                      }
                    });

                }
            }
        });
    }
    else{
     var spinnerDiv = document.getElementById("sr_sharedcartspinner");
     spinnerDiv.remove();
    }
}

var getProductByHandle = function (productHandle, productAvailability, variantId) {
		$.ajax({
			url: '/products/' + productHandle + '.js',
			type: 'GET',
			async: false,
			dataType: 'json', // added data type
			success: function (res) {
				console.log(res);
				productAvailability[variantId] = res.available;
				return res;
			}
		});
}

var isSRCartDataLodaed = false;

window.onload = function () {
    isSRCartDataLodaed = true;
    loadAffilateTrackingScript();
}

function checkIfDataIsLoaded(){
  if(!isSRCartDataLodaed){
  loadAffilateTrackingScript();
  }
}

setTimeout(function () {
checkIfDataIsLoaded();
}, 1000);


//(function (d, s, id) {
       // var js, fjs = d.getElementsByTagName(s)[0];
       //if (d.getElementById(id)) return;
        //js = d.createElement(s); js.id = id;
        //js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.9";
        //fjs.parentNode.insertBefore(js, fjs);
//}(document, 'script', 'facebook-jssdk'));