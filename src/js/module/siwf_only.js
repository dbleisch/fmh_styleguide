/*!
 * siwf_only.js
 * siwf only custom scripts
 *
 */

require('jquery');

// filter and search list.js
window.List = require('list.js')

// breakpoint detection & variables
const mediaq = require('../variables');

/*** global jQuery ***/

if (jQuery) {
	(function ($) {
		"use strict";

		$(function() {

			// console.log('siwf only loaded');

			/*** email protection ***/
			var $eml = $('.eml');
			if ( $eml.length ) {
				$eml.each(function(i){
					var settings = {
						ext: '&#99;&#104;',
						domain: 'siwf',
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


		});

	}(jQuery));

}