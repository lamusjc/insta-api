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
    "SELECT notifications_id, notifications_type, notifications_refer_id, notifications_description " +
    "FROM notifications " +
    "WHERE notifications_refer_id = ? " +
    "ORDER BY notifications_id DESC;";

  connection.query(query, [sess.users_id], function (error, result, fields) {
    if (error) {
      response = {
        message: "Internal Server Error",
        status: 500,
      };
      res.status(response.status);
      return res.json(response);
    } else {
      response = {
        message: "Success",
        status: 200,
        data: result,
      };
      res.status(response.status);
      return res.json(response);
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
