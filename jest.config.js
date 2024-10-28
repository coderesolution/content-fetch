module.exports = {
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	verbose: true,
	testTimeout: 10000,
	reporters: [
		'default',
		[
			'jest-junit',
			{
				outputDirectory: 'coverage',
				outputName: 'junit.xml',
				classNameTemplate: '{classname}',
				titleTemplate: '{title}',
				ancestorSeparator: ' › ',
				usePathForSuiteName: true,
			},
		],
	],
	bail: 1,
	detectOpenHandles: true,
	errorOnDeprecated: true,
	logHeapUsage: true,
}
