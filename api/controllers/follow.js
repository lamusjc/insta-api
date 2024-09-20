"use strict";

module.exports = function (req, res) {
  var response = {};
  var sess = req.session;
  var followed = req.body.followed;
  var accepted = req.body.accepted;

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
      message: "You can't follow yourself",
      status: 409,
    };
    res.status(response.status);
    return res.json(response);
  }

  var query =
    "INSERT INTO follows(users_id, follows_followed, follows_accepted) VALUES (?,?,?)";
  var query2 =
    "SELECT *FROM follows WHERE users_id = ? AND follows_followed = ?";
  var query3 =
    "SELECT users.users_username, follows_followed FROM follows inner join users ON follows.users_id = users.users_id ORDER BY follows_id DESC LIMIT 1;";
  var query4 =
    "INSERT INTO notifications(notifications_type, notifications_refer_id, notifications_description) VALUES(?,?,?);";
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
        response = {
          status: 409,
          message: "You have already followed this user",
        };
        res.status(response.status);
        return res.json(response);
      } else {
        connection.query(query, [sess.users_id, followed, accepted], function (
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
                    "follow",
                    result3[0].follows_followed,
                    "The user " +
                    '<a href="/#/home/user/'+sess.users_id+'">'+
                      result3[0].users_username +
                      "</a>" +
                      " is following you! ",
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
                        message: "Following user!",
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
