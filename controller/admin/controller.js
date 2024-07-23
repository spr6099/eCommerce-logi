
exports.admin = (req, res)=> {
    res.render("index", { title: "Admin", admin: true });
  } 