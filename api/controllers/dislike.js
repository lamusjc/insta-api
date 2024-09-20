"use strict";

module.exports = function (req, res) {
  var response = {};
  var sess = req.session;
  var likes_id = req.body.likes_id;
  var posts_id = req.body.posts_id;

  if (sess.users_id == undefined) {
    response = {
      message: "Session doesn't exists",
      status: 401,
    };
    res.status(response.status);
    return res.json(response);
  }
  var query = "DELETE FROM likes WHERE likes_id = ? AND users_id = ? AND posts_id = ? ";

  connection.query(
    query,
    [likes_id, sess.users_id, posts_id],
    function (error, result, fields) {
      if (error) {
        response = {
          status: 500,
          message: "Unknown Error",
        };
        res.status(response.status);
        return res.json(response);
      } else {
        response = {
          status: 200,
          message: "Deleted like!",
        };
        res.status(response.status);
        return res.json(response);
      }
    }
  );
};
