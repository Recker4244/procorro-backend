const db = require('../../src/models');
const leaveService = require('../../src/services/leave');
describe('Leave Service', () => {
  describe('createLeave', () => {
    it('should create a leave', async () => {
      jest.spyOn(db.user_leaves, 'create').mockResolvedValue({
        username: 'test user',
        start_date: '2021-01-01',
        end_date: '2021-01-01',
      });

      const result = await leaveService.createLeave(
        'test user',
        '2021-01-01',
        '2021-01-01'
      );
      expect(result).toEqual({
        username: 'test user',
        start_date: '2021-01-01',
        end_date: '2021-01-01',
      });
    });

    it('should throw an error when leave is not created', async () => {
      jest.spyOn(db.user_leaves, 'create').mockRejectedValue(new Error('Error'));

      const result = leaveService.createLeave(
        'test user',
        '2021-01-01',
        '2021-01-01'
      );
      expect(result).rejects.toThrow('Error');
    });
  });

  describe('deleteLeave', () => {
    it('should delete a leave', async () => {
      jest.spyOn(db.user_leaves, 'destroy').mockResolvedValue([1]);

      const result = await leaveService.deleteLeave(1);
      expect(result).toEqual([1]);
    });

    it('should throw an error when leave is not deleted', async () => {
      jest.spyOn(db.user_leaves, 'destroy').mockRejectedValue(new Error('Error'));

      const result = leaveService.deleteLeave(1);
      expect(result).rejects.toThrow('Error');
    });
  });

  describe('getLeavesByUser', () => {
    it('should get leave by user', async () => {
      jest.spyOn(db.sequelize, 'query').mockResolvedValue([
        {
          name: 'John Doe',
          username: 'johndoe',
          start_date: '2022-05-01',
          end_date: '2022-05-10',
        },
      ]);

      const result = await leaveService.getLeavesByUser('johndoe');
      expect(result).toEqual({
        name: 'John Doe',
        username: 'johndoe',
        start_date: '2022-05-01',
        end_date: '2022-05-10',
      });
    });

    it('should throw an error when leave is not retrieved', async () => {
      jest.spyOn(db.sequelize, 'query').mockRejectedValue(new Error('Error'));

      const result = leaveService.getLeavesByUser('test');
      await expect(result).rejects.toThrow('Error');
    });
  });

  describe('updateLeave', () => {
    it('should update a leave', async () => {
      jest.spyOn(db.user_leaves, 'update').mockResolvedValue([1, [{
        username: 'test user',
        start_date: '2021-01-01',
        end_date: '2021-01-01',
      }]]);

      const result = await leaveService.updateLeave(
        1,
        {
          startDate: '2021-01-01',
          endDate: '2021-01-01',
        }
      );
      expect(result).toEqual([1, [{
        username: 'test user',
        start_date: '2021-01-01',
        end_date: '2021-01-01'
      }]]);
    });

    it('should throw an error when leave is not updated', async () => {
      jest.spyOn(db.user_leaves, 'update').mockRejectedValue(new Error('Error'));

      const result = leaveService.updateLeave(
        1,
        {
          startDate: '2021-01-01',
          endDate: '2021-01-01',
        }
      );
      expect(result).rejects.toThrow('Error');
    });
  });
  describe('getLeavesByProjectId', () => {
    it('should get leaves by project id', async () => {
      jest.spyOn(db.sequelize, 'query').mockResolvedValue([
        {
          name: 'John Doe',
          username: 'johndoe',
          start_date: '2022-05-01',
          end_date: '2022-05-10',
        }
      ]);

      const result = await leaveService.getLeavesByProjectId(123);
      expect(result).toEqual({
        name: 'John Doe',
        username: 'johndoe',
        start_date: '2022-05-01',
        end_date: '2022-05-10',
      });
    });
    it('should throw an error when leave is not retrieved', async () => {
      jest.spyOn(db.sequelize, 'query').mockRejectedValue(new Error('Error'));
      const result = leaveService.getLeavesByProjectId(123);
      await expect(result).rejects.toThrow('Error');
    });
  });
});