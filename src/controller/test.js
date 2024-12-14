// import connected from "../config/db_mysql.js";
// export const Insert = (req, res) => {
//   try {
//     const { username, password } = req.body;
//     if (!username || !password) {
//       return res.status(400).json({ success: false, message: "Bad Request" });
//     }
//     const insert = "insert into test (username,password) values (?,?)";
//     connected.query(insert, [username, password], (err) => {
//       if (err) throw err;
//       return res.status(201).json({
//         success: true,
//         message: "Insert Success",
//         data: {
//           username,
//           password,
//         },
//       });
//     });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ success: false, message: "Server Error Internal", error });
//   }
// };
