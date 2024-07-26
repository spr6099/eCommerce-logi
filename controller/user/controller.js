exports.user = (req, res) => {
  res.render("user/userHome", { title: "User", user: true });
};
