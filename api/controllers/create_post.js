"use strict";

module.exports = function (req, res) {
  var response = {};
  var sess = req.session;
  var description = req.body.description;
  var file = req.body.file;

  if (sess.users_id == undefined) {
    response = {
      message: "Session doesn't exists",
      status: 401,
    };
    res.status(response.status);
    return res.json(response);
  }
  var query =
    "INSERT INTO posts(users_id, posts_photo, posts_description, posts_created_at, posts_hidden, posts_deleted) VALUES (?,?,?,?, false, false)";
  var query2 = "SELECT now()";

  connection.query(query2, [], function (error2, result2, field2) {
    if (error2) {
      response = {
        status: 500,
        message: "Internal Server Error! Intenta con una imagen menos pesada!",
      };

      res.status(response.status);
      return res.json(response);
    } else {
      connection.query(
        query,
        [sess.users_id, file, description, result2[0]["now()"]],
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
              message: "Post created!",
            };
            res.status(response.status);
            return res.json(response);
          }
        }
      );
    }
  });
};
