"use strict";

module.exports = function (req, res) {
  var response = {};
  var name = req.body.name;
  var lastname = req.body.lastname;
  var username = req.body.username.toLowerCase();
  var password = req.body.password;

  var query =
    "INSERT INTO users(users_name, users_lastname, users_username, users_password, users_private) VALUES (?,?,?,?, false)";

  var query2 = "SELECT *FROM USERS where users_username = ?";

  //Verificamos si el usuario existe o no
  connection.query(query2, [username], function (error, result, fields) {
    if (error) {
      response = {
        status: 500,
        message: "Unknown Error",
      };
      res.status(response.status);
      return res.json(response);
    } else {
      //Preguntamos si esta vacio, si lo esta lo registra
      if (result.length == 0) {
        connection.query(query, [name, lastname, username, password], function (
          error,
          result,
          fields
        ) {
          if (error) {
            response = {
              status: 500,
              message: "Error Interno del Servidor",
            };
            res.status(response.status);
            return res.json(response);
          } else {
            response = {
              status: 200,
              message: "Registered User!",
            };
            res.status(response.status);
            return res.json(response);
          }
        });
        //Si es mayor a 0, quiere decir que hay datos guardados
      } else {
        response = {
          status: 409,
          message: "Users exists",
        };
        res.status(response.status);
        return res.json(response);
      }
    }
  });
};
