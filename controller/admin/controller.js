let database = require("../../database/database");
const mongodb = require("mongodb");
// Category
exports.admin = (req, res) => {
  database.then((dbase) => {
    dbase
      .collection("adminCategory")
      .find()
      .toArray()
      .then((categorydatas) => {
        res.render("admin/home", { categorydatas, admin: true });
      });
  });
};

exports.addCategory = (req, res) => {
  res.render("admin/addCategory", { admin: true });
};

exports.editCategory = (req, res) => {
  let editId = req.params.id;
  database.then((dbase) => {
    dbase
      .collection("adminCategory")
      .findOne({ _id: new mongodb.ObjectId(editId) })
      .then((editData) => {
        res.render("admin/editCategory", { editData, admin: true });
      });
  });
};

exports.deleteCategory = (req, res) => {
  let delId = req.params.id;
  database.then((dbase) => {
    dbase
      .collection("adminCategory")
      .deleteOne({ _id: new mongodb.ObjectId(delId) })
      .then((result) => {
        res.redirect("/admin");
      });
  });
};

// SubCategory
exports.subCategory = (req, res) => {
  database.then(async (dbase) => {
    // const category = await dbase.collection("adminCategory").find().toArray();
    const subcat = await dbase
      .collection("subCategory")
      .aggregate([
        { $addFields: { categoryId: { $toObjectId: "$categoryName" } } },
        {
          $lookup: {
            from: "adminCategory",
            localField: "categoryId",
            foreignField: "_id",
            as: "subcatData",
          },
        },
        { $unwind: "$subcatData" },
      ])
      .toArray();

    res.render("admin/subCategory", { subcat, admin: "true" });
    // console.log("subcategory", subcat);
  });
};

exports.addSubcategory = (req, res) => {
  database.then(async (dbase) => {
    const category = await dbase.collection("adminCategory").find().toArray();
    res.render("admin/addSubcategory", { category, admin: "true" });
  });
};

exports.subcatEdit = (req, res) => {
  let updateId = req.params.id;
  database.then(async (dbase) => {
    const category = await dbase
      .collection("subCategory")
      .findOne({ _id: new mongodb.ObjectId(updateId) });

    const adminCategory = await dbase
      .collection("adminCategory")
      .find()
      .toArray();

    const subcategory = await dbase
      .collection("subCategory")
      .aggregate([
        { $addFields: { categoryId: { $toObjectId: "$categoryName" } } },
        {
          $lookup: {
            from: "adminCategory",
            localField: "categoryId",
            foreignField: "_id",
            as: "lookupDatas",
          },
        },
        { $unwind: "$lookupDatas" },
      ])
      .toArray();

    res.render("admin/editSubcategory", {
      category,
      subcategory,
      adminCategory,
      admin: "true",
    });
    // console.log("subcategory", subcategory);
    // console.log("category", category);
  });
};

exports.subcatDelete = (req, res) => {
  let delId = req.params.id;
  console.log(delId);
  database.then((dbase) => {
    dbase
      .collection("subCategory")
      .deleteOne({ _id: new mongodb.ObjectId(delId) })
      .then((reslt) => {
        res.redirect("/admin/subCategory");
      });
  });
};

//Product

exports.product = (req, res) => {
  database.then(async (dbase) => {
    const category = await dbase
      .collection("productDetails")
      .aggregate([
        { $addFields: { categoryId: { $toObjectId: "$category" } } },
        {
          $lookup: {
            from: "adminCategory",
            localField: "categoryId",
            foreignField: "_id",
            as: "categoryData",
          },
        },
        { $unwind: "$categoryData" },
        { $addFields: { categoryId: { $toObjectId: "$subCategory" } } },
        {
          $lookup: {
            from: "subCategory",
            localField: "categoryId",
            foreignField: "_id",
            as: "subCatData",
          },
        },
        { $unwind: "$subCatData" },
      ])
      .toArray();
    res.render("admin/product", { category, admin: "true" });
    // console.log("subcategory", subcat);
  });
};

exports.addProduct = (req, res) => {
  database.then(async (dbase) => {
    const admincat = await dbase.collection("adminCategory").find().toArray();
    const subcat = await dbase.collection("subCategory").find().toArray();

    res.render("admin/addProduct", { admincat, subcat, admin: "true" });
  });
};
