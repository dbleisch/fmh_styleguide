import $ from 'jquery'
import validate from 'jquery-validation'

// breakpoint detection & variables
const mediaq = require('./variables')

// droop menu
import droopmenu from './module/droopmenu'

// glidejs.com
import Glide from '@glidejs/glide'
const $glide = document.querySelector(".glide")

if ($glide) {
	var hasItems = $(".glide__slides > li").length;
	// console.log('hasItems: ', hasItems);
	if (hasItems) {
		new Glide($glide, {
			autoplay: 5000,
			animationDuration: 1000,
			type: 'carousel',
			// startAt: (mediaq.ui.isDesktop) ? 1 : 0,
			perView: 3,
			gap: 33,
			focusAt: 0,
			breakpoints: {
				800: {
					perView: 2,
					gap: 20,
					focusAt: 0
				},
				767: {
					perView: 2,
					gap: 13,
					focusAt: 'center'
				},
				600: {
					perView: 1.5,
					gap: 13,
					focusAt: 'center'
				}
			}
		}).mount()
	}
}

// fmh script
import fmh from './module/fmh'

// siwf only script
import siwf_only from './module/siwf_only'

// stylesheet
import styles from '../scss/siwf.scss'

// styleguide script
import styleguide from './module/styleguide'