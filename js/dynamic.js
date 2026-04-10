/**
 * Dynamic renderer for YuttanaArt
 * Fetches data.json and renders all sections — no hardcoded content in HTML
 */
(function ($) {
  'use strict';

  /* ===== FETCH DATA & BOOT ===== */
  $.getJSON('data.json')
    .done(function (data) {
      renderAbout(data.about);
      renderSlides(data.slides);
      renderServiceIcons(data.services);
      renderServiceImages(data.serviceImages);
      renderBoon(data.boon, data.carouselImages);
      renderGallery(data.gallery);
      renderMap(data.map);
      renderParallax(data.parallax);
      renderFooter(data.branches, data.contacts, data.site);
      renderSocial(data.site);
      initPlugins();
      initScrollBehaviors();
    })
    .fail(function () {
      console.error('ไม่สามารถโหลด data.json ได้');
      $('#about-content').html(
        '<div class="col-sm-12 text-center" style="padding:40px 0;">' +
          '<i class="fa fa-exclamation-triangle" style="font-size:40px;color:#c0392b;"></i>' +
          '<p style="margin-top:16px;">ขออภัย ไม่สามารถโหลดข้อมูลได้<br>กรุณารีเฟรชหน้าใหม่อีกครั้ง</p>' +
        '</div>'
      );
    });

  /* ===== RENDER: ABOUT ===== */
  function renderAbout(about) {
    var features = about.features.map(function (f) {
      return '<li><i class="fa fa-check"></i>' + f + '</li>';
    }).join('');

    $('#about-content').html(
      '<div class="row">' +
        '<div class="col-sm-6 padd">' +
          '<h4 class="uppercase">' + about.heading + '</h4>' +
          '<div class="line-left"></div>' +
          '<p class="weight-600">' + about.subheading + '</p>' +
          '<ul class="list3">' + features + '</ul>' +
          '<br><p class="weight-400">' + about.extra + '</p><br>' +
          '<a href="#" class="btn rounded btn-lg pi-btn-default">เปิด 24 ชั่วโมง</a>' +
        '</div>' +
        '<div class="col-sm-6 padd">' +
          '<img class="img-responsive wow zoomIn" src="' + about.image + '" />' +
        '</div>' +
      '</div>'
    );
  }

  /* ===== RENDER: HERO CAROUSEL ===== */
  function renderSlides(slides) {
    var indicators = slides.map(function (_, i) {
      return '<li data-target="#hero-carousel" data-slide-to="' + i + '"' + (i === 0 ? ' class="active"' : '') + '></li>';
    }).join('');

    var slideHtml = slides.map(function (slide, i) {
      return (
        '<div class="item hero-slide' + (i === 0 ? ' active' : '') + '" style="background-image:url(\'' + slide.image + '\');">' +
          '<div class="hero-overlay"></div>' +
          '<div class="hero-content">' +
            '<div class="hero-text">' +
              '<h1>' + slide.heading + '</h1>' +
              '<p>' + slide.subtext + '</p>' +
              '<a href="#service" class="btn hero-btn">' + slide.badge + '</a>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    $('#hero-indicators').html(indicators);
    $('#hero-slides').html(slideHtml);

    // Init Bootstrap Carousel AFTER slides are injected
    $('#hero-carousel').carousel({ interval: 5000, pause: 'hover' });
  }

  /* ===== RENDER: SERVICE ICONS ===== */
  function renderServiceIcons(services) {
    var delays = [1, 2, 3, 4];
    var html = services.map(function (s, i) {
      return (
        '<div class="col-sm-6 col-md-3 padd">' +
          '<div class="single_box style6 wow fadeIn" data-wow-duration="' + delays[i] + 's">' +
            '<div class="icons_introimg image-icon box ' + s.colorClass + '">' +
              '<i class="fa ' + s.icon + '"></i>' +
            '</div>' +
            '<h3>' + s.title + '</h3>' +
            '<p class="introtext">' + s.description + '</p>' +
          '</div>' +
        '</div>'
      );
    }).join('');
    $('#service-icons').html(html);
  }

  /* ===== RENDER: SERVICE IMAGES ===== */
  function renderServiceImages(images) {
    var html = images.map(function (img, i) {
      return (
        '<div class="col-sm-4 padd wow fadeIn" data-wow-duration="' + (i + 1) + 's">' +
          '<img class="img-responsive margin-bottom-25" src="' + img.src + '" alt="' + img.alt + '" />' +
        '</div>'
      );
    }).join('');
    $('#service-images').html(html);
  }

  /* ===== RENDER: BOON ===== */
  function renderBoon(boon, carouselImages) {
    var carouselItems = carouselImages.map(function (src) {
      return '<div class="item"><img src="' + src + '" /></div>';
    }).join('');

    var boonItems = boon.items.map(function (item) {
      return '<li><i class="fa fa-check"></i>' + item + '</li>';
    }).join('');

    $('#boon-content').html(
      '<div class="row">' +
        '<div class="col-sm-12 col-md-6 padd">' +
          '<div class="owl-carousel owl-item-1">' + carouselItems + '</div>' +
        '</div>' +
        '<div class="col-sm-12 col-md-6 padd">' +
          '<h5 class="uppercase">' + boon.heading + '</h5>' +
          '<div class="line-left"></div>' +
          '<ul class="list3">' + boonItems + '</ul>' +
          '<br><a href="#boon" class="btn rounded btn-lg pi-btn-default">ให้กับลูกค้าที่สนใจบริการด้วยค่ะ</a>' +
        '</div>' +
      '</div>'
    );
  }

  /* ===== RENDER: GALLERY ===== */
  function renderGallery(gallery) {
    // Filter buttons
    var filterHtml = '<button class="gallery-btn active" data-filter="all">ทั้งหมด</button>';
    gallery.forEach(function (cat) {
      filterHtml += '<button class="gallery-btn" data-filter="' + cat.filter + '">' + cat.category + '</button>';
    });
    $('#gallery-filters').html(filterHtml);

    // Grid items
    var gridHtml = '';
    gallery.forEach(function (cat) {
      cat.items.forEach(function (item) {
        gridHtml +=
          '<div class="gallery-item" data-cat="' + cat.filter + '">' +
            '<div class="gallery-card">' +
              '<img src="' + item.src + '" alt="' + item.title + '"/>' +
              '<div class="gallery-overlay">' +
                '<span>' + item.title + '</span>' +
              '</div>' +
            '</div>' +
          '</div>';
      });
    });
    $('#gallery-grid').html(gridHtml);

    // Filter click
    $(document).on('click', '.gallery-btn', function () {
      var filter = $(this).data('filter');
      $('.gallery-btn').removeClass('active');
      $(this).addClass('active');

      if (filter === 'all') {
        $('.gallery-item').fadeIn(300);
      } else {
        $('.gallery-item').hide();
        $('.gallery-item[data-cat="' + filter + '"]').fadeIn(300);
      }
    });

    // Lightbox on click
    $(document).on('click', '.gallery-card', function () {
      $('#lightbox').remove(); // prevent duplicate lightboxes
      var src = $(this).find('img').attr('src');
      var title = $(this).find('.gallery-overlay span').text();
      $('body').append(
        '<div id="lightbox" class="lightbox-overlay">' +
          '<div class="lightbox-box">' +
            '<button class="lightbox-close">&times;</button>' +
            '<img src="' + src + '" alt="' + title + '"/>' +
            '<p>' + title + '</p>' +
          '</div>' +
        '</div>'
      );
      setTimeout(function () { $('#lightbox').addClass('active'); }, 10);
    });

    $(document).on('click', '.lightbox-overlay, .lightbox-close', function (e) {
      if ($(e.target).hasClass('lightbox-overlay') || $(e.target).hasClass('lightbox-close')) {
        $('#lightbox').removeClass('active');
        setTimeout(function () { $('#lightbox').remove(); }, 300);
      }
    });
  }

  /* ===== RENDER: MAP ===== */
  function renderMap(map) {
    $('#map-content').html(
      '<iframe src="' + map.embedUrl + '" width="100%" height="400" frameborder="0" style="border:0;border-radius:12px;" allowfullscreen=""></iframe>'
    );
  }

  /* ===== RENDER: PARALLAX ===== */
  function renderParallax(parallax) {
    var branchItems = parallax.branches.map(function (b) {
      return '<li><i class="fa fa-map-marker"></i>' + b + '</li>';
    }).join('');

    $('#parallax-content').html(
      '<h3>' + parallax.heading + '</h3>' +
      '<p>' + parallax.description + '</p>' +
      '<ul class="list3">' + branchItems + '</ul>' +
      '<a href="#map" class="btn rounded btn-lg pi-btn-default">เปิด 24 ชั่วโมง</a>'
    );
  }

  /* ===== RENDER: FOOTER ===== */
  function renderFooter(branches, contacts, site) {
    var branchCols = branches.map(function (b) {
      var phones = b.phones.map(function (p) {
        return '<i class="fa fa-phone"></i>&nbsp;<a href="' + p.href + '">' + p.number + '</a><br>';
      }).join('');

      return (
        '<div class="col-sm-4 padd">' +
          '<div class="icon"><i class="fa fa-map-marker"></i></div>' +
          '<h5>' + b.label + '</h5>' +
          '<address><p>' +
            '<i class="fa fa-map-marker"></i>&nbsp;' + b.address + '<br>' +
            (b.note ? b.note + '<br>' : '') +
            '<i class="fa fa-map-marker"></i>&nbsp;<a href="' + b.mapUrl + '" target="_blank">Google Map</a><br><br>' +
            phones +
          '</p></address>' +
        '</div>'
      );
    }).join('');

    var contactLines = contacts.map(function (c) {
      return (
        '<i class="fa fa-phone"></i>&nbsp;<a href="' + c.href + '">' + c.phone + '</a><br>' +
        '<i class="c-fa-line"></i>&nbsp; Line ID : <a href="' + c.lineUrl + '">' + c.lineId + '</a><br><br>'
      );
    }).join('');

    var contactCol =
      '<div class="col-sm-4 padd">' +
        '<div class="icon"><i class="fa fa-envelope"></i></div>' +
        '<h5>ติดต่อ</h5>' +
        contactLines +
        '<div class="fb-like" data-href="https://www.facebook.com/' + site.facebook.split('/').pop() + '" data-layout="button_count" data-action="like" data-show-faces="true" data-share="false"></div>' +
      '</div>';

    $('#footer-branches').html(branchCols + contactCol);
  }

  /* ===== RENDER: SOCIAL ICONS ===== */
  function renderSocial(site) {
    $('#footer-social').html(
      '<a href="' + site.facebook + '" target="_blank" class="social-icon-jump-x4 circle">' +
        '<div>' +
          '<i class="fa fa-facebook facebook-icon-jump"></i>' +
          '<i class="fa fa-facebook social-icon-jump-dark"></i>' +
        '</div>' +
      '</a>'
    );
  }

  /* ===== INIT JQUERY PLUGINS (after DOM is ready) ===== */
  function initPlugins() {
    // Owl Carousel
    $('.owl-carousel.owl-item-1').owlCarousel({
      singleItem: true,
      autoPlay: 3000,
      navigation: false,
      pagination: true,
      stopOnHover: true
    });

    // WOW animations
    new WOW().init();

    // Parallax
    if ($.fn.parallax) {
      $('.parallaxBg').parallax('50%', 0.3);
    }

    // Scroll to top
    if ($.fn.UItoTop) {
      $().UItoTop({ easingType: 'easeOutQuart' });
    }
  }

  /* ===== SCROLL BEHAVIORS ===== */
  function initScrollBehaviors() {
    // Navbar scroll effect
    function handleNavbarScroll() {
      if ($(window).scrollTop() > 60) {
        $('.navbar.navbar-default').addClass('navbar-scrolled');
      } else {
        $('.navbar.navbar-default').removeClass('navbar-scrolled');
      }
    }
    $(window).on('scroll.navbar', handleNavbarScroll);
    handleNavbarScroll();

    // Smooth scroll for anchor links
    $(document).on('click', 'a[href^="#"]', function (e) {
      var target = $(this.getAttribute('href'));
      if (target.length) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: target.offset().top - 70 }, 600);
      }
    });

    // Scroll reveal
    function revealOnScroll() {
      var windowBottom = $(window).scrollTop() + $(window).height();
      $('.reveal, .reveal-left').each(function () {
        if (windowBottom > $(this).offset().top + 60) {
          $(this).addClass('visible');
        }
      });
    }

    // Add reveal classes to sections after render
    setTimeout(function () {
      $('.single_box').each(function (i) {
        $(this).addClass('reveal').css('transition-delay', (i * 0.12) + 's');
      });
      $('.col-sm-4.padd').each(function (i) {
        $(this).addClass('reveal').css('transition-delay', (i * 0.15) + 's');
      });
      $('#about-content .col-sm-6').first().addClass('reveal-left');
      $('#about-content .col-sm-6').last().addClass('reveal');
      $('#boon-content .col-sm-12, #boon-content .col-sm-6').each(function (i) {
        $(this).addClass('reveal').css('transition-delay', (i * 0.15) + 's');
      });
      $('#footer-branches .col-sm-4').each(function (i) {
        $(this).addClass('reveal').css('transition-delay', (i * 0.1) + 's');
      });
      revealOnScroll();
    }, 100);

    $(window).on('scroll.reveal', revealOnScroll);

    // Active nav link on scroll
    $(window).on('scroll.activeLink', function () {
      var scrollPos = $(window).scrollTop() + 100;
      $('section[id], footer[id]').each(function () {
        var id = '#' + $(this).attr('id');
        var top = $(this).offset().top;
        var bottom = top + $(this).outerHeight();
        var link = $('.zetta-menu li a[href="' + id + '"]').parent();
        if (scrollPos >= top && scrollPos < bottom) {
          link.addClass('active');
        } else {
          link.removeClass('active');
        }
      });
    });
  }

}(jQuery));
