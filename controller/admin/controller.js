let database = require("../../database/database");
const mongodb = require("mongodb");

// Category
exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};

exports.admin = (req, res) => {
  // let sessions = req.session.logs;
  database.then((dbase) => {
    dbase
      .collection("adminCategory")
      .find()
      .toArray()
      .then((categorydatas) => {
        // console.log(sessions);

        res.render("admin/home", { categorydatas, admin: true });
      });
  });
};

exports.addCategory = (req, res) => {
  // let sessions = req.session.logs;

  res.render("admin/categoryAdd", { admin: true });
};

exports.editCategory = (req, res) => {
  // let sessions = req.session.logs;

  let editId = req.params.id;
  database.then((dbase) => {
    dbase
      .collection("adminCategory")
      .findOne({ _id: new mongodb.ObjectId(editId) })
      .then((editData) => {
        res.render("admin/categoryEdit", { editData, admin: true });
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
  // let sessions = req.session.logs;

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

    res.render("admin/subCategory", { subcat, admin: true });
    // console.log("subcategory", subcat);
  });
};

exports.addSubcategory = (req, res) => {
  // let sessions = req.session.logs;

  database.then(async (dbase) => {
    const category = await dbase.collection("adminCategory").find().toArray();
    res.render("admin/subcategoryAdd", { category, admin: true });
  });
};

exports.subcatEdit = (req, res) => {
  // let sessions = req.session.logs;

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
      admin: true,
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
  // let sessions = req.session.logs;

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
    res.render("admin/product", { category, admin: true });
    // console.log("subcategory", category);
  });
};

exports.addProduct = (req, res) => {
  // let sessions = req.session.logs;

  database.then(async (dbase) => {
    const admincat = await dbase.collection("adminCategory").find().toArray();
    const subcat = await dbase.collection("subCategory").find().toArray();

    res.render("admin/productAdd", { admincat, subcat, admin: true });
  });
};

exports.productEdit = (req, res) => {
  // let sessions = req.session.logs;

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
      admin: true,
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
  // let sessions = req.session.logs;
  database.then((dbase) => {
    dbase
      .collection("userRegister")
      .find({ userStatus: 1 })
      .toArray()
      .then((users) => {
        // console.log(users);
        res.render("admin/users", { users, admin: "true" });
      });
  });
};

exports.userDelete = (req, res) => {
  let delId = req.params.id;
  database.then(async (dbase) => {
    const userDelete = await dbase
      .collection("userRegister")
      .deleteOne({ _id: new mongodb.ObjectId(delId) });
    const cartDelete = await dbase
      .collection("cart")
      .deleteMany({ userid: delId });

    res.redirect("admin/users");
  });
};

exports.userView = (req, res) => {
  let userId = req.params.id;
  req.session.admin_user_id = userId;
  let sessionId = req.session.admin_user_id;
  // console.log("sessionId", sessionId);

  database.then(async (dbase) => {
    const products = await dbase
      .collection("cart")
      .aggregate([
        { $match: { $and: [{ userid: userId }, { status: 1 }] } },
        // { $match: { $and: [{ userid: sessionid }, { status: 1 }] } },

        { $addFields: { userid: { $toObjectId: "$userid" } } },
        {
          $lookup: {
            from: "userRegister",
            localField: "userid",
            foreignField: "_id",
            as: "userLookup",
          },
        },
        { $unwind: "$userLookup" },
        { $addFields: { product: { $toObjectId: "$product" } } },
        {
          $lookup: {
            from: "productDetails",
            localField: "product",
            foreignField: "_id",
            as: "productLookup",
          },
        },
        { $unwind: "$productLookup" },
        { $addFields: { product: { $toObjectId: "$product" } } },
        {
          $lookup: {
            from: "productDetails",
            localField: "product",
            foreignField: "_id",
            as: "productLookup",
          },
        },
        { $unwind: "$productLookup" },
      ])
      .toArray();
    // console.log("userId", userId);
    // console.log("products", products);
    res.render("admin/userView", { products, admin: "true" });
  });
};

exports.deleteOrder = (req, res) => {
  let delId = req.params.id;
  let sessionId = req.session.admin_user_id;
  console.log("sessionId", sessionId);

  // console.log(delId);

  database.then((dbase) => {
    dbase
      .collection("cart")
      .deleteOne({ _id: new mongodb.ObjectId(delId) })
      .then((reslt) => {});
  });
  // res.redirect("/admin/userView/66b2faef5522320db89de17b");
  res.redirect(`/admin/userView/${sessionId}`);

  // res.redirect("admin/users");
};
