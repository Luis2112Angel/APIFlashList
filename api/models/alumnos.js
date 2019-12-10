'use strict';
module.exports = (sequelize, DataTypes) => {
  const Alumnos = sequelize.define('Alumnos', {
    nombre: DataTypes.STRING,
    apellidoPaterno: DataTypes.STRING,
    ApellidoMaterno: DataTypes.STRING
  }, {});
  Alumnos.associate = function(models) {
    // associations can be defined here
  };
  return Alumnos;
};