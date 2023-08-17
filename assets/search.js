function getData(response, href) {
  response.products.forEach(product => {  
    var index = product.images[0].src.indexOf('.jpg');
    var imgSrc = [product.images[0].src.slice(0, index), '_small', product.images[0].src.slice(index)].join('');
     if (product.product_type === "SweetLegs Plus") {
      var size = "plus";
     } else if(product.product_type === "SweetLegs Petite"){                      
        var size = "petite";
     }else if(product.product_type === "SweetLegs Kids"){                      
        var size = "kids";
     }else if(product.product_type === "SweetLegs One Size"){                      
        var size = "one-size";
     }else if(product.product_type === "SweetLegs Plus2"){                      
        var size = "plus2-size";
     }
     var title = product.title.toLowerCase().replace(/\"/g,' ');
     var discription = product.body_html.toLowerCase();
     var tags = product.tags.join('|').toLowerCase().split('|');
 
//       $('table#quick-order-content tr[data-name ="'+title+'"] .prodListImg').append(`                       
//                 <a href="https://${href}/collections/${size}/products/${product.handle}"> <img src="${imgSrc}"  style="max-width: none"/></a>                            
//              `);
     if(product.product_type != "Marketing Materials" || $('.customerTag').val().toLowerCase().includes('distributor')) {
        if($('.customerTag').val().toLowerCase().includes('distributor')) {
         priceNew = '';
       } else {
         priceNew = `$${product.variants[0].price}`;
       }  
       if(product.product_type != "ID Only Prints") {
         $('table #searchList, #searchListTag ').append(`
            <tr  class='clickable-row hideMe' data-href="https://${href}/collections/${size}/products/${product.handle}" data-name="${title}" data-tag="${tags}" >
              <td style="border: none;" class="searchListImg">                    
              	<img src="${imgSrc}"  style="max-width: none"/>                
              </td>
              <td style="width: 150px; border: none;">                   
              	<strong>${product.title} </strong></br>
              	<span class="price-new"> ${priceNew} </span>                  
              </td>
          </tr> 
       `)
       }
   }
  });     
}



 $('.filterBox .form-controls').keyup(function() {
    if($('.form-controls').val().length == 0) {
      $('.search-content tr').addClass('hideMe');
    	$('.search_hint').removeClass('hideMe');
    } else {
      $('.search_hint').addClass('hideMe');
      $('.search-content tr').addClass('hideMe');
    }
     var cv = $(this).val().toLowerCase();
    if (cv != '') {
      $('.search-content tr').addClass('hideMe');
      $('#searchList tr[data-name*="'+cv+'"]').removeClass('hideMe');      
      $('#searchListTag tr[data-tag*="'+cv+'"]').removeClass('hideMe');
      $('#searchListTag tr[data-discription*="'+cv+'"]').removeClass('hideMe');
      $('#searchListTag tr[data-name*="'+cv+'"]').addClass('hideMe');
    } else {
      $('#searchList tr').addClass('hideMe');
      
    }
    
    xv = $('#searchList tr:visible').size();
    xv1 = $('#searchListTag tr:visible').size();
    if (xv == 0 && $('.filterBox .form-controls').val().length > 0 && xv1 == 0) {
      $('.zeroResults').removeClass('hideMe');
    } else {
      $('.zeroResults').addClass('hideMe')
    }        
//     floatMe();       
  });  

 var href = window.location.href.split('/')[2];
  $('.search-form').submit(function(e) {
   e.preventDefault();
    var val = $('.form-controls').val() ? $('.form-controls').val() : $('#searchs-search-field').val();
   window.location.href = `https://${href}/search?q=${val}&type=product`;
  }); 
  
  $('table #searchList').on("click",".clickable-row",  function() {;
        window.location = $(this).data("href");
  });
  $('table #searchListTag').on("click",".clickable-row",  function() {;
        window.location = $(this).data("href");
  });
  
  
  $('.filterBox .form-controls').keydown(function(e) {

          // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46 , 9 , 27, 110, 190]) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode == 65 && e.ctrlKey === true) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      // let it happen, don't do anything
      return false;
    }
    // Ensure that it is a number and stop the keypress
    if (e.keyCode == 13) {
        e.preventDefault();
       $('.filterBox .form-controls').blur();
    }
 });  


  
  
  $(window).on('resize scroll', function() {

  });
  
  var xv = 1;
  var xt;


