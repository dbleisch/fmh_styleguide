/*!
 * fmh.js
 * fmh custom scripts
 *
 */

require('jquery');

// breakpoint detection & variables
const mediaq = require('../variables');

/*** global jQuery ***/

if (jQuery) {

	// drop menu
	(function($){
		// debug: console.log('init menu');

		"use strict";
		$.fn.droopmenu = function(options){
			var settings = {
				dmArrow 			: false,        // Show decorative arrows : true or false - Default is false
				dmIndicator 		: true,         // Show dropdown indicator arrow  : true or false - Default is true
				dmArrowDirection 	: 'dmarrowup',  // Decorative arrow direction : dmarrowup or dmarrowdown - Default is dmarrowup
				dmHideClick 		: true,         // On mobile hide menu on clicking outside : true or false - Default is true
				dmClickIcon 		: true,         // On Mobile Allow the whole link to be clickable - if true then only the icon is clickable
				dmTabAccess 		: true,         // On desktop Tab through menu items with the Tab Key : true or false - Default is true
				dmAnimation 		: true,         // On desktop Allow CSS3 Animations : true or false - Default is true
				dmFixed 			: false,        // Make menu fixed stays in position on scroll : true or false - Default is false
				dmSticky 			: false,        // Make menu sticky becomes fixed on scrolling to top of page: true or false - Default is false
				dmStickyClass 		: 'dmsticky',   // Sticky menu class : dmsticky
				dmOffCanvas 		: true,		    // Allow mobile offcanvas menu : true or false - Default is true
				dmAnimationEffect 	: 'dmfade',     // Animation style / effect :  Default is dmfade others /dmslideup/dmslidedown/dmslideleft/dmslideright/dmflip/dmflipdown/dmscale
				dmFixedClass 		: 'dmfixed',    // Fixed menu class : dmfixed
				dmOffCanvasPos 		: 'dmoffright', // Mobile offcanvas menu position : dmoffright or dmoffleft - Default is dmoffright
				dmPosition 			: 'dmtop',      // Menu Position class : for horizotal menus - dmtop / dmbottom  for vertical menus - dmleft / dmright
				dmOrientation 		: 'dmhorizontal', // Menu Orientation : dmhorizontal / dmvertical - Default is dmhorizontal
				dmCentered 			: false,        // Center Menu Items : true of false - Default is false
				dmCenteredClass 	: 'dmcentered', // Menu Center Class : dmcentered
				dmOpenClass 		: 'dmopener',   // Menu Opening Class on Hover : dmopener
				dmAnimDelay 		: 1200,         // Menu Animation Delay for removing the animation class - helps on sychronizing the scrollbar
				dmShowDelay 		: 200,          // Wait before showing Menu Dropdown
				dmHideDelay 		: 0,		    // Wait before hiding Menu Dropdown // default 200
				dmToggleSpeed 		: 500,          // Mobile Toggle Menu speed
				dmBreakpoint 		: 1199          // Mobile Break Point - Change it in case you change the one in CSS
			};

			options = $.extend(settings, options);

			var droopmenu_inst = $(this),
				droopmenu_body = $('body'),
				droopmenu_wrapper = $(droopmenu_inst),
				droopmenu_container = $('.droopmenu-nav'),
				droopmenu_main_toggler = $(".droopmenu-toggle"),
				droopmenu_arrow = $('<div class="dm-arrow"></div>'),
				droopmenu_overlay = $('<div class="droopmenu-overlay"></div>'),
				droopmenu_overlay_btn = $('<div class="droopmenu-mclose"><span></span></div>'),
				droopmenu_target_extra = $(".droopmenu-extra .droopmenu > li:has(> ul), .droopmenu-extra .droopmenu li .droopmenu-indicator"),
				droopmenu_target_droopmenu = droopmenu_wrapper,
				droopmenu_target_overlay = droopmenu_overlay,
				droopmenu_ww = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
				droopmenu_ww_last = (droopmenu_ww >= settings.dmBreakpoint ? 1: 0), // 1. desktop, 2. mobile
				droopmenu_ww_now = (droopmenu_ww >= settings.dmBreakpoint ? 1: 0), // 1. desktop, 2. mobile
				droopmenu_rub = '';

			var droopmenu_config = function() {
				$(droopmenu_inst).find(".droopmenu li a").each(function() {
					if($(this).siblings("ul").length > 0){
						$(this).attr("aria-expanded", "false");
						$(this).parent("li").addClass("droopmenu-parent").attr("aria-haspopup", "true");
						if(settings.dmIndicator == true){
							$(this).append("<span class='droopmenu-indicator'><em></em></span>");
						}
					}
					if($(this).siblings("ul").find(".droopmenu-grid").length > 0){
						$(".droopmenu-grid").closest("ul").addClass("droopmenu");
					}
				});

				$(droopmenu_inst).find('li:has(ul.droopmenu-megamenu)').addClass('droopmenu-mega');
				$(droopmenu_inst).find(".droopmenu > li > a").append("<em class='droopmenu-topanim'></em>");
				$(droopmenu_inst).find(".droopmenu-nav .droopmenu").wrapAll("<div class='droopmenu-nav-wrap'><div class='droopmenu-navi'></div></div>");
				$(droopmenu_inst).find(droopmenu_main_toggler).append("<i class='dm-burg'></i><i class='dm-burg'></i><i class='dm-burg'></i>");
				if(settings.dmFixed == true){
					$(droopmenu_inst).addClass(settings.dmFixedClass);
				}
				if(settings.dmSticky == true){
					$(droopmenu_inst).addClass(settings.dmStickyClass);
				}
				if(settings.dmArrow == true){
					$(droopmenu_inst).find(".droopmenu > li:has(ul) > a").after(droopmenu_arrow);
					switch (settings.dmArrowDirection) {
						case 'dmarrowup':
							$(droopmenu_inst).addClass('dmarrow-up');
							break;
						case 'dmarrowdown':
							$(droopmenu_inst).addClass('dmarrow-down');
							break;
					}
				}

				switch (settings.dmOrientation) {
					/*
					case 'dmvertical':
						$(droopmenu_inst).addClass('droopmenu-vertical');
						break;
					*/
					case 'dmhorizontal':
						$(droopmenu_inst).addClass('droopmenu-horizontal');
						break;
				}

				switch (settings.dmPosition) {
					case 'dmtop':
						$(droopmenu_inst).addClass('dmpos-top');
						break;
					/*
					case 'dmbottom':
						$(droopmenu_inst).addClass('dmpos-bottom');
						break;
					case 'dmleft':
						$(droopmenu_inst).addClass('dmpos-left');
						break;
					case 'dmright':
						$(droopmenu_inst).addClass('dmpos-right');
						break;
					*/
				}
			};

			var droopmenu_open = function() {
				if(settings.dmOffCanvas == true){
					droopmenu_wrapper.addClass('droopmenu-offcanvas-open');
					droopmenu_body.addClass('droopmenu-dmopen');
					droopmenu_overlay_btn.addClass('dmo-active');
				} else {
					droopmenu_container.stop(true,true).slideDown(settings.dmToggleSpeed);
					droopmenu_body.removeClass('droopmenu-dmopen');
					droopmenu_overlay_btn.remove();
				}
			};

			var droopmenu_close = function() {
				if(settings.dmOffCanvas == true){
					droopmenu_wrapper.removeClass('droopmenu-offcanvas-open');
					droopmenu_overlay_btn.removeClass('dmo-active');
				   setTimeout(function() {
					   droopmenu_body.removeClass('droopmenu-dmopen');
				   }, settings.dmAnimDelay);
				} else {
					droopmenu_container.stop(true,true).slideUp(settings.dmToggleSpeed);
					droopmenu_body.removeClass('droopmenu-dmopen');
					droopmenu_overlay_btn.remove();
				}
			};

			var droopmenu_close_offcanvas = function() {
				droopmenu_main_toggler.removeClass("dmt-active");
				droopmenu_overlay_btn.removeClass('dmo-active');
				droopmenu_close();
			};

			// mobile: wechseln zwischen menues
			var droopmenu_toggleMenu = function(e) {
				e.preventDefault();
				// debug: console.log('switched menu');
				var droopmenu_mobile_toggle = $(this),
					droopmenu_closest_ul = droopmenu_mobile_toggle.closest("ul:not(.droopmenu-grid ul)"),
					droopmenu_active_links = droopmenu_closest_ul.find(".dmtoggle-open"),
					droopmenu_closest_li = droopmenu_mobile_toggle.closest("li"),
					droopmenu_open_link = droopmenu_closest_li.hasClass("dmtoggle-open"),
					droopmenu_count = 0;
				droopmenu_closest_li.removeClass(settings.dmOpenClass).children("ul").find('li').removeClass(settings.dmOpenClass);
				droopmenu_closest_ul.find("ul:not(.droopmenu-grid ul)").stop(true, true).slideUp(settings.dmToggleSpeed, function() {
					if (++droopmenu_count == droopmenu_closest_ul.find("ul:not(.droopmenu-grid ul)").length){
						droopmenu_active_links.removeClass("dmtoggle-open");
						droopmenu_active_links.find('> a').attr('aria-expanded', 'false');
						droopmenu_active_links.find('ul').removeAttr("style");
					}
				});
				if (!droopmenu_open_link) {
					// debug: console.log('open link?');
					droopmenu_closest_li.children("ul:not(.droopmenu-grid ul)").stop(true, true).slideDown(settings.dmToggleSpeed);
					droopmenu_closest_li.addClass("dmtoggle-open");
					droopmenu_closest_li.find('> a').attr('aria-expanded', 'true');
				}
			};

			var droopmenu_adjust = function() {
				// desktop
				if(droopmenu_ww >= settings.dmBreakpoint){
					$(document).off("click.droopMenu touchstart.droopMenu");
					$(droopmenu_inst).find(".droopmenu li a .droopmenu-indicator").off('click');
					$(droopmenu_inst).find(".droopmenu li a:not(.droopmenu-grid a)").off('click');
					$(droopmenu_inst).removeClass(settings.dmOffCanvasPos);
					$(droopmenu_inst).removeClass("droopmenu-offcanvas droopmenu-offcanvas-open");
					$(droopmenu_inst).closest(droopmenu_body).removeClass('droopmenu-dmopen');
					$(droopmenu_inst).find(droopmenu_overlay, droopmenu_overlay_btn).remove();
					if(settings.dmAnimation == true){
						$(droopmenu_inst).addClass(settings.dmAnimationEffect);
					}
					if(settings.dmOffCanvas == true){
						$(droopmenu_inst).find(droopmenu_main_toggler).removeClass("dmt-active");
					}
					if(settings.dmTabAccess == true){
						$(droopmenu_inst).find("a, object, :input, iframe, [tabindex]").click(function() { // focus(function() {
							// hide all
							$('li.rub').removeClass(settings.dmOpenClass);
							$(this).parents('li:has("ul")').addClass(settings.dmOpenClass).find('> a').attr('aria-expanded', 'true');
						}).blur(function() { // blur(function() { ??
							// debug console.log('switched tab');
							$(this).parents('li:has("ul")').removeClass(settings.dmOpenClass).find('> a').attr('aria-expanded', 'false');
						});
					}
					if(settings.dmCentered == true){
						$(droopmenu_inst).addClass(settings.dmCenteredClass);
					}
					var dmHoverTimer,
					dmHoverList = $(droopmenu_inst).find(".droopmenu li:has(ul)");
					dmHoverList.removeClass(settings.dmOpenClass);
					// tab öffnen
					dmHoverList.on({
						// open tab
						click: function(e){ // mouseclick tab
							var clickedID = $(this).find('>a').attr('id');
							var clickedClass = $(this).attr('class');
							// debug: console.log(clickedID, clickedClass, $(this));
							// link auf 2. click öffnen
							if (clickedID !== undefined) {
								if (clickedClass = 'rub droopmenu-parent droopmenu-mega') {
									if (droopmenu_rub != clickedID) {
										e.preventDefault();
										droopmenu_rub = clickedID;
										// console.log('!', clickedID, droopmenu_rub);
									} else {
										// e.preventDefault();
										droopmenu_rub = '';
									}
								}
							}
						},
						// close tab on mouse leave
						/*
						mouseleave: function(){
							var dmHoverLnk = $(this);
							droopmenu_rub = '';
							// debug
							console.log('close tab on mouse leave: ' + droopmenu_rub);
							setTimeout(function(){
								dmHoverLnk.stop(true,true).removeClass(settings.dmOpenClass);
								dmHoverLnk.find('> a').attr('aria-expanded', 'false');
							}, settings.dmHideDelay);
						}
						*/
					});

				} else {
					// mobile
					$(droopmenu_inst).removeClass(settings.dmAnimationEffect);
					$(droopmenu_inst).removeClass(settings.dmCenteredClass);
					$(droopmenu_inst).find(".droopmenu li:has(ul)").off('mouseenter mouseleave');

					if(settings.dmClickIcon == true){
						$(droopmenu_inst).find(".droopmenu li a .droopmenu-indicator").off('click').on('click', droopmenu_toggleMenu);
					} else {
						$(droopmenu_inst).find(".droopmenu li:has(ul) > a").off('click').on('click', droopmenu_toggleMenu);
					}

					if(settings.dmOffCanvas == true){
						droopmenu_container.after(droopmenu_overlay);
						droopmenu_container.prepend(droopmenu_overlay_btn);
						droopmenu_wrapper.addClass("droopmenu-offcanvas");
						droopmenu_wrapper.addClass(settings.dmOffCanvasPos);
						$(droopmenu_inst).on('click', function(e){
							var droopmenu_target_close_btn = $(droopmenu_inst).find(".droopmenu-mclose span");
							if($(e.target).is(droopmenu_target_close_btn)) {
								droopmenu_close_offcanvas();
							}
						});
					}

					if(settings.dmHideClick == true){
						$(document).on("click.droopMenu touchstart.droopMenu", function(e){
							if(settings.dmOffCanvas == true){
								if( $(e.target).is(droopmenu_target_overlay)) {
									droopmenu_close_offcanvas();
								}
							} else {
								if (!droopmenu_inst.is(e.target)&& droopmenu_inst.has(e.target).length === 0){
									droopmenu_container.slideUp(settings.dmToggleSpeed, function() {
										droopmenu_main_toggler.removeClass("dmt-active");
									});
								}
							}
							if (!droopmenu_target_extra.is(e.target)&& droopmenu_target_extra.has(e.target).length === 0){
								var dmExtraParent = $(droopmenu_inst).find('.droopmenu-extra .droopmenu li:has(ul)');
								dmExtraParent.removeClass('dmtoggle-open').find('> a').attr('aria-expanded', 'false');
								dmExtraParent.find('> a').removeClass('dmparent-open').siblings('ul').slideUp(settings.dmToggleSpeed, function(){ });
							}
						});
					}
				}
			};

			var droopmenu_dmtoggler = function() {
				$(droopmenu_inst).find(droopmenu_main_toggler).on("click", function(e){
					e.preventDefault();
					$(this).toggleClass("dmt-active");
					if($(this).hasClass("dmt-active")) {
						droopmenu_open();
						/*** custom ***/
						$('.droopmenu-brand').hide();
						$('.fmh-search').hide();
						$('.fmh-rub').show();
						/*** custom ***/
					} else {
						droopmenu_close();
						/*** custom ***/
						$('.droopmenu-brand').show();
						$('.fmh-search').show();
						$('.fmh-rub').hide();
						/*** custom ***/
					}
				});
			};

			return this.each(function() {
				// droopmenu_tabs();
				droopmenu_config();
				droopmenu_adjust();
				droopmenu_dmtoggler();

				$(window).on('resize', function() {
					droopmenu_ww = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
					droopmenu_ww_now = (droopmenu_ww >= settings.dmBreakpoint ? 1: 0);
					if(droopmenu_ww_last != droopmenu_ww_now){
						droopmenu_ww_last = (droopmenu_ww >= settings.dmBreakpoint ? 1: 0);
						// console.log('droopmenu', droopmenu_ww_now);
						location.reload();
					}

				});

			});

		};

	})(jQuery);

	jQuery(function($){
		"use strict";
		/*	--------------------------------------------------
		:: Initialize menu
		-------------------------------------------------- */
		var $droopmenunavbar = $('.droopmenu-navbar');
		if ( $droopmenunavbar.length ) {
			$droopmenunavbar.droopmenu({
				dmArrow:true,
				dmOffCanvas: false,
				dmTabAccess:true,
				dmAnimationEffect: 'dmfade',
				dmArrowDirection:'dmarrowdown'
			});
		}

		/*	--------------------------------------------------
		:: Modal search
		-------------------------------------------------- */
		var $searchBody = $('body'),
			$searchClose = $('.dm-search-close'),
			$searchToggle = $('.fmh-search a');

		$searchToggle.on('click', function (e) {
			e.preventDefault();
			$searchBody.toggleClass("dm-search-open"); //  dm-body-fix
			$('#searchkeyword').focus();
		});

		$searchClose.on('click', function (e) {
			e.preventDefault();
			$searchBody.removeClass("dm-search-open");
			setTimeout(function() {
				$searchBody.removeClass("dm-body-fix");
			}, 300);
		});

		// close search modal on escape
		jQuery(document).on('keyup',function(evt) {
			if (evt.keyCode == 27 && $searchBody.hasClass("dm-search-open")) {
				$searchBody.removeClass("dm-search-open");
				setTimeout(function() {
					$searchBody.removeClass("dm-body-fix");
				}, 300);
			}
		});

		// submit search
		var $submitsearch = $('#submitsearch');
		if ( $submitsearch.length ) {
			$submitsearch.submit(function(e) {
				var url = $('#submitsearch').attr('action') + '#q=' + $('#searchkeyword').val();
				var $submitsearchpage = $('.searchform[action="#"]');
				e.preventDefault();
				window.location.href = url;
				// if searchpage close modale
				if ( $submitsearchpage.length ) {
					location.reload();
				}
			});
		}


		/*	--------------------------------------------------
			:: Mobile navigation 2 level
			-------------------------------------------------- */

		var $nv2droopmenuindicator = $('.nv2 > a .droopmenu-indicator');
		if ( $nv2droopmenuindicator.length ) {
			$nv2droopmenuindicator.on('click',function(e){
				e.preventDefault(); // prevent jumping
				if ($(this).parent().parent().hasClass('open')) {
					// console.log('removed open');
					$(this).attr("aria-expanded", "false");
					// siwf startpage close panel
					$(this).parent().parent().removeClass('open');
				} else {
					// console.log('added open');
					$(this).attr("aria-expanded", "true");
					// close all others
					$('.nv2').removeClass('open');
					// siwf startpage open panel
					$(this).parent().parent().addClass('open');
				}
			});
		}
	});
}