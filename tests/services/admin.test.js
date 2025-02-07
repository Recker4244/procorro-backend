// Testing DB data creation
const adminService = require("../../src/services/admin");
const db = require("../../src/models/index");
const hashPass = require("../../src/utils/hashPass");
const sendInBlueUtil = require("../../src/utils/sendinblue");
const HttpErrors = require("../../errors/httpErrors");
const { v4: uuidv4 } = require("uuid");
const { UniqueConstraintError } = require("sequelize");

jest.mock("../../src/utils/sendinblue");
jest.mock("../../src/utils/hashPass");
jest.mock("../../src/models");

describe("AdminService", () => {
  describe("getUsers", () => {
    it("Should return list of all users", async () => {
      const id = uuidv4();
      jest.spyOn(db.users, "findAndCountAll").mockResolvedValue([
        {
          id: id,
          username: "ashutosh_senapati",
          email: "ashutosh_senapati@google.com",
          role: "Admin",
          phoneno: "9777139671",
          flag: "red",
          name: "Ashutosh Senapati",
          github: "github.com/ashutoshmck",
          createdAt: "2023-02-16T19:27:09Z",
          updatedAt: "2023-02-16T19:27:09Z",
        },
      ]);
      const users = await adminService.getUsers();
      expect(users).toEqual([
        {
          id: id,
          username: "ashutosh_senapati",
          email: "ashutosh_senapati@google.com",
          role: "Admin",
          phoneno: "9777139671",
          name: "Ashutosh Senapati",
          github: "github.com/ashutoshmck",
          createdAt: "2023-02-16T19:27:09Z",
          updatedAt: "2023-02-16T19:27:09Z",
          flag: "red",
        },
      ]);
    });
    it("should return the user by name", async () => {
      jest
        .spyOn(db.users, "findOne")
        .mockResolvedValue({ id: 1, name: "Ashutosh Senapati" });
      const user = await adminService.getUser("ashutosh");
      expect(user).toEqual({ id: 1, name: "Ashutosh Senapati" });
    });
  });
  describe("createUser", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it("should create a new user with valid data", async () => {
      const username = "testuser";
      const name = "Test User";
      const email = "test@example.com";
      const phoneno = "1234567890";
      const role = "user";
      const github = "testuser";
      const password = "testpass";
      const flag = true;
      const encryptedPassword = "encryptedtestpass";
      const userDetails = {
        id: 1,
        username,
        name,
        email,
        phoneno,
        role,
        github,
        flag,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      db.users.create.mockResolvedValue(userDetails);
      hashPass.mockResolvedValue(encryptedPassword);

      const result = await adminService.createUser(
        username,
        name,
        email,
        phoneno,
        role,
        github,
        password,
        flag
      );

      expect(db.users.create).toHaveBeenCalledWith({
        username,
        name,
        email,
        phoneno,
        role,
        github,
        flag,
      });
      expect(hashPass).toHaveBeenCalledWith(password);
      expect(db.credentials.create).toHaveBeenCalledWith({
        username,
        password: encryptedPassword,
      });
      expect(sendInBlueUtil.sendEmail).toHaveBeenCalledWith(
        email,
        name,
        password
      );
      expect(result).toEqual(userDetails);
    });

    it("should throw a 400 error if the username already exists", async () => {
      // Arrange
      const username = "testuser";
      const name = "Test User";
      const email = "test@example.com";
      const phoneno = "1234567890";
      const role = "user";
      const github = "testuser";
      const password = "testpass";
      const flag = true;
      const error = new HttpErrors("Username already exists", 400);
      db.users.create.mockRejectedValue(new UniqueConstraintError());
      await expect(
        adminService.createUser(
          username,
          name,
          email,
          phoneno,
          role,
          github,
          password,
          flag
        )
      ).rejects.toEqual(error);
    });

    it("should throw a 500 error for other errors", async () => {
      // Arrange
      const username = "testuser";
      const name = "Test User";
      const email = "test@example.com";
      const phoneno = "1234567890";
      const role = "user";
      const github = "testuser";
      const password = "testpass";
      const flag = true;
      const error = new HttpErrors("Internal server error", 500);
      db.users.create.mockRejectedValue(new Error());

      await expect(
        adminService.createUser(
          username,
          name,
          email,
          phoneno,
          role,
          github,
          password,
          flag
        )
      ).rejects.toEqual(error);
    });
  });
  describe("updateUser", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should update a user when provided with valid inputs", async () => {
      const id = 1;
      const username = "johndoe";
      const name = "John Doe";
      const email = "johndoe@example.com";
      const phoneno = "1234567890";
      const role = "admin";
      const github = "https://github.com/johndoe";
      const flag = true;

      const mockUser = {
        id,
        username,
        name,
        email,
        phoneno,
        role,
        github,
        flag,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(db.users, "findOne").mockResolvedValue(mockUser);
      jest
        .spyOn(db.users, "update")
        .mockImplementation(() => Promise.resolve());
      jest.spyOn(db.users, "findOne").mockResolvedValue(mockUser);
      const updatedUser = await adminService.updateUser(
        id,
        username,
        name,
        email,
        phoneno,
        role,
        github,
        flag
      );
      expect(db.users.findOne).toHaveBeenCalledTimes(2);
      expect(db.users.update).toHaveBeenCalledTimes(1);
      expect(updatedUser).toEqual(mockUser);
    });
  });
});
