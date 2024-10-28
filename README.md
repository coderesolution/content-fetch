# ContentFetch

ContentFetch is a JavaScript library for fetching and inserting content from one part of a webpage to another, or even from different webpages. It offers a simple API to handle these operations with ease, ensuring the content is sanitised and cached to improve performance.

[![NPM Version](https://img.shields.io/npm/v/content-fetch.svg)](https://www.npmjs.com/package/content-fetch)
[![NPM Downloads](https://img.shields.io/npm/dm/content-fetch.svg)](https://www.npmjs.com/package/content-fetch)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Known Vulnerabilities](https://snyk.io/test/github/coderesolution/content-fetch/badge.svg)](https://snyk.io/test/github/coderesolution/content-fetch)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/content-fetch)](https://bundlephobia.com/package/content-fetch)
[![GitHub stars](https://img.shields.io/github/stars/coderesolution/content-fetch.svg?style=social&label=Star)](https://github.com/coderesolution/content-fetch)

## Features

-   Fetch content from the same or different webpages.
-   Insert content into the DOM with different modes (replace, append, prepend).
-   Sanitise fetched content to prevent XSS attacks.
-   Cache fetched content to improve performance.
-   Customisable loading, loaded, and error classes.
-   Debug mode for detailed logging.

## Installation

You can install ContentFetch via npm:

```bash
npm install content-fetch
```

## Usage

### Basic Usage

**Install from NPM**

```js
import ContentFetch from 'content-fetch'

const contentFetch = new ContentFetch()

// Fetch content from a URL and insert it into a target element
contentFetch.fromTo(
	{
		selector: '#source-element',
		url: 'https://example.com',
	},
	{
		destination: '#target-element',
		mode: 'replace',
	},
)
```

**Install from CDN**

```html
<script src="https://cdn.jsdelivr.net/npm/content-fetch/bundled/index.min.js"></script>
```

### Methods

`from(params)`

Fetches content from a specified URL or the current page.

**Parameters:**

-   `selector` (string, required): The CSS selector for the element to fetch.
-   `url` (string, optional): The URL to fetch content from. Defaults to the current page.
-   `includeParent` (boolean, optional): Whether to include the parent element in the fetched content. Defaults to false.
-   `onStart` (function, optional): Callback function to execute when fetching starts.
-   `onEnd` (function, optional): Callback function to execute when fetching ends.
-   `onError` (function, optional): Callback function to execute if an error occurs.

**Example:**

```js
contentFetch.from({
	selector: '#source-element',
	url: 'https://example.com',
	onStart: () => console.log('Fetching started'),
	onEnd: (data) => console.log('Fetching ended', data),
	onError: (error) => console.error('Error fetching content', error),
})
```

`to(params)`

Inserts content into a specified destination element.

**Parameters:**

-   `destination` (string or HTMLElement, required): The CSS selector or DOM element to insert content into.
-   `data` (string, required): The HTML content to insert.
-   `mode` (string, optional): The mode of insertion (replace, append, prepend). Defaults to replace.
-   `delay` (number, optional): Delay in seconds before inserting content. Defaults to 0.
-   `onStart` (function, optional): Callback function to execute when insertion starts. Can return a promise to delay the insertion.
-   `onEnd` (function, optional): Callback function to execute when insertion ends.
-   `onError` (function, optional): Callback function to execute if an error occurs.

**Example:**

```js
contentFetch.to({
	destination: '#target-element',
	data: '<p>New content</p>',
	mode: 'append',
	onStart: (destination, data) => console.log('Insertion started', destination, data),
	onEnd: (element) => console.log('Insertion ended', element),
	onError: (error) => console.error('Error inserting content', error),
})
```

If you wish to animate something inside onStart and delay the rest of the process, you can return a promise from the onStart callback. The insertion will wait until the promise resolves:

**Example with Animation:**

```js
contentFetch.to({
	destination: content,
	data: defaultHtml.innerHTML,
	mode: 'replace',
	onStart: (destination, data) => {
		return new Promise((resolve) => {
			gsap.to(destination.querySelector('.loading'), 1, {
				opacity: 0,
				x: 30,
				onComplete: resolve,
			})
		})
	},
	onEnd: (element) => {
		animateContent(element)
	},
	onError: (error) => console.error('Error inserting content', error),
})
```

`fromTo(fromParams, toParams)`

Fetches content using from and then inserts it using to.

**Parameters:**

-   `fromParams` (object, required): Parameters for the from method.
-   `toParams` (object, required): Parameters for the to method.

Note: when using `fromTo()` you do not need a `data` property in the `toParams`, as it will automatically use the data supplied by `fromParams`.

**Example:**

```js
contentFetch.fromTo(
	{
		selector: '#source-element',
		url: 'https://example.com',
	},
	{
		destination: '#target-element',
		mode: 'replace',
	},
)
```

### Options

The `ContentFetch` constructor accepts an options object to customise behaviour:

| Option         | Type    | Default        | Description                                 |
| -------------- | ------- | -------------- | ------------------------------------------- |
| `loadingClass` | string  | `'is-loading'` | Class added to target element while loading |
| `loadedClass`  | string  | `'has-loaded'` | Class added to target element when loaded   |
| `errorClass`   | string  | `'has-error'`  | Class added to target element on error      |
| `debugMode`    | boolean | `false`        | Enables debug logging                       |

**Example:**

```js
const contentFetch = new ContentFetch({
	loadingClass: 'loading',
	loadedClass: 'loaded',
	errorClass: 'error',
	debugMode: true,
})
```

## Security Features

ContentFetch includes several security measures:

### URL Validation

-   Only absolute URLs are allowed
-   Only http/https protocols are permitted
-   URLs are sanitised before use

### Domain Whitelisting

```javascript
// Development setup
const fetcher = new ContentFetch({
	allowedDomains: ['localhost'], // This will work for all localhost ports
	debugMode: true,
})

// Production setup
const fetcher = new ContentFetch({
	allowedDomains: ['mydomain.com', 'api.mydomain.com'],
})
```

Setting to `localhost` will allow:

-   `http://localhost:3000`
-   `http://localhost:8080`
-   `http://127.0.0.1:3000`
-   `http://[::1]:8080`

### Same-Origin Policy

Cross-origin requests require explicit configuration via `allowedDomains`.

### Content Sanitisation

All HTML content is sanitised using [DOMPurify](https://github.com/cure53/DOMPurify).

### URL Handling

ContentFetch handles various URL formats:

```javascript
// Absolute URLs
contentFetch.from({ url: 'http://localhost:3000/page.html' })

// Relative URLs (automatically converted using window.location.origin)
contentFetch.from({ url: '/page.html' })
contentFetch.from({ url: './page.html' })
contentFetch.from({ url: '../page.html' })

// If no URL is provided, current page URL is used
contentFetch.from({ selector: '.content' })
```

## License

ContentFetch is licensed under the MIT License. See the LICENSE file for more details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## Author

Written by Elliott Mangham at Code Resolution. Maintained by Code Resolution.
