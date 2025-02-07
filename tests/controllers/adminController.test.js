const adminController = require('../../src/controllers/adminController');
const adminService = require('../../src/services/admin');
const HttpErrors = require('../../errors/httpErrors');
describe('adminController', () => {
  it('should return 201 and created user if the user is created', async () => {
    jest.spyOn(adminService, 'createUser').mockResolvedValue({ username: 'username', name: 'name', email: 'email', phoneno: 'phoneno', role: 'role', github: 'github', flag: 'red' });
    const req = { body: { username: 'username', name: 'name', email: 'email', phoneno: 'phoneno', role: 'role', github: 'github', flag: 'red' } };

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await adminController.createUser(req, res);
    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalledWith({ username: 'username', name: 'name', email: 'email', phoneno: 'phoneno', role: 'role', github: 'github', flag: 'red' });
  });
  it('should return 400 and error message if the user is not created', async () => {
    jest.spyOn(adminService, 'createUser').mockRejectedValue(new HttpErrors('Username already exists', 400));
    const req = { body: { username: 'username', name: 'name', email: 'email', phoneno: 'phoneno', role: 'role', github: 'github', flag: 'red' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await adminController.createUser(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.status().json).toBeCalledWith({ message: 'Username already exists' });
  });
  it('should return 500 and error message if the user is not created', async () => {
    jest.spyOn(adminService, 'createUser').mockRejectedValue(new Error('error'));
    const req = { body: { username: 'username', name: 'name', email: 'email', phoneno: 'phoneno', role: 'role', github: 'github', flag: 'red' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await adminController.createUser(req, res);
    expect(res.status).toBeCalledWith(500);
    expect(res.status().json).toBeCalledWith({ status: 500, message: 'error' });
  });
  it('should return 200 and updated user if the user is updated', async () => {
    jest.spyOn(adminService, 'updateUser').mockResolvedValue({ username: 'username', name: 'name', email: 'email', phoneno: 'phoneno', role: 'role', github: 'github', flag: 'red' });
    const req = { body: { id: 'id', username: 'username', name: 'name', email: 'email', phoneno: 'phoneno', role: 'role', github: 'github', flag: 'red' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await adminController.updateUser(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({ username: 'username', name: 'name', email: 'email', phoneno: 'phoneno', role: 'role', github: 'github', flag: 'red' });
  });
  it('should return 400 and error message if the user is not updated', async () => {
    jest.spyOn(adminService, 'updateUser').mockRejectedValue(new HttpErrors('User not found', 400));
    const req = { body: { id: 'id', username: 'username', name: 'name', email: 'email', phoneno: 'phoneno', role: 'role', github: 'github', flag: 'red' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await adminController.updateUser(req, res);
    expect(res.status).toBeCalledWith(400);
    expect(res.status().json).toBeCalledWith({ message: 'User not found' });
  });
  it('should return 500 and error message if the user is not updated', async () => {
    jest.spyOn(adminService, 'updateUser').mockRejectedValue(new Error('error'));
    const req = { body: { id: 'id', username: 'username', name: 'name', email: 'email', phoneno: 'phoneno', role: 'role', github: 'github', flag: 'red' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await adminController.updateUser(req, res);
    expect(res.status).toBeCalledWith(500);
    expect(res.status().json).toBeCalledWith('error');
  });
  it('should return 200 and users if the users are fetched', async () => {
    jest.spyOn(adminService, 'getUsers').mockResolvedValue([{ username: 'username', name: 'name', email: 'email', phoneno: 'phoneno', role: 'role', github: 'github', flag: 'red' }]);
    const req = { query: { page: 1, limit: 10 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await adminController.getUsers(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith([{ username: 'username', name: 'name', email: 'email', phoneno: 'phoneno', role: 'role', github: 'github', flag: 'red' }]);
  });
  it('should return 500 and error message if there is some internal error', async () => {
    jest.spyOn(adminService, 'getUsers').mockRejectedValue(new Error('error'));
    const req = { query: { page: 1, limit: 10 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await adminController.getUsers(req, res);
    expect(res.status).toBeCalledWith(500);
    expect(res.status().json).toBeCalledWith('error');
  });
  it('should return 200 and user if the user is fetched', async () => {
    jest.spyOn(adminService, 'getUser').mockResolvedValue({ username: 'username', name: 'name', email: 'email', phoneno: 'phoneno', role: 'role', github: 'github', flag: 'red' });
    const req = { params: { username: 'username' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await adminController.getUser(req, res);
    expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({ username: 'username', name: 'name', email: 'email', phoneno: 'phoneno', role: 'role', github: 'github', flag: 'red' });
  });
  it('should return 500 and error message if there is some internal error', async () => {
    jest.spyOn(adminService, 'getUser').mockRejectedValue(new Error('error'));
    const req = { params: { username: 'username' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await adminController.getUser(req, res);
    expect(res.status).toBeCalledWith(500);
    expect(res.status().json).toBeCalledWith('error');
  });
});