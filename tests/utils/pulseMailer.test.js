const sendPulseMail = require('../../src/utils/pulseMailer');
const { teams, users } = require('../../src/models/index');
const { sendMail } = require('../../src/utils/mailer');
const cron = require('node-cron');

jest.mock('../../src/models', () => ({
  teams: {
    findAll: jest.fn(),
  },
  users: {
    findOne: jest.fn(),
  },
}));

jest.mock('../../src/utils/mailer', () => ({
  sendMail: jest.fn(),
}));

jest.mock('node-cron', () => ({
  schedule: jest.fn(),
}));

describe('sendPulseMail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should schedule a cron job to send emails', () => {
    sendPulseMail();
    expect(cron.schedule).toHaveBeenCalledTimes(1);
    expect(cron.schedule).toHaveBeenCalledWith('0 11 * * 1', expect.any(Function));
  });

  it('should send pulse survey emails to users with active projects', async () => {
    jest.spyOn(teams, 'findAll').mockResolvedValue([{
      project_id: 1,
      username: 'user1',
      end_date: '2022-12-31',
    }]);
    jest.spyOn(users, 'findOne').mockResolvedValue({
      email: 'abc@gmail.com',
      name: 'abc',
    });
    expect(sendPulseMail).not.toThrow();
  });

  it('should not send pulse survey emails to users with inactive projects', async () => {
    const projects = [
      { dataValues: { project_id: 1, username: 'user1', end_date: '2022-12-31' } },
      { dataValues: { project_id: 2, username: 'user2', end_date: '2023-01-31' } },
    ];
    teams.findAll.mockResolvedValue(projects);

    const task = { start: jest.fn() };
    cron.schedule.mockReturnValue(task);

    expect(users.findOne).not.toHaveBeenCalled();
    expect(sendMail).not.toHaveBeenCalled();
  });

});
