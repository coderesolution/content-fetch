module.exports = {
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	transform: {
		'^.+\\.js$': 'babel-jest',
	},
	moduleFileExtensions: ['js'],
	testMatch: ['<rootDir>/__tests__/**/*.test.js'],
}
