"use strict";

module.exports = function (req, res) {
  var response = {};
  var sess = req.session;
  var description = req.body.description;
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
    "INSERT INTO comments(users_id, posts_id, comments_description, comments_created_at) VALUES (?,?,?,?)";
  var query2 = "SELECT now()";
  var query3 =
    "SELECT posts.users_id, users.users_username, comments.posts_id, comments_description, comments_created_at FROM comments INNER JOIN posts ON comments.posts_id = posts.posts_id INNER JOIN users ON comments.users_id = users.users_id ORDER BY comments_id DESC LIMIT 1;";
  var query4 =
    "INSERT INTO notifications(notifications_type, notifications_refer_id, notifications_description) VALUES(?,?,?);";

  connection.query(query2, [], function (error2, result2, field2) {
    if (error2) {
      response = {
        status: 500,
        message: "Internal Server Error",
      };

      res.status(response.status);
      return res.json(response);
    } else {
      connection.query(
        query,
        [sess.users_id, posts_id, description, result2[0]["now()"]],
        function (error, result, fields) {
          if (error) {
            response = {
              status: 500,
              message: "Unknown Error",
            };
            res.status(response.status);
            return res.json(response);
          } else {
            connection.query(query3, function (error3, result3, fields3) {
              if (error3) {
                response = {
                  status: 500,
                  message: "Unknown Error",
                };
                res.status(response.status);
                return res.json(response);
              } else {
                connection.query(
                  query4,
                  [
                    "comment",
                    result3[0].users_id,
                    "The user " +
                    '<a href="/#/home/user/'+sess.users_id+'">'+
                      result3[0].users_username +
                      "</a>" +
                      " commented the following: " +
                      result3[0].comments_description,
                  ],
                  function (error4, result4, fields4) {
                    if (error4) {
                      response = {
                        status: 500,
                        message: "Unknown Error",
                      };
                      res.status(response.status);
                      return res.json(response);
                    } else {
                      response = {
                        status: 200,
                        message: "Comment posted!",
                      };
                      res.status(response.status);
                      return res.json(response);
                    }
                  }
                );
              }
            });
          }
        }
      );
    }
  });
};
