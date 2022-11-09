let searchItems = [];
  $('.s4com-article-title').each(function(){
    searchItems.push($(this).text().trim());
  });

  $("input#title").autocomplete({
    source: searchItems,
    maxItem: 5,
    select: function (e, ui) {   
      title = ui.item.value;
      slug = $(`.s4com-article-title:contains(${title})`).attr('id').replace("-question", "");
      window.location.hash = slug;
    },
    classes: {
      "ui-autocomplete": "highlight"
    }
  });

  var collapse = true ;

  function toggleSection(section,event) {
    if(collapse===false)
    {
      return false;
    }
    event.preventDefault();
    var link = $(section);
    link.next().toggle();

    var childToChange = $( event.target ).find('.s4com-fas')[0] ||
        $( event.target ).closest('.s4com-fas')[0] ||
        $(event.target).parent().find('.s4com-fas')[0];


    if(childToChange.classList.contains('fa-chevron-up'))
    {
      childToChange.classList.remove('fa-chevron-up');
      childToChange.classList.add('fa-chevron-down');
    }
    else
    {
      childToChange.classList.remove('fa-chevron-down');
      childToChange.classList.add('fa-chevron-up');
    }
  }

  $(document).ready(function() {
    if (location.hash) {
      var q = decodeURIComponent(location.hash)+'-question';
      var q = $(`${q}`).text().trim();
      $("input#title").val(q);
      hashchange();
    }
    $('.s4com-articles > a').click(function(e){
      e.preventDefault();
      var id = $(this).attr('href');
      $(this).toggleClass('s4com-active');

      history.pushState(null, null, '#'+id.substr(1));
    });

    if((window.location.hash != "") && (window.location.hash.indexOf('#q') == -1)) {
      $(window).trigger('hashchange');
    }
  });

  $(window).on('hashchange', function() {
    hashchange();
  });


  function hashchange() {
    let url = window.location.href;
    let target;

    if (url.includes('!')) {
      target = $('a[href="#' + window.location.hash.slice(1).substring(1, window.location.hash.slice(1).length) + '"]');
    } else {
      target = $('a[href="#' + window.location.hash.slice(1).substring(0, window.location.hash.slice(1).length) + '"]');
    }

    var carretToChange = target.parent().parent().parent().find('.fas.fa-chevron-down');

    carretToChange.removeClass('fa-chevron-down');
    carretToChange.addClass('fa-chevron-up');

    if (target.parents('.s4com-section-body').length) {

      target.parents('.s4com-section-body:first').show();
    }

    if (target.length) {
      target.addClass('s4com-active');

      $('html, body').animate({
        scrollTop: target.offset().top - 0
      });
    }
  }

$('.s4com-fas .fa-chevron-down').parent().parent().addClass('active') ;
document.onreadystatechange = function(){ $('.s4com-help-center-exclude').attr('onclick','toggleSection(this,event)'); }

