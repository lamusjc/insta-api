"use strict";

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
  } else {
    response = {
      data: {
        users_id: sess.users_id,
        username: sess.username,
        name: sess.name,
        lastname: sess.lastname,
        description: sess.description,
        private: sess.private,
        users_photo: sess.users_photo.hasOwnProperty('data') ? arrayBufferToString(sess.users_photo.data) : sess.users_photo,
      },
      message: "Success!",
      status: 200,
    };
    res.status(response.status);
    return res.json(response);
  }
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
