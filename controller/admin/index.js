var express = require("express");
var router = express.Router();
var controller = require("./controller");
var database = require("../../database/database");
var mongodb = require("mongodb");

// category

router.get("/", controller.admin);
router.get("/addCategory", controller.addCategory);

router.post("/addCategory", (req, res) => {
  let categoryDatas = {
    catName: req.body.categoryName,
    catDesc: req.body.categoryDescription,
    catImage: req.files.image.name,
  };
  // console.log(categoryDatas.catImage);
  database.then((dbase) => {
    dbase
      .collection("adminCategory")
      .insertOne(categoryDatas)
      .then((reslt) => {
        const fileUp = req.files.image;
        fileUp
          .mv("public/images/admin/category/" + categoryDatas.catImage)
          .then((resltImg) => {
            // console.log(resltImg);
          });
      });
    res.redirect("/admin");
  });
});

router.get("/edit/:id", controller.editCategory);
router.post("/edit/:id", (req, res) => {
  let updateId = req.params.id;

  let updateDatas = " ";
  if (req.files?.image) {
    updateDatas = {
      catName: req.body.categoryName,
      catDesc: req.body.categoryDescription,
      catImage: req.files.image.name,
    };
    const fileUp = req.files.image;
    fileUp.mv("public/images/admin/category/" + updateDatas.catImage);
  } else {
    updateDatas = {
      catName: req.body.categoryName,
      catDesc: req.body.categoryDescription,
    };
  }
  database.then((dbase) => {
    dbase
      .collection("adminCategory")
      .updateOne(
        { _id: new mongodb.ObjectId(updateId) },
        { $set: updateDatas }
      );
    res.redirect("/admin");
  });
});
router.get("/delete/:id", controller.deleteCategory);

// SubCategory

router.get("/subCategory", controller.subCategory);
router.get("/addSubcategory", controller.addSubcategory);

router.post("/addSubcategory", (req, res) => {
  let subCatDatas = {
    categoryName: req.body.category,
    subCategory: req.body.subCategory,
  };
  database.then((dbase) => {
    dbase
      .collection("subCategory")
      .insertOne(subCatDatas)
      .then((reslt) => {
        // console.log(reslt);
        res.redirect("/admin/subCategory");
      });
  });
});

router.get("/subCategory/delete/:id", controller.subcatDelete);
router.get("/subCategory/edit/:id", controller.subcatEdit);

router.post("/subCategory/edit/:id", (req, res) => {
  let updateId = req.params.id;
  // console.log(updateId);
  let datas = {
    categoryName: req.body.category,
    subCategory: req.body.subCategory,
  };
  database.then((dbase) => {
    dbase
      .collection("subCategory")
      .updateOne({ _id: new mongodb.ObjectId(updateId) }, { $set: datas })
      .then((reslt) => {});
    res.redirect("/admin/subCategory");
  });
});

//  Product

router.get("/product", controller.product);

router.get("/addProduct", controller.addProduct);

router.post("/addProduct", (req, res) => {
  let proDatas = {
    category: req.body.category,
    subCategory: req.body.subcategory,
    prodName: req.body.productName,
    description: req.body.description,
    price: req.body.price,
    image: req.files?.image.name,
  };
  database.then((dbase) => {
    dbase
      .collection("productDetails")
      .insertOne(proDatas)
      .then((reslt) => {
        const fileUp = req.files.image;
        fileUp
          .mv("public/images/admin/product/" + proDatas.image)
          .then((reslImg) => {});
      });
    res.redirect("/admin/product");
  });
});

router.get("/product/edit/:id", controller.productEdit);

router.post("/product/edit/:id", (req, res) => {
  let updateId = req.params.id;
  let datas = {
    category: req.body.category,
    subCategory: req.body.subcategory,
    prodName: req.body.productName,
    description: req.body.description,
    price: req.body.price,
    image: req.files?.image.name,
  };
  let newData = "";
  if (req.files.image) {
    newData = {
      category: req.body.category,
      subCategory: req.body.subcategory,
      prodName: req.body.productName,
      description: req.body.description,
      price: req.body.price,
      image: req.files.image.name,
    };
    const fileup = req.files.image;
    fileup
      .mv("public/images/admin/product/" + datas.image)
      .then((resltImg) => {});
  } else {
    newData = {
      category: req.body.category,
      subCategory: req.body.subcategory,
      prodName: req.body.productName,
      description: req.body.description,
      price: req.body.price,
    };
  }

  database.then((dbase) => {
    dbase
      .collection("productDetails")
      .updateOne({ _id: new mongodb.ObjectId(updateId) }, { $set: newData });
  });
  // console.log(datas);
  res.redirect("/admin/product");
});

router.get("/product/delete/:id", controller.productDelete);
router.get("/users", controller.users);



router.get("/logout", controller.logout);
module.exports = router;
