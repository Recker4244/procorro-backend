const db = require('../../src/models');
const checkPass = require('../../src/utils/checkPass');
const dashboardService = require('../../src/services/dashboard');
jest.mock('../../src/models');
jest.mock('../../src/utils/checkPass');


describe('DashboardService', () => {
  describe('getUsers', () => {
    it('Should return list of all users', async () => {
      jest.spyOn(db.users, 'findAll').mockResolvedValue([{ id: 1, name: 'Ashutosh Senapati' }]);
      const users = await dashboardService.getUsers();
      expect(users).toEqual([{ id: 1, name: 'Ashutosh Senapati' }]);
    });
  });
  describe('checkAuth', () => {
    it('Should return true if user is authenticated', async () => {
      jest.spyOn(db.users, 'findOne').mockResolvedValue({ id: 1, name: 'Ashutosh Senapati' });
      checkPass.mockResolvedValue(true);
      const user = await dashboardService.checkAuth('ashutosh', 'password');
      expect(user).toEqual(true);
    });
    it('Should return false if user is not authenticated', async () => {
      jest.spyOn(db.users, 'findOne').mockResolvedValue({ id: 1, name: 'Ashutosh Senapati' });
      checkPass.mockResolvedValue(false);
      const user = await dashboardService.checkAuth('ashutosh', 'password');
      expect(user).toEqual(false);
    });
  });
});