    $(document).ready(function(){  

      $(document).on('click', '.swatch-item', function(e) {
        $('.swatch-item').removeClass('active');
        $(this).addClass('active');
        const imageDiv = $(this).parent().parent().parent().find('.aspect-product__picture');
        imageDiv.attr('srcset',  $(this).attr('data-image'));
        $(this).parent().parent().parent().find('.product_thumbnail_secondary').css('background-image', `url(${$(this).attr('data-image')})`);
        
      })
      $(document).on('click', '.instafeed-lightbox', function(e) 
      {
          var container = $(".lightbox-instagram");
          if (!container.is(e.target) && container.has(e.target).length === 0) 
          {
            console.log($(this).find('#close-button-url'));
             var url = window.location.href;
              var a = url.indexOf("?");
              var b =  url.substring(a);
              var c = url.replace(b,"");
              window.location.href = 'https://sweetlegs.com/#_';
          }
      });
       $(document).on('click','.tagged-buy-button', function(e) {
        e.preventDefault();
        const href = $(this).parent().parent().find('a').prop('href');
        if(href.includes('leggings')) {
            const productName = $(this).parent().parent().find('a').html();
        	location.href = `/search?q=${productName}&type=product`;
        } else {
          location.href = href;
        }

      });
      $(document).on('click','.product-title', function(e) {
        e.preventDefault();
        const productName = $(this).find('a').html();
        const href = $(this).find('a').prop('href');
        if(href.includes('leggings')) {
        	location.href = `/search?q=${productName}&type=product`;
        } else {
          location.href = href;
        }
  
      });
      
      const myInterval = setInterval(scroll_bar, 500);

      function myStopFunction() {
        clearInterval(myInterval);
      }

      function scroll_bar() {
        if($('#fsb_bar').html()) {
          const style = $('#fsb_bar').attr('style');
          function findColor(item) {
            return item.includes('background');
          }
          let background_value = $('#fsb_bar').attr('style').split(';').find(findColor);
          let colon_index = background_value.indexOf(':');
          let background_color = background_value.substring(colon_index + 1, background_value.length);
          let ticker_tape_container = $('.tickerwrapper');
          ticker_tape_container.css('background-color', background_color);
          myStopFunction();
        }
      }

//       $('#insta-feed h2').append('<h2>TAG @SWEETLEGS FOR A CHANCE TO BE FEATURED</h2>');
      const player = new Plyr('#player'); 
      
      player.on('play', (data) => {
        const width = $(window).width();
        if(width < 600) {
          player.fullscreen.enter();
        }
      });
      $('.owl-item .product').on('mouseenter',function(e){
        $(this).closest('.owl-carousel').trigger('stop.owl.autoplay');
      })

      $('.owl-item .product ').on('mouseleave',function(e){
        $(this).closest('.owl-carousel').trigger('play.owl.autoplay');
      })
	 if (customerTags.toLowerCase().indexOf("distributor") >= 0) {
//           $('.price-old').hide();
          $('.price-new').text('');
     }   
     if(window.location.href == "https://sweetlegs.com/" || window.location.href.includes("https://sweetlegs.com/?")) {
         var myVar = setInterval(function() {
            if(jQuery) {    
              if($( "#stamped-badge-total" ).html()) {
                  $('.ribbon.black .content .text .points span').text($( "#stamped-badge-total" ).html())
                  clearInterval(myVar);
              }
            }
        }, 20);
      }
    
      var href = window.location.href.split('/')[2];
      var totalProduct = window.totalProducts;
      $('.search-button-icon').click(function(){
        if($('#searchList tr').length == 0) {
          for(var i = 1; i <= 20 ; i++) {
             
          $.getJSON(`/collections/quick-order/products.json?limit=50&page=${i}`, function(response){ 
               getData(response, href);
            });
        }
       }
      });
     if(($('.customer-tag').val() == 'distributor' || $('.customer-tag').val() == 'Distributor') &&  $(window).width() < 500){
        $('#topbar.topbar').css('display','block');
      }
      if(performance.navigation.type == 2 && "ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch){
         location.reload(true);
      }

      $('.store-switcher-cad').on('click', function(){
      	window.top.location.href = 'https://sweetlegs.ca'+window.location.pathname+'/?no-redirect'; 
      })
      $('.store-switcher-usd').on('click', function(){
      	window.top.location.href = 'https://sweetlegs.com'+window.location.pathname+'/?no-redirect'; 
      })
      
      $('.store-switcher-usd').css('font-weight', 'bold');
      $('.map-distibutor .double-ribbon').click(function(e) {
        window.location.href = "/pages/reviews";
      });
      $('.offcanvas_overlay').on('click', function(e){
        $(this).addClass('offcanvas_close');
      });
      $('.input-text.qty.text.cart').change(function(){
        var $qty = $(this).parent().find('.input-text.qty.text').val();
        var $id = $(this).parent().find('.input-text.qty.text').data('id');
        var $url = $(this).parent().find('.input-text.qty.text').data('url');
    
        var answer = true;
        var reload = true;
        var max = 25;
        var value = parseInt($(this).val(), 10) || 0;
        function  addToCart(quantity, reload) {  

            var data = {
            quantity: quantity,
            id: $id
            }

            jQuery.ajax({
              type: 'post',
              url: '/cart/change.js',
              data: data,
              success: function(d){ 
                                   if(reload) {
                                     if ($('.prodPlus:hover').length == 0 && $('.prodMinus:hover').length == 0) {
                                       
                                         location.reload();
                                     } else if ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch){
                                       	setTimeout(function(){location.reload();}, 3000);
                                     }
                 
                                   };
                                  }, 
              dataType: 'json'
            });

          } 
        if (value > max) {         
          reload = false;
          $('.goCart').addClass('hideMe');
          $('.btn.btn-default.closeModal').removeClass('hideMe');
		  addToCart(max, reload);
          $(".modal-body").text(`We do not have that quantity available.`);          
          $('.popUpModal').fadeIn(); 
                   
        }   
        if(parseInt($qty) == 0) {
      	 var answer = confirm("Are you sure you want to delete the  product?");         
        }  
         
        if(answer == true) {   
            $.ajax({
            type: 'GET',
            url: `${$url}`,
            cache: false,
            dataType: 'json',
            success: function(cart) {
              var tags = cart.product.tags.split(','); 
              tags.forEach(tag => {
               if(tag.trim().startsWith("limit")){
                  var limit = parseInt(tag.split("limit").pop());
                  if(parseInt($qty) > limit) {
                    $('.goCart').addClass('hideMe');
                    $('.btn.btn-default.closeModal').removeClass('hideMe');
                    $(".modal-body").text("Sorry, you have reached the maximum limit for this product.");      
                    $('.popUpModal').fadeIn();
                    var quantity = limit;
                    reload = false;
                  	addToCart(quantity);
                  }
                }
              });
            
              if(reload) {      
                addToCart($qty, reload);
              }        
            }
        });
         
        } else {
          if ($('.prodPlus:hover').length == 0 && $('.prodMinus:hover').length == 0) {
              location.reload();
          } else if ("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch){
            	setTimeout(function(){location.reload();}, 3000);
                                       
                                     }
        }
     });
      
      $('.prodPlus').on('click',function(){
        var initialCartValue = parseInt($('.cart_items_number.counter_number.animated.rubberBand').text());
        var $qty = $(this).parent().find('.input-text.qty.text');
        var currentVal = parseInt($qty.val());
		    if (!isNaN(currentVal) && currentVal > 0) {
          $qty.val(currentVal + 1).trigger('change');
        }          
      });
      $('.prodMinus').on('click',function(){
        var $qty = $(this).parent().find('.input-text.qty.text');
        var currentVal = parseInt($qty.val());
        if (!isNaN(currentVal) && currentVal > 0) {
            $qty.val(currentVal - 1).trigger('change');
        }
      });
      
      $('.myaccount-content').find('.shop_table').find('tbody').find('tr').each(function (keyElement, rowElement) {
        var qtyTD = $(rowElement).find('.order-quantity-outer');
        var qtyTotal = 0;
        $(qtyTD).find('.order-quantity').each(function(key, value) {
          qtyTotal += Number($(value).text());
          $(value).hide();
        })
        $(qtyTD).text(qtyTotal);
      })
      
  
    })
  
  
   
    url = window.location.href;
    let searchParams = new URLSearchParams(window.location.search);
    let srefId = searchParams.get('smile_referral_code');
    home_url = window.location.origin;
    var referrer =  document.referrer;
    referrer.search("https://sweetlegs.ca/");
    if(url.indexOf("smile_referral_code") != -1){
        $.ajax({
            type: "POST",
            url: '/cart.js',
            data: {"attributes[Ref_ID]": srefId}, /* We are using an attribute named "pagination" */
            success: function(d){             
              },
            dataType: 'json'
          });
    } else if (window.location.href.split('/').pop() === "" && referrer.search(home_url) == -1) { 
     
    	$.ajax({
            type: "POST",
            url: '/cart.js',
            data: {"attributes[Ref_ID]": null }, 
            success: function(d){             
              },
            dataType: 'json'
          });
	}
    //Add arrow in drowdown menu
    $(".list-item>li" ).has('ul').append('<i class="fa fa-angle-down" style="margin: 5px"></i>');
      
   // click event in offcanvas menu
    $(document).on("click",".offcanvas_menu.mm-listview span.mm-selected",function(e){
      if($(this).parent().attr('href') == '#') {
        $(this).parent().parent().find('.mm-next').trigger('click');
    //     $('.mm-next').trigger('click');
      }
    });


  //disable right click on sweetlegs logo
  $('.site-logo').bind('contextmenu', function(e) {
      return false;
  }); 