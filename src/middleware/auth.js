import { EMessage } from "../service/message.js";
import { SendError } from "../service/response.js";
import { VerifyToken } from "../service/service.js";
export const auth = async (req, res, next) => {
  try {
    const authorization = req.headers['authorization'];
    if (!authorization) {
      return SendError(res, 401, EMessage.Unauthorization);
    }
    const token = authorization.replace("Bearer ", "");
    const verify = await VerifyToken(token); // ຍັງບໍ່ມີ fucntion ນີ້ຕ້ອງສ້າງ service
    if (!verify) {
      return SendError(res, 401, EMessage.Unauthorization);
    }
    req.user = verify;
    next();
  } catch (error) {
    return SendError(res, 500, EMessage.ServerInternal, error);
  }
};
