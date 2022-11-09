 $(document).ready(function(e) {
   $('.input-text.qty').change(function(e) {
     console.log(e)
     const tags = $(this).attr('tags');
     if(tags.includes('limit')) {
       var limit = tags.split(",").find(tag => tag.includes('limit')).replace("limit","");
       console.log(limit)
       if(parseInt(limit) < this.value) {
         let limit_tag = limit.toString();
         switch (limit_tag) {
           case "1":
             limit_tag = "One";
             break;
           case "2":
             limit_tag = "Two";
             break;
           case "3":
             limit_tag = "Three";
             break;
           case "4":
             limit_tag = "Four";
             break;
           case "5":
             limit_tag = "Five";
             break;
           case "10":
             limit_tag = "Ten";
             break;
           default:
             limit_tag = limit;
         }

         let checkSpan = $(".limit-cnt").empty();
         $(".limit-cnt").append( "<div class='limit-one'>Limit " + limit_tag + "</div>" )
         this.value = parseInt(limit);
       }
     }       
   });
   
   if($(".add_to_cart_button").hasClass( "hide" )) {
       	$(".variations_button").addClass( "hide" )
   }
   $('select').on('change', function() {
     if($(".add_to_cart_button").hasClass( "hide" )) {
       	$(".variations_button").addClass( "hide" )
     } else {
       	$(".variations_button").removeClass( "hide" )
     }
	});
    $('.closeModal').on('click',function(){
      $('.popUpModal').fadeOut();
    });
    $('.add_to_cart_button.button.btn1').click(function(e) { 
      var $cartItems = $('.cart_items_number.counter_number.animated.rubberBand');
      var $cartItemsVal = parseInt($cartItems.text());
      e.preventDefault();
      var check = true;
      var $urlWithParams = window.location.href;

      var $id = $( ".variation-select.hide option:selected" ).data('id');
      var $url = $( ".variation-select.hide option:selected" ).data('url');
      console.log("url url", $url);
      var $qty = 0;
      var inputQty = parseInt($('.input-text.qty.text').val());
      addToCart($url, $id, inputQty);
     })
    $('select').on('change', function(e) {
        e.preventDefault();
       var text = $('p.stock').html().replace(/[\d\.]+/g, '' ).toUpperCase();
        $('p.stock').html(text);
      });
//stamped review 
   let searchParams = new URLSearchParams(window.location.search);
   var url = window.location.href;
   let param = searchParams.get('utm_source')
    if(url.includes("#stamped-main-widget")) {
      $(window).scrollTop(1100);
     $('.panel').addClass('Stamped');
    }   
  });