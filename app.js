//Importamos las librerias
var express = require("express");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var cors = require("cors");
const path = require("path");
var PORT = process.env.PORT || 3000;
//Configuramos el express
var app = express();
var http = require("http");
var server = http.Server(app);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(
  bodyParser.json({
    limit: "10mb",
  })
);
app.use(
  bodyParser.urlencoded({
    limit: "10mb",
    extended: true,
  })
);
app.use(cookieParser());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: 1800000,
    },
  })
);

app.use("/", require("./api/controllers"));
app.use(express.static(path.join(__dirname, "public")));

// Server index.html from client folder

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

function handleDisconnect() {
  connection = mysql.createConnection(
    "mysql://b791a9d6cd6619:4f85b5e4@us-cdbr-east-02.cleardb.com/heroku_8a0e5223e16bcf1?reconnect=true"
  ); // Recreate the connection, since
  // connection = mysql.createConnection({
  //   host: "localhost",
  //   port: 3306,
  //   user: "root",
  //   password: "",
  //   database: "instadb",
  // });

  connection.connect(function (err) {
    if (err) {
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 2000);
    }

    console.log(
      "\nConectado a la base de datos con éxito con id: " + connection.threadId
    );
  });

  connection.on("error", function (err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

//Iniciar el servidor
server.listen(PORT, function () {
  console.log("\nServidor local iniciado con éxito en el puerto: " + PORT);
});
