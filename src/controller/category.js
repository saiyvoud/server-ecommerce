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

export default class CategoryController {
  static async SelectAll(req, res) {
    try {
      const prisma = new PrismaClient();
      const category = await prisma.category.findMany();
      if (category.length < 0) {
        return SendError(res, 404, EMessage.NotFound, "category");
      }
      return SendSuccess(res, SMessage.SelectAll, category);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async SelectOne(req, res) {
    try {
      const categoryID = req.params.categoryID;
      const prisma = new PrismaClient();
      const category = await prisma.category.findFirst({
        where: { categoryID: categoryID },
      });
      if (!category) {
        return SendError(res, 404, EMessage.NotFound, "category");
      }
      return SendSuccess(res, SMessage.SelectOne, category);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async Insert(req, res) {
    try {
      const { categoryName } = req.body;
      if (!categoryName) {
        return SendError(res, 400, EMessage.BadRequest, "category name");
      }
      const categoryID = uuidv4();
      const prisma = new PrismaClient();
      const data = await prisma.category.create({
        data: {
          categoryID,
          categoryName,
        },
      });
      if (!data) {
        return SendError(res, 404, EMessage.ErrInsert);
      }
      return SendCreate(res, SMessage.Insert, data);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async updateCategory(req, res) {
    try {
      const categoryID = req.params.categoryID; // ຮັບ params
      const prisma = new PrismaClient();
      const category = await prisma.category.findFirst({
        where: { categoryID: categoryID },
      });
      if (!category) {
        return SendError(res, 404, EMessage.NotFound, "category");
      }
      const { categoryName } = req.body;
      if (!categoryName) {
        return SendError(res, 400, EMessage.BadRequest, "category name");
      }
      const update = await prisma.category.update({
        where: { categoryID: categoryID },
        data: {
          categoryName,
        },
      });
      if (!update) {
        return SendError(res, 404, EMessage.ErrUpdate);
      }
      return SendSuccess(res, SMessage.Update, update);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async deleteCategory(req, res) {
    try {
      const categoryID = req.params.categoryID;
      const prisma = new PrismaClient();
      const check = await prisma.category.findFirst({
        where: { categoryID: categoryID },
      });
      if (!check) {
        return SendError(res, 404, EMessage.NotFound, "category");
      }
      await prisma.category.delete({
        where: { categoryID: categoryID },
      });

      return SendSuccess(res, SMessage.Delete);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
}
