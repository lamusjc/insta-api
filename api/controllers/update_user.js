"use strict";

module.exports = function (req, res) {
  var response = {};
  var sess = req.session;

  var name = req.body.name;
  var lastname = req.body.lastname;
  var description = req.body.description;
  var isprivate = req.body.isprivate;
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
    "UPDATE users SET users_name = ?, users_lastname = ?, users_description = ?, users_private = ?, users_photo = ? WHERE users_id = ?";
  var query2 = "SELECT users_photo FROM users WHERE users_id = ?";
  connection.query(
    query,
    [name, lastname, description, isprivate, file, sess.users_id],
    function (error, result, fields) {
      if (error) {
        response = {
          status: 500,
          message:
            "Error Interno del Servidor! Intente con una imagen menos pesada!",
        };
        res.status(response.status);
        return res.json(response);
      } else {
        connection.query(query2, [sess.users_id], function (
          error2,
          result2,
          fields2
        ) {
          if (error2) {
            response = {
              status: 500,
              message:
                "Error Interno del Servidor! Intente con una imagen menos pesada!",
            };
            res.status(response.status);
            return res.json(response);
          } else {
            response = {
              status: 200,
              message: "Update User!",
            };
            sess.name = name;
            sess.lastname = lastname;
            sess.description = description;
            sess.private = isprivate;
            sess.users_photo = arrayBufferToString(result2[0].users_photo);

            res.status(response.status);
            return res.json(response);
          }
        });
      }
    }
  );
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
