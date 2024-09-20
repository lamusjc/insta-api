"use strict";
const moment = require("moment");

module.exports = function (req, res) {
  var response = {};
  var sess = req.session;
  if (sess.users_id == undefined) {
    response = {
      message: "Session doesn't exists",
      status: 401,
    };
    res.status(response.status);
    return res.json(response);
  }

  var query =
    "SELECT posts.posts_id, posts.users_id, posts_photo, posts_description, posts_created_at, posts_hidden, posts_deleted, users.users_username, users.users_name, users.users_lastname, users.users_description, users.users_photo, users.users_private " +
    "FROM posts " +
    "INNER JOIN users ON posts.users_id = users.users_id " +
    "WHERE posts.posts_deleted = false AND posts.posts_hidden = false " +
    "ORDER BY posts_created_at DESC;";

  var query2 =
    "SELECT likes_id, posts_id, likes.users_id, users.users_username, users.users_photo FROM likes INNER JOIN users ON likes.users_id = users.users_id;";
  var query3 =
    "SELECT users.users_username, users.users_photo, comments_id, comments.users_id, comments.posts_id, comments_description, comments_created_at " +
    "FROM comments " +
    "INNER JOIN users ON comments.users_id = users.users_id " +
    "ORDER BY comments_created_at DESC;";

  var followed =
    "SELECT follows_id, follows.users_id as 'follows_users_id', follows.follows_followed, follows_accepted, " +
    "users.users_id, users.users_name, users.users_lastname, users.users_username, users.users_description, users.users_photo, users.users_private " +
    "FROM follows " +
    "INNER JOIN users ON follows.follows_followed = users.users_id " +
    "WHERE follows.users_id = ?;";

  connection.query(query, function (error, result, fields) {
    if (error) {
      response = {
        status: 500,
        message: "Internal Server Error",
      };

      res.status(response.status);
      return res.json(response);
    } else {
      result.map((value, i) => {
        result[i].posts_photo = arrayBufferToString(value.posts_photo);
        result[i].users_photo = arrayBufferToString(value.users_photo);
        result[i].posts_created_at = moment(result[i].posts_created_at).format(
          "DD/MM/YYYY hh:mm a"
        );
      });

      connection.query(query2, function (error2, result2, fields2) {
        if (error2) {
          response = {
            status: 500,
            message: "Internal Server Error",
          };

          res.status(response.status);
          return res.json(response);
        } else {
          result.map((value, i) => {
            result[i].like = false;
            result[i].likes_id = null;
            result[i].count_likes = 0;
            result[i].likes = [];
            result2.map((value2, j) => {
              if (value.posts_id == value2.posts_id) {
                result[i].count_likes++;
                value2.users_photo = arrayBufferToString(value2.users_photo);
                result[i].likes.push(value2);
                if (sess.users_id == value2.users_id) {
                  result[i].like = true;
                  result[i].likes_id = value2.likes_id;
                }
              }
            });
          });

          connection.query(query3, function (error3, result3, fields3) {
            if (error3) {
              response = {
                status: 500,
                message: "Internal Server Error",
              };

              res.status(response.status);
              return res.json(response);
            } else {
              result.map((value, i) => {
                result[i].comments = [];
                result[i].comments_count = 0;
                result3.map((value3, k) => {
                  if (value.posts_id == value3.posts_id) {
                    value3.comments_created_at = moment(
                      value3.comments_created_at
                    ).format("DD/MM/YYYY hh:mm a");
                    value3.users_photo = arrayBufferToString(
                      value3.users_photo
                    );
                    result[i].comments.push(value3);
                    result[i].comments_count++;
                  }
                });
              });

              connection.query(followed, [sess.users_id], function (
                error4,
                result4,
                fields4
              ) {
                if (error4) {
                  response = {
                    status: 500,
                    message: "Internal Server Error",
                    data: result,
                  };

                  res.status(response.status);
                  return res.json(response);
                } else {
                  let final = [];
                  result.map((value, i) => {
                    if (value.users_id === sess.users_id) {
                      final.push(value);
                    }
                    result4.map((value2, j) => {
                      if (value.users_id === value2.follows_followed) {
                        final.push(value);
                      }
                    });
                  });
                  response = {
                    status: 200,
                    message: "Success",
                    data: final,
                  };

                  res.status(response.status);
                  return res.json(response);
                }
              });
            }
          });
        }
      });
    }
  });
};

function arrayBufferToString(buffer) {
  var bufView = new Uint16Array(buffer);
  var length = bufView.length;
  var result = "";
  var addition = Math.pow(2, 16) - 1;

  for (var i = 0; i < length; i += addition) {
    if (i + addition > length) {
      addition = length - i;
    }
    result += String.fromCharCode.apply(
      null,
      bufView.subarray(i, i + addition)
    );
  }

  return result;
}
