// Import vendors
import { gsap } from 'gsap'

// Import utility
import DomInject from '../src/index'

// Create an instance of the DomInject class
const domInject = new DomInject()

// Test
const triggers = document.querySelectorAll('[data-fetch]')
const content = document.querySelector('.content')

triggers.forEach(function (trigger) {
	trigger.addEventListener('click', () => {
		const contentSource = trigger.dataset.fetchUrl || null
		const sourceScope = trigger.dataset.fetchScope || null

		domInject.loadContent(trigger, contentSource, sourceScope, {
			mode: trigger.dataset.fetchMode ?? 'replace',
			includeParent: trigger.dataset.includeParent ?? true,
			beforeFetch: (trigger) => console.log('Before fetch', trigger),
			afterFetch: (trigger) => {
				console.log('After fetch', trigger)

				if (!trigger.dataset.fetchSource && trigger.dataset.fetchScope) {
					const fetchedContent = trigger.querySelectorAll(trigger.dataset.fetchScope)
					fetchedContent.forEach(function (content) {
						content.classList.remove('-hidden')
					})
				}

				gsap.fromTo(
					trigger.querySelectorAll('h1, p'),
					{ opacity: 0, y: 20 },
					{
						opacity: 1,
						y: 0,
						stagger: 0.1,
						duration: 0.5,
					},
				)
			},
			// onError: (error) => {
			// 	console.error('Custom error handler:', error)
			// },
			// muteErrors: true,
		})
	})
})
