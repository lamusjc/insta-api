"use strict";
const moment = require("moment");

module.exports = function (req, res) {
  var response = {};
  var sess = req.session;
  var users_id = req.params.users_id;

  if (sess.users_id == undefined) {
    response = {
      message: "Session doesn't exists",
      status: 401,
    };
    res.status(response.status);
    return res.json(response);
  }

  var query =
    "SELECT users_id, users_name, users_lastname, users_username, users_description, users_photo, users_private FROM users WHERE users_id = ?";
  var followed =
    "SELECT follows_id, follows.users_id as 'follows_users_id', follows.follows_followed, follows_accepted, " +
    "users.users_id, users.users_name, users.users_lastname, users.users_username, users.users_description, users.users_photo, users.users_private " +
    "FROM follows " +
    "INNER JOIN users ON follows.follows_followed = users.users_id " +
    "WHERE follows.users_id = ?;";

  var followers =
    "SELECT follows_id, follows.users_id as 'follows_users_id', follows.follows_followed, follows_accepted, " +
    "users.users_id, users.users_name, users.users_lastname, users.users_username, users.users_description, users.users_photo, users.users_private " +
    "FROM follows " +
    "INNER JOIN users ON follows.users_id = users.users_id " +
    "WHERE follows.follows_followed = ?;";

  var posts =
    "SELECT posts.posts_id, posts.users_id, posts_photo, posts_description, posts_created_at, posts_hidden, posts_deleted, users.users_username, users.users_name, users.users_lastname, users.users_description, users.users_private " +
    "FROM posts " +
    "INNER JOIN users ON posts.users_id = users.users_id " +
    "WHERE posts.users_id = ? AND posts.posts_deleted = false " +
    "ORDER BY posts_created_at DESC;";

  var likes =
    "SELECT likes_id, posts_id, likes.users_id, users.users_username, users.users_photo FROM likes INNER JOIN users ON likes.users_id = users.users_id;";
  var comments =
    "SELECT users.users_username, users.users_photo, comments_id, comments.users_id, comments.posts_id, comments_description, comments_created_at " +
    "FROM comments " +
    "INNER JOIN users ON comments.users_id = users.users_id " +
    "ORDER BY comments_created_at DESC;";

  connection.query(query, [users_id], function (error, result, fields) {
    if (error) {
      response = {
        message: "Internal Server Error1",
        status: 500,
      };
      res.status(response.status);
      return res.json(response);
    } else {
      connection.query(followed, [users_id], function (
        error2,
        result2,
        fields2
      ) {
        if (error2) {
          response = {
            message: "Internal Server Error2",
            status: 500,
          };
          res.status(response.status);
          return res.json(response);
        } else {
          connection.query(followers, [users_id], function (
            error3,
            result3,
            fields3
          ) {
            if (error3) {
              response = {
                message: "Internal Server Error3",
                status: 500,
              };
              res.status(response.status);
              return res.json(response);
            } else {
              if (result[0] == undefined) {
                response = {
                  message: "Success",
                  status: 200,
                  data: undefined,
                };
                res.status(response.status);
                return res.json(response);
              } else {
                connection.query(posts, [users_id], function (
                  error4,
                  result4,
                  fields4
                ) {
                  if (error4) {
                    response = {
                      message: "Internal Server Error4",
                      status: 500,
                    };
                    res.status(response.status);
                    return res.json(response);
                  } else {
                    connection.query(likes, function (
                      error5,
                      result5,
                      fields5
                    ) {
                      if (error5) {
                        response = {
                          message: "Internal Server Error4",
                          status: 500,
                        };
                        res.status(response.status);
                        return res.json(response);
                      } else {
                        connection.query(comments, function (
                          error6,
                          result6,
                          fields6
                        ) {
                          if (error6) {
                            response = {
                              message: "Internal Server Error4",
                              status: 500,
                            };
                            res.status(response.status);
                            return res.json(response);
                          } else {
                            result[0].followed = result2;
                            result[0].followers = result3;
                            result[0].count_followed = 0;
                            result[0].count_followers = 0;
                            result[0].isfollowed = false;
                            result[0].posts = [];
                            result[0].count_posts = 0;
                            result[0].users_photo = arrayBufferToString(
                              result[0].users_photo
                            );

                            result2.map((value2, j) => {
                              result[0].count_followed++;
                              result2[j].users_photo = arrayBufferToString(
                                result2[j].users_photo
                              );
                            });

                            result3.map((value3, k) => {
                              result[0].count_followers++;
                              result3[k].users_photo = arrayBufferToString(
                                result3[k].users_photo
                              );
                              if (value3.users_id === sess.users_id) {
                                result[0].isfollowed = true;
                                result[0].posts = result4;
                              }
                            });
                            result4.map((value, i) => {
                              result[0].count_posts++;
                              value.posts_photo = arrayBufferToString(
                                value.posts_photo
                              );
                              value.posts_created_at = moment(
                                value.posts_created_at
                              ).format("DD/MM/YYYY hh:mm a");
                            });
                            if (!result[0].users_private) {
                              result[0].posts = result4;
                            }

                            if (sess.users_id == users_id) {
                              result[0].posts = result4;
                            } else {
                              // Si no lo oculta 
                              result[0].posts.map((value, i) => {
                                if (value.posts_hidden) {
                                  result[0].posts.splice(i, 1);
                                }
                              });
                            }
                            // Likes
                            result[0].posts.map((value, i) => {
                              value.like = false;
                              value.likes_id = null;
                              value.count_likes = 0;
                              value.likes = [];
                              result5.map((value2, j) => {
                                if (value.posts_id == value2.posts_id) {
                                  value.count_likes++;
                                  value2.users_photo = arrayBufferToString(
                                    value2.users_photo
                                  );
                                  value.likes.push(value2);
                                  if (sess.users_id == value2.users_id) {
                                    value.like = true;
                                    value.likes_id = value2.likes_id;
                                  }
                                }
                              });
                            });

                            // Commentarios
                            result[0].posts.map((value, i) => {
                              value.comments = [];
                              value.comments_count = 0;
                              result6.map((value3, k) => {
                                if (value.posts_id == value3.posts_id) {
                                  value3.comments_created_at = moment(
                                    value3.comments_created_at
                                  ).format("DD/MM/YYYY hh:mm a");
                                  value3.users_photo = arrayBufferToString(
                                    value3.users_photo
                                  );
                                  value.comments.push(value3);
                                  value.comments_count++;
                                }
                              });
                            });

                            response = {
                              message: "Success",
                              status: 200,
                              data: result[0],
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
