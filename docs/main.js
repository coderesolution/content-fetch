// Import the ContentFetch instance
import ContentFetch from '../src/index'

// Create an instance of ContentFetch with debugMode enabled
const contentFetch = new ContentFetch({ debugMode: true })

// Create animations on the injected elements
const animateContent = (target) => {
	gsap.fromTo(
		target.querySelectorAll('h1, p'),
		{ opacity: 0, y: 20 },
		{
			opacity: 1,
			y: 0,
			stagger: 0.1,
			duration: 0.5,
		},
	)
}

// Test
const triggers = document.querySelectorAll('[data-fetch]')

triggers.forEach((trigger) => {
	trigger.addEventListener('click', () => {
		contentFetch.fromTo(
			{
				selector: trigger.dataset.fetchSelector,
				url: trigger.dataset.fetchUrl,
				includeParent: trigger.dataset.includeParent ?? true,
				onStart: () => {
					console.log('FROM: start')
					gsap.to(trigger, 1, {
						backgroundColor: 'blue',
					})
				},
				onEnd: (target) => {
					console.log('FROM: end', target)
				},
				//onError: (error) => console.error('Custom error handler on from:', error),
			},
			{
				destination: trigger,
				mode: trigger.dataset.fetchMode ?? 'replace',
				delay: parseFloat(trigger.dataset.fetchDelay) || 0,
				onStart: (target) => {
					console.log('TO: start', target)
				},
				onEnd: (target) => {
					console.log('TO: end', target)
					animateContent(target)
				},
				//onError: (error) => console.error('Custom error handler on to:', error),
			},
		)
	})
})
