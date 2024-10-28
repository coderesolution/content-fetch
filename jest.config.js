module.exports = {
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	verbose: true,
	transform: {
		'^.+\\.js$': 'babel-jest',
	},
}
