import { PrismaClient } from "@prisma/client";
import { EMessage, SMessage } from "../service/message.js";
import { SendCreate, SendError, SendSuccess } from "../service/response.js";
import { ValidateData } from "../service/validate.js";
import {
  Encrypt,
  CheckEmail,
  FindOneEmail,
  Decrypt,
  GenerateToken,
} from "../service/service.js";
import { v4 as uuidv4 } from "uuid";
export default class UserController {
  static async SelectAll(req, res) {
    try {
      const prisma = new PrismaClient();
      const users = await prisma.user.findMany();
      if (users.length < 0) {
        return SendError(res, 404, EMessage.NotFound, "users");
      }
      return SendSuccess(res, SMessage.SelectAll, users);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async SelectOne(req, res) {
    try {
      const userID = req.params.userID;
      const prisma = new PrismaClient();
      const user = await prisma.user.findFirst({ where: { userID: userID } });
      if (user.length < 0) {
        return SendError(res, 404, EMessage.NotFound, "user");
      }
      return SendSuccess(res, SMessage.SelectOne, user);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async Login(req, res) {
    try {
      const { email, password } = req.body;
      const validate = await ValidateData({ email, password });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.BadRequest + validate.join(","));
      }
      const user = await FindOneEmail(email);
      const decode = await Decrypt(user.password);
      if (password !== decode) {
        return SendError(res, 404, EMessage.IsNotMatch);
      }
      user.password = undefined;
      const token = await GenerateToken(user.userID);
      const data = Object.assign(
        JSON.parse(JSON.stringify(user)),
        JSON.parse(JSON.stringify(token))
      );
      return SendSuccess(res, SMessage.Login, data);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async Register(req, res) {
    try {
      const { username, password, email, phoneNumber } = req.body;
      const validate = await ValidateData({
        username,
        password,
        email,
        phoneNumber,
      });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.BadRequest + validate.join(","));
      }
      const generatePassword = await Encrypt(password);
      if (!generatePassword) {
        return SendError(res, 400, EMessage.BadRequest);
      }
      await CheckEmail(email);

      const userID = uuidv4();
      const prisma = new PrismaClient();
      const user = await prisma.user.create({
        data: {
          userID,
          username,
          password: generatePassword,
          email,
          phoneNumber: parseInt(phoneNumber),
        },
      });
      if (!user) {
        return SendError(res, 404, EMessage.ErrInsert);
      }
      user.password = undefined;
      return SendCreate(res, SMessage.Register, user);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async Forgot(req, res) {
    try {
      const { email, newpassword } = req.body;
      const validate = await ValidateData({ email, newpassword });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.BadRequest + validate.join(","));
      }
      const prisma = new PrismaClient();
      const checkEmail = await prisma.user.findFirst({
        where: { email: email },
      });

      if (!checkEmail) {
        return SendError(res, 404, EMessage.NotFound);
      }

      const decryptPassword = await Encrypt(newpassword);
      const data = await prisma.user.update({
        where: {
          userID: checkEmail.userID,
        },
        data: {
          password: decryptPassword,
        },
      });
      return SendSuccess(res, SMessage.Update, data);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async updateProfile(req, res) {
    try {
      const userID = req.params.userID;
      const prisma = new PrismaClient();
      const { username, phoneNumber, email } = req.body;
      const validate = await ValidateData({ username, phoneNumber, email });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.BadRequest, validate.join(","));
      }
      const data = await prisma.user.update({
        where: {
          userID: userID,
        },
        data: {
          username,
          phoneNumber: parseInt(phoneNumber),
          email,
        },
      });
      if (!data) {
        return SendError(res, 404, EMessage.ErrUpdate);
      }
      return SendSuccess(res, SMessage.Update, data);
    } catch (error) {
      console.log(error);
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async deleteUser(req, res) {
    try {
      const userID = req.params.userID;
      const prisma = new PrismaClient();
      const check = await prisma.user.findFirst({ where: { userID: userID } });
      if (!check) {
        return SendError(res, 404, EMessage.NotFound, "user");
      }
       await prisma.user.delete({
        where: { userID: userID },
      });
     
      return SendSuccess(res, SMessage.Delete);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
}
