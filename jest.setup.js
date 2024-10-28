import 'whatwg-fetch'
import '@testing-library/jest-dom'

// Ensure window and document are available
if (typeof window === 'undefined') {
	global.window = {}
}
if (typeof document === 'undefined') {
	global.document = {}
}

// Setup DOMParser
if (typeof DOMParser === 'undefined') {
	global.DOMParser = class DOMParser {
		parseFromString(string, type) {
			return {
				body: { innerHTML: string },
				querySelector: () => ({ innerHTML: string, outerHTML: string }),
			}
		}
	}
}
