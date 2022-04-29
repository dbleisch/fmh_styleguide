/*!
 * fmh.js
 * fmh custom scripts
 *
 */

require('jquery');

// breakpoint detection & variables
const mediaq = require('../variables');
const autoComplete = require("javascript-autocomplete");

// filter and search list.js
window.List = require('list.js');

/*!
 * jQuery Textarea AutoSize plugin : https://github.com/javierjulio/textarea-autosize
 * Author: Javier Julio
 * Licensed under the MIT license
 */
!function(t,e,i,n){function s(e,i){this.element=e,this.$element=t(e),this.init()}var h="textareaAutoSize",o="plugin_"+h,r=function(t){return t.replace(/\s/g,"").length>0};s.prototype={init:function(){var i=parseInt(this.$element.css("paddingBottom"))+parseInt(this.$element.css("paddingTop"))+parseInt(this.$element.css("borderTopWidth"))+parseInt(this.$element.css("borderBottomWidth"))||0;r(this.element.value)&&this.$element.height(this.element.scrollHeight-i),this.$element.on("input keyup",function(n){var s=t(e),h=s.scrollTop();t(this).height(0).height(this.scrollHeight-i),s.scrollTop(h)})}},t.fn[h]=function(e){return this.each(function(){t.data(this,o)||t.data(this,o,new s(this,e))}),this}}(jQuery,window,document);

/*** global jQuery ***/

if (jQuery) {
	// include jquery for html ref
	global.$ = jQuery;

	(function ($) {
		"use strict";

		$(function() {

			// Initialize Textarea
			var $textarea = $('.textarea-autosize');
			$textarea.textareaAutoSize();

			/*** autocomplete ***/
			// https://goodies.pixabay.com/javascript/auto-complete/demo.html
			var $a = $('#searchkeyword');
			if ( $a.length ) {
				var xhr;
				var channel = $a.attr('data-channel') || 0;
				var lang = $a.attr('data-lang') || 0;
				var site = $a.attr('data-site') || 0;

				if ((!channel == 0) && (!lang == 0) && (!site==0)) {
					// console.log('autocomplete loaded');
					var autocomp = new autoComplete({
						selector: '#searchkeyword',
						minChars: 2,
						source: function(term, response) { // response
							try { xhr.abort(); } catch(e){}
							// console.log('autocomplete called');
							xhr = $.getJSON('/__suggestions.cfm',
								{
									query: term,
									channel_ID: channel,
									lang_ID: lang,
									site_ID: site,
									_action: "search.search.getSuggestions"
								},
								function(data){
									response(data.suggestions);
								}
							);
							// https://www.fmh.ch/__api.cfm?channel_ID=3&lang_ID=2&site_ID=200001&_action=search.search.getSuggestions&query=beruf
						},
						onSelect: function(e, term, item) {
							var url = $('#submitsearch').attr('action') + '#q=' + term;
							var $submitsearchpage = $('.searchform[action="#"]');
							// e.preventDefault();
							window.location.href = url;
							// if searchpage close modale
							if ( $submitsearchpage.length ) {
								location.reload();
							}
						}
					});
				}
			}

			/* site-wide search criteria highlighting */
			var sCriteria = getURLParameter('criteria');
			if( sCriteria && sCriteria.length ){
				highlight( sCriteria );
			}

			/*** url opener serviceboxes ***/
			const $openurl = $(".data-url");
			if ($openurl) {
				$openurl.on('click', function() {
					var thisurl = $(this).attr('data-url');
					if (thisurl) {
						window.location.href = thisurl;
					}
				});
			}

			/*** show more page layout ***/
			const $showmore = $('#showmore');
			const $more = $('#more');

			if ($showmore && $more) {
				$showmore.on('click', function() {
					event.preventDefault(); // prevent jumping
					$showmore.toggleClass('open');
					$more.toggleClass('open');
				});
			}

			/*** dropdown menue (language) ***/
			const $dropdowns = $('.menu-dd'); // Specifying the element is faster for older browsers

			/**
			 * Mouse events
			 * @description Mimic hoverIntent plugin by waiting for the mouse to 'settle' within the target before triggering
			*/

			$dropdowns.on('mouseover', function() { // Mouseenter (used with .hover()) does not trigger when user enters from outside document window
				var $this = $(this);

				if ($this.prop('hoverTimeout')) {
					$this.prop('hoverTimeout', clearTimeout($this.prop('hoverTimeout')));
				}

				$this.prop('hoverIntent', setTimeout(function() {
					$this.addClass('open');
				}, 250));
			}).on('mouseleave', function() {
				var $this = $(this);

				if ($this.prop('hoverIntent')) {
					$this.prop('hoverIntent', clearTimeout($this.prop('hoverIntent')));
				}

				$this.prop('hoverTimeout', setTimeout(function() {
					$this.removeClass('open');
				}, 250));
			});

			/*** expandable ***/

			// expandable open
			var $exph2h3 = $(".exp:not('.locked') > h2, .exp:not('.locked') > h3");
			if ( $exph2h3.length ) {
				$exph2h3.on('click', function(e) {
					e.preventDefault(); // prevent jumping
					var $exp = $(this).parent();
					var is_open = $exp.hasClass('open');
					var tmphash = $exp.find('a').attr("name");

					// close all
					$('.exp').removeClass('open');

					// offset scroll to item top
					var offsetdet = 170;
					if ($(window).width() < 768) { offsetdet = 30; }

					if (!is_open) {
						// add open class
						$exp.addClass('open');

						// scroll to (if behind current position)
						if ($(window).scrollTop() > ($("#exp-"+tmphash).offset().top-offsetdet)) {
							scrollToExpand(tmphash);
						}
						// debug: console.log($("#exp-"+$exp.find('a').attr("name")).offset().top, $(window).height(), $(window).scrollTop());
						// set hash
						history.pushState(null,null,"#" + tmphash);

					}
				});
			}

			// expandable portraits more/less
			var $portraitportmore = $(".exp.portrait:not('.locked') > div.port-more");
			if ( $portraitportmore.length ) {
				$portraitportmore.on('click', function(e) {
					e.preventDefault(); // prevent jumping
					var $exp = $(this).parent();
					var is_open = $exp.hasClass('open');
					var tmphash = $exp.find('a').attr("name");

					// close all
					$('.exp').removeClass('open');
					$('.less').hide();
					$('.more').show();

					// offset scroll to item top
					var offsetdet = 170;
					if ($(window).width() < 768) { offsetdet = 30; }

					$(this).parents('.exp').find('.more').show();
					$(this).parents('.exp').find('.less').hide();

					if (!is_open) {
						// add open class
						$exp.addClass('open');

						// portraits more/less
						$(this).parents('.exp').find('.less').show();
						$(this).parents('.exp').find('.more').hide();

						// scroll to (if behind current position)
						if ($(window).scrollTop() > ($("#exp-"+tmphash).offset().top-offsetdet)) {
							scrollToExpand(tmphash);
						}
						// debug: console.log($("#exp-"+$exp.find('a').attr("name")).offset().top, $(window).height(), $(window).scrollTop());
						// set hash
						history.pushState(null,null,"#" + tmphash);

					}
				});
			}

			// vimeo magnific popup

			/*** vimeo ***/
			$(".video").each(function( index ) {
				var vimeoVideoID = $( this ).attr('data-id');
				// console.log( index + ": " + $( this ).attr('data-id') );
				$.getJSON('https://vimeo.com/api/oembed.json?url=https://vimeo.com/' + vimeoVideoID + '&width=1280&height=720', {format: "json"}, function(data) {
					// console.log(data.thumbnail_url);
					$("#vimeo-" + vimeoVideoID).css("background-image", "url('" + data.thumbnail_url + "')");
				});

				$( this ).find("a.video-play-button").magnificPopup({
					mainClass: "vimeoPopup mfp-fade", // mfp-vimeo-popup-2041
					type: "iframe",
					iframe: {
						markup: '<div class="mfp-iframe-scaler">'+
								'<div class="mfp-close"></div>'+
								'<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
								'<div class="mfp-title"></div>'+
								'</div>'
					},
					items: { src: "https://vimeo.com/" + vimeoVideoID },			//Add Additional Options Below Here
				});
			});

			// scroll to expandable
			function scrollToExpand(tmphash) {
				var timer = window.setTimeout(function() {
					// destination position
					var offset = 0;
					// offset scroll to item top
					var offsetdet = 170;
					if ($(window).width() < 992) { offsetdet = 30; }
					if ($("#exp-"+tmphash).offset()) { offset = $("#exp-"+tmphash).offset().top - offsetdet; }
					// debug: console.log($(window).height(),$("#exp-"+tmphash).offset(), $("#exp-"+tmphash).offset().top)
					var all = $(window).height() + offset;
					// scroll to
					$('html, body').animate({
						scrollTop: offset
					}, 1000);
				}, 200);

				// set hash
				history.pushState(null,null,"#" + $("#exp-"+tmphash).attr('name'));
			}

			// open expandable by url-hash
			function openExpand(tmphash) {
				if (tmphash.length) {

					// verify if anchor is in expandable
					const $anchor_has_exp = $('#' + tmphash).closest('.exp');
					if ( $anchor_has_exp.length ) {
						// open expandable
						let is_open = $anchor_has_exp.hasClass('open');
						if (!is_open) {
							// close all
							$('.exp').removeClass('open');
							// add open class
							$anchor_has_exp.addClass('open');
						}
					}

					// if not in expandable
					if ($('#exp-' + tmphash).length == 0) {
						// direct scroll to
						return;
					}

					// open expandable
					var $exp = $('#exp-' + tmphash).parent();
					var is_open = $exp.hasClass('open');
					if (!is_open && $exp.hasClass('exp')) {
						// close all
						$('.exp').removeClass('open');
						// add open class
						$exp.addClass('open');
					}

					// scroll to expandable
					scrollToExpand(tmphash);
				}
			}

			// expand by url-hash
			var inithash = window.location.hash.substring(1);
			var $elementsearch = $('element-search');

			if ( !$elementsearch.length ) { // only if not on fmh search form
				openExpand(inithash);

				$(window).on('hashchange',function(e){
					// get hash
					var tmphash = window.location.hash.substring(1);
					// open more expandable for containing expandables
					$('#more').addClass('open');
					$('#showmore').addClass('open');
					// console.log(tmphash);
					openExpand(tmphash);
				});

				// if hash exists
				if($(window.location.hash).length > 0){
					$('#more').addClass('open');
					$('#showmore').addClass('open');
					$('html, body').animate({ scrollTop: $(window.location.hash).offset().top-40 }, 1000);
				}
			}

			// open services sbox (dienstleistungen)
			var $servicessboxmore = $('.services .sbox .more a');
			if ( $servicessboxmore.length ) {
				$servicessboxmore.on('click',function(e){
					e.preventDefault(); // prevent jumping
					// close all
					$('.sbox').removeClass('open');
					$('.more-cnt').removeClass('open');
					$('.more').show();
					$('.less').hide();
					// open
					$(this).parents('.sbox').addClass('open');
					$(this).parents('.sbox').find('.more-cnt').addClass('open');
					$(this).parents('.sbox').find('.less').show();
					$(this).parent().hide();
				});
			}

			// close services sbox (dienstleistungen)
			var $servicessboxless = $('.services .sbox .less a');
			if ( $servicessboxless.length ) {
				$servicessboxless.on('click',function(e){
					e.preventDefault(); // prevent jumping
					$(this).parents('.sbox').removeClass('open');
					$(this).parents('.sbox').find('.more-cnt').removeClass('open');
					$(this).parents('.sbox').find('.more').show();
					$(this).parent().hide();
				});
			}

			/*** startpage ***/

			// open siwf/fmh startpage mobile open panel
			var $panelmobexp = $('.panel .mob-exp');
			if ( $panelmobexp.length ) {
				$panelmobexp.on('click',function(e){
					e.preventDefault(); // prevent jumping
					if ($(this).parent().hasClass('open')) {
						// startpage close panel
						$(this).parent().removeClass('open');
					} else {
						// startpage open panel
						$('.panel').removeClass('open');
						$(this).parent().addClass('open');
					}
				});
			}

			/*** contactform ***/
			var submitform = false;

			// deny submit form
			var $webform = $('.webform');
			if ( $webform.length ) {
				// validate
				// https://jqueryvalidation.org/documentation/
				// https://johnnycode.com/2014/03/27/using-jquery-validate-plugin-html5-data-attribute-rules/
				$webform.validate({
					// rules, options, etc.,
					onfocusout: function(element) {
						// "eager" validation
						this.element(element);
					}
				});
				// deny submit (by tastatur)
				$webform.on('submit', function(e){
					// console.log('no submit', submitform);
					if (!submitform) {
						return false;
					}
				});
			}

			// submit form on click
			var $subform = $('#formsub,#formsub1');
			if ( $subform.length ) {
				$subform.on('click',function(e){
					e.preventDefault(); // prevent jumping
					submitform = true;
					// console.log('submit');
					$('.webform').trigger('submit');
				});
			}

			// submit form on click gutachterstelle
			var $subformga = $('#formsub-ga,#formsub-ga1');
			if ( $subformga.length ) {
				$subformga.on('click',function(e){
					e.preventDefault(); // prevent jumping
					submitform = true;
					// console.log('submit');
					$('.webform').append('<input type="hidden" name="save" value="true" />');
					$('.webform').trigger('submit');
				});
			}

			// submit form gutachterstelle on delete file
			var $subformgad = $('a.formsub-ga-delfile');
			var delfield = '';
			if ( $subformgad.length ) {
				$subformgad.on('click',function(e){
					e.preventDefault(); // prevent jumping
					delfield = $(this).attr('data-field');
					submitform = true;
					// console.log('submit', delfield);
					$('.webform').append('<input type="hidden" name="save" value="true" />');
					$('.webform').append('<input type="hidden" name="removefile" value="' + delfield + '" />');
					$('.webform').trigger('submit');
				});
			}

			/*** ddq ***/

			// qualitaetsinitiativen
			var $qsinit = $('#sel input.flnk');
			if ( $qsinit.length ) {
				$qsinit.change(function () {
					var valueSelected = $("#sel input.flnk[type='radio']:checked").val();
					var $parentWrapper = $(this).parent().parent().parent();
					$parentWrapper.parent().children('.exp-frm').removeClass('open');
					$parentWrapper.addClass('open');
					$('#sel input[type=checkbox]:not(".top"),#sel input[type=radiod]:not(".top")').prop('checked', false);
					$(this).prop('checked', true);
				});
			}

			// medizinische register
			var $medreg = $('.medreg input.mlnk');
			if ( $medreg.length ) {
				$medreg.change(function () {
					var valueSelected = $("#sel input.mlnk[type='radio']:checked").val();
					var $parentWrapper = $(this).parent().parent().parent();
					$parentWrapper.toggleClass("open");
					$(this).prop('checked', true);
				});
			}

			// medizinische register tooltips
			var $medregtooltips = $('[data-toggle="tooltip"]');
			if ( $medregtooltips.length ) {
				$medregtooltips.tooltip({
					placement:'bottom',
					html:true
					// , trigger:'click'
				});
			}

			// siwf abc
			var $siwfabc = $('#abc');
			if ( $siwfabc.length ) {
				// console.log('a', $('.abc-inner').width(), $('.abc-inner').innerWidth(), $siwfabc.width(), '-', $('.abc-inner1').width(), $('.abc-inner')[0].scrollWidth, $('.abc-outer')[0].scrollWidth);
				var innerWidth = $('.abc-inner')[0].scrollWidth;
				if (innerWidth > $siwfabc.width()) {
					$siwfabc.children('.right').show();
					$('#abc-r').on('click', function(e) {
						e.preventDefault(); // prevent jumping
						$siwfabc.children('.abc-outer').animate( { scrollLeft: innerWidth}, 500);
						$('#abc-r').hide();
						$('#abc-l').show();
					});
					$('#abc-l').on('click', function(e) {
						e.preventDefault(); // prevent jumping
						$siwfabc.children('.abc-outer').animate( { scrollLeft: 0 }, 500);
						$('#abc-l').hide();
						$('#abc-r').show();
					});
				}
			}

			// sharing
			var $sharing = $('.share');
			if ( $sharing.length ) {
				$sharing.each( function() {
					$( this ).children('.icon-share_icon').on('touchend', function(e) {
						$( this ).parent().toggleClass('act');
					});
				});

				$(document).mouseup(function(e) {
					if (!$sharing.is(e.target) && $sharing.has(e.target).length === 0) {
						$sharing.removeClass('act');
					}
				});
			}

			// sharing
			var $sharingadv = $('.share.adv,.sharepage');
			if ( $sharingadv.length ) {
				$sharingadv.each( function() {
					// console.log('loaded');
					$( this ).find('.icons .sfb,.icons .sln,.icons .stw').attr('target','_blank');
					var socurl = $(this).find('.icons').attr('data-url');
					var soctitle = $(this).find('.icons').attr('data-title');
					$( this ).find('.icons .sfb').attr('href', 'https://www.facebook.com/sharer/sharer.php?display=page&u=' + socurl + '%3Fsocext%3DFacebook' ); // c=&
					$( this ).find('.icons .sln').attr('href', 'https://www.linkedin.com/sharing/share-offsite/?url=' + socurl + '%3Fsocext%3DLinkedIn&title=' + soctitle );
					$( this ).find('.icons .stw').attr('href', 'https://twitter.com/intent/tweet?url=' + socurl + '%3Fsocext%3DTwitter&amp;text=' + soctitle );
					$( this ).find('.icons .sml.de').attr('href', 'mailto:?body=Guten%20Tag%0A%0ADies%20k%C3%B6nnte%20Sie%20interessieren%3A%0A' + socurl + '%3Fsocext%3DMail%0A%0AFreundliche%20Gr%C3%BCsse&subject=Meine%20Empfehlung%20%E2%80%93%20' + soctitle);
					$( this ).find('.icons .sml.fr').attr('href', 'mailto:?body=Cela%20pourrait%20vous%20int%C3%A9resser%3A%0A' + socurl + '%3Fsocext%3DMail%0A%0AMeilleures%20salutations&subject=Ma%20recommandation%20%E2%80%93%20' + soctitle);
					$( this ).find('.icons .sml.it').attr('href', 'mailto:?body=Buongiorno%0A%0AQuesto%20potrebbe%20interessarla%3A%0A' + socurl + '%3Fsocext%3DMail%0A%0ACordiali%20saluti&subject=La%20mia%20raccomandazione%20%E2%80%93%20' + soctitle);
				});
			}

			/*** styleguide mob-nav ***/
			var $sidenav = $('#sidenav .toggle');
			if ( $sidenav.length ) {
				$sidenav.on( 'click', function(e){
					$(this).next().toggleClass('open');
				});
			}

			// styleguide mobile open panel
			/* ... (inactiv?) ... */
			var $sidenavexp = $('.pan .mob-exp');
			if ( $sidenavexp.length ) {
				$sidenavexp.on('click',function(e){
					// e.preventDefault(); // prevent jumping
					if ($(this).parent().hasClass('open')) {
						// startpage close panel
						$(this).parent().removeClass('open');
					} else {
						// startpage open panel
						$('.pan').removeClass('open');
						$(this).parent().addClass('open');
					}
				});
			}

		});

		function getURLParameter( sParam ) {
			return decodeURIComponent((new RegExp('[?|&]' + sParam + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
		}

		function highlight(terms) {
			var $highlightContent = $('section>div>.lead,section>div>.abschnitt,section>div>.download'); // , .inhalt .lead, .inhalt .abschnitt
			if ( $highlightContent.length ) {
				$highlightContent.each(function() {
					var content = $(this).html();
					if (!content) {
						return;
					} else {
						var template = '$1<span class="highlight">$2</span>$3',
								pattern = new RegExp('"([^"]+)"', "ig"),
								match = "";
						while ((match = pattern.exec(terms)) !== null) {
								terms = terms.replace(match[0], match[0].replace(/\s/g, '-+|-+|-+|-+|'));
						}

						var aTerms = terms.split(" ");
						for(var i=0; i < aTerms.length; i++) {
								if($.trim(aTerms[i]).length) {
									aTerms[i] = aTerms[i].replace('-+|-+|-+|-+|',' ').replace(/[\*\(\)\+\-\[\]\\\{\}\|\?"]/g, '');
									var pattern = new RegExp("(>[^<]*)(" + aTerms[i] + ")([^<]*)", "ig");
									content = content.replace(pattern, template);
								}
						}
						$(this).html(content);
					}
				});
			}
		}

		/* highlight faqs */
		function highlightfaq(terms) {
			var $highlightContent = $('.faq .abschnitt');
			if ( $highlightContent.length ) {
				$highlightContent.each(function() {
					var content = $(this).html();
					content = content.replace(/<span[^>]*>([^<]+)<\/span>/g, '$1');
					// console.log(content);
					if (!content) {
						return;
					} else {
						var template = '$1<span class="highlight">$2</span>$3',
								pattern = new RegExp('"([^"]+)"', "ig"),
								match = "";
						while ((match = pattern.exec(terms)) !== null) {
								terms = terms.replace(match[0], match[0].replace(/\s/g, '-+|-+|-+|-+|'));
						}

						var aTerms = terms.split(" ");
						for(var i=0; i < aTerms.length; i++) {
								if($.trim(aTerms[i]).length) {
									aTerms[i] = aTerms[i].replace('-+|-+|-+|-+|',' ').replace(/[\*\(\)\+\-\[\]\\\{\}\|\?"]/g, '');
									var pattern = new RegExp("(>[^<]*)(" + aTerms[i] + ")([^<]*)", "ig");
									content = content.replace(pattern, template);
								}
						}
						$(this).html(content);
					}
				});
			}
			filter_timeout = false;
		}

		/* highlight wikis */
		function highlightwikis(terms) {
			var $highlightContent = $('.wiki .abschnitt');
			// console.log(terms);
			if ( $highlightContent.length ) {
				$highlightContent.each(function() {
					var content = $(this).html();
					content = content.replace(/<span[^>]*>([^<]+)<\/span>/g, '$1');
					// console.log(content);
					if (!content) {
						return;
					} else {
						var template = '$1<span class="highlight">$2</span>$3',
								pattern = new RegExp('"([^"]+)"', "ig"),
								match = "";
						while ((match = pattern.exec(terms)) !== null) {
								terms = terms.replace(match[0], match[0].replace(/\s/g, '-+|-+|-+|-+|'));
						}

						var aTerms = terms.split(" ");
						for(var i=0; i < aTerms.length; i++) {
								if($.trim(aTerms[i]).length) {
									aTerms[i] = aTerms[i].replace('-+|-+|-+|-+|',' ').replace(/[\*\(\)\+\-\[\]\\\{\}\|\?"]/g, '');
									var pattern = new RegExp("(>[^<]*)(" + aTerms[i] + ")([^<]*)", "ig");
									content = content.replace(pattern, template);
								}
						}
						$(this).html(content);
					}
				});
			}
			filter_timeout = false;
		}

		/*** wiki filter ***/
		var $wikis = $('#wikis');
		var $wikis_lists = $('.wikiwrp');

		if ( $wikis.length ) {
			var options = {
				valueNames: [ 'ttl','exp-cnt' ]
			};

			let wikiList = [];
			if ( $wikis_lists.length ) {
				for (let index = 0; index < $wikis_lists.length; index++) {
					wikiList.push(new List($wikis_lists[index], options));
				}
			}

			var $filtertxt = $('#filtertxt');
			var filter_timeout = false;
			$filtertxt.focus();
			if ( $filtertxt.length ) {

				$filtertxt.on( 'keyup', function(e){
					e.preventDefault();
					if (!filter_timeout) {
						let timer = window.setTimeout(function() {
							let searchString = $( "#filtertxt" ).val();
							for (let index = 0; index < wikiList.length; index++) {
								wikiList[index].search(searchString);
							}
							filter_timeout = true;
							highlightwikis(searchString);
						}, 1000);
					}
				});

				$filtertxt.on( 'keydown', function (e) {
					if (e.keyCode == 13) {
						e.preventDefault();
						return false;
					}
				});

			}
		}

		/*** faqs ***/
		var $faqs = $('#faqs');
		var $faqs_lists = $('.faqwrp');

		if ( $faqs.length ) {
			var options = {
				valueNames: [ 'fttl','abschnitt' ]
			};

			let faqList = [];
			if ( $faqs_lists.length ) {
			for (let index = 0; index < $faqs_lists.length; index++) {
					faqList.push(new List($faqs_lists[index], options));
				}
			}

			if (window.location.hash.substring(1).length) {
				var tmphash = window.location.hash.substring(2);
				console.log('hash: ', tmphash);
				var $checkboxes = $('.faq_filter input');
				var this_id = '';
				if ( $checkboxes.length ) {
					$checkboxes.each(function () {
						$(this).prop('checked', false);
						this_id = $(this).attr('data-id');
						// console.log('hash 2: ', this_id);
						$('#i' + this_id).parent().hide();
						$('#i' + this_id).parent().next().hide();
					});
				}
				var $checkbox = $('#ckb' + tmphash);
				if ( $checkbox.length ) {
					// console.log('hash: ', tmphash);
					$checkbox.prop('checked', true);
					$('#i' + tmphash).parent().show();
					$('#i' + tmphash).parent().next().show();
				}
			}


			var $filtertxt = $('#filtertxt');
			var filter_timeout = false;
			$filtertxt.focus();
			if ( $filtertxt.length ) {

				$filtertxt.on( 'keyup', function(e){
					e.preventDefault();
					if (!filter_timeout) {
						let timer = window.setTimeout(function() {
							let searchString = $( "#filtertxt" ).val();
							for (let index = 0; index < faqList.length; index++) {
								faqList[index].search(searchString);
							}
							filter_timeout = true;
							highlightfaq(searchString);
						}, 1000);
					}
				});

				$filtertxt.on( 'keydown', function (e) {
					if (e.keyCode == 13) {
						e.preventDefault();
						return false;
					}
				});

			}

			$( ".faq_filter>input").on( 'click', function(e){
				var this_id = $(this).attr('data-id');
				if (!$(this).is(':checked')) {
					$('#i' + this_id).parent().hide();
					$('#i' + this_id).parent().next().hide();
				} else {
					$('#i' + this_id).parent().show();
					$('#i' + this_id).parent().next().show();
				}
				console.log('#i' + this_id);
				console.log($('#i' + this_id).parent());
			});
		}

	}(jQuery));
}