const services = require('../../src/services/pulseServices');
const db = require('../../src/models/index');
const { v4: uuidv4 } = require('uuid');
describe('Pulse Services', () => {
  describe('addPulse', () => {
    it('should throw an error when invalid user', async () => {
      jest.spyOn(db.teams, 'findOne').mockResolvedValue(null);
      await expect(services.addPulse(uuidv4(), 'username', 3)).rejects.toThrow('Invalid user');
    });
    it('should create a new pulse', async () => {
      jest.spyOn(db.teams, 'findOne').mockResolvedValue({ dataValues: { project_id: uuidv4() } });
      jest.spyOn(db.pulse_score, 'findAll').mockResolvedValue(null);
      jest.spyOn(db.pulse_score, 'create').mockResolvedValue({ message: 'Pulse reported successfully' });
      await expect(services.addPulse(uuidv4(), 'username', 5)).resolves.toEqual({ message: 'Pulse reported successfully' });
    });
  });
  describe('getPulse', () => {
    it('should return empty array when no projects', async () => {
      jest.spyOn(db.teams, 'findAll').mockResolvedValue([]);
      await expect(services.getPulse('viewer')).resolves.toEqual({
        x_axis: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], y_axis: [
          { name: 'Terrible', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: 'Ok', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { name: 'Great', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        ]
      });
    });

  });
});