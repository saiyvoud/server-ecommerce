import { PrismaClient } from "@prisma/client";
import { EMessage } from "../service/message.js";
import { SendError } from "../service/response.js";
import { ValidateData } from "../service/validate.js";
export default class UserController {
  static async Register(req, res) {
    try {
      const {username,password,email,phoneNumber} = req.body;
      const validate = await ValidateData({username,password,email,phoneNumber});
      if(validate.length > 0){
        return SendError(res,400,EMessage.BadRequest+ validate.join(",")) 
      }
      const generatePassword = await Encrypt(password);
      
      const prisma = new PrismaClient();
      const user = await prisma.user.create({
        data: {
          name: "Test3",
          email: "test3@gmail.com",
        },
      });
      return res
        .status(201)
        .json({ success: true, message: "Register Success", data: user });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Server Error Internal",error });
    }
  }
}
