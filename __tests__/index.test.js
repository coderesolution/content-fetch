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
			debugMode: false,
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

	// Test fromTo method
	test('fromTo fetches and injects content', async () => {
		document.body.innerHTML = `
			<div id="source">Source Content</div>
			<div id="target"></div>
		`

		const mockHtml = '<div class="content">New Content</div>'
		mockFetch.mockResolvedValueOnce({
			ok: true,
			text: () =>
				Promise.resolve(`
				<html>
					<body>
						<div id="source">${mockHtml}</div>
					</body>
				</html>
			`),
		})

		await contentFetch.fromTo(
			{
				selector: '#source',
				url: 'http://localhost/test',
			},
			{
				destination: '#target',
			},
		)

		expect(document.querySelector('#target').innerHTML).toContain('New Content')
	})

	// Test fromTo with callbacks
	test('fromTo executes callbacks', async () => {
		document.body.innerHTML = `
			<div id="source">Source Content</div>
			<div id="target"></div>
		`

		const onStartFrom = jest.fn()
		const onEndFrom = jest.fn()
		const onStartTo = jest.fn()
		const onEndTo = jest.fn()

		const mockHtml = '<div class="content">New Content</div>'
		mockFetch.mockResolvedValueOnce({
			ok: true,
			text: () =>
				Promise.resolve(`
				<html>
					<body>
						<div id="source">${mockHtml}</div>
					</body>
				</html>
			`),
		})

		await contentFetch.fromTo(
			{
				selector: '#source',
				url: 'http://localhost/test',
				onStart: onStartFrom,
				onEnd: onEndFrom,
			},
			{
				destination: '#target',
				onStart: onStartTo,
				onEnd: onEndTo,
			},
		)

		// Remove setTimeout and directly check callbacks
		expect(onStartFrom).toHaveBeenCalled()
		expect(onEndFrom).toHaveBeenCalled()
		expect(onStartTo).toHaveBeenCalled()
		expect(onEndTo).toHaveBeenCalled()
	})

	// Test fromTo error handling
	test('fromTo handles errors properly', async () => {
		const onError = jest.fn()

		// Expect the promise to reject
		await expect(
			contentFetch.fromTo(
				{
					selector: '#nonexistent',
					onError,
				},
				{
					destination: '#target',
				},
			),
		).rejects.toThrow('Element not found for selector: #nonexistent')

		// Verify onError was called
		expect(onError).toHaveBeenCalled()
		expect(onError).toHaveBeenCalledWith(
			expect.objectContaining({
				message: 'Element not found for selector: #nonexistent',
			}),
		)
	})

	// Test abortFetch
	test('abortFetch cancels ongoing requests', async () => {
		const abortSpy = jest.spyOn(contentFetch.controller, 'abort')
		const clearSpy = jest.spyOn(contentFetch.cache, 'clear')

		contentFetch.abortFetch()

		expect(abortSpy).toHaveBeenCalled()
		expect(clearSpy).toHaveBeenCalled()
		expect(contentFetch.controller).toBeDefined() // New controller created
	})

	// Test cache clearing on abort
	test('abortFetch clears cache', async () => {
		// Pre-populate cache
		contentFetch.cache.set('test-key', 'test-data')
		expect(contentFetch.cache.size).toBe(1)

		contentFetch.abortFetch()

		expect(contentFetch.cache.size).toBe(0)
	})
})
