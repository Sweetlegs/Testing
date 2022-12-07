jQuery.fn.setAllToMaxHeight = function(){
   return this.height( Math.max.apply(this, jQuery.map( this , function(e){ return jQuery(e).height() }) ) );
}

window.is_ie = /MSIE|Trident/i.test(navigator.userAgent);

Sunrise.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on('shopify:section:load', this._onSectionLoad.bind(this))
    .on('shopify:section:unload', this._onSectionUnload.bind(this))
    .on('shopify:section:select', this._onSelect.bind(this))
    .on('shopify:section:deselect', this._onDeselect.bind(this))
    .on('shopify:block:select', this._onBlockSelect.bind(this))
    .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};

Sunrise.Sections.prototype = _.assignIn({}, Sunrise.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (_.isUndefined(constructor)) {
      return;
    }

    var instance = _.assignIn(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function(evt) {
    var container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload: function(evt) {
    this.instances = _.filter(this.instances, function(instance) {
      var isEventInstance = (instance.id === evt.detail.sectionId);

      if (isEventInstance) {
        if (_.isFunction(instance.onUnload)) {
          instance.onUnload(evt);
        }
      }

      return !isEventInstance;
    });
  },

  _onSelect: function(evt) {
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onSelect)) {
      instance.onSelect(evt);
    }
  },

  _onDeselect: function(evt) {
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onDeselect)) {
      instance.onDeselect(evt);
    }
  },

  _onBlockSelect: function(evt) {
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onBlockSelect)) {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function(evt) {
    var instance = _.find(this.instances, function(instance) {
      return instance.id === evt.detail.sectionId;
    });

    if (!_.isUndefined(instance) && _.isFunction(instance.onBlockDeselect)) {
      instance.onBlockDeselect(evt);
    }
  },

  register: function(type, constructor) {
    this.constructors[type] = constructor;

    $('[data-section-type=' + type + ']').each(function(index, container) {
      this._createInstance(container, constructor);
    }.bind(this));
  }
});

Sunrise.customerTemplates = (function() {
   function initEventListeners() {
      // Show reset password form
      $('#recover-password').on('click', function(evt) {
         evt.preventDefault();
         toggleRecoverPasswordForm();
      });

      // Hide reset password form
      $('#hide-password-form').on('click', function(evt) {
         evt.preventDefault();
         toggleRecoverPasswordForm();
      });
   }

   //Show/Hide recover password form 
   function toggleRecoverPasswordForm() {
      $('#recover-password-form').toggleClass('hide');
      $('#customer-login-form').toggleClass('hide');
   }

   //Show reset password success message
   function resetPasswordSuccess() {
      var $formState = $('.reset-password-success');
      // check if reset password form was successfully submited.
      if (!$formState.length) {
         return;
      }
      // show success message
      $('#reset-success').removeClass('hide');
   }

   // Show/hide customer address forms
   function customerAddressForm() {
      var $newAddressForm = $('#AddressNewForm');

      if (!$newAddressForm.length) {
         return;
      }

      // Initialize observers on address selectors, defined in shopify_common.js
      if (Shopify) {
         new Shopify.CountryProvinceSelector('address_country_new', 'address_province_new', { 
            hideElement: 'address_province_container_new'
         });
      }

      // Initialize each edit form's country/province selector
      $('.address-country-option').each(function() {
         var formId = $(this).data('form-id');
         var countrySelector = 'address_country_' + formId;
         var provinceSelector = 'address_province_' + formId;
         var containerSelector = 'address_province_container_' + formId;

         new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
            hideElement: containerSelector
         });
      });

      // Toggle new/edit address forms
      $('.address-new-toggle').on('click', function(e) {
         e.preventDefault();
         $newAddressForm.toggleClass('hide');
      });

      $('.address-edit-toggle').on('click', function(e) {
         e.preventDefault();
         var formId = $(this).data('form-id');
         $('#edit_address_' + formId).toggleClass('hide');
      });

      $('.address-delete').on('click', function(e) {
         e.preventDefault();
         var $el = $(this);
         var formId = $el.data('form-id');
         var confirmMessage = $el.data('confirm-message');
         if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
            Shopify.postLink('/account/addresses/' + formId, {parameters: {_method: 'delete'}});
         }
      });
   }

   // Check URL for reset password hash
   function checkUrlHash() {
      var hash = window.location.hash;
      // Allow deep linking to recover password form
      if (hash === '#recover') {
         toggleRecoverPasswordForm();
      }
   }

   return {
      init: function() {
      checkUrlHash();
      initEventListeners();
      resetPasswordSuccess();
      customerAddressForm();
   }
   };
})();

//Image Helper Functions
Sunrise.Images = (function() {
   /* Preloads an image in memory and uses the browsers cache to store it until needed.
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute */
  function preload(images, size) {
    if (typeof images === 'string') {
      images = [images];
    }
    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      this.loadImage(this.getSizedImageUrl(image, size));
    }
  }

   /* Loads and caches an image in the browsers cache.
   * @param {string} path - An image url */
  function loadImage(path) {
    new Image().src = path;
  }

   /* Swaps the src of an image for another OR returns the imageURL to the callback function
   * @param image
   * @param element
   * @param callback */
  function switchImage(image, element, callback) {
    var size = this.imageSize(element.src);
    var imageUrl = this.getSizedImageUrl(image.src, size);

    if (callback) {
      callback(imageUrl, image, element); // eslint-disable-line callback-return
    } else {
      element.src = imageUrl;
    }
  }

   /* Find the Shopify image attribute size
   * @param {string} src
   * @returns {null} */
  function imageSize(src) {
    var match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);

    if (match !== null) {
      return match[1];
    } else {
      return null;
    }
  }

   /* Adds a Shopify size attribute to a URL
   * @param src
   * @param size
   * @returns {*} */
  function getSizedImageUrl(src, size) {
    if (size == null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

    if (match != null) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + '_' + size + suffix);
    }

    return null;
  }

  function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
  }

  return {
    preload: preload,
    loadImage: loadImage,
    switchImage: switchImage,
    imageSize: imageSize,
    getSizedImageUrl: getSizedImageUrl,
    removeProtocol: removeProtocol
  };
})();

//Currency Helpers
Sunrise.Currency = (function() {
  var moneyFormat = Sunrise.strings.money_format;

  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = (format || moneyFormat);

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = precision || 2;
      thousands = thousands || ',';
      decimal = decimal || '.';

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      var centsAmount = parts[1] ? (decimal + parts[1]) : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;
    }
    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney
  }
})();

Sunrise.Variants = (function() {
  function Variants(options) {
    this.$container = options.$container;
    this.product = options.product;
    this.enableHistoryState = options.enableHistoryState;
    this.singleOptionSelector = options.singleOptionSelector;
    this.originalSelectorId = options.originalSelectorId;
    this.currentVariant = this._getVariantFromOptions();

    $(this.singleOptionSelector).on('change', this._onSelectChange.bind(this));
  }

  Variants.prototype = _.assignIn({}, Variants.prototype, {
    _getCurrentOptions: function() {
      var currentOptions = _.map($(this.singleOptionSelector, this.$container), function(element) {
        var $element = $(element);
        var currentOption = {};
          currentOption.value = $element.val();
          currentOption.index = $element.data('index');
          return currentOption;
      });

      return currentOptions;
    },

    _getVariantFromOptions: function() {
      var selectedValues = this._getCurrentOptions();
      var variants = this.product.variants;

      var found = _.find(variants, function(variant) {
        return selectedValues.every(function(values) {
          return _.isEqual(variant[values.index], values.value);
        });
      });

      return found;
    },

    _onSelectChange: function() {
      var options = this._getCurrentOptions();
      var variant = this._getVariantFromOptions(options);

      this.$container.trigger({
        type: 'variantChange',
        variant: variant
      });

      if (!variant) {
        return;
      }

      this._updateMasterSelect(variant);
      this._updateImages(variant);
      this._updatePrice(variant);
      this._updateSKU(variant);
      this.currentVariant = variant;

      if (this.enableHistoryState) {
        this._updateHistoryState(variant);
      }
    },

    _updateImages: function(variant) {
      var variantImage = variant.featured_image || {};
      var currentVariantImage = this.currentVariant.featured_image || {};

      if (!variant.featured_image || variantImage.src === currentVariantImage.src) {
        return;
      }

      this.$container.trigger({
        type: 'variantImageChange',
        variant: variant
      });
    },

    _updateSKU: function(variant) {
      this.$container.trigger({
        type: 'variantSKUChange',
        variant: variant
      });
    },    
    
    _updatePrice: function(variant) {
      if (variant.price === this.currentVariant.price && variant.compare_at_price === this.currentVariant.compare_at_price) {
        return;
      }

      this.$container.trigger({
        type: 'variantPriceChange',
        variant: variant
      });
    },

    _updateHistoryState: function(variant) {
      if (!history.pushState || !variant) {
        return;
      }

      var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;
      window.history.replaceState({path: newurl}, '', newurl);
    },

    _updateMasterSelect: function(variant) {
      var $originalSelector = $(this.originalSelectorId);

      if (!variant) {
        return;
      }

      $originalSelector.find('[selected]').removeAttr('selected');
      $originalSelector.find('[value=' + variant.id + ']').prop('selected', 'selected');
    }
  });

  return Variants;
})();

Sunrise.Product = (function() {
  function Product(container) {
    var $container = this.$container = $(container),
        sectionId = $container.attr('data-section-id'),
        self = this;

    this.$item = $('.item', $container);
    this.$info = $('.info', $container);
    this.$images = $('.images', $container);
    this.$image = $('.images .image', $container);
    this.$window = $(window);
    this.$footer = $('.footer');
    this.index = 0;

    this.selectors = {
      originalSelectorId: '#productSelect-' + sectionId,
      addToCart: '#addToCart-' + sectionId,
      addToCartText: '#addToCartText-' + sectionId,
      productPrice: '#productPrice-' + sectionId,
      comparePrice: '#comparePrice-' + sectionId,
      productSKU: '#productSKU-' + sectionId,
      productStockMsg: '#stockMsg-' + sectionId,
      singleOptionSelector: '.single-option-selector-' + sectionId,
      productThumbImages: '.product-thumbs-' + sectionId + ' .smallimg',
      productFeaturedImage: '#product-shot',
      productImageWrap: '#more-images'
    };

    this.settings = {
      sectionId: sectionId,
      enableHistoryState: $container.data('enable-history-state') || true,
      namespace: '.product-' + sectionId,
      showPreOrder: $container.data("show-preorder"),
      showInventory: $container.data("show-inventory"),
      zoomEnabled: false,
      imageSize: null,
      imageZoomSize: null
    };

    // Stop parsing if we don't have the product json script tag
    if (!$('#ProductJson-' + sectionId).html()) {
      return;
    }

    this.productSingleObject = JSON.parse($('#ProductJson-' + sectionId).html());
    this.settings.imageSize = '1024x1024';
    this.settings.zoomEnabled = $container.data("zoom-enabled");

    this.init();
  }

  Product.prototype = _.assignIn({}, Product.prototype, {
    init: function() {
      this.initVariants();
      this.initMoreImages();
      this.initImageSwitch();
      this.initProductZoom();
    },
    initVariants: function() {
      var options = {
        $container: this.$container,
        enableHistoryState: this.settings.enableHistoryState,
        product: this.productSingleObject,
        singleOptionSelector: this.selectors.singleOptionSelector,
        originalSelectorId: this.selectors.originalSelectorId
      };

      this.variants = new Sunrise.Variants(options);
      this.$container.on('variantChange' + this.settings.namespace, this.updateAddToCartButton.bind(this));
      this.$container.on('variantPriceChange' + this.settings.namespace, this.updatePrices.bind(this));
      this.$container.on('variantImageChange' + this.settings.namespace, this.updateImages.bind(this));
      this.$container.on('variantSKUChange' + this.settings.namespace, this.updateSKU.bind(this));
    },
   initImageSwitch: function(event) {
      if (!$(this.selectors.productThumbImages).length) {
        return;
      }

      var self = this;
     
      //scroll to active thumb if set
      var $thumb = $(this.selectors.productImageWrap + ' .active-img');
      scrolltoActiveImage($(this.selectors.productImageWrap),$thumb.data("image-index"));     
    
      $(this.selectors.productThumbImages).on('click', function(evt) {
        evt.preventDefault();
        var $el = $(this);
        var imageSrc = $el.prop('href');
        var zoomSrc = $el.prop('href');
        var imageId = $el.data('image-id');
        self.switchImage(imageSrc, zoomSrc);
        self.setActiveThumbnail(imageId);
      });
    },    
   switchImage: function(image, zoomImage) {
     $(this.selectors.productFeaturedImage).prop('href', zoomImage);
     $(this.selectors.productFeaturedImage).find('img').prop('src', image);
    },    
    setActiveThumbnail: function(imageId) {
      var activeClass = 'active-img';
      var $thumb = $(this.selectors.productImageWrap + ' .smallimg[data-image-id="' + imageId + '"]');
      
      $(this.selectors.productThumbImages).removeClass(activeClass);
      $thumb.addClass(activeClass);
      // jump to selected thumbnail 
      scrolltoActiveImage($(this.selectors.productImageWrap),$thumb.data("image-index"));
    },    
    updateImages: function(event){
      var variant = event.variant;
      if (variant && variant.featured_image) {
        var variantImageId = variant.featured_image.id;
        //got image id now find matching image in thumbs and get href
        var $thumb = $(this.selectors.productImageWrap + ' .smallimg[data-image-id="' + variantImageId + '"]');
        this.switchImage($thumb.prop("href"), $thumb.prop("href"));
        this.setActiveThumbnail(variantImageId);
      }
    },    
    updateSKU: function(event){
      var variant = event.variant;
      var variantSKU = variant.sku || "";
      $(this.selectors.productSKU).html('').hide();
      if(variantSKU.trim()){
          $(this.selectors.productSKU).html("SKU: " + variantSKU).fadeIn(200);
       }
    },
    updateAddToCartButton: function(event){
      var variant = event.variant;
      $(this.selectors.productStockMsg).html('').hide();
      if (variant) {
        if (variant.available) {
          // We have a valid product variant, so enable the submit button
          $(this.selectors.addToCart).prop('disabled', false);
          $(this.selectors.addToCartText).text(Sunrise.strings.add_to_cart);
          // Show pre-order message
          if (this.settings.showPreOrder == "yes" && variant.inventory_management == 'shopify' && variant.inventory_quantity <= 0 && variant.inventory_policy == 'continue') {
              $(this.selectors.productStockMsg).html("<div class='var-msg'>"+"Available for pre-order"+"</div>").fadeIn(200);
          } else if(this.settings.showInventory == "yes" && variant.inventory_management == 'shopify'){
              $(this.selectors.productStockMsg).html("<div class='var-msg'>"+"Availability: "+" "+variant.inventory_quantity+" "+"in stock"+"</div>").fadeIn(200);
          }
        } else {
          // The variant doesn't exist, disable submit button and change the text
          $(this.selectors.addToCart).prop('disabled', true);
          $(this.selectors.addToCartText).text(Sunrise.strings.sold_out);
        }
      } else {
        $(this.selectors.addToCart).prop('disabled', true);
        $(this.selectors.addToCartText).text(Sunrise.strings.unavailable);
      }  
    },
    updatePrices: function(event){
      var variant = event.variant;
      if (variant) {
        $(this.selectors.productPrice).html('<span class=price-money>'+Sunrise.Currency.formatMoney(variant.price, Sunrise.strings.money_format)+'</span>');

        // Update and show the product's compare price if necessary
        if (variant.compare_at_price > variant.price) {
          $(this.selectors.comparePrice)
            .html('<span class=price-money>'+Sunrise.Currency.formatMoney(variant.compare_at_price, Sunrise.strings.money_format)+'</span>')
            .show();
        } else {
          $(this.selectors.comparePrice).hide();
        }
      } else {
        $(this.selectors.comparePrice).hide();
      }
      Sunrise.convertPrices();
    },
    initMoreImages: function(){
      initMoreImages($(this.selectors.productImageWrap));
    },    
    initProductZoom: function(){
      var self = this;
      var $mainImage = $(this.selectors.productFeaturedImage);
      
      enableLightbox($mainImage);
      
      if (self.settings.zoomEnabled) {
         // to avoid difficult scrolling only enable zoom on larger devices
         enquire.register("screen and (min-width: 760px)", {
            match : function() {
               enableZoom($mainImage);
            },  
            unmatch : function() {
               destroyZoom($mainImage);
            }
         });
      } else {
        destroyZoom($mainImage);
      }
    },     
    
   });
  
   function enableZoom($el) {
      var zoomUrl = $el.data('zoom');
      $el.zoom({});
   }

   function destroyZoom($el) {
      $el.trigger('zoom.destroy');
   }
  
   function initMoreImages($el) {
      var owl = $el;
      var leftArrow = $el.data("arrow-left");
      var rightArrow = $el.data("arrow-right");
      owl.owlCarousel({
         itemsCustom : [
         [0, 1],
         [320, 2],   
         [640, 3]
         ],  
         items : 3,
         rewindSpeed : 400,   
         navigation:true,
         navigationText : [leftArrow,rightArrow]   
      });
   }

   function scrolltoActiveImage($el,imageIndex) {
      var owl = $el.data('owlCarousel');
      owl.goTo(imageIndex);
   }

   function enableLightbox($el) {
      $el.magnificPopup({type:'image'});
   }

   function disableLightbox($el) {
      $el.off();
   }
  
   return Product;
})();

Sunrise.doResize = function() {
  if (Modernizr.flexbox && Modernizr.flexwrap) {
    // no need to resize thumbs with javascript
    return;
  }
  $('ul.collection-th a,ul.collection-list a').imagesLoaded( function() {
    $("ul.collection-th").each(function() {
       $(this).find("a.prod-th").removeAttr("style").setAllToMaxHeight();
    });
    $("ul.collection-list").each(function() {
       $(this).find("a.prod-th").removeAttr("style").setAllToMaxHeight();
    });    
  });
};

Sunrise.sortHandler = function(e) {
  var $sortBy = $('#sort-by');
  var sortOrder = $sortBy.data('default-sort');
  
  Shopify.queryParams = {};

  if (location.search.length) {
    for (var aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
      aKeyValue = aCouples[i].split('=');
      if (aKeyValue.length > 1) {
        Shopify.queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
      }  
    }
  }

  $sortBy.val(sortOrder);

  $(document).on('change', $sortBy, function (event) {
    Shopify.queryParams.sort_by = $sortBy.val();
    if (Shopify.queryParams.sort_by != sortOrder){
      location.search = jQuery.param(Shopify.queryParams);
    }
  });
};

Sunrise.initVideos = function(){
  $("#main").fitVids();
};

Sunrise.initAccordions = function(){
  $('.gt-accordion h4').each(function() {
    var tis = $(this), state = false, answer = tis.next('div');
    tis.click(function() {
      state = !state;
      answer.slideToggle(state);
      tis.toggleClass('active',state);
    });
  });  
};

Sunrise.Sidebar = function() {
  var $sideMenu = $("#sidebar");
  var $topMenu = $("nav.top-menu");
  var sideMenuHandle = $sideMenu.data("menuchosen");
  var topMenuHandle = $topMenu.data("menuchosen");
  var keepMenuOpen = $sideMenu.data("keep-open");

  // append top nav to side menu for mobile view (if it's different)
  $sideMenu.find('li.from-top-menu').remove();
  if (sideMenuHandle == topMenuHandle){
    // nothing to do
  }else{
    var children = $topMenu.find("ul:first").children().clone();
    $sideMenu.find(".side-menu-mobile").html(children);
  }

  $('#side-menu').find('li.has-sub > a').off();

  $('#side-menu').find('li.has-sub > a').each(function() {
    var tis = $(this);
    var state = false;

    var subMenu = tis.next('ul');
    tis.on('click', function(e) {
      e.preventDefault();
      state = tis.closest('li').hasClass('active');
      state = !state;
      subMenu.slideToggle(state);
      tis.closest('li').toggleClass('active',state);
    });
  });   

  if (keepMenuOpen){
     // get current path and see if it matches the link href. If it does,
     // open that section of the menu
     var CurrentUrl = window.location.pathname;

     if(CurrentUrl !="/"){
       $item = $('#side-menu li.level-1 a').filter(function(){
         var xpathname = location.pathname + "zzz";
         var xhref = $(this).prop('href') + "zzz";
         if (xhref.indexOf(xpathname) != -1){
           $(this).parentsUntil("#side-menu", ".has-sub").addClass("active");
         }
       });

       $('#side-menu li.active').each(function() {
         var tis = $(this);
         tis.find('ul').eq(0).slideDown();
       });
     }
  }    
};

Sunrise.Slideshow = (function() {
  var $slideshow, 
      $slides,
      autoPlay;

   function Slideshow(container) {
      $slideshow = $(container);
      $slides = $('.slides', $slideshow);

      var slideCount = $slides.find(".slide").length;
      var slideTrans = $slideshow.data("transition");
      var slideTime = $slideshow.data("speed");
      var leftArrow = $slideshow.data("arrow-left");
      var rightArrow = $slideshow.data("arrow-right");
      var slideDuration = false;

      autoPlay = $slideshow.data("autoplay");
      if (autoPlay === true) {
         slideDuration = slideTime;
      }

      if (slideCount > 1) {
         $slides.owlCarousel({
            navigation : true, // Show next and prev buttons
            slideSpeed : 300,
            paginationSpeed : 400,
            singleItem:true,
            transitionStyle : slideTrans,
            autoPlay: slideDuration,
            pagination: false,
            navigationText : [leftArrow,rightArrow]          
         });
      } else if(slideCount == 1){
         $slides.removeClass("owl-carousel");
      }

      if (window.is_ie){
         // fixes an issue with IE where the slider width is calculated incorrectly on first display.
         setTimeout(function() {
            $(".owl-carousel").each(function() {
               $(this).data('owlCarousel').calculateAll();
            });
         }, 300);
      }
   }

   Slideshow.prototype = _.assignIn({}, Slideshow.prototype, {
      onDeselect: function(event) {
         var owl = $slides.data('owlCarousel');
         if (autoPlay === true) {
            owl.play();
         }
      },
      onBlockSelect: function(event) {
         var $target = $(event.target);
         var owl = $slides.data('owlCarousel');
         owl.stop();
         owl.goTo($target.data('index'));
      },
      onBlockDeselect: function(event) {
         this.onDeselect(event);
      }
   });

   return Slideshow;
})();

Sunrise.BrandScroller = (function() {
   var $scroller, 
   $brands,
   autoPlay;

   function BrandScroller(container) {
      $scroller = $(container);
      $brands = $('#brand-scroller', $scroller);

      autoPlay = $brands.data("autoplay");
     
      var leftArrow = $scroller.data("arrow-left");
      var rightArrow = $scroller.data("arrow-right");

      $brands.owlCarousel({
         lazyLoad: true,
         itemsCustom: [ [0, 1], [320, 2], [480, 3], [960, 4] ],
         responsiveRefreshRate: 50,
         slideSpeed: 200,
         paginationSpeed: 500,
         autoPlay: autoPlay,
         stopOnHover: true,
         rewindNav: true,
         rewindSpeed: 500,
         pagination: false,
         navigation: true,
         navigationText : [leftArrow,rightArrow]        
      });  
   }

   BrandScroller.prototype = _.assignIn({}, BrandScroller.prototype, {
      onDeselect: function(event) {
         var owl = $brands.data('owlCarousel');
         if (autoPlay === true) {
            owl.play;
         }
      },
      onBlockSelect: function(event) {
         var $target = $(event.target);
         var owl = $brands.data('owlCarousel');
         owl.stop();
         owl.goTo($target.data('index'));
      },
      onBlockDeselect: function(event) {
         this.onDeselect(event);
      }
   });

   return BrandScroller;
})();


Sunrise.FeaturedVideo = (function() {
  var $container;

   function FeaturedVideo(container) {
      $container = $(container);
      $container.fitVids();
   }

  FeaturedVideo.prototype = _.assignIn({}, FeaturedVideo.prototype, {
    onDeselect: function(event) {
      //
    },
    onBlockSelect: function(event) {
      //
    },
    onBlockDeselect: function(event) {
      this.onDeselect(event);
    }
  });

  return FeaturedVideo;
})();

Sunrise.initLayout = function() {
   var $window = $(window);
   var $currencyBox = $('#curr-switcher');

   Sunrise.doResize(); 

   var showSidebar = function(){
      $('body').toggleClass("active-nav");
      $('.menu-button').removeClass("active-button");             
   }

   $(document).on('click', '.menu-button', function(e){
      e.preventDefault();
      showSidebar();
   });

   $(document).on('click', '.menu-currency', function(e){
      e.preventDefault();
      $currencyBox.slideToggle(200);
   });
  
   $(document).on('click', '.close-currency-box', function(e){
      e.preventDefault();
      $currencyBox.slideToggle(200);
   });
  
   $window.on('resize', _.debounce(function() {
      var off_canvas_nav_display = $('.off-canvas-navigation').css('display');
      var menu_button_display = $('.menu-button').css('display');
      if (off_canvas_nav_display === 'flex') {       
         $("body").removeClass("two-column").addClass("small-screen");           
      } 
      if (off_canvas_nav_display === 'none') {
         $("body").removeClass("active-sidebar active-nav small-screen")
         .addClass("two-column");         
      }  
      Sunrise.doResize(); 
   }, 200));

   $window.on('scroll', _.debounce(function() {
      if ($(this).scrollTop() > 200) {
         $('#xx-scroll-to-top').fadeIn().css("display","inline-block");
      } else {
         $('#xx-scroll-to-top').fadeOut();
      }
   }, 200));
  
   $window.trigger('resize');
   $window.trigger('scroll');

   $(".coll-tags").removeClass('show-tags');
};

Sunrise.convertPrices = function(){
   if(window.Currency){
      Currency.convertAll(Sunrise.strings.shop_currency, $('[name=currencies]').val());
   }
};

Sunrise.Cart = (function() {
  function Cart(container) {
    var $container = container;
    var $cartform = $('#cartform',$container);
    var $qtyFields = $('#cartform input.quantity',$container);
    var reset_cart = false;

    $qtyFields.each(function(){
      var $this = $(this);
      if ($this.data("managed") == "shopify" && $this.data("policy") == "deny" ){
        var gt_stock = parseInt($this.data('stk'), 10);
        var gt_qty = parseInt($this.val(), 10);
        if (gt_qty > gt_stock) { 
          $this.val(gt_stock); 
          reset_cart = true; 
        } 
      }
    });

    if (reset_cart){
      alert("Some quantities have been reduced to match the available stock");
      $cartform.submit();
    }

    $qtyFields.on('blur',function(){
      var $this = $(this);
      if ($this.data("managed") == "shopify" && $this.data("policy") == "deny"){
        var gt_stock = parseInt($this.data('stk'), 10);
        var gt_qty = parseInt($this.val(), 10);
        if (gt_qty > gt_stock) { 
          alert("Sorry, available stock is" + " " + gt_stock);
          $this.val(gt_stock);
        }  
      }
    });

    if (window.Shopify.Cart){
      Shopify.Cart.ShippingCalculator.show({
        submitButton: "Calculate shipping",
        submitButtonDisabled: "Calculating...",
        customerIsLoggedIn: Sunrise.strings.customer_logged_in,
        moneyFormat: '<span class=price-money>'+Sunrise.strings.money_format_json+'</span>',
        currentLanguage: Sunrise.strings.locale_json
      });
    }
  }

  Cart.prototype = _.assignIn({}, Cart.prototype, {
    onUnload: function() {
      // nothing to do on unload
    }
  });

  return Cart;
})();

Sunrise.Collection = (function() {
   function Collection(container) {
      var $container = container;
      Sunrise.sortHandler();
      Sunrise.doResize();
   }

   Collection.prototype = _.assignIn({}, Collection.prototype, {
      onUnload: function() {
      //
      }
   });

   return Collection;
})();

Sunrise.FeaturedCollection = (function() {
   function FeaturedCollection(container) {
     var $container = container;
      Sunrise.doResize();
   }

   FeaturedCollection.prototype = _.assignIn({}, FeaturedCollection.prototype, {
      onUnload: function() {
      //
      }
   });

   return FeaturedCollection;
})();

Sunrise.Footer = (function() {
   function Footer(container) {
   }

   Footer.prototype = _.assignIn({}, Footer.prototype, {
      onUnload: function() {
      // make sure back to top icon appears
        $(window).trigger('scroll');
      }
   });

   return Footer;
})();

Sunrise.doCurrency = function(){
  if(window.Currency){
    var shopCurrency = Sunrise.strings.shop_currency;
    var $currencySelector = $('#currencies');
    var $mobileCurrency = $('a.menu-currency span');
    
    Currency.format = 'money_with_currency_format';

    /* Sometimes merchants change their shop currency, let's tell our JavaScript file */
    Currency.moneyFormats[shopCurrency].money_with_currency_format =  Sunrise.strings.money_with_currency_format_json;
    Currency.moneyFormats[shopCurrency].money_format = Sunrise.strings.money_format_json;

    /* Default currency */
    var defaultCurrency = "USD" || shopCurrency;

    /* Cookie currency */
    var cookieCurrency = Currency.cookie.read();
    
    /* Saving the current price */
    $('span.price-money').each(function() {
      $(this).attr('data-currency-', $(this).html());
    });

    // If there's no cookie.
    if (cookieCurrency == null) {
      if (shopCurrency !== defaultCurrency) {
        Currency.convertAll(shopCurrency, defaultCurrency);
      } else {
        Currency.currentCurrency = defaultCurrency;
      }
    } else if ($currencySelector.length && $currencySelector.find('option[value=' + cookieCurrency + ']').length === 0) {
      // If the cookie value does not correspond to any value in the currency dropdown.
      Currency.currentCurrency = shopCurrency;
      Currency.cookie.write(shopCurrency);
    } else if (cookieCurrency === shopCurrency) {
      Currency.currentCurrency = shopCurrency;
    } else {
      Currency.convertAll(shopCurrency, cookieCurrency);
    }

    $currencySelector.val(Currency.currentCurrency);
    $mobileCurrency.html(Currency.currentCurrency);

    $currencySelector.on('change',function() {
      var newCurrency = $(this).val();
      Currency.convertAll(Currency.currentCurrency, newCurrency);
      $mobileCurrency.html(newCurrency);
    });
  } 
};

Sunrise.initSections = function(){
   var sections = new Sunrise.Sections();
   sections.register('slideshow', Sunrise.Slideshow);
   sections.register('product', Sunrise.Product);
   sections.register('sidebar', Sunrise.Sidebar);
   sections.register('logo-list', Sunrise.BrandScroller);
   sections.register('featured-video', Sunrise.FeaturedVideo);
   sections.register('cart-template', Sunrise.Cart);
   sections.register('collection-template', Sunrise.Collection);
   sections.register('featured-collection', Sunrise.FeaturedCollection);
   sections.register('footer', Sunrise.Footer);    
};

Sunrise.initListeners = function(){
   $(document)
      .on('click', 'input[name="checkout"], input[name="goto_pp"], input[name="goto_gc"]', function(e){
         var $agreeTerms = $("#agree-terms");
         if ($agreeTerms.length){
            // agree terms is active so make sure it's checked
            if($('#agree',$agreeTerms).prop('checked') == false) {
               e.preventDefault();
               alert("You must agree with the terms and conditions of sale to check out");
               $('#agree-terms').addClass('highlight').focus();           
            }
         }
      })

      .on('click', '.coll-tags .button', function(e){
         e.preventDefault();
         $(".tags").slideToggle(300);
      })

      .on('click', 'a.go-back', function(e){
         e.preventDefault();
         window.location.href = document.referrer;
      })

      .on('change', '#BlogTagFilter', function(e){
         e.preventDefault();
         window.location.href  = $(this).val();
      })

      .on('click', '#xx-scroll-to-top', function(e){
         // Animate the scroll to top
         e.preventDefault();
         $('html, body').animate({scrollTop: 0}, 300);
      })
};


$(document).ready(function() {
  Sunrise.init();
});

Sunrise.init = function(){
   Sunrise.initLayout();
   Sunrise.initAccordions();
   Sunrise.initVideos();
   Sunrise.initListeners();
   Sunrise.initSections();
   Sunrise.customerTemplates.init();
   Sunrise.doCurrency();
};

$(document).ready(function() {
  $('#addToCartButton').click(function(e) {
    let items = [];

    if($('#popshild1').is(':checked')) {
         e.preventDefault();
         popshild1Arr = [{
            'id': $('#popshild1').val(),
            'quantity': $('.productQuantity').val(),
             properties: {
              'addon': $('.product-form__variants').val()
             }
            }]; 
         items = [...items, ...popshild1Arr];
     } 
    if($('#popshild2').is(':checked')) {
         e.preventDefault();
         popshild1Arr1 = [{
            'id': $('#popshild2').val(),
            'quantity': $('.productQuantity').val(),
             properties: {
              'addon': $('.product-form__variants').val()
             }
            }];
        items = [...items, ...popshild1Arr1];  
         
     }
   
      let formData = {
       'items': items
      };
   
    if(items.length > 0) {
      fetch('/cart/add.js', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          })
          .then(response => {
            $( ".product-form" ).submit();
            return response.json();

          })
          .catch((error) => {
            console.error('Error:', error);
      });
    }
      
//     $( ".product-form" ).submit();
  });
  
  $('.cart-remove-line').click((e)=> {
    var $this = $(e.currentTarget);
    const href = $this.attr('href');
    const productId = $this.parent().parent().find('.productId').val();
    e.preventDefault();
    const arry = {
    	[productId] : 0,
  	};

    fetch('/cart.js', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => {
      
      response.json().then((res)=> {
        const items = res.items;
        res.items.forEach((item) => {
//           if(item.properties['addon'] == 'bundle' && $this.attr('properties') == 'bundle') {
//              arry[item.id.toString()] = 0;
//           }
          if(item.properties['addon'] == productId) {
            arry[item.id.toString()] = 0;
          } 
        });

        jQuery.post(window.Shopify.routes.root + 'cart/update.js', {
            updates: arry
        })
        function timeout() {
          location.reload();
        }
        
        setTimeout(timeout, 500);
      });

    })
    
  });
  let totalPricePopshield = 0;
   $('#popshild1').change(function(e) {
     if($(this).is(':checked')) {
       $('.popsheid-cnt').removeClass('hideMe');
       $('.metafieldText1').removeClass('hideMe');
       totalPricePopshield = totalPricePopshield + parseInt($(this).attr('price'));
     } else {
       $('.popsheid-cnt').addClass('hideMe');
       $('.metafieldText1').addClass('hideMe');
        totalPricePopshield = totalPricePopshield - parseInt($(this).attr('price'));
     }
     $('.money').html(`$${totalPricePopshield/100}`);
    });
  
   $('#popshild2').change(function(e) {
       if($(this).is(':checked')) {
         $('.popsheid-cnt').removeClass('hideMe');
         $('.metafieldText2').removeClass('hideMe');
         totalPricePopshield = totalPricePopshield + parseInt($(this).attr('price'));
       } else {
         $('.popsheid-cnt').addClass('hideMe');
         $('.metafieldText2').addClass('hideMe');
         totalPricePopshield = totalPricePopshield - parseInt($(this).attr('price'));
       }
		$('.money').html(`$${totalPricePopshield/100}`);
      });

    $('.bundle-qunatity-input').change(function(e) {
        e.preventDefault();
        e.stopPropagation();
        let  totalQuantity = 0;
        $('.bundle-qunatity-input').each(function(i, obj) {
            totalQuantity += parseInt($(this).val());
        });
      if(totalQuantity >= 12) {
        $('.bundle-builder-app--bundle--alert--content.step1').css('display', 'none');
        $('.bundle-builder-app--bundle--alert--content.step2').css('display', 'block');
      } else {
        $('.bundle-builder-app--bundle--alert--content.step1').css('display', 'block');
        $('.bundle-builder-app--bundle--alert--content.step2').css('display', 'none');
      }
      $('.bundle-total-quantity').text(totalQuantity);
    })   
    $('#addToCartBundleButton').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        let items = [];
        $('.bundle-qunatity-input').each(function(i, obj) {
          if(parseInt($(this).val()) > 0) {
             items.push({
            'id': $(this).attr('variantid'),
            'quantity': $(this).val(),
             properties: {
              'addon': 'bundle'
             }          
          })
         }
          
        });
      if(items.length > 0) {
        $.post(window.Shopify.routes.root + 'cart/add.js', {
            items: items
        })
        .always(function() {
          window.location.replace("/cart");
        });
      }
        
    }) 
});


