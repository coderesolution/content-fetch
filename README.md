# DOM Inject

Work in progress.

## Example

```js
// Import utility
import DomInject from '../src/index'

// Create an instance of the DomInject class
const domInject = new DomInject()

// Test
const trigger = document.querySelector('.trigger')

domInject.loadContent(, 'page.html', '.content', {
	mode: 'replace',
	includeParent: true,
	beforeFetch: (trigger) => console.log('Before fetch', trigger),
	afterFetch: (trigger) => {
		console.log('After fetch', trigger)
		// Add animations here
	},
	onError: (error) => {
		console.error('Custom error handler:', error)
	},
	muteErrors: true,
})

```

## License

[The MIT License (MIT)](LICENSE)
