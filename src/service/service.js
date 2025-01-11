import CryptoJS from "crypto-js";
import { PrismaClient } from "@prisma/client";
import { SECRETE_KEY, SECRETE_KEY_REFRESH } from "../config/globalKey.js";
import { EMessage, SMessage } from "./message.js";
import jwt from "jsonwebtoken";

export const VerifyToken = async (token) => {
  return new Promise(async (resovle, reject) => {
    try {
      const prisma = new PrismaClient();
      jwt.verify(token, SECRETE_KEY, async (err, decode) => {
        if (err) reject(err);
        const data = await prisma.user.findFirst({
          where: { userID: decode.id },
        });
        if (!data) {
          reject("Error Verify Token");
        }
        resovle(data);
      });
    } catch (error) {
      reject(error);
    }
  });
};
export const GenerateToken = async (data) => {
  return new Promise(async (resovle, reject) => {
    try {
      const payload = {
        id: data,
      };
      const payload_refresh = {
        id: data,
      };
      const token = jwt.sign(payload, SECRETE_KEY, { expiresIn: "3h" });
      const refreshToken = jwt.sign(payload_refresh, SECRETE_KEY_REFRESH, {
        expiresIn: "5h",
      });
      resovle({ token, refreshToken });
    } catch (error) {
      reject(error);
    }
  });
};
export const FindOneOrder = async (orderID) => {
  return new Promise(async (resovle, reject) => {
    try {
      const prisma = new PrismaClient();

      const data = await prisma.order.findFirst({
        where: { orderID: orderID },
      });
      if (!data) {
        reject(EMessage.NotFound + "order");
      }
      resovle(data);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
export const FindOneProduct = async (productID) => {
  return new Promise(async (resovle, reject) => {
    try {
      const prisma = new PrismaClient();

      const data = await prisma.product.findFirst({
        where: { productID: productID },
      });
      if (!data) {
        reject(EMessage.NotFound + "product");
      }
      resovle(data);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
export const FindOneEmail = async (email) => {
  return new Promise(async (resovle, reject) => {
    try {
      const prisma = new PrismaClient();

      const data = await prisma.user.findFirst({ where: { email: email } });
      if (!data) {
        reject(EMessage.NotFound + "Email");
      }
      resovle(data);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
export const CheckCategory = async (categoryID) => {
  return new Promise(async (resovle, reject) => {
    try {
      const prisma = new PrismaClient();

      const data = await prisma.category.findFirst({
        where: { categoryID: categoryID },
      });
      if (!data) {
        reject(EMessage.NotFound + "category");
      }
      resovle(data);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
export const CheckEmail = async (email) => {
  return new Promise(async (resovle, reject) => {
    try {
      const prisma = new PrismaClient();

      const data = await prisma.user.findFirst({ where: { email: email } });
      if (data) {
        reject(SMessage.Already);
      }
      resovle(true);
    } catch (error) {
      reject(error);
    }
  });
};

export const Encrypt = async (data) => {
  return CryptoJS.AES.encrypt(data, SECRETE_KEY).toString();
  // ແມ່ນການເຂົ້າລະຫັດ
};
export const Decrypt = async (data) => {
  return CryptoJS.AES.decrypt(data, SECRETE_KEY).toString(CryptoJS.enc.Utf8);

  // ແມ່ນການຖອດລະຫັດ
};
