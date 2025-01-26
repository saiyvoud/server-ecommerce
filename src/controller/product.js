import { PrismaClient } from "@prisma/client";
import { EMessage, SMessage } from "../service/message.js";
import { SendCreate, SendError, SendSuccess } from "../service/response.js";
import { ValidateData } from "../service/validate.js";
import { CheckCategory } from "../service/service.js";
import { v4 as uuidv4 } from "uuid";
import { UploadImageToCloud } from "../config/cloudinary.js";

export default class ProductController {
  static async Search(req, res) {
    try {
      const search = req.query.search;
      const prisma = new PrismaClient();
      const data = await prisma.product.findMany({
        where: {
          name: {
            contains: search,
          },
        },
      });
      if (data.length === 0) {
        return SendError(res, 404, EMessage.NotFound, "product");
      }
      return SendSuccess(res, SMessage.Search, data);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async SelectBy(req, res) {
    try {
      const categoryID = req.params.categoryID;
      const prisma = new PrismaClient();
      const data = await prisma.product.findMany({
        where: { categoryID: categoryID },
      });
      if (!data) {
        return SendError(res, 404, EMessage.NotFound, "category");
      }
      return SendSuccess(res, SMessage.SelectBy, data);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async SelectOne(req, res) {
    try {
      const productID = req.params.productID;
      const prisma = new PrismaClient();
      const data = await prisma.product.findFirst({
        where: { productID: productID },
      });
      if (!data) {
        return SendError(res, 404, EMessage.NotFound, "product");
      }
      return SendSuccess(res, SMessage.SelectOne, data);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  
  static async SelectAll(req, res) {
    try {
      const prisma = new PrismaClient();
      const data = await prisma.product.findMany({
        select: {
          productID: true,
          name: true,
          detail: true,
          amount: true,
          price: true,
          image: true,
          category: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          updatedAt: "asc",
        },
      });
      if (!data) {
        return SendError(res, 404, EMessage.NotFound, "product");
      }
      return SendSuccess(res, SMessage.SelectAll, data);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async Insert(req, res) {
    try {
      const { categoryID, name, detail, amount, price } = req.body;
      const validate = await ValidateData({
        categoryID,
        name,
        detail,
        amount,
        price,
      });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.BadRequest, validate.join(","));
      }
      const checkCategory = await CheckCategory(categoryID);
      if (!checkCategory) {
        return SendError(res, 404, EMessage.NotFound, "category");
      }
      const data = req.files;
      if (!data || !data.image) {
        return SendError(res, 400, EMessage.BadRequest, "image");
      }
      const img_url = await UploadImageToCloud(
        data.image.data,
        data.image.mimetype
      );
      if (!img_url) {
        return SendError(res, 404, EMessage.ErrUpload);
      }
      const productID = uuidv4();
      const prisma = new PrismaClient();
      const insert = await prisma.product.create({
        data: {
          productID,
          categoryID,
          name,
          detail,
          amount: parseInt(amount),
          price: parseInt(price),
          image: img_url,
        },
      });
      if (!insert) {
        return SendError(res, 404, EMessage.ErrInsert);
      }
      return SendCreate(res, SMessage.Insert, insert);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async UpdateProduct(req, res) {
    try {
      const productID = req.params.productID;
      const prisma = new PrismaClient();
      const checkProduct = await prisma.product.findFirst({
        where: { productID: productID },
      });
      if (!checkProduct)
        return SendError(res, 404, EMessage.NotFound, "product");

      const { categoryID, name, detail, amount, price } = req.body;
      const validate = await ValidateData({
        categoryID,
        name,
        detail,
        amount,
        price,
      });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.BadRequest, validate.join(","));
      }
      const data = await prisma.product.updateMany({
        where: { productID: productID },
        data: {
          categoryID,
          name,
          detail,
          amount: parseInt(amount),
          price: parseInt(price),
        },
      });
      if (!data) return SendError(res, 404, EMessage.ErrUpdate);

      return SendSuccess(res, SMessage.Update, data);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async UpdateImage(req, res) {
    try {
      const productID = req.params.productID;
      const prisma = new PrismaClient();
      const checkProduct = await prisma.product.findFirst({
        where: { productID: productID },
      });
      if (!checkProduct) {
        return SendError(res, 404, EMessage.NotFound, "product");
      }
      const data = req.files;
      if (!data || !data.image) {
        return SendError(res, 400, EMessage.BadRequest, "image");
      }
      const img_url = await UploadImageToCloud(
        data.image.data,
        data.image.mimetype
      );
      if (!img_url) {
        return SendError(res, 404, EMessage.ErrUpload);
      }
      const result = await prisma.product.update({
        where: { productID: productID },
        data: { image: img_url },
      });
      if (!result) return SendError(res, 404, EMessage.ErrUpdate);
      return SendSuccess(res, SMessage.UpdateImage, img_url);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async DeleteProduct(req, res) {
    try {
      const productID = req.params.productID;
      const prisma = new PrismaClient();
      const check = await prisma.product.findFirst({
        where: { productID: productID },
      });
      if (!check) {
        return SendError(res, 404, EMessage.NotFound, "product");
      }
      const result = await prisma.product.delete({
        where: { productID: productID },
      });

      return SendSuccess(res, SMessage.Delete, result);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
}
