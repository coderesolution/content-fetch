/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import ContentFetch from '../src/index'

describe('ContentFetch', () => {
	let contentFetch
	let mockFetch

	beforeEach(() => {
		// Setup
		contentFetch = new ContentFetch({
			allowedDomains: ['localhost'],
			debugMode: true,
		})

		// Mock fetch
		mockFetch = jest.fn()
		global.fetch = mockFetch
	})

	// Test constructor
	test('initializes with default options', () => {
		const cf = new ContentFetch()
		expect(cf.options.loadingClass).toBe('is-loading')
		expect(cf.options.loadedClass).toBe('has-loaded')
		expect(cf.options.errorClass).toBe('has-error')
	})

	// Test URL validation
	test('validates URLs correctly', () => {
		const validUrls = ['http://localhost:3000/test', 'https://localhost/page', '/relative/path', './relative/path']

		validUrls.forEach((url) => {
			expect(() => contentFetch.validateUrl(url)).not.toThrow()
		})
	})

	test('rejects invalid URLs', () => {
		const invalidUrls = ['ftp://invalid.com', 'ws://invalid.com']

		invalidUrls.forEach((url) => {
			expect(() => contentFetch.validateUrl(url)).toThrow()
		})
	})

	// Test content fetching
	test('fetches content successfully', async () => {
		const mockHtml = '<div class="content">Test Content</div>'
		mockFetch.mockResolvedValueOnce({
			ok: true,
			text: () => Promise.resolve(mockHtml),
		})

		const result = await contentFetch.fetchContent('http://localhost/test', '.content')
		expect(result).toContain('Test Content')
	})

	// Test error handling
	test('handles fetch errors', async () => {
		mockFetch.mockRejectedValueOnce(new Error('Network error'))

		await expect(contentFetch.fetchContent('http://localhost/test')).rejects.toThrow('Network error')
	})

	// Test DOM manipulation
	test('injects content into DOM', async () => {
		document.body.innerHTML = '<div id="target"></div>'
		const content = '<p>New content</p>'

		await contentFetch.to({
			destination: '#target',
			data: content,
		})

		expect(document.querySelector('#target').innerHTML).toContain('New content')
	})

	// Test caching
	test('caches fetched content', async () => {
		const mockHtml = '<div>Cached Content</div>'
		mockFetch.mockResolvedValueOnce({
			ok: true,
			text: () => Promise.resolve(mockHtml),
		})

		// First fetch
		await contentFetch.from({
			selector: 'div',
			url: 'http://localhost/cached',
		})

		// Second fetch should use cache
		await contentFetch.from({
			selector: 'div',
			url: 'http://localhost/cached',
		})

		expect(mockFetch).toHaveBeenCalledTimes(1)
	})

	// Test insertion modes
	test('supports different insertion modes', async () => {
		document.body.innerHTML = '<div id="target">Existing</div>'

		// Test prepend
		await contentFetch.to({
			destination: '#target',
			data: '<p>New</p>',
			mode: 'prepend',
		})
		expect(document.querySelector('#target').innerHTML).toMatch(/New.*Existing/s)

		// Test append
		document.body.innerHTML = '<div id="target">Existing</div>'
		await contentFetch.to({
			destination: '#target',
			data: '<p>New</p>',
			mode: 'append',
		})
		expect(document.querySelector('#target').innerHTML).toMatch(/Existing.*New/s)
	})

	// Test callbacks
	test('executes callbacks', async () => {
		const onStart = jest.fn()
		const onEnd = jest.fn()

		await contentFetch.to({
			destination: document.createElement('div'),
			data: '<p>Test</p>',
			onStart,
			onEnd,
		})

		expect(onStart).toHaveBeenCalled()
		expect(onEnd).toHaveBeenCalled()
	})
})
