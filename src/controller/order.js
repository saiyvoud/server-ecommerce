import { PrismaClient } from "@prisma/client";
import { EMessage, SMessage, StatusOrder } from "../service/message.js";
import { SendCreate, SendError, SendSuccess } from "../service/response.js";
import { ValidateData } from "../service/validate.js";
import { CheckCategory } from "../service/service.js";
import { v4 as uuidv4 } from "uuid";
import { UploadImageToCloud } from "../config/cloudinary.js";
export default class OrderController {
  static async SelectOne(req, res) {
    try {
      const orderID = req.params.orderID;
      const prisma = new PrismaClient();
      const data = await prisma.order.findFirst({
        where: { orderID: orderID },
      });
      if (!data) {
        return SendError(res, 404, EMessage.NotFound, "order");
      }
      return SendSuccess(res, SMessage.SelectOne, data);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async SelectAll(req, res) {
    try {
      const prisma = new PrismaClient();
      const data = await prisma.order.findMany({});
     
      if (!data) {
        return SendError(res, 404, EMessage.NotFound, "order");
      }
      return SendSuccess(res, SMessage.SelectAll, data);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async Insert(req, res) {
    try {
      const { paymentType, totalPrice, userID, address } = req.body;
      const validate = await ValidateData({
        paymentType,
        totalPrice,
        userID,
        address,
      });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.BadRequest, validate.join(","));
      }
      const prisma = new PrismaClient();
      const bill = req.files;
      if (!bill || !bill.bill) {
        return SendError(res, 400, EMessage.BadRequest, "bill");
      }
      const img_url = await UploadImageToCloud(
        bill.bill.data,
        bill.bill.mimetype
      );
      if (!img_url) {
        return SendError(res, 404, EMessage.NotFound, "bill");
      }
      const orderID = uuidv4();
      const data = await prisma.order.create({
        data: {
          orderID,
          paymentType,
          totalPrice: parseInt(totalPrice),
          userID,
          address,
          bill: img_url,
          status: StatusOrder.padding,
        },
      });
      if (!data) return SendError(res, 404, EMessage.ErrInsert);
      return SendCreate(res, SMessage.Insert, data);
    } catch (error) {
       console.log(error);
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async UpdateOrderStatus(req, res) {
    try {
      const orderID = req.params.orderID;
      const prisma = new PrismaClient();
      const data = await prisma.order.findFirst({
        where: { orderID: orderID },
      });
      if (!data) {
        return SendError(res, 404, EMessage.NotFound, "order");
      }
      const { status } = req.body;
      if (!status) {
        return SendError(res, 400, EMessage.BadRequest, "status");
      }
      const checkStatus = Object.keys(StatusOrder).includes(status);
      if (!checkStatus) {
        return SendError(res, 404, EMessage.NotFound, "status");
      }
      const result = await prisma.order.update({
        where: {
          orderID: orderID,
        },
        data: {
          status: status,
        },
      });
      if (!result) SendError(res, 404, EMessage.ErrUpdate);
      return SendSuccess(res, SMessage.Update, result);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async DeleteOrder(req, res) {
    try {
      const orderID = req.params.orderID;
      const prisma = new PrismaClient();
      const check = await prisma.order.findFirst({
        where: { orderID: orderID },
      });
      if (!check) {
        return SendError(res, 404, EMessage.NotFound, "order");
      }
      const result = await prisma.order.delete({
        where: { orderID: orderID },
      });

      return SendSuccess(res, SMessage.Delete, result);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
}
