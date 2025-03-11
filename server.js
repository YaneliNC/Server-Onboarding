import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';  
// import multer from 'multer';
// import path from 'path'; 
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// import fs from 'fs';

dotenv.config();
const app = express();
app.use(cors());

app.use(express.json());

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT 
});

db.connect(err => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.code, err.message);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
});


//! MODELOS 

// funciones de modelo de roles
const createRol = async (nomrol, callback) => {
  try {
      const query = 'INSERT INTO rol (nomrol) VALUES (?)';
      db.query(query, [nomrol], callback);
  } catch (err) {
      callback(err, null);
  }
};
const updateRol = async (idrol, nomrol, callback) => {
  try {
      const query = 'UPDATE rol SET nomrol = ? WHERE idrol = ?';
      db.query(query, [ nomrol, idrol], callback);
  } catch (err) {
      callback(err, null);
  }
};
const deleteRol = (idrol, callback) => {
  const query = 'DELETE FROM rol WHERE idrol = ?';
  db.query(query, [idrol], callback);
};

// funciones de modelo de permisos

const createPermiso = async (nompermiso, clave, callback) => {
  try {
      const query = 'INSERT INTO permiso (nompermiso , clave) VALUES (?,?)';
      db.query(query, [nompermiso, clave], callback);
  } catch (err) {
      callback(err, null);
  }
};
const updatePermiso = async (idpermiso, nompermiso, clave, callback) => {
  try {
      const query = 'UPDATE permiso SET nompermiso = ?, clave = ? WHERE idpermiso = ?';
      db.query(query, [ nompermiso, clave, idpermiso], callback);
  } catch (err) {
      callback(err, null);
  }
};
const deletePermiso = (idpermiso, callback) => {
  const query = 'DELETE FROM permiso WHERE idpermiso = ?';
  db.query(query, [idpermiso], callback);
};

// funciones de modelo rolxpermisos
const createRolxPermiso = (idrol, idpermiso, callback) => {
  try {
      const query = 'INSERT INTO rolxpermiso (idrol, idpermiso) VALUES (?, ?)';
      db.query(query, [idrol, idpermiso], callback);
  } catch (err) {
      callback(err, null);
  }
};
const updateRolxPermiso = (idrol, idpermiso, callback) => {
  try {
      const query = 'UPDATE rolxpermiso SET idpermiso = ? WHERE idrol = ?';
      db.query(query, [idpermiso, idrol], callback);
  } catch (err) {
      callback(err, null);
  }
};
const deleteRolxPermiso = (idrol, idpermiso, callback) => {
  const query = 'DELETE FROM rolxpermiso WHERE idrol = ? AND idpermiso = ?';
  db.query(query, [idrol, idpermiso], callback);
};


// Funciones del modelo de usuario
const createUser = async (nombre, correo, contraseña, puesto, numero_empleado, planta, turno, idrol, callback) => {
  try {
      const query = 'INSERT INTO users (nombre, correo, contraseña, puesto, numero_empleado, planta, turno, idrol) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      db.query(query, [nombre, correo,  contraseña, puesto, numero_empleado, planta, turno, idrol], callback);
  } catch (err) {
      callback(err, null);
  }
};
const createAdmin = async (nombre, correo, contraseña, puesto, numero_empleado, planta, turno, idrol, callback) => {
  try {
      const query = 'INSERT INTO users (nombre, correo, contraseña, puesto, numero_empleado, planta, turno, idrol) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      db.query(query, [nombre, correo,  contraseña, puesto, numero_empleado, planta, turno, idrol], callback);
  } catch (err) {
      callback(err, null);
  }
};
const updateUser = async (idusuario, nombre, correo, contraseña, puesto, numero_empleado, planta, turno, idrol, callback) => {
  try {
      const query = 'UPDATE users SET nombre = ?, correo = ?,  contraseña= ?, puesto = ?, numero_empleado = ?, planta = ?, turno = ?, idrol = ? WHERE idusuario = ?';
      db.query(query, [nombre, correo,contraseña,  puesto, numero_empleado, planta, turno, idrol, idusuario], callback);
  } catch (err) {
      callback(err, null);
  }
};

const deleteUser = (idusuario, callback) => {
  const query = 'DELETE FROM users WHERE idusuario = ?';
  db.query(query, [idusuario], callback);
};

// Modelo para la tabla categorias
const createCategoria = async (nombre_categoria, callback) => {
  try {
    const query = 'INSERT INTO categorias (nombre_categoria) VALUES (?)';
    db.query(query, [nombre_categoria], callback);
  } catch (err) {
    callback(err, null);
  }
};

const updateCategoria = async (id_categoria, nombre_categoria, callback) => {
  try {
    const query = 'UPDATE categorias SET nombre_categoria = ? WHERE id_categoria = ?';
    db.query(query, [nombre_categoria, id_categoria], callback);
  } catch (err) {
    callback(err, null);
  }
};

const deleteCategoria = (id_categoria, callback) => {
  const query = 'DELETE FROM categorias WHERE id_categoria = ?';
  db.query(query, [id_categoria], callback);
};

// Modelo para la tabla encuestas
const createEncuesta = async (nombre_encuesta, descripcion, id_categoria, idusuario, callback) => {
  try {
    const query = 'INSERT INTO encuestas (nombre_encuesta, descripcion, id_categoria, idusuario) VALUES (?, ?, ?, ?)';
    db.query(query, [nombre_encuesta, descripcion, id_categoria, idusuario], callback);
  } catch (err) {
    callback(err, null);
  }
};

const updateEncuesta = async (id_encuesta, nombre_encuesta, descripcion, id_categoria, idusuario, callback) => {
  try {
    const query = 'UPDATE encuestas SET nombre_encuesta = ?, descripcion = ?, id_categoria = ?, idusuario = ? WHERE id_encuesta = ?';
    db.query(query, [nombre_encuesta, descripcion, id_categoria, idusuario, id_encuesta], callback);
  } catch (err) {
    callback(err, null);
  }
};

const deleteEncuesta = (id_encuesta, callback) => {
  const query = 'DELETE FROM encuestas WHERE id_encuesta = ?';
  db.query(query, [id_encuesta], callback);
};

// Modelo para la tabla preguntas
const createPregunta = (texto_pregunta, tipo_pregunta, id_encuesta, callback) => {
  const query = 'INSERT INTO preguntas (texto_pregunta, tipo_pregunta, id_encuesta) VALUES (?, ?, ?)';
  db.query(query, [texto_pregunta, tipo_pregunta, id_encuesta], (err, results) => {
    if (err) {
      console.error("Error en la consulta SQL:", err);
      return callback(err, null);
    }
    callback(null, results);
  });
};

const updatePregunta = async (id_pregunta, texto_pregunta, tipo_pregunta, id_encuesta, callback) => {
  try {
    const query = 'UPDATE preguntas SET texto_pregunta = ?, tipo_pregunta = ?, id_encuesta = ? WHERE id_pregunta = ?';
    db.query(query, [texto_pregunta, tipo_pregunta, id_encuesta, id_pregunta], callback);
  } catch (err) {
    callback(err, null);
  }
};

const deletePregunta = (id_pregunta, callback) => {
  const query = 'DELETE FROM preguntas WHERE id_pregunta = ?';
  db.query(query, [id_pregunta], callback);
};

// Modelo para la tabla opciones_respuesta
const createOpcionRespuesta = async (id_pregunta, texto_opcion, callback) => {
  try {
    const query = 'INSERT INTO opciones_respuesta (id_pregunta, texto_opcion) VALUES (?, ?)';
    db.query(query, [id_pregunta, texto_opcion], callback);
  } catch (err) {
    callback(err, null);
  }
};

const updateOpcionRespuesta = async (id_opcion, id_pregunta, texto_opcion, callback) => {
  try {
    const query = 'UPDATE opciones_respuesta SET id_pregunta = ?, texto_opcion = ? WHERE id_opcion = ?';
    db.query(query, [id_pregunta, texto_opcion, id_opcion], callback);
  } catch (err) {
    callback(err, null);
  }
};

const deleteOpcionRespuesta = (id_opcion, callback) => {
  const query = 'DELETE FROM opciones_respuesta WHERE id_opcion = ?';
  db.query(query, [id_opcion], callback);
};

// Modelo para la tabla respuestas
const createRespuesta = async (id_pregunta, id_opcion, texto_respuesta, idusuario, id_encuesta, callback) => {
  try {
    const query = 'INSERT INTO respuestas (id_pregunta, id_opcion, texto_respuesta, idusuario, id_encuesta) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [id_pregunta, id_opcion, texto_respuesta, idusuario, id_encuesta], callback);
  } catch (err) {
    callback(err, null);
  }
};

const updateRespuesta = async (id_respuesta, id_pregunta, id_opcion, texto_respuesta, idusuario, id_encuesta, callback) => {
  try {
    const query = 'UPDATE respuestas SET id_pregunta = ?, id_opcion = ?, texto_respuesta = ?, idusuario = ?, id_encuesta = ? WHERE id_respuesta = ?';
    db.query(query, [id_pregunta, id_opcion, texto_respuesta, idusuario, id_encuesta, id_respuesta], callback);
  } catch (err) {
    callback(err, null);
  }
};

const deleteRespuesta = (id_respuesta, callback) => {
  const query = 'DELETE FROM respuestas WHERE id_respuesta = ?';
  db.query(query, [id_respuesta], callback);
};


// Modelo para la tabla encuestas_asignadas
const createEncuestaAsignada = async (idusuario, id_encuesta, cantidad, callback) => {
  try {
    const query = 'INSERT INTO encuestas_asignadas (idusuario, id_encuesta, cantidad) VALUES (?, ?, ?)';
    db.query(query, [idusuario, id_encuesta, cantidad], callback);
  } catch (err) {
    callback(err, null);
  }
};

const updateEncuestaAsignada = async (id_asignacion, idusuario, id_encuesta, cantidad, callback) => {
  try {
    const query = 'UPDATE encuestas_asignadas SET idusuario = ?, id_encuesta = ?, cantidad = ? WHERE id_asignacion = ?';
    db.query(query, [idusuario, id_encuesta, cantidad, id_asignacion], callback);
  } catch (err) {
    callback(err, null);
  }
};

const deleteEncuestaAsignada = (id_asignacion, callback) => {
  const query = 'DELETE FROM encuestas_asignadas WHERE id_asignacion = ?';
  db.query(query, [id_asignacion], callback);
};



//!LOGIN & authenticateUser

// Función para autenticar usuario
const authenticateUser = (correo, contraseña, callback) => {
  const query = 'SELECT * FROM users WHERE correo = ?';
  db.query(query, [correo], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    if (results.length === 0) {
      return callback(new Error('Usuario no encontrado'), null);
    }

    const user = results[0];
    // Comparar directamente la contraseña (sin encriptación)
    if (contraseña !== user.contraseña) {
      return callback(new Error('Contraseña incorrecta'), null);
    }

    // Generar remember_token
    const remember_token = crypto.randomBytes(16).toString('hex');
    const updateTokenQuery = 'UPDATE users SET remember_token = ? WHERE correo = ?';
    db.query(updateTokenQuery, [remember_token, correo], (err) => {
      if (err) {
        return callback(err, null);
      }
      user.remember_token = remember_token; // Agregar el token al usuario
      callback(null, user);
    });
  });
};

// Endpoint POST para login
app.post('/login', (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
  }

  authenticateUser(correo, contraseña, (err, user) => {
    if (err) {
      res.status(401).json({ message: err.message });
      return;
    }
    res.status(200).json({ message: 'Login exitoso', user, remember_token: user.remember_token });
  });
});

// Endpoint POST para logout
app.post('/logout', (req, res) => {
  const { remember_token } = req.body;

  if (!remember_token) {
    return res.status(400).json({ message: 'El token es obligatorio para cerrar sesión' });
  }

  const query = 'UPDATE users SET remember_token = NULL WHERE remember_token = ?';
  db.query(query, [remember_token], (err) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(200).json({ message: 'Logout exitoso' });
  });
});

// Endpoint para verificar el token
app.post('/auth/check-token', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'El token es obligatorio' });
  }

  const query = 'SELECT * FROM users WHERE remember_token = ?';
  db.query(query, [token], (err, results) => {
    if (err || results.length === 0) {
      res.status(401).json({ message: 'Token inválido' });
      return;
    }
    res.status(200).json({ user: results[0] });
  });
});

//! METODOS 

// Endpoint GET para obtener todos los roles
app.get('/roles', (req, res) => {
  const query = 'SELECT * FROM rol';
  db.query(query, (err, results) => {
      if (err) {
          res.status(500).send(err);
          return;
      }
      res.status(200).json(results);
  });
});

app.get('/roles/:idrol', (req, res) => {
  const { idrol } = req.params; // Cambiado de "id" a "idrol"
  const query = 'SELECT * FROM rol WHERE idrol = ?';

  db.query(query, [idrol], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: 'Rol no encontrado' });
      return;
    }
    res.status(200).json(results[0]); // Envía el primer resultado como objeto
  });
});


// Endpoint POST para registrar un rol
app.post('/nuevo-rol', async (req, res) => {
  const { nomrol } = req.body;
  createRol(nomrol, (err, results) => {
      if (err) {
          res.status(500).send(err);
          return;
      }
      res.status(201).json({ message: 'Rol agregado exitosamente' });
  });
});

// Endpoint PUT para actualizar un rol
app.put('/actualizar-rol/:idrol', async (req, res) => {
  const { idrol } = req.params;
  const { nomrol } = req.body;
  updateRol(idrol,nomrol, (err, results) => {
      if (err) {
          res.status(500).send(err);
          return;
      }
      if (results.affectedRows === 0) {
          res.status(404).json({ message: 'Rol no encontrado' });
          return;
      }
      res.status(200).json({ message: 'Rol actualizado exitosamente' });
  });
});

// Endpoint DELETE para eliminar un rol
app.delete('/eliminar-rol/:idrol', (req, res) => {
  const { idrol } = req.params;
  deleteRol(idrol, (err, results) => {
      if (err) {
          res.status(500).send(err);
          return;
      }
      if (results.affectedRows === 0) {
          res.status(404).json({ message: 'Rol no encontrado' });
          return;
      }
      res.status(200).json({ message: 'Rol eliminado exitosamente' });
  });
});

//! BUSCAR rol
app.get('/buscar-rol', (req, res) => {
  let query = `
    SELECT * 
    FROM rol
    WHERE 1=1
  `;
  const queryParams = [];
  const campos = ['nomrol', 'idrol']; 
  if (req.query.termino) {
    const termino = `%${req.query.termino}%`;
    query += ` AND (${campos.map(campo => `${campo} LIKE ?`).join(' OR ')})`;
    campos.forEach(() => queryParams.push(termino));
  } else {
    campos.forEach(campo => {
      if (req.query[campo]) {
        query += ` AND ${campo} LIKE ?`;
        queryParams.push(`%${req.query[campo]}%`);
      }
    });
  }
  db.query(query, queryParams, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(200).json(results);
  });
});

//! BUSCAR permiso
app.get('/buscar-permiso', (req, res) => {
  let query = `
    SELECT * 
    FROM permiso
    WHERE 1=1
  `;
  const queryParams = [];
  const campos = ['nompermiso', 'idpermiso', 'clave'];   
  if (req.query.termino) {
    const termino = `%${req.query.termino}%`;
    query += ` AND (${campos.map(campo => `${campo} LIKE ?`).join(' OR ')})`;
    campos.forEach(() => queryParams.push(termino));
  } else {
    campos.forEach(campo => {
      if (req.query[campo]) {
        query += ` AND ${campo} LIKE ?`;
        queryParams.push(`%${req.query[campo]}%`);
      }
    });
  }
  db.query(query, queryParams, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(200).json(results);
  });
});



// Endpoint GET para obtener todas las relaciones rol-permiso
app.get('/permisos', (req, res) => {
  const query = 'SELECT * FROM permiso';
  db.query(query, (err, results) => {
      if (err) {
          res.status(500).send(err);
          return;
      }
      res.status(200).json(results);
  });
});

// buscar permiso por ID
app.get('/permisos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM permiso WHERE idpermiso = ?';
  db.query(query, [id], (err, results) => {
      if (err) {
          res.status(500).send(err);
          return;
      }
      if (results.length === 0) {
          res.status(404).json({ message: 'Permiso no encontrado' });
          return;
      }
      res.status(200).json(results[0]);
  });
});

// Endpoint POST para registrar un permiso
app.post('/nuevo-permiso', async (req, res) => {
  const { nompermiso, clave } = req.body;
  createPermiso(nompermiso, clave, (err, results) => {
      if (err) {
          res.status(500).send(err);
          return;
      }
      res.status(201).json({ message: 'Permiso registrado exitosamente' });
  });
});

// Endpoint PUT para actualizar un permiso
app.put('/actualizar-permiso/:idpermiso', async (req, res) => {
  const { idpermiso } = req.params;
  const { nompermiso, clave } = req.body;
  updatePermiso(idpermiso, nompermiso, clave, (err, results) => {
      if (err) {
          res.status(500).send(err);
          return;
      }
      if (results.affectedRows === 0) {
          res.status(404).json({ message: 'Permiso no encontrado' });
          return;
      }
      res.status(200).json({ message: 'Permiso actualizado exitosamente' });
  });
});

// Endpoint DELETE para eliminar un permiso
app.delete('/eliminar-permiso/:idpermiso', (req, res) => {
  const { idpermiso } = req.params;
  deletePermiso(idpermiso, (err, results) => {
      if (err) {
          res.status(500).send(err);
          return;
      }
      if (results.affectedRows === 0) {
          res.status(404).json({ message: 'Permiso no encontrado' });
          return;
      }
      res.status(200).json({ message: 'Permiso eliminado exitosamente' });
  });
});

// Endpoint GET para obtener todas las relaciones rol-permiso
app.get('/rolxpermiso', (req, res) => {
  const query = 'SELECT * FROM rolxpermiso';
  db.query(query, (err, results) => {
      if (err) {
          res.status(500).send(err);
          return;
      }
      res.status(200).json(results);
  });
});

app.get('/rolxpermiso/:idrol', (req, res) => {
  const { idrol } = req.params;
  const query = `
      SELECT rp.idpermiso, p.nompermiso AS nombre_permiso
      FROM rolxpermiso rp
      JOIN permiso p ON rp.idpermiso = p.idpermiso
      WHERE rp.idrol = ?
  `;
  db.query(query, [idrol], (err, results) => {
      if (err) {
          res.status(500).send(err);
          return;
      }
      res.status(200).json(results);
  });
});

//endpoint post para agregar un rolxpermiso

app.post('/agregar-rolxpermiso', async (req, res) => {
  const { idrol, idpermiso } = req.body;

  // Verificar que el rol exista
  const roleQuery = 'SELECT * FROM rol WHERE idrol = ?';
  db.query(roleQuery, [idrol], (roleErr, roleResults) => {
      if (roleErr) {
          res.status(500).send(roleErr);
          return;
      }
      if (roleResults.length === 0) {
          res.status(404).json({ message: 'Rol no encontrado' });
          return;
      }

      // Verificar que el permiso exista
      const permisoQuery = 'SELECT * FROM permiso WHERE idpermiso = ?';
      db.query(permisoQuery, [idpermiso], (permisoErr, permisoResults) => {
          if (permisoErr) {
              res.status(500).send(permisoErr);
              return;
          }
          if (permisoResults.length === 0) {
              res.status(404).json({ message: 'Permiso no encontrado' });
              return;
          }

          // Crear la relación rol-permiso
          createRolxPermiso(idrol, idpermiso, (createErr, createResults) => {
              if (createErr) {
                  res.status(500).send(createErr);
                  return;
              }
              res.status(201).json({ message: 'Relación rol-permiso agregada exitosamente' });
          });
      });
  });
});



// Endpoint para actualizar el permiso de un rol específico
app.put('/actualizar-rolxpermiso/:idrol', (req, res) => {
  const { idrol } = req.params;
  const { idpermiso } = req.body;

  if (typeof idpermiso !== 'number') {
      res.status(400).json({ message: 'idpermiso debe ser un número válido' });
      return;
  }

  updateRolxPermiso(idrol, idpermiso, (updateErr, updateResults) => {
      if (updateErr) {
          res.status(500).send(updateErr);
          return;
      }
      if (updateResults.affectedRows === 0) {
          res.status(404).json({ message: 'Relación rol-permiso no encontrada' });
          return;
      }
      res.status(200).json({ message: 'Permiso del rol actualizado exitosamente' });
  });
});

//endpoint Delete para eliminar una relacion rolxpermimso

app.delete('/eliminar-rolxpermiso', async (req, res) => {
  const { idrol, idpermiso } = req.body;

  deleteRolxPermiso(idrol, idpermiso, (deleteErr, deleteResults) => {
      if (deleteErr) {
          res.status(500).send(deleteErr);
          return;
      }
      if (deleteResults.affectedRows === 0) {
          res.status(404).json({ message: 'Relación rol-permiso no encontrada' });
          return;
      }
      res.status(200).json({ message: 'Relación rol-permiso eliminada exitosamente' });
  });
});

// Endpoint GET para obtener todos los usuarios
app.get('/usuarios', (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
      if (err) {
          res.status(500).send(err);
          return;
      }
      res.status(200).json(results);
  });
});

// Endpoint POST para registrar un usuario
app.post('/nuevo-usuario', async (req, res) => {
  const { nombre, correo, contraseña, puesto, numero_empleado, planta, turno, idrol } = req.body;
  createUser(nombre, correo, contraseña, puesto, numero_empleado, planta, turno, idrol, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
  }
  res.status(201).json({ message: 'Usuario registrado exitosamente' });  
  });
});

// Endpoint POST para registrar un administrador
app.post('/nuevo-admin', async (req, res) => {
  const { nombre, correo, contraseña, puesto, numero_empleado, planta, turno } = req.body;
  const idrol = 1; // ID de rol para administrador
  console.log("Datos recibidos:", req.body); // Log para verificar los datos

  try {
    createAdmin(nombre, correo, contraseña, puesto, numero_empleado, planta, turno, idrol, (err, results) => {
      if (err) {
        console.error("Error al registrar admin:", err); // Log para errores
        res.status(500).json({ error: 'Error al registrar admin' });
        return;
      }
      res.status(201).json({ message: 'Admin registrado exitosamente' });
    });
  } catch (error) {
    console.error("Error no controlado:", error); // Log para errores inesperados
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint PUT para actualizar un usuario
app.put('/actualizar-usuario/:idusuario', async (req, res) => {
  const { idusuario } = req.params;
  const { nombre, correo, contraseña, puesto, numero_empleado, planta, turno, idrol } = req.body;
  updateUser(idusuario, nombre, correo, contraseña, puesto, numero_empleado, planta, turno, idrol, (err, results) => {
      if (err) {
          res.status(500).send(err);
          return;
      }
      if (results.affectedRows === 0) {
          res.status(404).json({ message: 'Usuario no encontrado' });
          return;
      }
      res.status(200).json({ message: 'Usuario actualizado exitosamente' });
  });
});


app.put('/actualizar-perfil/:idusuario', async (req, res) => {
  const { idusuario } = req.params;
  const { nombre, correo, contraseña, puesto, numero_empleado, planta, turno, idrol } = req.body;
  updateUser(idusuario, nombre, correo, contraseña, puesto, numero_empleado, planta, turno, idrol, (err, results) => {
      if (err) {
          res.status(500).send(err);
          return;
      }
      if (results.affectedRows === 0) {
          res.status(404).json({ message: 'Usuario no encontrado' });
          return;
      }
      res.status(200).json({ message: 'Usuario actualizado exitosamente' });
  });
});

// Endpoint DELETE para eliminar un usuario
app.delete('/eliminar-usuario/:idusuario', (req, res) => {
  const { idusuario } = req.params;
  deleteUser(idusuario, (err, results) => {
      if (err) {
          res.status(500).send(err);
          return;
      }
      if (results.affectedRows === 0) {
          res.status(404).json({ message: 'Usuario no encontrado' });
          return;
      }
      res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  });
});

// Endpoint GET para obtener un usuario por ID
app.get('/perfil-usuario/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM users WHERE idusuario = ?';
  db.query(query, [id], (err, results) => {
      if (err) {
          res.status(500).send(err);
          return;
      }
      if (results.length === 0) {
          res.status(404).json({ message: 'Usuario no encontrado' });
          return;
      }
      res.status(200).json(results[0]);
  });
});

app.get('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM users WHERE idusuario = ?';
  db.query(query, [id], (err, results) => {
      if (err) {
          res.status(500).send(err);
          return;
      }
      if (results.length === 0) {
          res.status(404).json({ message: 'Usuario no encontrado' });
          return;
      }
      res.status(200).json(results[0]);
  });
});

//! BUSCAR USUARIO 
app.get('/buscar-usuarios', (req, res) => {
  let query = `
    SELECT users.*, rol.nomrol 
    FROM users 
    LEFT JOIN rol ON users.idrol = rol.idrol 
    WHERE 1=1
  `;
  const queryParams = [];

  const campos = ['nombre', 'puesto', 'correo', 'numero_empleado', 'planta', 'turno', 'users.idrol'];

  if (req.query.termino) {
    const termino = `%${req.query.termino}%`;
    query += ` AND (${campos.map(campo => `${campo} LIKE ?`).join(' OR ')})`;
    campos.forEach(() => queryParams.push(termino));
  } else {
    campos.forEach(campo => {
      if (req.query[campo]) {
        query += ` AND ${campo} LIKE ?`;
        queryParams.push(`%${req.query[campo]}%`);
      }
    });
  }
  db.query(query, queryParams, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(200).json(results);
  });
});

// Rutas para Categorías
app.get('/categorias', (req, res) => {
  db.query('SELECT * FROM categorias', (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(results);
  });
});

app.get('/categoria/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM categorias WHERE id_categoria = ?', [id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ message: 'Categoría no encontrada' });
      res.status(200).json(results[0]);
  });
});

app.post('/categoria', (req, res) => {
  const { nombre_categoria } = req.body;
  if (!nombre_categoria) return res.status(400).json({ message: 'El nombre de la categoría es requerido' });
  
  createCategoria(nombre_categoria, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Categoría creada', id: results.insertId });
  });
});

app.put('/categoria/:id', (req, res) => {
  const { id } = req.params;
  const { nombre_categoria } = req.body;
  if (!nombre_categoria) return res.status(400).json({ message: 'El nombre de la categoría es requerido' });
  
  updateCategoria(id, nombre_categoria, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.affectedRows === 0) return res.status(404).json({ message: 'Categoría no encontrada' });
      res.status(200).json({ message: 'Categoría actualizada' });
  });
});

app.delete('/categoria/:id', (req, res) => {
  const { id } = req.params;
  deleteCategoria(id, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.affectedRows === 0) return res.status(404).json({ message: 'Categoría no encontrada' });
      res.status(200).json({ message: 'Categoría eliminada' });
  });
});

app.get('/buscar-categoria', (req, res) => {
  let query = 'SELECT * FROM categorias WHERE 1=1';
  const queryParams = [];
  const campos = ['nombre_categoria', 'id_categoria'];
  
  if (req.query.termino) {
      const termino = `%${req.query.termino}%`;
      query += ` AND (${campos.map(campo => `${campo} LIKE ?`).join(' OR ')})`;
      campos.forEach(() => queryParams.push(termino));
  } else {
      campos.forEach(campo => {
          if (req.query[campo]) {
              query += ` AND ${campo} LIKE ?`;
              queryParams.push(`%${req.query[campo]}%`);
          }
      });
  }
  
  db.query(query, queryParams, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json(results);
  });
});

// Endpoint GET para obtener todas las encuestas
app.get('/encuestas', (req, res) => {
  const query = `
    SELECT encuestas.* 
    FROM encuestas
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error en la consulta SQL:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(200).json(results);
  });
});

//! BUSCAR Encuestas
// Endpoint GET para buscar encuestas
app.get('/buscar-encuestas', (req, res) => {
  let query = `
    SELECT encuestas.*, categorias.nombre_categoria AS categoria, users.nombre AS usuario 
    FROM encuestas 
    LEFT JOIN categorias ON encuestas.id_categoria = categorias.id_categoria
    LEFT JOIN users ON encuestas.idusuario = users.idusuario
    WHERE 1=1
  `;
  const queryParams = [];
  const campos = ['nombre_encuesta', 'descripcion', 'encuestas.id_categoria', 'encuestas.idusuario'];
  
  if (req.query.termino) {
    const termino = `%${req.query.termino}%`;
    query += ` AND (${campos.map(campo => `${campo} LIKE ?`).join(' OR ')})`;
    campos.forEach(() => queryParams.push(termino));
  } else {
    campos.forEach(campo => {
      if (req.query[campo]) {
        query += ` AND ${campo} LIKE ?`;
        queryParams.push(`%${req.query[campo]}%`);
      }
    });
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error al buscar encuestas:", err);
      return res.status(500).json({ error: 'Error al buscar encuestas' });
    }
    res.status(200).json(results);
  });
});

// Endpoint POST para registrar una nueva encuesta
// app.post('/nueva-encuesta', (req, res) => {
//   const { nombre_encuesta, descripcion, id_categoria, id_usuario } = req.body;
  
//   // Validar que se envíen todos los campos
//   if (!nombre_encuesta || !descripcion || !id_categoria || !id_usuario) {
//     return res.status(400).json({ error: 'Todos los campos son obligatorios' });
//   }
  
//   createEncuesta(nombre_encuesta, descripcion, id_categoria, id_usuario, (err, results) => {
//     if (err) {
//       console.error("Error al registrar una encuesta:", err);
//       res.status(500).json({ error: 'Error al registrar una encuesta' });
//       return;
//     }
//     res.status(201).json({ message: 'Encuesta registrada exitosamente', id_encuesta: results.insertId });
//   });
// });
// Endpoint POST para registrar una nueva encuesta
app.post('/nueva-encuesta', (req, res) => {
  const { nombre_encuesta, descripcion, id_categoria, idusuario } = req.body;

  // Validar que se envíen todos los campos
  if (!nombre_encuesta || !descripcion || !id_categoria || !idusuario) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  // Llamar a la función para crear la encuesta
  createEncuesta(nombre_encuesta, descripcion, id_categoria, idusuario, (err, results) => {
    if (err) {
      console.error("Error al registrar una encuesta:", err);
      return res.status(500).json({ error: 'Error al registrar una encuesta' });
    }
    res.status(201).json({ message: 'Encuesta registrada exitosamente', id_encuesta: results.insertId });
  });
});

// Endpoint PUT para actualizar una encuesta
app.put('/actualizar-encuesta/:id_encuesta', (req, res) => {
  const { id_encuesta } = req.params;
  const { nombre_encuesta, descripcion, id_categoria, id_usuario } = req.body;
  
  // Validar que se envíen todos los campos
  if (!nombre_encuesta || !descripcion || !id_categoria || !id_usuario) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }
  
  updateEncuesta(id_encuesta, nombre_encuesta, descripcion, id_categoria, id_usuario, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Encuesta no encontrada' });
      return;
    }
    res.status(200).json({ message: 'Encuesta actualizada exitosamente' });
  });
});

// Endpoint DELETE para eliminar una encuesta
app.delete('/eliminar-encuesta/:id_encuesta', (req, res) => {
  const { id_encuesta } = req.params;
  deleteEncuesta(id_encuesta, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Encuesta no encontrada' });
      return;
    }
    res.status(200).json({ message: 'Encuesta eliminada exitosamente' });
  });
});

// Endpoint GET para obtener todas las preguntas
app.get('/preguntas', (req, res) => {
  const query = 'SELECT * FROM preguntas';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(200).json(results);
  });
});

// Endpoint POST para registrar una nueva pregunta
// app.post('/nueva-pregunta', (req, res) => {
//   const { texto_pregunta, tipo_pregunta, id_encuesta } = req.body;
//   try {
//     createPregunta(texto_pregunta, tipo_pregunta, id_encuesta, (err, results) => {
//       if (err) {
//         console.error("Error al registrar pregunta:", err);
//         res.status(500).json({ error: 'Error al registrar pregunta' });
//         return;
//       }
//       res.status(201).json({ message: 'Pregunta registrada exitosamente' });
//     });
//   } catch (error) {
//     console.error("Error no controlado:", error);
//     res.status(500).json({ error: 'Error interno del servidor' });
//   }
// });

// Endpoint POST para registrar una nueva pregunta
app.post('/nueva-pregunta', (req, res) => {
  const { texto_pregunta, tipo_pregunta, id_encuesta } = req.body;

  // Validar que se envíen todos los campos
  if (!texto_pregunta || !tipo_pregunta || !id_encuesta) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  // Validar que tipo_pregunta sea uno de los valores permitidos
  const tiposPermitidos = ["opcion_multiple", "parrafo", "texto_corto"];
  if (!tiposPermitidos.includes(tipo_pregunta)) {
    return res.status(400).json({ error: 'Tipo de pregunta no válido' });
  }

  // Llamar a la función para crear la pregunta
  createPregunta(texto_pregunta, tipo_pregunta, id_encuesta, (err, results) => {
    if (err) {
      console.error("Error al registrar pregunta:", err);
      return res.status(500).json({ error: 'Error al registrar pregunta' });
    }
    res.status(201).json({ message: 'Pregunta registrada exitosamente', id_pregunta: results.insertId });
  });
});

// Endpoint PUT para actualizar una pregunta
app.put('/actualizar-pregunta/:id_pregunta', (req, res) => {
  const { id_pregunta } = req.params;
  const { texto_pregunta, tipo_pregunta, id_encuesta } = req.body;
  updatePregunta(id_pregunta, texto_pregunta, tipo_pregunta, id_encuesta, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Pregunta no encontrada' });
      return;
    }
    res.status(200).json({ message: 'Pregunta actualizada exitosamente' });
  });
});

// Endpoint DELETE para eliminar una pregunta
app.delete('/eliminar-pregunta/:id_pregunta', (req, res) => {
  const { id_pregunta } = req.params;
  deletePregunta(id_pregunta, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Pregunta no encontrada' });
      return;
    }
    res.status(200).json({ message: 'Pregunta eliminada exitosamente' });
  });
});


// Endpoint GET para obtener todas las opciones de respuesta
app.get('/opciones-respuesta', (req, res) => {
  const query = 'SELECT * FROM opcionesrespuesta';
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener opciones de respuesta:", err);
      res.status(500).json({ error: 'Error al obtener opciones de respuesta' });
      return;
    }
    res.status(200).json(results);
  });
});

// Endpoint POST para registrar una nueva opción de respuesta
// app.post('/nueva-opcion-respuesta', (req, res) => {
//   const { texto_opcion, id_pregunta } = req.body;
//   createOpcionRespuesta(id_pregunta, texto_opcion, (err, results) => {
//     if (err) {
//       console.error("Error al registrar opción de respuesta:", err);
//       res.status(500).json({ error: 'Error al registrar opción de respuesta' });
//       return;
//     }
//     res.status(201).json({ message: 'Opción de respuesta registrada exitosamente' });
//   });
// });

// Endpoint POST para registrar una nueva opción de respuesta
app.post('/nueva-opcion-respuesta', (req, res) => {
  const { texto_opcion, id_pregunta } = req.body;

  // Validar que se envíen todos los campos
  if (!texto_opcion || !id_pregunta) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  // Llamar a la función para crear la opción de respuesta
  createOpcionRespuesta(id_pregunta, texto_opcion, (err, results) => {
    if (err) {
      console.error("Error al registrar opción de respuesta:", err);
      return res.status(500).json({ error: 'Error al registrar opción de respuesta' });
    }
    res.status(201).json({ message: 'Opción de respuesta registrada exitosamente' });
  });
});

// Endpoint PUT para actualizar una opción de respuesta
app.put('/actualizar-opcion-respuesta/:id_opcion', (req, res) => {
  const { id_opcion } = req.params;
  const { texto_opcion, id_pregunta } = req.body;

  updateOpcionRespuesta(id_opcion, id_pregunta, texto_opcion, (err, results) => {
    if (err) {
      console.error("Error al actualizar opción de respuesta:", err);
      res.status(500).json({ error: 'Error al actualizar opción de respuesta' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Opción de respuesta no encontrada' });
      return;
    }
    res.status(200).json({ message: 'Opción de respuesta actualizada exitosamente' });
  });
});

// Endpoint DELETE para eliminar una opción de respuesta
app.delete('/eliminar-opcion-respuesta/:id_opcion', (req, res) => {
  const { id_opcion } = req.params;

  deleteOpcionRespuesta(id_opcion, (err, results) => {
    if (err) {
      console.error("Error al eliminar opción de respuesta:", err);
      res.status(500).json({ error: 'Error al eliminar opción de respuesta' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Opción de respuesta no encontrada' });
      return;
    }
    res.status(200).json({ message: 'Opción de respuesta eliminada exitosamente' });
  });
});

// Método GET para obtener una encuesta con preguntas y opciones de respuesta
app.get('/encuestas/:id', (req, res) => {
  const encuestaId = req.params.id;

  const query = `
    SELECT 
      e.id_encuesta,
      e.nombre_encuesta,
      e.descripcion,
      p.id_pregunta,
      p.texto_pregunta,
      p.tipo_pregunta,
      o.id_opcion,
      o.texto_opcion
    FROM 
      encuestas e
    LEFT JOIN 
      preguntas p ON e.id_encuesta = p.id_encuesta
    LEFT JOIN 
      opciones_respuesta o ON p.id_pregunta = o.id_pregunta
    WHERE 
      e.id_encuesta = ?
  `;

  db.query(query, [encuestaId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const encuesta = {
      id_encuesta: results[0]?.id_encuesta,
      nombre_encuesta: results[0]?.nombre_encuesta,
      descripcion: results[0]?.descripcion,
      preguntas: []
    };

    // Agrupar preguntas y opciones de respuesta
    results.forEach(row => {
      if (row.id_pregunta) {
        const pregunta = {
          id_pregunta: row.id_pregunta,
          texto_pregunta: row.texto_pregunta,
          tipo_pregunta: row.tipo_pregunta,
          opciones: []
        };

        if (row.id_opcion) {
          pregunta.opciones.push({
            id_opcion: row.id_opcion,
            texto_opcion: row.texto_opcion
          });
        }

        // Verifica si la pregunta ya fue agregada para evitar duplicados
        const existingPregunta = encuesta.preguntas.find(p => p.id_pregunta === row.id_pregunta);
        if (existingPregunta) {
          existingPregunta.opciones.push({
            id_opcion: row.id_opcion,
            texto_opcion: row.texto_opcion
          });
        } else {
          encuesta.preguntas.push(pregunta);
        }
      }
    });

    res.json(encuesta);
  });
});

//categoria
app.get('/encuestas/categoria/:categoriaId', (req, res) => {
  const categoriaId = req.params.categoriaId;

  const query = `
    SELECT 
      e.id_encuesta,
      e.nombre_encuesta,
      e.descripcion,
      c.id_categoria,
      c.nombre_categoria
    FROM 
      encuestas e
    JOIN 
      categorias c ON e.id_categoria = c.id_categoria
    WHERE 
      c.id_categoria = ?
  `;

  db.query(query, [categoriaId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No hay encuestas para esta categoría.' });
    }

    const encuestas = results.map(row => ({
      id_encuesta: row.id_encuesta,
      nombre_encuesta: row.nombre_encuesta,
      descripcion: row.descripcion,
      categoria: {
        id_categoria: row.id_categoria,
        nombre_categoria: row.nombre_categoria
      }
    }));

    res.json(encuestas);
  });
});

// Endpoint GET para obtener todas las respuestas
app.get('/respuestas', (req, res) => {
  const query = 'SELECT * FROM respuestas';
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener respuestas:", err);
      res.status(500).json({ error: "Error al obtener respuestas" });
      return;
    }
    res.status(200).json(results);
  });
});



// Endpoint POST para registrar una nueva respuesta
app.post('/nueva-respuesta', (req, res) => {
  const { id_pregunta, id_opcion, texto_respuesta, idusuario, id_encuesta } = req.body;

  // Validar campos obligatorios
  if (!id_pregunta || !idusuario || !id_encuesta) {
    return res.status(400).json({ error: "Los campos id_pregunta, idusuario e id_encuesta son obligatorios" });
  }

  // Si es una pregunta de opción múltiple, id_opcion es obligatorio
  if (id_opcion === undefined && texto_respuesta === undefined) {
    return res.status(400).json({ error: "Debe proporcionar id_opcion o texto_respuesta" });
  }

  // Llamar a la función createRespuesta para insertar la respuesta
  createRespuesta(id_pregunta, id_opcion, texto_respuesta, idusuario, id_encuesta, (err, results) => {
    if (err) {
      console.error("Error al registrar respuesta:", err);
      return res.status(500).json({ error: "Error al registrar respuesta" });
    }
    res.status(201).json({ message: "Respuesta registrada exitosamente" });
  });
});

// Endpoint PUT para actualizar una respuesta
app.put('/actualizar-respuesta/:id_respuesta', (req, res) => {
  const { id_respuesta } = req.params;
  const { id_pregunta, id_opcion, texto_respuesta, idusuario } = req.body;

  if (!id_pregunta || !id_opcion || !texto_respuesta || !idusuario) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  updateRespuesta(id_respuesta, id_pregunta, id_opcion, texto_respuesta, idusuario, (err, results) => {
    if (err) {
      console.error("Error al actualizar respuesta:", err);
      res.status(500).json({ error: "Error al actualizar respuesta" });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ message: "Respuesta no encontrada" });
      return;
    }
    res.status(200).json({ message: "Respuesta actualizada exitosamente" });
  });
});

// Endpoint DELETE para eliminar una respuesta
app.delete('/eliminar-respuesta/:id_respuesta', (req, res) => {
  const { id_respuesta } = req.params;

  deleteRespuesta(id_respuesta, (err, results) => {
    if (err) {
      console.error("Error al eliminar respuesta:", err);
      res.status(500).json({ error: "Error al eliminar respuesta" });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ message: "Respuesta no encontrada" });
      return;
    }
    res.status(200).json({ message: "Respuesta eliminada exitosamente" });
  });
});




// Endpoint GET para obtener todas las encuestas asignadas
// app.get('/encuestas-asignadas', (req, res) => {
//   const query = 'SELECT * FROM encuestas_asignadas';
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error("Error al obtener encuestas asignadas:", err);
//       res.status(500).json({ error: 'Error al obtener encuestas asignadas' });
//       return;
//     }
//     res.status(200).json(results);
//   });
// });

app.get('/encuestas-asignadas', (req, res) => {

  const { search, filter } = req.query; // Captura el término de búsqueda y el filtro

  let query = `
    SELECT 
      ea.id_asignacion,
      u.nombre,
      e.nombre_encuesta AS encuesta,
      ea.cantidad,
      ea.fecha_creacion,
      ea.estado
    FROM 
      encuestas_asignadas ea
    JOIN 
      users u ON ea.idusuario = u.idusuario
    JOIN 
      encuestas e ON ea.id_encuesta = e.id_encuesta
    WHERE 1=1
  `;

  const queryParams = [];

  if (search && filter) {
    switch (filter) {
      case 'nombre':
        query += ` AND u.nombre LIKE ?`;
        queryParams.push(`%${search}%`);
        break;
      case 'encuesta':
        query += ` AND e.nombre_encuesta LIKE ?`;
        queryParams.push(`%${search}%`);
        break;
      case 'cantidad':
        query += ` AND ea.cantidad = ?`;
        queryParams.push(search);
        break;
      case 'fecha':
        query += ` AND DATE(ea.fecha_creacion) = ?`;
        queryParams.push(search);
        break;
      default:
        break;
    }
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error en la consulta SQL:", err);
      res.status(500).json({ error: err.message });
      return;
    }
    
    res.status(200).json(results);
  });
});

// Endpoint GET para obtener una encuesta asignada por ID
app.get('/encuesta-asignada/:id_asignacion', (req, res) => {
  const { id_asignacion } = req.params;
  const query = 'SELECT * FROM encuestas_asignadas WHERE id_asignacion = ?';
  db.query(query, [id_asignacion], (err, results) => {
    if (err) {
      console.error("Error al obtener encuesta asignada:", err);
      res.status(500).json({ error: 'Error al obtener encuesta asignada' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: 'Encuesta asignada no encontrada' });
      return;
    }
    res.status(200).json(results[0]);
  });
});

app.get('/mis-encuestas/:idusuario', (req, res) => {
  const { idusuario } = req.params;

  const query = `
    SELECT 
      ea.id_asignacion,
      ea.idusuario,
      ea.id_encuesta,
      ea.cantidad,
      ea.fecha_creacion,
      ea.estado,
      e.nombre_encuesta,  -- Nombre de la encuesta
      u.nombre,           -- Nombre del usuario
      (SELECT COUNT(DISTINCT fecha_creacion) 
      FROM respuestas 
      WHERE idusuario = ea.idusuario AND id_encuesta = ea.id_encuesta
      ) AS completadas    -- Veces que el usuario ha completado la encuesta
    FROM 
      encuestas_asignadas ea
    JOIN 
      encuestas e ON ea.id_encuesta = e.id_encuesta
    JOIN 
      users u ON ea.idusuario = u.idusuario
    WHERE 
      ea.idusuario = ?;
  `;

  db.query(query, [idusuario], (err, results) => {
    if (err) {
      console.error("Error al obtener encuestas asignadas:", err);
      res.status(500).json({ error: 'Error al obtener encuestas asignadas' });
      return;
    }
    res.status(200).json(results);
  });
});

// Endpoint POST para asignar una nueva encuesta
app.post('/nueva-encuesta-asignada', (req, res) => {
  const { idusuario, id_encuesta, cantidad } = req.body;

  createEncuestaAsignada(idusuario, id_encuesta, cantidad, (err, results) => {
    if (err) {
      console.error("Error al registrar encuesta asignada:", err);
      res.status(500).json({ error: 'Error al registrar encuesta asignada' });
      return;
    }
    res.status(201).json({ message: 'Encuesta asignada registrada exitosamente' });
  });
});


// Endpoint PUT para actualizar una encuesta asignada
app.put('/actualizar-encuesta-asignada/:id_asignacion', (req, res) => {
  const { id_asignacion } = req.params;
  const { idusuario, id_encuesta, cantidad } = req.body;

  updateEncuestaAsignada(id_asignacion, idusuario, id_encuesta, cantidad, (err, results) => {
    if (err) {
      console.error("Error al actualizar encuesta asignada:", err);
      res.status(500).json({ error: 'Error al actualizar encuesta asignada' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Encuesta asignada no encontrada' });
      return;
    }
    res.status(200).json({ message: 'Encuesta asignada actualizada exitosamente' });
  });
});

app.put('/verificar-completado/:idusuario/:id_encuesta', (req, res) => {
  const { idusuario, id_encuesta } = req.params;

  // Paso 1: Obtener la cantidad de veces que el usuario ha completado la encuesta
  db.query(
    `SELECT COUNT(DISTINCT fecha_creacion) AS veces_completadas
     FROM respuestas 
     WHERE idusuario = ? AND id_encuesta = ?`,
    [idusuario, id_encuesta],
    (error, results) => {
      if (error) {
        console.error('Error al contar las veces completadas:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }

      const vecesCompletadas = results[0].veces_completadas;

      // Paso 2: Obtener la cantidad de veces que el usuario debe completar la encuesta
      db.query(
        `SELECT cantidad 
         FROM encuestas_asignadas 
         WHERE idusuario = ? AND id_encuesta = ?`,
        [idusuario, id_encuesta],
        (error, results) => {
          if (error) {
            console.error('Error al obtener la cantidad permitida:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
          }

          if (results.length === 0) {
            return res.status(404).json({ message: 'Encuesta no encontrada' });
          }

          const cantidadPermitida = results[0].cantidad;

          // Paso 3: Verificar si el usuario ha alcanzado la cantidad permitida
          if (vecesCompletadas >= cantidadPermitida) { // Usar >= para cubrir casos donde el usuario complete más de lo requerido
            // Paso 4: Marcar la encuesta como completada
            db.query(
              `UPDATE encuestas_asignadas 
               SET estado = 'completado' 
               WHERE idusuario = ? AND id_encuesta = ?`,
              [idusuario, id_encuesta],
              (error) => {
                if (error) {
                  console.error('Error al marcar la encuesta como completada:', error);
                  return res.status(500).json({ message: 'Error interno del servidor' });
                }

                return res.status(200).json({ message: 'Encuesta marcada como completada' });
              }
            );
          } else {
            // Si no se ha alcanzado la cantidad permitida, devolver un mensaje de éxito
            return res.status(200).json({ message: 'Verificación completada' });
          }
        }
      );
    }
  );
});


// Endpoint DELETE para eliminar una encuesta asignada
app.delete('/eliminar-encuesta-asignada/:id_asignacion', (req, res) => {
  const { id_asignacion } = req.params;

  deleteEncuestaAsignada(id_asignacion, (err, results) => {
    if (err) {
      console.error("Error al eliminar encuesta asignada:", err);
      res.status(500).json({ error: 'Error al eliminar encuesta asignada' });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ message: 'Encuesta asignada no encontrada' });
      return;
    }
    res.status(200).json({ message: 'Encuesta asignada eliminada exitosamente' });
  });
});



// Inicia el servidor
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Servidor funcionando en el puerto ${port}`);
});