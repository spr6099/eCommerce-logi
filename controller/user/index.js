var express = require("express");
var router = express.Router();
var controller = require("./controller");
var database = require("../../database/database");
var bcrypt = require("bcrypt");
const { log } = require("handlebars");

// /* GET userHome */
router.get("/", controller.user);

router.get("/register", controller.userRegister);
router.post("/register", (req, res) => {
  let Datas = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    userStatus: 1,
  };
  database.then((dbase) => {
    bcrypt.hash(req.body.password, 10).then((pswd) => {
      Datas.password = pswd;
      dbase
        .collection("userRegister")
        .insertOne(Datas)
        .then((reslt) => {});
      res.redirect("/user");
    });
  });
});

router.get("/login", controller.userLogin);

// router.post("/login", (req, res) => {
//   logDatas = {
//     email: req.body.email,
//     password: req.body.password,
//   };
//   database.then((dbase) => {
//     dbase
//       .collection("userRegister")
//       .findOne({ email: logDatas.email })
//       .then((reslt) => {
//         if (reslt) {
//           bcrypt.compare(logDatas.password, reslt.password).then((pas) => {
//             if (pas) {
//               if (reslt.userStatus == 0) {
//                 // console.log("reslt", reslt);

//                 req.session.logs = reslt;

//                 res.redirect("/admin");
//               } else {
//                 req.session.logs = reslt;
//                 res.redirect("/");
//                 // console.log(req.session.logs);
//               }
//             } else {
//               console.log("incorrect Password");
//               res.redirect("/login");
//             }
//           });
//         } else {
//           console.log("user Not Found");
//           res.redirect("/login");
//         }
//       });
//   });
// });

router.post("/login", (req, res) => {
  logDatas = {
    email: req.body.email,
    password: req.body.password,
  };
  database.then((dbase) => {
    dbase
      .collection("userRegister")
      .findOne({ email: logDatas.email })
      .then((reslt) => {
        if (reslt) {
          bcrypt.compare(logDatas.password, reslt.password).then((pas) => {
            if (pas) {
              if (reslt.userStatus == 0) {
                // console.log("reslt", reslt);

                req.session.logs = reslt;

                res.redirect("/admin");
              } else {
                req.session.logs = reslt;
                res.redirect("/");
                // console.log(req.session.logs);
              }

              // if (reslt.userStatus == 0) {
              //   // console.log("reslt", reslt);

              //   req.session.logs = reslt;

              //   res.redirect("/admin");
              // } else if (reslt.userStatus == 1) {
              //   req.session.logs = reslt;
              //   res.redirect("/user");
              //   // console.log(req.session.logs);
              // } else {
              //   req.session.logs = reslt;
              //   res.redirect("/");
              //   // console.log(req.session.logs);
              // }
            } else {
              console.log("incorrect Password");
              res.redirect("/login");
            }
          });
        } else {
          console.log("user Not Found");
          res.redirect("/login");
        }
      });
  });
});

router.get("/logout", controller.logout);

router.get("/singleProduct/:id", controller.singleProduct);
router.get("/categories/:id", controller.categories);

//cart
router.get("/wishlist/:id", controller.wishlist);
router.get("/cart", controller.cart);
router.get("/deleteCart/:id", controller.deleteCart);

router.get("/order", controller.order);

module.exports = router;
