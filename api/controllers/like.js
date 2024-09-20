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
  var query = "INSERT INTO likes(users_id, posts_id) VALUES(?,?)";
  var query2 = "SELECT *FROM likes WHERE users_id = ? AND posts_id = ?;";
  var query3 =
    "SELECT posts.users_id, users.users_username, likes.posts_id FROM likes INNER JOIN posts ON likes.posts_id = posts.posts_id INNER JOIN users ON likes.users_id = users.users_id ORDER BY likes_id DESC LIMIT 1;";
  var query4 =
    "INSERT INTO notifications(notifications_type, notifications_refer_id, notifications_description) VALUES(?,?,?);";
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
        response = {
          message: "You have already like this!",
          status: 500,
        };
        res.status(response.status);
        return res.json(response);
      } else {
        connection.query(query, [sess.users_id, posts_id], function (
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
                    "like",
                    result3[0].users_id,
                    "The user " +
                    '<a href="/#/home/user/'+sess.users_id+'">'+
                      result3[0].users_username +
                      "</a>" +
                      " like some of your posts!",
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
                        message: "Like post!",
                      };
                      res.status(response.status);
                      return res.json(response);
                    }
                  }
                );
              }
            });
          }
        });
      }
    }
  });
};
