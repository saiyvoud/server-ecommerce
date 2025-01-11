import express from "express";
import BannerController from "../controller/banner.js";
import CategoryController from "../controller/category.js";
import OrderController from "../controller/order.js";
import OrderDetailController from "../controller/orderDetail.js";
import ProductController from "../controller/product.js";
import UserController from "../controller/user.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();
//------- user -----
const user = "/user";
router.get(`${user}/selAll`,auth, UserController.SelectAll);
router.get(`${user}/selOne/:userID`,auth, UserController.SelectOne);
router.post(`${user}/login`, UserController.Login);
router.post(`${user}/register`, UserController.Register);
router.put(`${user}/forgot`, UserController.Forgot);
router.put(`${user}/update/:userID`,auth ,UserController.updateProfile);
router.delete(`${user}/delete/:userID`, auth,UserController.deleteUser);
//------- category -----
const category = "/category";
router.get(`${category}/selAll`,auth, CategoryController.SelectAll);
router.get(`${category}/selOne/:categoryID`,auth, CategoryController.SelectOne);
router.post(`${category}/insert/`,auth, CategoryController.Insert);
router.put(`${category}/update/:categoryID`,auth, CategoryController.updateCategory);
router.delete(`${category}/delete/:categoryID`,auth, CategoryController.deleteCategory);
//------- banner ------
const banner = "/banner";
router.get(`${banner}/selAll`,BannerController.SelectAll);
router.get(`${banner}/selOne/:bannerID`, BannerController.SelectOne);
router.post(`${banner}/insert/`,auth, BannerController.Insert);
router.put(`${banner}/update/:bannerID`,auth, BannerController.updateBanner);
router.delete(`${banner}/delete/:bannerID`,auth, BannerController.deleteBanner);
//------- product -----
const product = "/product";
router.get(`${product}/selAll`,ProductController.SelectAll);
router.get(`${product}/selBy/:categoryID`,ProductController.SelectBy);
router.get(`${product}/selOne/:productID`, ProductController.SelectOne);
router.post(`${product}/insert`,auth, ProductController.Insert);
router.get(`${product}/search`, ProductController.Search);
router.put(`${product}/update/:productID`,auth, ProductController.UpdateProduct);
router.put(`${product}/updateImage/:productID`,auth, ProductController.UpdateImage);
router.delete(`${product}/delete/:productID`,auth, ProductController.DeleteProduct);
//------- order -----
const order = "/order";
router.get(`${order}/selAll`,auth,OrderController.SelectAll);
router.get(`${order}/selOne/:orderID`, auth, OrderController.SelectOne);
router.post(`${order}/insert`,auth, OrderController.Insert);
router.put(`${order}/update/:orderID`,auth, OrderController.UpdateOrderStatus);
router.delete(`${order}/delete/:orderID`,auth, OrderController.DeleteOrder);
//------- order detail -----
const orderDetail = "/orderDetail";
router.get(`${orderDetail}/selAll`,auth,OrderDetailController.SelectAll);
router.get(`${orderDetail}/selOne/:order_detail_ID`, auth, OrderDetailController.SelectOne);
router.get(`${orderDetail}/selBy/:orderID`, auth, OrderDetailController.SelectBy);
router.post(`${orderDetail}/insert`,auth, OrderDetailController.Insert);
router.put(`${orderDetail}/update/:order_detail_ID`,auth, OrderDetailController.UpdateOrderDetail);
router.delete(`${orderDetail}/delete/:order_detail_ID`,auth, OrderDetailController.DeleteOrderDetail);

export default router;
