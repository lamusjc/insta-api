"use strict";

module.exports = function (req, res) {
  var response = {};
  var sess = req.session;
  var followed = req.body.followed;

  if (sess.users_id == undefined) {
    response = {
      message: "Session doesn't exists",
      status: 401,
    };
    res.status(response.status);
    return res.json(response);
  }

  if (sess.users_id == followed) {
    response = {
      message: "You can't unfollow yourself",
      status: 409,
    };
    res.status(response.status);
    return res.json(response);
  }

  var query = "DELETE FROM follows WHERE users_id = ? AND follows_followed = ?";
  var query2 =
    "SELECT *FROM follows WHERE users_id = ? AND follows_followed = ?";
  connection.query(query2, [sess.users_id, followed], function (
    error2,
    result2,
    fields2
  ) {
    if (error2) {
      response = {
        status: 500,
        message: "Unknown Error 2",
      };
      res.status(response.status);
      return res.json(response);
    } else {
      if (result2.length > 0) {
        connection.query(query, [sess.users_id, followed], function (
          error,
          result,
          fields
        ) {
          if (error) {
            response = {
              status: 500,
              message: "Unknown Error 1",
            };
            res.status(response.status);
            return res.json(response);
          } else {
            response = {
              status: 200,
              message: "Unfollowed user!",
            };
            res.status(response.status);
            return res.json(response);
          }
        });
      } else {
        response = {
          status: 409,
          message: "That follow doesn't exists",
        };
        res.status(response.status);
        return res.json(response);
      }
    }
  });
};
