const services = require('../../src/services/teamServices');
const db = require('../../src/models/index');
describe('Team Services', () => {
  describe('addMember', () => {
    it('should add the members to the project', async () => {
      jest.spyOn(db.teams, 'bulkCreate').mockResolvedValue([{ project_id: 'abc', username: 'Balkar', role: 'Developer', key_status: false, start_date: '2020-01-01', end_date: '2020-01-01', cost: 2000 }]);
      const req = [{ username: 'Balkar', role: 'Developer', keyStatus: false, start_date: '2020-01-01', end_date: '2020-01-01', cost: 2000 }];
      const members = [{ username: 'Balkar', role: 'Developer', key_status: false, start_date: '2020-01-01', end_date: '2020-01-01', cost: 2000, project_id: 'abc' }];
      const storedMembers = await services.addMember('abc', req);
      expect(storedMembers).toEqual(members);
    });
    it('should add cost and status if it is not provided', async () => {
      jest.spyOn(db.teams, 'bulkCreate').mockResolvedValue([{ project_id: 'abc', username: 'Balkar', role: 'Developer', key_status: false, start_date: '2020-01-01', end_date: '2020-01-01', cost: 0 }]);
      const req = [{ username: 'Balkar', role: 'Developer', start_date: '2020-01-01', end_date: '2020-01-01' }];
      const members = [{ username: 'Balkar', role: 'Developer', key_status: false, start_date: '2020-01-01', end_date: '2020-01-01', cost: 0, project_id: 'abc' }];
      const storedMembers = await services.addMember('abc', req);
      expect(storedMembers).toEqual(members);
    });
  });
  describe('getTeam', () => {
    it('should get the team of the project', async () => {
      jest.spyOn(db.teams, 'findAll').mockResolvedValue([{ project_id: 'abc', username: 'Balkar', role: 'Developer', key_status: false, start_date: '2020-01-01', end_date: '2020-01-01', cost: 2000 }]);
      const teams = await services.getTeam('abc');
      expect(teams).toEqual([{ project_id: 'abc', username: 'Balkar', role: 'Developer', key_status: false, start_date: '2020-01-01', end_date: '2020-01-01', cost: 2000 }]);
    });
  });
  describe('updateMember', () => {
    it('should update the team members', async () => {
      jest.spyOn(db.teams, 'update').mockResolvedValue([1]);
      jest.spyOn(db.teams, 'findAll').mockResolvedValue([{ project_id: 'abc', username: 'Balkar', role: 'Developer', key_status: false, start_date: '2020-01-01', end_date: '2020-01-01', cost: 2000 }]);
      const team_members = [{ username: 'Balkar', role: 'Developer', key_status: false, start_date: '2020-01-01', end_date: '2020-01-01', cost: 2000 }];
      const updatedMembers = await services.updateMember('abc', team_members);
      expect(updatedMembers).toEqual([{ project_id: 'abc', username: 'Balkar', role: 'Developer', key_status: false, start_date: '2020-01-01', end_date: '2020-01-01', cost: 2000 }]);
    });
  });
  describe('editMember', () => {
    it('should edit the team members', async () => {
      const req = [{ username: 'Balkar', role: 'Developer', keyStatus: false, start_date: '2020-01-01', end_date: '2020-01-01', cost: 2000 }];
      jest.spyOn(db.teams, 'update').mockResolvedValue([1]);
      jest.spyOn(db.teams, 'create').mockResolvedValue({ project_id: 'abc', username: 'Balkar', role: 'Developer', key_status: false, start_date: '2020-01-01', end_date: '2020-01-01', cost: 2000 });
      await services.editMembers('abc', req);
      expect(db.teams.update).toHaveBeenCalled();
    });
    it('should create the team member if not present', async () => {
      const req = [{ username: 'Balkar', role: 'Developer', keyStatus: false, start_date: '2020-01-01', end_date: '2020-01-01', cost: 2000 }];
      jest.spyOn(db.teams, 'update').mockResolvedValue([0]);
      jest.spyOn(db.teams, 'create').mockResolvedValue({ project_id: 'abc', username: 'Balkar', role: 'Developer', key_status: false, start_date: '2020-01-01', end_date: '2020-01-01', cost: 2000 });
      await services.editMembers('abc', req);
      expect(db.teams.update).toHaveBeenCalled();
      expect(db.teams.create).toHaveBeenCalled();
    });
  });
});
