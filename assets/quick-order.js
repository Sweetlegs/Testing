var customerTier = customerTags.split(',').find(tag => tag.includes("sl vip"));
// Discount for the legacy order for different tier labels
var legacyDiscount = {'sl vip - rising star': .1, 'sl vip - superstar': .2, 'sl vip - boss babe' : .22, 'sl vip - sweetelite': .25};

// Id wholesale discount
var idDiscount = {
  'legacyDiscount': {
    accessories: legacyDiscount[customerTier],
    scrunchie: legacyDiscount[customerTier],
    sweetlegs: legacyDiscount[customerTier],
    sweettops: legacyDiscount[customerTier],
    shorts: legacyDiscount[customerTier],
  },
  'regularDiscount': {
    accessories: .25,
    scrunchie: .40,
    sweetlegs: .50,
    shorts: .50,
    sweettops: .35,
  },
};


if($(window).width() > 600){
  $(document).on("mouseenter", ".prodListImg", function(le) {
    const imgSrc = $(this).find('img').attr('src').replace('_small','_200x');
    $('.tooltipImg').remove();
    $(this).append(`<span class="tooltipImg"><img class="bigger-img" src=${imgSrc} /></span>`);
  });

  $(document).on("mouseleave", ".prodListImg", function(le) {
    $('.tooltipImg').remove();
  });
}

// $(document).on("touchstart", ".prodListImg", function(le) {
//   const imgSrc = $(this).find('img').attr('src').replace('_small','_200x');
//   $('.tooltipImg').remove();
//   $(this).append(`<span class="tooltipImg"><img class="bigger-img" src=${imgSrc} /></span>`);
// });


// $(document).on("click", ".bigger-img", function(le) { 
//   $('.tooltipImg').remove();
// });

function removeDiscount() {
//   $(".productPrice span").removeClass('price-old');
//   $(".productPrice .newPrice").remove();
}

function countDiscountableItem() {
  var totalDiscountableItem = 0; 
  $('input.quantity.field').each(function() {
    if(Number($(this).val()) > 0) {
       var productType = $(this).parent('td').parent('tr').find('.productPrice').attr("data-type");
      checkProductType = productType.includes('sweetlegs') || productType.includes('sweettops') || productType.includes('shorts');
       if (checkProductType){ 
            totalDiscountableItem += Number($(this).val()); 
       }
    }
  });
  return totalDiscountableItem;
}

function postToCart(data , href, errorHappen) {  
  totalQuantity = 0;
     $.ajax({
        url:'/cart',
        type:'post',
        data:$('.orderForm').serialize(),
        success:function(item){
          if(!errorHappen) {
          	window.location.href = href;
          }
        },
       error: function(xhr, textStatus, error){
         errorHappen = true;
         $("#spinner").css('display', 'none');
         $(window).scrollTop(0);
         var $result = xhr.responseText;
         console.log($result);
         error = $result.match(/Cart Error:(.+)\./)[1];
         if(error.indexOf('sold out') >= 1) {
           quantity = 0;
           productName = error.split(';')[1].split('&')[0];
         } else {
           quantity = parseInt(error.split('/')[0]);
           productName = error.split('/')[1];
         }
         $('#quick-order-content tr').each(function() {
           $("body").css("cursor", "default");
            if($(this).attr('data-name') == productName.trim().toLowerCase()) {
              $('#errorCart').removeClass('hideMe');
              $('#errorCart').append(`<div>${productName} has been adjusted to reflected available stock.</div>`);
              $(window).scrollTop(0); 
              $(this).find("td.prodListQty input").val(quantity); 
            } else {}
        });
          $('.orderForm').find('.quantity.field').each(function() {
            totalQuantity = totalQuantity + parseInt($(this).val());
             var xname = $(this).attr('data-name'); 
               if ($(this).attr('update') == 'updated'){
               $(this).attr('name', xname); 
             } else {
               $(this).attr('name', '');  
             }
           });
         $('.cart_items_number.counter_number.animated.rubberBand').text(totalQuantity);
         postToCart(data, href, errorHappen);
  	  }       
    });  
}


function showDiscount(discountableItem, page) {
    let lineItemCount = 25;
    if(customerTags.includes("new")) {
      lineItemCount = 50;
    }
	if($('.customerTag').val().toLowerCase().includes('distributor')){   
      $('table').find('td.productPrice').slice(page).each(function(i, pp) {
        var compareAtPrice =$(pp).data('compare').split("$")[1];
        var oldPrice =$(pp).text().split("$")[1];
        var flag = true;
        var type = $(pp).data('type');
        var tags = $(pp).data('tag-array');
        var salePrice = $(pp).data('sale-price');
        var clearancePrice = null;
        if(discountableItem < lineItemCount) {
            var discountableType = 'legacyDiscount';
        } else {
            var discountableType = 'regularDiscount';
        }
        type = type.includes('sweetlegs') ? 'sweetlegs' : type.includes('sweettops') ? 'sweettops' : type;
        if(tags.includes('sale-')) {
          clearanceIndex = tags.split(",").findIndex(element => element.includes("sale-"));
          clearancePrice = parseFloat(tags.split(",")[clearanceIndex].slice(5))
        }
             
        if(clearancePrice && discountableItem >= lineItemCount){ 
          $(pp).text('');
          $(pp).append(`<span class="price-old">$${oldPrice}</span>`);
          var newPrice ="$"+ (compareAtPrice - parseInt(compareAtPrice) * 0.6).toFixed(2);
          $(pp).append(`<span class="newPrice">$${clearancePrice.toFixed(2)}</span>`);
          flag = false;
        } else if(type !== 'marketing materials') {
            if(customerTags.includes("new") && discountableItem <50 ) {
                  $(pp).find('.price-old').remove();
                  $(pp).find('.price-new').remove();
                  $(pp).html(`$${compareAtPrice}`);
            } else {
                  var newPrice = (compareAtPrice - parseInt(compareAtPrice) * idDiscount[discountableType][type]).toFixed(2);
                if(newPrice < salePrice/100) {
                  $(pp).text('');
                  finalPrice = newPrice;
                  $(pp).append(`<span class="price-old">$${oldPrice}</span>`);
                  $(pp).append(`<span class="newPrice">$${finalPrice}</span>`);
            } else {
              finalPrice = (salePrice/100).toFixed(2);
            } 
              
            }
                             
        } 
   })
  }
}