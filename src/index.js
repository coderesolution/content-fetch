export default class DomInject {
	constructor(options = {}) {
		this.options = {
			loadingClass: options.loadingClass || 'loading',
			loadedClass: options.loadedClass || 'loaded',
			errorClass: options.errorClass || 'error',
			...options,
		}
	}

	static fetchContent(sourceUrl, sourceScope = null, includeParent = false) {
		const url = sourceUrl || window.location.href
		return fetch(url)
			.then((response) => {
				if (!response.ok) {
					throw new Error('Network response was not ok.')
				}
				return response.text()
			})
			.then((data) => {
				const parser = new DOMParser()
				const doc = parser.parseFromString(data, 'text/html')
				const element = sourceScope ? doc.querySelector(sourceScope) : doc.body
				if (!element) {
					throw new Error(`Element not found for selector: ${sourceScope}`)
				}
				return includeParent && sourceScope ? element.outerHTML : element.innerHTML
			})
	}

	static from({ selector, url = window.location.href, includeParent = false, onStart, onEnd, onError }) {
		if (!selector) {
			const error = new Error('Selector must be defined.')
			if (onError) {
				onError(error)
			} else {
				console.error(error)
			}
			return Promise.reject(error)
		}

		if (onStart) onStart()

		return new Promise((resolve, reject) => {
			if (url === window.location.href) {
				const sourceElement = document.querySelector(selector)
				if (!sourceElement) {
					const error = new Error(`Element not found for selector: ${selector}`)
					if (onError) {
						onError(error)
					} else {
						console.error(error)
					}
					return reject(error)
				}
				const html = includeParent ? sourceElement.outerHTML : sourceElement.innerHTML
				if (onEnd) onEnd(html)
				resolve(html)
			} else {
				this.fetchContent(url, selector, includeParent)
					.then((html) => {
						if (onEnd) onEnd(html)
						resolve(html)
					})
					.catch((error) => {
						if (onError) {
							onError(error)
						} else {
							console.error('Error fetching content:', error)
						}
						reject(error)
					})
			}
		})
	}

	static to({ destination, data, mode = 'replace', onStart, onEnd, onError }) {
		if (!destination || !data) {
			const error = new Error('Destination and data must be defined.')
			if (onError) {
				onError(error)
			} else {
				console.error(error)
			}
			return Promise.reject(error)
		}

		const targetElement = typeof destination === 'string' ? document.querySelector(destination) : destination
		if (!targetElement) {
			const error = new Error(`Target element not found for selector: ${destination}`)
			if (onError) {
				onError(error)
			} else {
				console.error(error)
			}
			return Promise.reject(error)
		}

		if (onStart) onStart(targetElement)

		try {
			if (mode === 'prepend') {
				targetElement.insertAdjacentHTML('afterbegin', data)
			} else if (mode === 'append') {
				targetElement.insertAdjacentHTML('beforeend', data)
			} else {
				// default to 'replace'
				targetElement.innerHTML = data
			}

			if (onEnd) onEnd(targetElement)
			return Promise.resolve(targetElement)
		} catch (error) {
			if (onError) {
				onError(error)
			} else {
				console.error('Error injecting content:', error)
			}
			return Promise.reject(error)
		}
	}

	static fromTo(fromParams, toParams) {
		this.from(fromParams)
			.then((html) => {
				return this.to({ ...toParams, data: html })
			})
			.catch((error) => {
				// No need to console.error here as from and to already handle it
			})
	}
}
