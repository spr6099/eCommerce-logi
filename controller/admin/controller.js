let database = require("../../database/database");
const mongodb = require("mongodb");


// Category

exports.admin = (req, res) => {
  let sessions = req.session.logs;
  database.then((dbase) => {
    dbase
      .collection("adminCategory")
      .find()
      .toArray()
      .then((categorydatas) => {
        console.log(sessions);

        res.render("admin/home", { categorydatas, sessions });
      });
  });
};

exports.addCategory = (req, res) => {
  let sessions = req.session.logs;

  res.render("admin/categoryAdd", { sessions });
};

exports.editCategory = (req, res) => {
  let sessions = req.session.logs;

  let editId = req.params.id;
  database.then((dbase) => {
    dbase
      .collection("adminCategory")
      .findOne({ _id: new mongodb.ObjectId(editId) })
      .then((editData) => {
        res.render("admin/categoryEdit", { editData, sessions });
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
  let sessions = req.session.logs;

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

    res.render("admin/subCategory", { subcat, sessions });
    // console.log("subcategory", subcat);
  });
};

exports.addSubcategory = (req, res) => {
  let sessions = req.session.logs;

  database.then(async (dbase) => {
    const category = await dbase.collection("adminCategory").find().toArray();
    res.render("admin/subcategoryAdd", { category, sessions });
  });
};

exports.subcatEdit = (req, res) => {
  let sessions = req.session.logs;

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

    res.render("admin/subcategoryEdit", {
      category,
      subcategory,
      adminCategory,
      sessions,
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
  let sessions = req.session.logs;

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
    res.render("admin/product", { category, sessions });
    // console.log("subcategory", category);
  });
};

exports.addProduct = (req, res) => {
  let sessions = req.session.logs;

  database.then(async (dbase) => {
    const admincat = await dbase.collection("adminCategory").find().toArray();
    const subcat = await dbase.collection("subCategory").find().toArray();

    res.render("admin/productAdd", { admincat, subcat, sessions });
  });
};

exports.productEdit = (req, res) => {
  let sessions = req.session.logs;

  let editId = req.params.id;
  database.then(async (dbase) => {
    const product = await dbase
      .collection("productDetails")
      .findOne({ _id: new mongodb.ObjectId(editId) });
    const category = await dbase.collection("adminCategory").find().toArray();
    const subCategory = await dbase.collection("subCategory").find().toArray();
    res.render("admin/productEdit", {
      product,
      category,
      subCategory,
      sessions,
    });
    // console.log("products", product);
    // console.log("category", category);
    // console.log("subcategory", subCategory);
  });
};

exports.productDelete = (req, res) => {
  let delId = req.params.id;
  database.then((dbase) => {
    dbase
      .collection("productDetails")
      .deleteOne({ _id: new mongodb.ObjectId(delId) })
      .then((result) => {
        res.redirect("/admin/product");
      });
  });
  // console.log(delId);
};

exports.users = (req, res) => {
  let sessions = req.session.logs;
  res.render("admin/users", { sessions, admin: "true" });
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};
