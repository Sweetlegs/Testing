/*
* Pipeline Theme
*
* Use this file to add custom Javascript to Pipeline.  Keeping your custom
* Javascript in this fill will make it easier to update Pipeline. In order
* to use this file you will need to open layout/theme.liquid and uncomment
* the custom.js script import line near the bottom of the file.
*
*/


(function() {

  // Below are example event listeners.  They listen for theme events that Pipeline
  // fires in order to make it easier for you to add customizations.

  // Keep your scripts inside this IIFE function call to avoid leaking your
  // variables into the global scope.


  document.addEventListener('theme:variant:change', function(event) {
    // You might use something like this to write a pre-order feature or a
    var variant = event.detail.variant;
    var container = event.target;
    if (variant) {
      console.log('Container ———————— ↓');
      console.log(container);
      console.log('Variant —————————— ↓');
      console.log(variant);
      // ... update some element on the page
    }
  });

  document.addEventListener('theme:cart:change', function(event) {
    var cart = event.detail.cart;
    if (cart) {
      console.log('Cart ———————————— ↓');
      console.log(cart);
      // ... update an app or a custom shipping caluclator
    }
  });
  // Fired when page loads to update header values
  document.addEventListener('theme:cart:init', (e) => {
    console.log('theme:cart:init');
    console.log(e);
  });

  // Debounced scroll listeners.  Up and down only fire on direction changes
  // These events are useful for creating sticky elements and popups.
  document.addEventListener('theme:scroll', e => { console.log(e); });
  document.addEventListener('theme:scroll:up', e => { console.log(e); });
  document.addEventListener('theme:scroll:down', e => { console.log(e); });

  // Debounced resize listener to bundle changes that trigger document reflow
  document.addEventListener('theme:resize', e => { console.log(e); });

  // Locks and unlocks page scroll for modals and drawers
  // These are commented out because firing them will lock the page scroll
  // the lock event must set `detail` to the modal or drawer body so the 
  // scroll locking code knows what element should maintain scoll. 
  // document.dispatchEvent(new CustomEvent('theme:scroll:lock', {bubbles: true, detail: scrollableInnerElement}));
  // document.dispatchEvent(new CustomEvent('theme:scroll:unlock', {bubbles: true}));


  // ^^ Keep your scripts inside this IIFE function call to avoid leaking your
  // variables into the global scope.
})();

// --------------------
// DELIVERY TIMER
// --------------------

var setTimer = function() {
  $('.countdown').each(function() {
    var target = $(this).data('target');
    if (!target) {
      return;
    }
    var now = parseInt(Date.now() / 1000, 10);
    var diff = (target - now)/60;
    if (diff <= 0) {
      $(this).parent().hide();
      return;
    }

    var hours = parseInt(diff/60, 10);
    var mins = parseInt(diff - (hours * 60), 10);
    var hoursStr = hours + ' hours';
    var minsStr = mins + ' minutes';
    if (hours === 1) {
      hoursStr = hours + ' hour'
    }
    if (hours === 0) {
      hoursStr = ''
    }
    if (mins === 1) {
      minsStr = mins + ' minutes'
    }
    if (mins === 0) {
      minsStr = ''
    }
    var str = hoursStr + ' ' + minsStr;
    $(this).text(str);
  });
}
setInterval(setTimer, 60*1000);
setTimer();

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function showTimer() {
  var val = getCookie('GlobalE_Data') || JSON.stringify({countryISO: 'US'});
  if (val) {
    val = JSON.parse(val);
    if (val.countryISO) {
      if (val.countryISO === 'US') {
        $('.delivery-timer.us').show();
      } else {
        $('.delivery-timer.non-us').show();        
      }
      return;
    }
  }
  setTimeout(showTimer, 1000);
}

showTimer();

$( document ).ready(function () {
  setTimeout( function () { 
    $("#delivery-timer").detach().appendTo('.product__submit__buttons')
    // $("#variantDefectMessage").detach().appendTo('.product__submit__buttons')
  }, 1000);
});

// --------------------
// HEADER STUFF
// --------------------

$( document ).ready(function () {
  $('.theme__header').bind('mouseenter', function (event) { 
    $('.theme__header').addClass('header-hover');
  });
  $('.theme__header').bind('mouseleave', function (event) { 
    $('.theme__header').removeClass('header-hover');
  });
});

// --------------------
// OTHER
// --------------------

$( document ).ready(function() {
  $('.dropdown__family.parent-sub-menu').hover(function() {
    // $('.sub-menu').removeClass('showMe');
    $(this).find('.sub-menu').toggle('showMe');
  });
});

// --------------------
// VARIANT DEFECT MESSAGE
// --------------------

$( document ).ready(function() {
  if (document.getElementById('metafieldDefect')) {
    $('input').on('change', function(e) {
      const metafieldDefect = JSON.parse(document.getElementById('metafieldDefect').textContent);
      const id =  $(this).val();
      if(metafieldDefect[id]) {
        $('#variantDefectMessage').text(metafieldDefect[id]);
      }  else {
        $('#variantDefectMessage').text('');
      }     
    });
  }
});

// --------------------
// CART DRAWER
// --------------------

$( document ).ready(function() {
  $('.cart-drawer-checkout-button').click(function(e) {
    e.preventDefault();
    window.location.href = "/cart";
  });
});


// --------------------
// SWATCHES
// --------------------

function initSwatches () {
  if ($('body').hasClass('template-product')) {

    function hideOtherSwatchThumbs () {
      let $form = $('[data-product-form');
      let id = $form.find('input[name=id]').val();
      let metacolor = $form.find('input[name="options[Color]"]:checked').val();
      let $thumbs = $('[data-product-thumbs]');

      $thumbs.find('.media__thumb').each(function () {
        if ($(this).find('img').attr('alt') != metacolor) {
          $(this).hide();
        } else {
          $(this).show();
        }
      });
      $thumbs[0].dispatchEvent(new CustomEvent('theme:swatches:change'));
    }

    let productJSON = JSON.parse( $('[data-product-json]').html() );
    let vID = $('[data-product-form').find('input[name=id]').val();
    let vJSON = $.grep(productJSON.variants, function (v) {
      return v.id == vID;
    });
    let mediaId = vJSON[0].featured_media.id;

    $('[data-product-slideshow]')[0].dispatchEvent(
      new CustomEvent('theme:image:change', {
        detail: {
          id: mediaId
        },
      })
    );
    hideOtherSwatchThumbs();
    $('.shopify-product-form .swatch__button').click(hideOtherSwatchThumbs);

  }


  $('.swatch__button label').each(function(i, obj) {
    if($(this).data('metacolor')) {
      var metacolor = $(this).data('metacolor');
      metacolor = JSON.parse(metacolor);
      var dataColor = $(this).data('swatch');

      if(metacolor[dataColor]) {
        $(this).css("background",metacolor[dataColor]);
      }
    }
  });

  if (document.getElementById('metafieldColorSwatch')) {
    const metafieldColorSwatch = JSON.parse(document.getElementById('metafieldColorSwatch').textContent);
    if(metafieldColorSwatch) {
      $("[data-swatch]").each(function(){
        var color = $(this).attr('data-value');
        if(color) {
          $(this).css("background",metafieldColorSwatch[color]);
        }
      });
    }
  }

  function loadScript(options = {}) {
    return window
    .fetch(options.json)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      const colors = response.colors;

      $('.product-grid-item .swatch__button label').each(function(i, obj) {
 
        var dataColor = $(this).data('swatch');

        if($(this).data('swatch')) {
          const findColor = colors.find(item => {
            return Object.keys(item)[0] == dataColor;
          });
          if(findColor) {
            $(this).css("background", findColor[dataColor]);
          }
        }

        if($(this).data('metacolor')) {
          var metacolor = $(this).data('metacolor');
          metacolor = JSON.parse(metacolor);
          var dataColor = $(this).data('swatch');

          if(metacolor[dataColor]) {
            $(this).css("background",metacolor[dataColor]);
          }
        }
      });
    });
  }

  const sizeChart = loadScript({json: window.theme.assets.swatches});

  $('.swatch__button.metacolor').click(function(e) { 
    e.preventDefault();
    e.stopImmediatePropagation();
    const selectedVariants = JSON.parse($(this).attr('data-variant'));
    var html = "<div class='product__badge product__badge--sale'>Sale</div>";
    if(selectedVariants['price'] < selectedVariants['compare_at_price']) {
      $(this).closest('.product-grid-item').find('div .lazy-image.double__image').append(html);
    } else {
      $(this).closest('.product-grid-item').find('.product__badge.product__badge--sale').remove();
    }
    var html = `<div class='less-inventory'>${selectedVariants['inventory_quantity']} LEFT</div>`;
    if(selectedVariants['inventory_quantity'] <= 10) {
      $(this).closest('.product-grid-item').find('div .lazy-image.double__image').append(html);
    } else {
      $(this).closest('.product-grid-item').find('.less-inventory').remove();
    }
    
    
    $(this).find('input').prop("checked",true);
    let img = $(this).find('input').attr('img');    
    imgSrc = `url("https://cdn.shopify.com/s/files/1/1991/6023/${img}")`;
    $(this).parent().parent().parent().parent().find('a.lazy-image .collection__image__top.lazyloaded').css('background-image', imgSrc);
  });

}

$( document ).ready(function() {
  initSwatches();
  document.addEventListener('related-products:added', () => {
    initSwatches();
  });
  document.addEventListener('recent-products:added', () => {
    initSwatches();
  });

$( ".read-more-content" ).click(function() {
  $( ".content" ).slideToggle( "fast" );
      var $this = $(this);
        $this.toggleClass("open");

        if ($this.hasClass("open")) {
            $this.html("Less");
          $( ".content-truncate" ).css('display', 'none');
        } else {
            $this.html("Read more");
          $( ".content-truncate" ).css('display', 'block');
        }
});
});
