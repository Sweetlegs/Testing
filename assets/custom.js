document.querySelectorAll(".newsletter-form__button").forEach(function(obj) {
  obj.addEventListener("click", function(e) {
    if(document.querySelector("#newsletterGuaranteeCheck").checked) {
    }
    else {
      e.preventDefault();
    }
  });
});

document.querySelectorAll(".btn-password_notify").forEach(function(obj) {
  obj.addEventListener("click", function(e) {
    console.log("clicked");
    if(document.querySelector("#newsletterGuaranteeCheck_Password").checked) {
    }
    else {
      e.preventDefault();
    }
  });
});

// function detectSpecialChar(e) {
//     var k = e.keyCode;
//     return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8   || (k >= 48 && k <= 57));
// }

// document.querySelectorAll("#CartSpecialInstructions").forEach(function(obj) {
//   obj.addEventListener("keydown", function(e) {
//     if(!detectSpecialChar(e)) {
//       e.preventDefault();
//     }
//   });
// });

const variant_selector = document.querySelector("#variant-selector");
jQuery(document).ready(function($) {  
        var handle      = window.location.href.replaceAll("https://shop.chick-fil-a.com/products/", ""); 
                        if(handle) {
                            var selector = "button[handle*='" + handle + "']";
       											console.log('mnop', $(selector).addClass('selected'));
                        }

  $(document).on("click", ".product-sibling-swatches button", function(e) {
    const swatchesProduct = $('.product-sibling-swatches').html();
    let handle = $(this).attr('handle');
    
      window.location = `https://shop.chick-fil-a.com/products/${handle}`;
    
  })
  $(document).on("click", "[data-option-buttons] button", function(e) {
   
    const variant_selector = document.querySelector("#variant-selector");
    
    var ind = 0;
    var depth = document.querySelectorAll("[data-option-buttons]").length;
    var opt_val = [];
    document.querySelectorAll("[data-option-buttons]").forEach(function(group) {
      var k = 1;
      if(depth == 1) {
        k = 0;
      }
      if(ind < depth - k) {
        var v = '';
        if(group.querySelector("button.selected").hasAttribute("data-value")) {
          v = group.querySelector("button.selected").getAttribute("data-value").trim();
        }
        else if(group.querySelector("button.selected").hasAttribute("data-label")) {
          v = group.querySelector("button.selected").getAttribute("data-label").trim();
        }
        else {
          v = group.querySelector("button.selected").textContent.trim();
        }
        opt_val.push(v);
      }
      else {
        var opts = variant_selector.querySelectorAll("option");

        group.querySelectorAll("button").forEach(function(obj) {
          var f1 = 0;
          var v = '';
          if(obj.hasAttribute("data-value")) {
            v = obj.getAttribute("data-value").trim();
          }
          else if(obj.hasAttribute("data-label")) {
            v = obj.getAttribute("data-label").trim();
          }
          else {
            v = obj.textContent.trim();
          }
          opts.forEach(function(obj1) {
            var last_op = obj1.getAttribute("data-variant").split(" / ");
            var f2 = 0;

            for(var i = 0; i < last_op.length - k; i ++) {
              if(opt_val[i] == last_op[i]) {
                f2 = 1;
                break;
              }
            }

            if(f2 == 1) {
              if(v == last_op[last_op.length - 1]) {
                if(obj1.getAttribute("data-active") == 'true') {
                  f1 = 1;
                }
                return;
              }
            }
          });

          if(f1 == 0) {
            console.log('this hit sold');
            obj.classList.add("soldout");
          }
          else {
            console.log('this hit out');
            obj.classList.remove("soldout");
          }
        });
      }
      ind ++;
    });
  });
  
  if(variant_selector) {
    document.querySelector("[data-option-buttons] button.selected")?.click();
  }
});

  const elements = document.querySelectorAll('.product-item__inner.addon .select-wrapper select')
// Loop through each element and add an event listener
for (let i = 0; i < elements.length; i++) {
  const element = elements[i];
  element.addEventListener('change', function() {
    // Do something when the element is clicked
    console.log('Clicked element:', this.value);
    console.log('thid ',  this.closest('.addon-container').querySelector('.product-item__quick-add-button').setAttribute('data-product-id', this.value));

  });
}


document.addEventListener("openQuickAdd", function(e) {
  console.log("openQuickAdd");
  const variant_selector = document.querySelector("#variant-selector");
  
  if(variant_selector) {
    document.querySelector("[data-option-buttons] button.selected")?.click();
  }
});

  $(document).ready(function() {
    $('body').on('click', '[name="checkout"], [name="goto_pp"], [name="goto_gc"]', function() {
      if ($('#agree').is(':checked')) {
        $(this).submit();
      }
      else {
        alert("Please agree to our Terms of Service and acknowledge receipt of our Privacy Policy and California Privacy Notice to make a purchase.");
        return false;
      }
    });
  });