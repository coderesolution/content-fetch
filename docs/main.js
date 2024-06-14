// Import the DomInject instance
import DomInject from '../src/index'

// Create an instance of DomInject with debugMode enabled
const domInject = new DomInject({ debugMode: true })

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
		domInject.fromTo(
			{
				selector: trigger.dataset.fetchSelector,
				url: trigger.dataset.fetchUrl,
				includeParent: trigger.dataset.includeParent ?? true,
				// onStart: () => console.log('Getting content'),
				// onEnd: (html) => console.log('Content received', html),
				//onError: (error) => console.error('Custom error handler on from:', error),
			},
			{
				destination: trigger,
				mode: trigger.dataset.fetchMode ?? 'replace',
				// onStart: (target) => console.log('About to inject data', target),
				onEnd: (target) => {
					//console.log('Injected successfully', target)
					animateContent(target)
				},
				//onError: (error) => console.error('Custom error handler on to:', error),
			},
		)
	})
})
