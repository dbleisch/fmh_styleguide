/*!
 * fmh_only.js
 * fmh only custom scripts
 *
 */

require('jquery');

// filter and search list.js
window.List = require('list.js');

// breakpoint detection & variables
const mediaq = require('../variables');

/*** global jQuery ***/

if (jQuery) {
	(function ($) {
		"use strict";
		$(function() {

			// console.log('fmh only loaded');

			/*** email protection ***/
			var $eml = $('.eml');
			if ( $eml.length ) {
				$eml.each(function(i){
					var settings = {
						ext: '&#99;&#104;',
						domain: 'fmh',
						fulldom: '',
						nm: $(this).html(),
						stylesStr: '',
						styles: $(this).attr('style'),
						ttlStr: '',
						ttl: $(this).attr('title'),
						classStr: '',
						classname: $(this).attr('class'),
						dom: $(this).attr('alt')
					};

					settings.fulldom = settings.domain + '.' + settings.ext;
					if (settings.styles) { settings.stylesStr = ' style=\"' + settings.styles + '\"'; }
					if (settings.ttl) { settings.ttlStr = settings.ttl; }
					if (settings.classname) { settings.classStr = ' class=\"' + settings.classname + '\"'; }
					if (settings.dom) { settings.fulldom = settings.dom; }
					if (settings.ttlStr.length>0) {
						$(this).html('<a' + settings.stylesStr + settings.classStr + ' href=\"mailto:' + settings.nm + '@' + settings.fulldom + '\">' + settings.ttlStr + '</a>');
					} else {
						$(this).html('<a' + settings.stylesStr + settings.classStr + ' href=\"mailto:' + settings.nm + '@' + settings.fulldom + '\">' + settings.nm + '@' + settings.fulldom + '</a>');
					}
				});
			}

			// kantonale gesellschaften
			var $gesellschaften = $('#gesellschaften');
			if ( $gesellschaften.length ) {

				var options = {
					valueNames: [ 'c-society','title', 'exp-cnt' ]
				};

				var gesList = new List('gesellschaften', options);

				var $filtertxt = $('#filtertxt');
				if ( $filtertxt.length ) {

					$filtertxt.on( 'keyup', function(e){
						e.preventDefault();
						var searchString = $( "#filtertxt" ).val();
						gesList.search(searchString);
					});

					$filtertxt.on( 'keydown', function (e) {
						if (e.keyCode == 13) {
							e.preventDefault();
							return false;
						}
					});

				}

				$( ".kt" ).on( 'click', function(e){
					gesList.search();
					$( "#filtertxt" ).val('');
				});
			}

			// fach gesellschaften
			var $gesellschaften1 = $('#fachgesellschaften1');
			var $gesellschaften2 = $('#fachgesellschaften2');
			var $gesellschaften3 = $('#fachgesellschaften3');
			var $gesellschaften4 = $('#fachgesellschaften4');

			if ( $gesellschaften1.length ) {
				var options = { valueNames: [ 'c-society','title', 'exp-cnt' ] };
				var fachGes1 = new List('fachgesellschaften1', options);

				fachGes1.on("searchComplete",function(list){
					var userList_tmp = list.items;
					var curalpha = '';
					$('.c-society').hide();

					$('#fachgesellschaften1 .c-society').each(function( index ) {
						var itemtxt = $( this ).text();
						if (curalpha != itemtxt) {
							$( this ).show();
						}
						curalpha = itemtxt;
					});

					curalpha = '';
					$('#fachgesellschaften2 .c-society').each(function( index ) {
						var itemtxt = $( this ).text();
						if (curalpha != itemtxt) {
							$( this ).show();
						}
						curalpha = itemtxt;
					});

					curalpha = '';
					$('#fachgesellschaften3 .c-society').each(function( index ) {
						var itemtxt = $( this ).text();
						if (curalpha != itemtxt) {
							$( this ).show();
						}
						curalpha = itemtxt;
					});

					curalpha = '';
					$('#fachgesellschaften4 .c-society').each(function( index ) {
						var itemtxt = $( this ).text();
						if (curalpha != itemtxt) {
							$( this ).show();
						}
						curalpha = itemtxt;
					});
				});
			}

			if ( $gesellschaften2.length ) {
				var options = { valueNames: [ 'c-society','title', 'exp-cnt' ] };
				var fachGes2 = new List('fachgesellschaften2', options);
			}

			if ( $gesellschaften3.length ) {
				var options = { valueNames: [ 'c-society','title', 'exp-cnt' ] };
				var fachGes3 = new List('fachgesellschaften3', options);
			}

			if ( $gesellschaften4.length ) {
				var options = { valueNames: [ 'c-society','title', 'exp-cnt' ] };
				var fachGes4 = new List('fachgesellschaften4', options);
			}

			var $filtertxt = $('#filtertxt');
			if ( $filtertxt.length ) {

				$filtertxt.on( 'keyup', function(e){
					e.preventDefault();
					var searchString = $filtertxt.val();
					if ( $gesellschaften1.length ) { fachGes1.search(searchString); }
					if ( $gesellschaften2.length ) { fachGes2.search(searchString); }
					if ( $gesellschaften3.length ) { fachGes3.search(searchString); }
					if ( $gesellschaften4.length ) { fachGes4.search(searchString); }
				});

				$filtertxt.on( 'keydown', function (e) {
					if (e.keyCode == 13) {
						e.preventDefault();
						return false;
					}
				});

			}

			var $filter1 = $('#filter1');
			var $filter2 = $('#filter2');
			var $filter3 = $('#filter3');
			var $filter4 = $('#filter4');

			if ( $filter1.length ) {
				$filter1.on( 'click', function(e){
					e.preventDefault();
					if ( $gesellschaften1.length ) {
						if ($filter1.hasClass('active')) {
							$filter1.removeClass('active');
							$gesellschaften2.fadeIn();
							$gesellschaften3.fadeIn();
							$gesellschaften4.fadeIn();
						} else {
							if ( $gesellschaften1.is(":hidden") ){ $gesellschaften1.fadeIn(); }
							$filter1.addClass('active');
							$gesellschaften2.fadeOut();
							$filter2.removeClass('active');
							$gesellschaften3.fadeOut();
							$filter3.removeClass('active');
							$gesellschaften4.fadeOut();
							$filter4.removeClass('active');
						}
					}
				});
			}
			if ( $filter2.length ) {
				$filter2.on( 'click', function(e){
					e.preventDefault();
					if ( $gesellschaften2.length ) {
						if ($filter2.hasClass('active')) {
							$filter2.removeClass('active');
							$gesellschaften1.fadeIn();
							$gesellschaften3.fadeIn();
							$gesellschaften4.fadeIn();
						} else {
							if ( $gesellschaften2.is(":hidden") ){ $gesellschaften2.fadeIn(); }
							$filter2.addClass('active');
							$gesellschaften1.fadeOut();
							$filter1.removeClass('active');
							$gesellschaften3.fadeOut();
							$filter3.removeClass('active');
							$gesellschaften4.fadeOut();
							$filter4.removeClass('active');
						}
					}
				});
			}
			if ( $filter3.length ) {
				$filter3.on( 'click', function(e){
					e.preventDefault();
					if ( $gesellschaften3.length ) {
						if ($filter3.hasClass('active')) {
							$filter3.removeClass('active');
							$gesellschaften1.fadeIn();
							$gesellschaften2.fadeIn();
							$gesellschaften4.fadeIn();
						} else {
							if ( $gesellschaften3.is(":hidden") ){ $gesellschaften3.fadeIn(); }
							$filter3.addClass('active');
							$gesellschaften1.fadeOut();
							$filter1.removeClass('active');
							$gesellschaften2.fadeOut();
							$filter2.removeClass('active');
							$gesellschaften4.fadeOut();
							$filter4.removeClass('active');
						}
					}
				});
			}
			if ( $filter4.length ) {
				$filter4.on( 'click', function(e){
					e.preventDefault();
					if ( $gesellschaften4.length ) {
						if ($filter4.hasClass('active')) {
							$filter4.removeClass('active');
							$gesellschaften1.fadeIn();
							$gesellschaften2.fadeIn();
							$gesellschaften3.fadeIn();
						} else {
							if ( $gesellschaften4.is(":hidden") ){ $gesellschaften4.fadeIn(); }
							$filter4.addClass('active');
							$gesellschaften1.fadeOut();
							$filter1.removeClass('active');
							$gesellschaften2.fadeOut();
							$filter2.removeClass('active');
							$gesellschaften3.fadeOut();
							$filter3.removeClass('active');
						}
					}
				});
			}
		});

		var curalphaInit = '';
		$('.c-society').hide();

		$('.c-society').each(function( index ) {
			var itemtxt = $( this ).text();
			if (curalphaInit != itemtxt) {
				$( this ).show();
			}
			curalphaInit = itemtxt;
			// console.log( curalphaInit );
		});

	}(jQuery));

}