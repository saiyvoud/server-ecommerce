import { PrismaClient } from "@prisma/client";
import { EMessage, SMessage, StatusOrder } from "../service/message.js";
import { SendCreate, SendError, SendSuccess } from "../service/response.js";
import { ValidateData } from "../service/validate.js";
import { FindOneOrder, FindOneProduct } from "../service/service.js";
import { v4 as uuidv4 } from "uuid";
export default class OrderDetailController {
  static async SelectAll(req, res) {
    try {
      const prisma = new PrismaClient();
      const orderDetail = await prisma.orderDetail.findMany();
      if (!orderDetail) {
        return SendError(res, 404, EMessage.NotFound, "orderDetail");
      }
      return SendSuccess(res, SMessage.SelectAll, orderDetail);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async SelectOne(req, res) {
    try {
      const order_detail_ID = req.params.order_detail_ID;
      if (!order_detail_ID) {
        return SendError(res, 400, EMessage.BadRequest, order_detail_ID);
      }
      const prisma = new PrismaClient();
      const orderDetail = await prisma.orderDetail.findFirst({
        where: { order_detail_ID: order_detail_ID },
      });
      if (!orderDetail) {
        return SendError(res, 404, EMessage.NotFound, "orderDetail");
      }
      return SendSuccess(res, SMessage.SelectOne, orderDetail);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async SelectBy(req, res) {
    try {
      const orderID = req.params.orderID;
      if (!orderID) {
        return SendError(res, 400, EMessage.BadRequest, orderID);
      }
      const prisma = new PrismaClient();
      const orderDetail = await prisma.orderDetail.findMany({
        where: { orderID: orderID },
      });
      if (!orderDetail) {
        return SendError(res, 404, EMessage.NotFound, "orderDetail");
      }
      return SendSuccess(res, SMessage.SelectBy, orderDetail);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async Insert(req, res) {
    try {
      const { orderID, productID, amount } = req.body;
      const validate = await ValidateData({ orderID, productID, amount });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.BadRequest, validate.join(","));
      }
      const checkOrderID = await FindOneOrder(orderID);
      if (!checkOrderID) {
        return SendError(res, 404, EMessage.NotFound, "order");
      }
      const checkProductID = await FindOneProduct(productID);
      if (!checkProductID) {
        return SendError(res, 404, EMessage.NotFound, "product");
      }
      const order_detail_ID = uuidv4();
      const prisma = new PrismaClient();
      const data = await prisma.orderDetail.create({
        data: {
          order_detail_ID,
          orderID,
          productID,
          amount,
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
  static async UpdateOrderDetail(req, res) {
    try {
      const order_detail_ID = req.params.order_detail_ID;
      if (!order_detail_ID) {
        return SendError(res, 400, EMessage.BadRequest, order_detail_ID);
      }
      const prisma = new PrismaClient();
      const orderDetail = await prisma.orderDetail.findFirst({
        where: { order_detail_ID: order_detail_ID },
      });
      if (!orderDetail) {
        return SendError(res, 404, EMessage.NotFound, "orderDetail");
      }
      const { amount } = req.body;
      if (!amount) {
        return SendError(res, 400, EMessage.BadRequest, "amount");
      }
      const result = await prisma.orderDetail.updateMany({
        where: { order_detail_ID: order_detail_ID },
        data: {
          amount: amount,
        },
      });
      if (!result) {
        return SendError(res, 404, EMessage.ErrUpdate);
      }
      return SendSuccess(res, SMessage.Update, result);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async DeleteOrderDetail(req, res) {
    try {
      const order_detail_ID = req.params.order_detail_ID;
      const prisma = new PrismaClient();
      const orderDetail = await prisma.orderDetail.findFirst({
        where: { order_detail_ID: order_detail_ID },
      });
      if (!orderDetail) {
        return SendError(res, 404, EMessage.NotFound, "orderDetail");
      }
      const deleteOrderDetail = await prisma.orderDetail.delete({
        where: { order_detail_ID: order_detail_ID },
      });
      if (deleteOrderDetail) {
        return SendError(res, 404, EMessage.ErrDelete);
      }
      return SendSuccess(res, SMessage.Delete, deleteOrderDetail);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
}
