// Vendors
import { gsap } from 'gsap'

// Main script
import DomInject from '../src/index'

// Create an instance of the DomInject class
const domInject = new DomInject()

// Test
const triggers = document.querySelectorAll('[data-fetch]')

triggers.forEach(function (trigger) {
	trigger.addEventListener('click', () => {
		domInject.loadContent(trigger, '/sub/1.html', '.content:last-child', {
			mode: trigger.dataset.fetchMode ?? 'replace',
			includeParent: true,
			beforeFetch: (trigger) => console.log('Before fetch', trigger),
			afterFetch: (trigger) => {
				console.log('After fetch', trigger)
				// GSAP animation
				gsap.from(trigger.querySelectorAll('p'), {
					opacity: 0,
					y: 20,
					stagger: 0.1,
					duration: 0.5,
				})
			},
		})
	})
})
