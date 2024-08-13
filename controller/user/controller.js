var database = require("../../database/database");
var mongodb = require("mongodb");

exports.user = (req, res) => {
  let sessions = req.session.logs;
  let session = req.session;
  let sessionid = req.session.logs._id;

  database.then(async (dbase) => {
    const product = await dbase.collection("productDetails").find().toArray();
    const category = await dbase.collection("adminCategory").find().toArray();
    const orders = await dbase
      .collection("cart")
      .aggregate([
        { $match: { $and: [{ userid: sessionid }, { status: 1 }] } },
        // { $match: { userid: sessionid } },

        { $addFields: { userid: { $toObjectId: "$userid" } } },
        {
          $lookup: {
            from: "userRegister",
            localField: "userid",
            foreignField: "_id",
            as: "userLookup",
          },
        },

        { $addFields: { product: { $toObjectId: "$product" } } },
        {
          $lookup: {
            from: "productDetails",
            localField: "product",
            foreignField: "_id",
            as: "productLookup",
          },
        },
        { $unwind: "$userLookup" },
        { $unwind: "$productLookup" },
      ])
      .toArray();
    const carts = await dbase
      .collection("cart")
      .aggregate([
        { $match: { $and: [{ userid: sessionid }, { status: 0 }] } },
        // { $match: { userid: sessionid } },

        { $addFields: { userid: { $toObjectId: "$userid" } } },
        {
          $lookup: {
            from: "userRegister",
            localField: "userid",
            foreignField: "_id",
            as: "userLookup",
          },
        },

        { $addFields: { product: { $toObjectId: "$product" } } },
        {
          $lookup: {
            from: "productDetails",
            localField: "product",
            foreignField: "_id",
            as: "productLookup",
          },
        },
        { $unwind: "$userLookup" },
        { $unwind: "$productLookup" },
      ])
      .toArray();
    req.session.carts = carts;
    req.session.orders = orders;
    res.render("user/userHome", { product, category, session });
    // console.log("session", session);
  });
};

exports.userRegister = (req, res) => {
  // let session = req.session;

  res.render("user/register");
};

exports.userLogin = (req, res) => {
  // let session = req.session;

  res.render("user/login");
};

exports.logout = (req, res) => { 
  req.session.destroy();
  res.redirect("/login");
};

exports.singleProduct = (req, res) => {
  let prodId = req.params.id;
  let session = req.session;
  database.then(async (dbase) => {
    const sproduct = await dbase
      .collection("productDetails")
      .findOne({ _id: new mongodb.ObjectId(prodId) });
    res.render("user/singleProduct", { sproduct, session });
    // console.log("sessions", sessions);
    // console.log("sproduct", sproduct);
  });
};

exports.categories = (req, res) => {
  catId = req.params.id;
  let session = req.session;
  database.then(async (dbase) => {
    const category = await dbase
      .collection("adminCategory")
      .findOne({ _id: new mongodb.ObjectId(catId) });
    const products = await dbase
      .collection("productDetails")
      .aggregate([
        { $match: { category: catId } },
        // { $addFields: { categoryId: { $toObjectId: "$category" } } },
        // {
        //   $lookup: {
        //     from: "adminCategory",
        //     localField: "categoryId",
        //     foreignField: "_id",
        //     as: "lookupDatas",
        //   },
        // },
        // { $unwind: "$lookupDatas" },
        { $addFields: { categoryId: { $toObjectId: "$category" } } },
        {
          $lookup: {
            from: "adminCategory",
            localField: "categoryId",
            foreignField: "_id",
            as: "catlookupDatas",
          },
        },
        { $unwind: "$catlookupDatas" },
        { $addFields: { categoryId: { $toObjectId: "$subCategory" } } },
        {
          $lookup: {
            from: "subCategory",
            localField: "categoryId",
            foreignField: "_id",
            as: "sublookupDatas",
          },
        },
        { $unwind: "$sublookupDatas" },
      ])
      .toArray();
    console.log("products", products);
    res.render("user/products", { products, category,session });
  });
};

exports.addToCart = (req, res) => {
  let prodId = req.params.id;
  let session = req.session;

  let datas = {
    product: prodId,
    userid: session.logs._id,
    status: 0,
  };
  // console.log("datas", datas);
  // console.log("sessions", sessions);
  // console.log("prodId", prodId);

  database.then((dbase) => {
    dbase
      .collection("cart")
      .insertOne(datas)
      .then((result) => {
        res.redirect("/");
      });
  });
};

exports.cart = (req, res) => {
  let session = req.session;
  let sessionid = req.session.logs._id;
  database.then(async (dbase) => {
    const carts = await dbase
      .collection("cart")
      .aggregate([
        { $match: { $and: [{ userid: sessionid }, { status: 0 }] } },
        // { $match: { userid: sessionid } },

        { $addFields: { userid: { $toObjectId: "$userid" } } },
        {
          $lookup: {
            from: "userRegister",
            localField: "userid",
            foreignField: "_id",
            as: "userLookup",
          },
        },

        { $addFields: { product: { $toObjectId: "$product" } } },
        {
          $lookup: {
            from: "productDetails",
            localField: "product",
            foreignField: "_id",
            as: "productLookup",
          },
        },
        { $unwind: "$userLookup" },
        { $unwind: "$productLookup" },
      ])
      .toArray();

    //Find carts Length
  
    let total = 0;
    for (let i = 0; i < carts.length; i++) {
      total += parseInt(carts[i].productLookup.price);
      total;
    }
    req.session.carts = carts;
    res.render("user/cart", { carts, session,total });

    // console.log("userid", userid);
    // console.log("sessions", sessions);
  });
};

exports.deleteCart = (req, res) => {
  let delId = req.params.id;
  database.then((dbase) => {
    dbase
      .collection("cart")
      .deleteOne({ _id: new mongodb.ObjectId(delId) })
      .then((reslt) => {
        res.redirect("/cart");
      });
  });
};

exports.order = (req, res) => {
  let session = req.session;
  let sessionid = req.session.logs._id;
  // let cartId = req.params.id;

  database.then(async (dbase) => {
    const updates = await dbase
      .collection("cart")
      .updateMany({ userid: sessionid }, { $set: { status: 1 } });

    
    res.render("user/cart", { session });
    res.redirect("/cart")

  });
};

exports.orderView = (req, res) => {
  let session = req.session;
  let sessionid = req.session.logs._id;

  database.then(async (dbase) => {
    const orders = await dbase
      .collection("cart")
      .aggregate([
        { $match: { $and: [{ userid: sessionid }, { status: 1 }] } },
        // { $match: { userid: sessionid } },

        { $addFields: { userid: { $toObjectId: "$userid" } } },
        {
          $lookup: {
            from: "userRegister",
            localField: "userid",
            foreignField: "_id",
            as: "userLookup",
          },
        },

        { $addFields: { product: { $toObjectId: "$product" } } },
        {
          $lookup: {
            from: "productDetails",
            localField: "product",
            foreignField: "_id",
            as: "productLookup",
          },
        },
        { $unwind: "$userLookup" },
        { $unwind: "$productLookup" },
      ])
      .toArray();
    // console.log("cartId",cartId);

    res.render("user/order", { orders, session });
  });
};

