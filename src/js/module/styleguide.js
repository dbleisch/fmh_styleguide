/*!
 * fmh.js
 * fmh custom scripts
 *
 */

require('jquery');

/*** global jQuery ***/

if (jQuery) {
	// include jquery for html ref
	global.$ = jQuery;

	(function ($) {
		"use strict";

		$(function() {

			// set viewport mobile
			function setMobile(id=0) {
				const iframe = document.getElementById('prv-' + id).getElementsByTagName( 'iframe' )[0];
				let iframe_scale = 1;
				if (iframe.parentElement.parentElement.parentElement.parentElement.getAttribute('data-scale') != 'null') {
					iframe_scale = iframe.parentElement.parentElement.parentElement.parentElement.getAttribute('data-scale');
				}
				iframe.style.width='375px';
				setTimeout(function(){
					let newheight = iframe.contentWindow.document.documentElement.scrollHeight;
					iframe.style.height = newheight + 'px';
					iframe.parentElement.style.height = (newheight * iframe_scale) + 'px';
				});
			}

			// set viewport desktop
			function setDesktop(id=0) {
				const iframe = document.getElementById('prv-' + id).getElementsByTagName( 'iframe' )[0];
				iframe.style.width='1200px';
			}

			// toggle preview desktop
			var $prv_d = $('.prv-tgl-d');
			if ( $prv_d.length ) {
				$prv_d.each( function( i ) {
					$(this).on( 'click', function(e) {
						e.preventDefault();
						var id = $( this ).parent().parent().parent().attr('data-id');
						setDesktop(id);
						$( this ).addClass('act');
						$( this ).parent().find('.prv-tgl-m').removeClass('act');
					});
				});
			}

			// toggle preview mobile
			var $prv_m = $('.prv-tgl-m');
			if ( $prv_m.length ) {
				$prv_m.each( function( i ) {
					$(this).on( 'click', function(e) {
						e.preventDefault();
						var id = $( this ).parent().parent().parent().attr('data-id');
						setMobile(id);
						$( this ).addClass('act');
						$( this ).parent().find('.prv-tgl-d').removeClass('act');
					});
				});
			}

			// toggle preview mobile
			var $editor_obj = $('.editor_obj');
			if ( $editor_obj.length ) {
				$editor_obj.each( function( i ) {
					$(this).each( function(e) {
						var id = $( this ).attr('data-id');
						initEditor(id);
					});
				});
				// console.log('length:', $editor_obj.length);
			}

			var $prvtglcode = $('.prv-tgl-code');
			if ( $prvtglcode.length ) {
				$prvtglcode.each( function( i ) {
					$(this).on( 'click', function(e) {
						e.preventDefault();
						$(this).toggleClass('act');
						$(this).parent().parent().next().slideToggle();
					});
				});
			}
		});

		// init code
		function initEditorCode(id, type) {
			var src = document.getElementById(id + 'src').textContent;
			var editorwrp = document.getElementById(id);
			var editor = monaco.editor.create(editorwrp, {
				value: [src].join('\n'),
				language: type,
				readOnly: true,
				scrollBeyondLastLine: false,
				automaticLayout: true,
				theme: "vs-dark",
				scrollbar: {
					alwaysConsumeMouseWheel: false,
				},
			});

			var model = editor.getModel();
			model.updateOptions({
				tabSize: 2,
				// trimAutoWhitespace: false,
			});
			// autosize
			const contentHeight = editor.getModel().getLineCount() * 18;
			editorwrp.style.height = contentHeight + 'px';
			// refresh editor
			editor.layout();
			// console.log(editor.getValue());
			// return editor;
		}

		// init editor object
		function initEditor(oid) {
			var id = 'container-' + oid;
			initEditorCode(id + '-1', 'html');
			initEditorCode(id + '-2', 'css');
			initEditorCode(id + '-3', 'javascript');
			append_iFrame(oid);
			return false;
		}

		function append_iFrame(oid=0) {
			const iframe = document.createElement('iframe');
			let iframe_height = 200;
			let iframe_scale = 1;
			let html = '<html><head><style>' + document.getElementById('container-' + oid + '-2src').textContent + '</style><script>' + document.getElementById('container-' + oid + '-3src').textContent + '</script>';
				html = html + '<body>' + document.getElementById('container-' + oid + '-1src').textContent + '</body>';
			// console.log(html, 'container-' + oid + '-1', document.getElementById('container-' + oid + '-2'), document.getElementById('container-' + oid + '-2').textContent);
			document.getElementById('prv-' + oid).appendChild(iframe);
			if (iframe.parentElement.parentElement.parentElement.parentElement.getAttribute('data-height') != 'null') {
				iframe_height = iframe.parentElement.parentElement.parentElement.parentElement.getAttribute('data-height');
			}
			if (iframe.parentElement.parentElement.parentElement.parentElement.getAttribute('data-scale') != 'null') {
				iframe_scale = iframe.parentElement.parentElement.parentElement.parentElement.getAttribute('data-scale');
			}
			iframe.contentWindow.document.open();
			// iframe.style.height = iframe_height + 'px';
			iframe.contentWindow.document.write(html);
			iframe.style.transform = 'scale(' + iframe_scale + ')';

			setTimeout(function(){
				let newheight = iframe.contentWindow.document.documentElement.scrollHeight; //  * iframe_scale
				iframe.style.height = (newheight+20) + 'px';
				iframe.parentElement.style.height = ((newheight * iframe_scale)+20) + 'px';
				// console.log('scrollHeight:', iframe.contentWindow.document.documentElement.scrollHeight, 'newheight', newheight, 'iframe:', iframe.style.height);
			});
			iframe.contentWindow.document.close();

		}

	}(jQuery));
}