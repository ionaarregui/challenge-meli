import '@testing-library/jest-dom'

global.TextEncoder = require('util').TextEncoder
global.TextDecoder = require('util').TextDecoder

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: '/',
    search: '',
  }),
}))
