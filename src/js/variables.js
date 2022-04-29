// variables.js

$("body").append("<div style='visibilty:hidden' class='viewport-check'><span class='d-none d-lg-block'></span></div>");

// checks if the span is set to display block via CSS
var Bootstrap4MediaQuery = "";
function FnDetectMediaQuery(_QsTarget) {
	var _QsTarget = $(_QsTarget).css('display') == 'block';
	return _QsTarget;
}
if(FnDetectMediaQuery('.viewport-check .d-lg-block') == true) { Bootstrap4MediaQuery = "lg"; } else { Bootstrap4MediaQuery = ""; }

// console.log(Bootstrap4MediaQuery, 'first init');

exports.ui = {
	breakpoint: Bootstrap4MediaQuery,
	isDesktop: (Bootstrap4MediaQuery === 'lg') ? true : false,
};
