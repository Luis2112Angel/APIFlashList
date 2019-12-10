'use strict';

var controllerHelper = require('../helpers/controller.helper');
var auth = require("../helpers/auth");
const {Alumnos} = require('../models');

exports.unprotectedGet = function(args, res, next) {
    var response = { message: "My resource!" };
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(response));
  };
  
  exports.protectedGet = function(args, res, next) {
    var response = { message: "My protected resource for admins and users!" };
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(response));
  };
  
  exports.protected2Get = function(args, res, next) {
    var response = { message: "My protected resource for admins!" };
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(response));
  };
  
  exports.loginPost = function(args, res, next) {
    var role = args.swagger.params.role.value;
    var username = args.body.username;
    var password = args.body.password;
  
    if (role != "user" && role != "admin") {
      var response = { message: 'Error: Role must be either "admin" or "user"' };
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(response));
    }
  
    if (username == "Luis" && password == "2112" && role) {
      var tokenString = auth.issueToken(username, role);
      var response = { token: tokenString };
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(response));
    } else {
      var response = { message: "Error: Credentials incorrect" };
      res.writeHead(403, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(response));
    }
  };
  

// Module Name
const MODULE_NAME = '[Alumno Controller]';
// Error Messages
const G_CT_ERR_ALUMNO_NOT_FOUND = 'Alumno not found';
// Success Messages
const G_CT_DELETED_SUCCESSFULLY = 'Alumno deleted successfully';

function getAlumnos(req, res) {
    try {

        Alumnos.findAll()
            .then(alumnoList => res.status(200).send(alumnoList))
            .catch(error => res.status(500).send(error));

    } catch (error) {
        console.log("Was an error");
        console.log(error);
        controllerHelper.handleErrorResponse(MODULE_NAME, getAlumnos.name, error, res);
    }
}

function createAlumno(req, res) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    try {

        var parameters = req.body;

        return Alumnos.create({
            nombre: parameters.nombre,
            apellidoPaterno: parameters.apellidoPaterno,
            apellidoMaterno: parameters.apellidoMaterno
        }).then(alumno => res.status(201).send(alumno))
            .catch(error => res.status(400).send(error));

    } catch (error) {
        console.log("Was an error");
        controllerHelper.handleErrorResponse(MODULE_NAME, createAlumno.name, error, res);
    }

}

function getAlumnoById(req, res) {
    try {

        var id = req.swagger.params.id.value;

        Alumnos.findByPk(id)
            .then(alumno => res.status(200).send(alumno));

    } catch (error) {
        console.log("Was an error");
        controllerHelper.handleErrorResponse(MODULE_NAME, getAlumnoById.name, error, res);
    }
}

function deleteAlumno(req, res) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    var id = req.swagger.params.id.value;

    Alumnos.findByPk(id).then(alumno => {
        if (!alumno) {
            res.status(200).send({"success": 0, "description": "not found !"});
        } else {
            return alumno.destroy()
                .then(() => res.status(200).send({"success": 1, "description": "deleted!"}))
                .catch(() => res.status(403).send({"success": 0, "description": "error !"}));
        }
    }).catch(error => console.log("There was an error: " + error));
}

function updateAlumno(req, res) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    try {

        var id = req.swagger.params.id.value;
        var parameters = req.body;

        Alumnos.findByPk(id).then(alumno => {
            if (!alumno) {
                res.status(401).send(({}));
            }
            return alumno.update({
                nombre: parameters.name,
                apellidoPaterno: parameters.apellidoPaterno,
                apellidoMaterno: parameters.apellidoMaterno
            }).then(() => res.status(200).send(alumno))
                .catch(error => res.status(403).send(alumno));
        }).catch(error => console.log("There was an error: " + error));

    } catch (error) {
        console.log("Was an error");
        controllerHelper.handleErrorResponse(MODULE_NAME, updateAlumno.name, error, res);
    }
}

module.exports =
{
        getAlumnos,
        getAlumnoById,
        createAlumno,
        updateAlumno,
        deleteAlumno,
        G_CT_ERR_ALUMNO_NOT_FOUND,
        G_CT_DELETED_SUCCESSFULLY,
        MODULE_NAME
};
