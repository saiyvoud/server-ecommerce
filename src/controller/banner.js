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
import { UploadImageToCloud } from "../config/cloudinary.js";
export default class BannerController {
  static async SelectAll(req, res) {
    try {
      const prisma = new PrismaClient();
      const banner = await prisma.banner.findMany();
      if (banner.length < 0) {
        return SendError(res, 404, EMessage.NotFound, "banner");
      }
      return SendSuccess(res, SMessage.SelectAll, banner);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async SelectOne(req, res) {
    try {
      const bannerID = req.params.bannerID;
      const prisma = new PrismaClient();
      const banner = await prisma.banner.findFirst({
        where: { bannerID: bannerID },
      });
      if (!banner) {
        return SendError(res, 404, EMessage.NotFound, "banner");
      }
      return SendSuccess(res, SMessage.SelectOne, banner);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async Insert(req, res) {
    try {
      const { title, detail } = req.body;
      const validate = await ValidateData({ title, detail });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.BadRequest, validate.join(","));
      }
      const data = req.files; // ຮັບຄ່າຈາກ form data ທີ່ເປັນ files
      if (!data || !data.image) {
        return SendCreate(res, 400, EMessage.BadRequest, "image");
      }
      const img_url = await UploadImageToCloud(
        data.image.data,
        data.image.mimetype
      ); // 1 buffer , 2ນາມສະກຸນໄຟ
      if (!img_url) {
        return SendError(res, 404, EMessage.NotFound);
      }
      const bannerID = uuidv4();
      const prisma = new PrismaClient();
      const result = await prisma.banner.create({
        data: {
          bannerID,
          title,
          detail,
          image: img_url,
        },
      });
      if (!result) {
        return SendError(res, 404, EMessage.ErrInsert);
      }
      return SendCreate(res, SMessage.Insert, result);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async updateBanner(req, res) {
    try {
      const bannerID = req.params.bannerID;
      const prisma = new PrismaClient();
      const banner = await prisma.banner.findFirst({
        where: { bannerID: bannerID },
      });
      if (!banner) {
        return SendError(res, 404, EMessage.NotFound, "banner");
      }
      const { title, detail } = req.body;
      const validate = await ValidateData({ title, detail });
      if (validate.length > 0) {
        return SendError(res, 400, EMessage.BadRequest, validate.join(","));
      }
      const data = req.files; // ຮັບຄ່າຈາກ form data ທີ່ເປັນ files
      if (!data || !data.image) {
        return SendCreate(res, 400, EMessage.BadRequest, "image");
      }
      const img_url = await UploadImageToCloud(
        data.image.data,
        data.image.mimetype
      ); // 1 buffer , 2ນາມສະກຸນໄຟ
      if (!img_url) {
        return SendError(res, 404, EMessage.NotFound);
      }
      const result = await prisma.banner.update({
        where: {
          bannerID: bannerID,
        },
        data: {
          bannerID,
          title,
          detail,
          image: img_url,
        },
      });
      if (!result) {
        return SendError(res, 404, EMessage.ErrUpdate);
      }
      return SendCreate(res, SMessage.Update, result);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
  static async deleteBanner(req, res) {
    try {
      const bannerID = req.params.bannerID;
      const prisma = new PrismaClient();
      const check = await prisma.banner.findFirst({
        where: { bannerID: bannerID },
      });
      if (!check) {
        return SendError(res, 404, EMessage.NotFound, "banner");
      }
      const result = await prisma.banner.delete({
        where: { bannerID: bannerID },
      });

      return SendSuccess(res, SMessage.Delete, result);
    } catch (error) {
      return SendError(res, 500, EMessage.ServerInternal, error);
    }
  }
}
