# ContentFetch

ContentFetch is a JavaScript library for fetching and inserting content from one part of a webpage to another, or even from different webpages. It offers a simple API to handle these operations with ease, ensuring the content is sanitized and optionally cached.

## Features

-   Fetch content from the same or different webpages.
-   Insert content into the DOM with different modes (replace, append, prepend).
-   Sanitise fetched content to prevent XSS attacks.
-   Cache fetched content to improve performance.
-   Customisable loading, loaded, and error classes.
-   Debug mode for detailed logging.

## Installation

ContentFetch is not available on npm yet. For now, add the bundled code to your project.

## Usage

### Basic Usage

```js
import ContentFetch from 'contentfetch'

const contentFetch = new ContentFetch({
	loadingClass: 'is-loading',
	loadedClass: 'has-loaded',
	errorClass: 'has-error',
	debugMode: true,
})

// Fetch content from a URL and insert it into a target element
contentFetch.fromTo(
	{
		selector: '#source-element',
		url: 'https://example.com',
	},
	{
		destination: '#target-element',
		mode: 'replace',
	}
)
```

### Methods

`from(params)`

Fetches content from a specified URL or the current page.

_Parameters:_

-   `selector` (string, required): The CSS selector for the element to fetch.
-   `url` (string, optional): The URL to fetch content from. Defaults to the current page.
-   `includeParent` (boolean, optional): Whether to include the parent element in the fetched content. Defaults to false.
-   `onStart` (function, optional): Callback function to execute when fetching starts.
-   `onEnd` (function, optional): Callback function to execute when fetching ends.
-   `onError` (function, optional): Callback function to execute if an error occurs.

_Example:_

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

_Parameters:_

-   `destination` (string or HTMLElement, required): The CSS selector or DOM element to insert content into.
-   `data` (string, required): The HTML content to insert.
-   `mode` (string, optional): The mode of insertion (replace, append, prepend). Defaults to replace.
-   `delay` (number, optional): Delay in seconds before inserting content. Defaults to 0.
-   `onStart` (function, optional): Callback function to execute when insertion starts.
-   `onEnd` (function, optional): Callback function to execute when insertion ends.
-   `onError` (function, optional): Callback function to execute if an error occurs.

_Example:_

```js
contentFetch.to({
	destination: '#target-element',
	data: '<p>New content</p>',
	mode: 'append',
	onStart: (element) => console.log('Insertion started', element),
	onEnd: (element) => console.log('Insertion ended', element),
	onError: (error) => console.error('Error inserting content', error),
})
```

`fromTo(fromParams, toParams)`

Fetches content using from and then inserts it using to.

_Parameters:_

-   `fromParams` (object, required): Parameters for the from method.
-   `toParams` (object, required): Parameters for the to method.

_Example:_

```js
contentFetch.fromTo(
	{
		selector: '#source-element',
		url: 'https://example.com',
	},
	{
		destination: '#target-element',
		mode: 'replace',
	}
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

_Example:_

```js
const contentFetch = new ContentFetch({
	loadingClass: 'loading',
	loadedClass: 'loaded',
	errorClass: 'error',
	debugMode: true,
})
```

## License

ContentFetch is licensed under the MIT License. See the LICENSE file for more details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## Author

Written by Elliott Mangham at Code Resolution. Maintained by Code Resolution.
