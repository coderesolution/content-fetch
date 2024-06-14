/**
 * Written by Elliott Mangham at Code Resolution. Maintained by Code Resolution.
 * made@coderesolution.com
 */
export default class DomInject {
	constructor(options = {}) {
		this.options = {
			loadingClass: options.loadingClass || 'is-loading',
			loadedClass: options.loadedClass || 'has-loaded',
			errorClass: options.errorClass || 'has-error',
			debugMode: options.debugMode || false,
			...options,
		}
		this.cache = new Map()
		this.controller = new AbortController()
	}

	log(message) {
		if (this.options.debugMode) {
			console.log(message)
		}
	}

	fetchContent(url, sourceScope = null, includeParent = false) {
		return fetch(url, { signal: this.controller.signal })
			.then((response) => {
				if (!response.ok) {
					throw new Error('Network response was not ok.')
				}
				this.log('Fetch response received')
				return response.text()
			})
			.then((data) => {
				const parser = new DOMParser()
				const doc = parser.parseFromString(data, 'text/html')
				const element = sourceScope ? doc.querySelector(sourceScope) : doc.body
				if (!element) {
					throw new Error(`Element not found for selector: ${sourceScope}`)
				}
				this.log('Parsed HTML and found element')
				return includeParent && sourceScope ? element.outerHTML : element.innerHTML
			})
	}

	from({ selector, url = window.location.href, includeParent = false, onStart, onEnd, onError }) {
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

		const cacheKey = `${url}-${selector}-${includeParent}`
		this.log(`Cache key is: ${cacheKey}`)

		return new Promise((resolve, reject) => {
			if (this.cache.has(cacheKey)) {
				const cachedData = this.cache.get(cacheKey)
				this.log('Serving from cache')
				if (onEnd) onEnd(cachedData)
				resolve(cachedData)
				return
			}

			this.log(`Fetching data from URL: ${url}`)
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
				this.cache.set(cacheKey, html)
				if (onEnd) onEnd(html)
				resolve(html)
			} else {
				this.fetchContent(url, selector, includeParent)
					.then((html) => {
						this.cache.set(cacheKey, html)
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

	to({ destination, data, mode = 'replace', onStart, onEnd, onError }) {
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
			this.log(`Injecting data with mode: ${mode}`)
			const fragment = document.createDocumentFragment()
			const tempDiv = document.createElement('div')
			tempDiv.innerHTML = data

			if (mode === 'prepend') {
				for (const node of [...tempDiv.childNodes].reverse()) {
					targetElement.insertBefore(node, targetElement.firstChild)
				}
			} else if (mode === 'append') {
				targetElement.appendChild(tempDiv)
			} else {
				targetElement.innerHTML = '' // Clear the existing content
				targetElement.appendChild(tempDiv)
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

	fromTo(fromParams, toParams) {
		this.from(fromParams)
			.then((html) => {
				return this.to({ ...toParams, data: html })
			})
			.catch((error) => {
				console.error('fromTo encountered an error:', error)
			})
	}

	abortFetch() {
		this.controller.abort()
		this.controller = new AbortController()
		this.cache.clear()
	}
}
