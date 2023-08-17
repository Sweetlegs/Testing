function addToCart($url, $id, inputQty) {
  var check = true;
  var $cartItems = $('.cart_items_number.counter_number.animated.rubberBand');
  var $cartItemsVal = parseInt($cartItems.text());
  $.ajax({
      type: 'GET',
      url:'/cart.js',
      dataType: 'json',
      success: function(cart){
        console.log(cart);
        item = cart.items.filter(item => item.variant_id == $id);
        index = cart.items.findIndex(item => item.variant_id == $id);
        if(item.length == 0) {
          $qty = 0;
        } else {
         $qty = item.reduce((n, {quantity}) => n + quantity, 0);
        }
       $.ajax({
        type: 'GET',
        url: `${$url}`,
        cache: false,
        dataType: 'json',
        success: function(cart) {
          console.log(cart);
          var tags = cart.product.tags.split(',');           
          tags.forEach(tag => {   
            if(tag.trim().startsWith("limit")){
              var limit = parseInt(tag.split("limit").pop());
              console.log(limit);
              if(parseInt($qty) + inputQty > limit) {
                $('.goCart').addClass('hideMe');
          	    $('.btn.btn-default.closeModal').removeClass('hideMe');
                $(".modal-body").text("Sorry, you have reached the maximum limit for this product.");      
                $('.popUpModal').fadeIn();
			  	var quantity = limit;
              	check = false;
                addQtyToCart(quantity); 
              }
            }            
          });
          if(check) {
                addQtyToCart(parseInt($qty) + inputQty); 
          }
        }
    });
      }
    });
 
// function removeAddQtyToCart(qty) {  
//    var data = {
//     	id: $id,
//      	quantity: 0
//     }
//     $.ajax({
//         type: "POST",
//         url: '/cart/change.js',
//         data: data,
//         success: function(cart){
//           		 var data = {
//                 quantity: qty,
//                 id: $id
//             }
//             $.ajax({
//                 type: "POST",
//                 url: '/cart/add.js',
//                 data: data,
//                 success: function(cart){
//                    console.log('success');
//                 },
//                 dataType: 'json'
//              });         
//           },
//           dataType: 'json'
//         });   
//  }
  
 function addQtyToCart(qty, line) {  
   var data = {
    	quantity: qty,
    	line: line
    }
    $.ajax({
        type: "POST",
        url: '/cart/change.js',
        data: data,
        success: function(cart){
          console.log(cart);        
          $('.cart_items_number.counter_number.animated.rubberBand').text(cart.quantity);
          console.log(cart.quantity);
          $cartItems.text(cart.item_count);
          if(cart.items.length > 250) {
             $(".modal-body").text("You have hit the maximum line items allowed in your cart, please checkout to avoid any issues."); 
             $('.goCart').removeClass('hideMe');
             $('.btn.btn-default.closeModal').addClass('hideMe');
             $('.popUpModal').fadeIn();        	
          }          
          },
          dataType: 'json'
   });   
 }
}