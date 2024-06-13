/**
 * Written by Elliott Mangham at Code Resolution. Maintained by Code Resolution.
 * made@coderesolution.com
 */
export default class DomInject {
	constructor(options = {}) {
		this.options = {
			loadingClass: options.loadingClass || 'loading',
			loadedClass: options.loadedClass || 'loaded',
			errorClass: options.errorClass || 'error',
			...options,
		}
	}

	fetchContent(sourceUrl, sourceScope = null, includeParent = false) {
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

	loadContent(
		target,
		sourceUrl = null,
		sourceScope = null,
		{ mode = 'replace', beforeFetch = null, afterFetch = null, includeParent = false } = {}
	) {
		const targetElement = typeof target === 'string' ? document.querySelector(target) : target
		if (!targetElement) {
			console.error(`Target element not found.`)
			return
		}

		this._toggleLoadingState(targetElement, true)

		if (beforeFetch) {
			beforeFetch(targetElement)
		}

		this.fetchContent(sourceUrl, sourceScope, includeParent)
			.then((html) => {
				if (mode === 'prepend') {
					targetElement.insertAdjacentHTML('afterbegin', html)
				} else if (mode === 'append') {
					targetElement.insertAdjacentHTML('beforeend', html)
				} else {
					// default to 'replace'
					targetElement.innerHTML = html
				}

				this._toggleLoadingState(targetElement, false)

				if (afterFetch) {
					afterFetch(targetElement)
				}
			})
			.catch((error) => {
				console.error('Error fetching content:', error)
				this._toggleLoadingState(targetElement, false, true)
			})
	}

	_toggleLoadingState(element, isLoading, isError = false) {
		element.classList.toggle(this.options.loadingClass, isLoading)
		element.classList.toggle(this.options.loadedClass, !isLoading && !isError)
		element.classList.toggle(this.options.errorClass, isError)
	}
}
