
const { authenticateUser, refreshAccessToken } = require('../../src/services/auth.js');
const UserAuth = require('../../src/models').credentials;
const User = require('../../src/models').users;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


describe('authenticateUser', () => {
  it('should return JWT when correct credentials are given.', async () => {
    const mockReqBody = {
      username: 'abc',
      password: 'xyz'
    };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(mockReqBody.password, salt);
    const returnValue = {
      dataValues: {
        username: 'abc',
        password: hashedPassword
      }
    };

    jest.spyOn(UserAuth, 'findOne').mockResolvedValue(returnValue);
    jest.spyOn(User, 'findOne').mockResolvedValue({ dataValues: { role: 'admin' } });

    const tokens = await authenticateUser(mockReqBody);
    const decodedAccessToken = jwt.verify(tokens.accessToken, process.env.jwtPrivateKey);
    const decodedRefreshToken = jwt.verify(tokens.refreshToken, process.env.jwtPrivateKey);


    expect(decodedAccessToken.username).toBe(mockReqBody.username);
    expect(decodedRefreshToken.username).toBe(mockReqBody.username);
  });

  it('should not return JWT when wrong password is given.', async () => {
    const mockReqBody = {
      username: 'abc',
      password: 'xyz'
    };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123', salt);

    const returnValue = {
      dataValues: {
        username: 'abc',
        password: hashedPassword
      }
    };

    jest.spyOn(UserAuth, 'findOne').mockResolvedValue(returnValue);

    const token = await authenticateUser(mockReqBody);
    expect(token).toBe('Invalid id or password.');
  });

  it('should not return JWT when user is not registered.', async () => {
    const mockReqBody = {
      username: 'abc',
      password: 'xyz'
    };

    const returnValue = null;

    jest.spyOn(UserAuth, 'findOne').mockResolvedValue(returnValue);

    const token = await authenticateUser(mockReqBody);
    expect(token).toBe('Invalid id or password.');
  });
});

describe('refreshAccessToken', () => {
  it('should return an access token when valid refresh token is provided.', async () => {
    const refreshToken = jwt.sign({ username: 'abc', role: 'xyz' }, process.env.jwtPrivateKey, { expiresIn: '1d' });

    const accessToken = await refreshAccessToken(refreshToken);

    const decodedAccessToken = jwt.verify(accessToken, process.env.jwtPrivateKey);
    expect(decodedAccessToken.username).toBe('abc');
    expect(decodedAccessToken.role).toBe('xyz');
  });

  it('should return exception message when wrong refresh token is provided.', async () => {
    const result = await refreshAccessToken('abcd');
    expect(result).toBe('Invalid refresh token.');
  });
});