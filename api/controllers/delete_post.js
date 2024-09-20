"use strict";

module.exports = function (req, res) {
  var response = {};
  var sess = req.session;
  var posts_id = req.body.posts_id;

  if (sess.users_id == undefined) {
    response = {
      message: "Session doesn't exists",
      status: 401,
    };
    res.status(response.status);
    return res.json(response);
  }
  var query =
    "UPDATE posts SET posts_deleted = true WHERE posts_id = ? AND users_id = ?";
  var query2 = "SELECT *FROM posts WHERE users_id = ? AND posts_id = ?;";
  connection.query(query2, [sess.users_id, posts_id], function (
    error2,
    result2,
    fields2
  ) {
    if (error2) {
      response = {
        message: "Internal Server Error",
        status: 500,
      };
      res.status(response.status);
      return res.json(response);
    } else {
      if (result2.length > 0) {
        connection.query(query, [posts_id, sess.users_id], function (
          error,
          result,
          fields
        ) {
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
              message: "Post deleted!",
            };
            res.status(response.status);
            return res.json(response);
          }
        });
      } else {
        response = {
          message: "Posts doesn't exists!",
          status: 500,
        };
        res.status(response.status);
        return res.json(response);
      }
    }
  });
};
