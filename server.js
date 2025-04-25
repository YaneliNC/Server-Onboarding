import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configuración de multer para manejar la subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });

// Endpoint para subir la imagen
app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("Error al subir archivos:", err);
      return res
        .status(500)
        .json({ message: "Error al subir archivos", error: err.message });
    }

    if (!req.files) {
      return res.status(400).json({ message: "No se subieron archivos" });
    }

    const filepaths = {
      foto: req.files["foto"] ? `uploads/${req.files["foto"][0].filename}` : "",
      foto2: req.files["foto2"]
        ? `uploads/${req.files["foto2"][0].filename}`
        : "",
      foto3: req.files["foto3"]
        ? `uploads/${req.files["foto3"][0].filename}`
        : "",
    };

    const filteredFilepaths = Object.fromEntries(
      Object.entries(filepaths).filter(([key, value]) => value !== "")
    );

    res.status(200).json(filteredFilepaths);
  });
});

// Función para convertir base64 a archivo
const base64ToFile = (base64Str, fileName) => {
  try {
    const matches = base64Str.match(
      /^data:image\/([A-Za-z-+\/]+);base64,(.+)$/
    );
    if (!matches || matches.length !== 3) {
      throw new Error("Formato de base64 inválido");
    }

    const fileType = matches[1];
    const fileData = Buffer.from(matches[2], "base64");

    const uniqueId = crypto.randomBytes(16).toString("hex");
    const newFileName = `${fileName}-${uniqueId}${path.extname(fileName)}`;
    const relativePath = path.join("uploads", newFileName);
    const absolutePath = path.join(__dirname, relativePath);

    fs.writeFileSync(absolutePath, fileData, { encoding: "base64" });

    return relativePath;
  } catch (error) {
    console.error("Error al convertir base64 a archivo:", error);
    throw error;
  }
};

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error(
      "Error al conectar con la base de datos:",
      err.code,
      err.message
    );
    return;
  }
  console.log("Conexión exitosa a la base de datos");
});

//! MODELOS

// funciones de modelo de roles
const createRol = async (nomrol, callback) => {
  try {
    const query = "INSERT INTO rol (nomrol) VALUES (?)";
    db.query(query, [nomrol], callback);
  } catch (err) {
    callback(err, null);
  }
};
const updateRol = async (idrol, nomrol, callback) => {
  try {
    const query = "UPDATE rol SET nomrol = ? WHERE idrol = ?";
    db.query(query, [nomrol, idrol], callback);
  } catch (err) {
    callback(err, null);
  }
};
const deleteRol = (idrol, callback) => {
  const query = "DELETE FROM rol WHERE idrol = ?";
  db.query(query, [idrol], callback);
};

// funciones de modelo de permisos

const createPermiso = async (nompermiso, clave, callback) => {
  try {
    const query = "INSERT INTO permiso (nompermiso , clave) VALUES (?,?)";
    db.query(query, [nompermiso, clave], callback);
  } catch (err) {
    callback(err, null);
  }
};
const updatePermiso = async (idpermiso, nompermiso, clave, callback) => {
  try {
    const query =
      "UPDATE permiso SET nompermiso = ?, clave = ? WHERE idpermiso = ?";
    db.query(query, [nompermiso, clave, idpermiso], callback);
  } catch (err) {
    callback(err, null);
  }
};
const deletePermiso = (idpermiso, callback) => {
  const query = "DELETE FROM permiso WHERE idpermiso = ?";
  db.query(query, [idpermiso], callback);
};

// funciones de modelo rolxpermisos
const createRolxPermiso = (idrol, idpermiso, callback) => {
  try {
    const query = "INSERT INTO rolxpermiso (idrol, idpermiso) VALUES (?, ?)";
    db.query(query, [idrol, idpermiso], callback);
  } catch (err) {
    callback(err, null);
  }
};
const updateRolxPermiso = (idrol, idpermiso, callback) => {
  try {
    const query = "UPDATE rolxpermiso SET idpermiso = ? WHERE idrol = ?";
    db.query(query, [idpermiso, idrol], callback);
  } catch (err) {
    callback(err, null);
  }
};
const deleteRolxPermiso = (idrol, idpermiso, callback) => {
  const query = "DELETE FROM rolxpermiso WHERE idrol = ? AND idpermiso = ?";
  db.query(query, [idrol, idpermiso], callback);
};

// Funciones del modelo de usuario
const createUser = async (
  nombre,
  correo,
  contraseña,
  puesto,
  numero_empleado,
  planta,
  turno,
  idrol,
  callback
) => {
  try {
    const query =
      "INSERT INTO users (nombre, correo, contraseña, puesto, numero_empleado, planta, turno, idrol) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(
      query,
      [
        nombre,
        correo,
        contraseña,
        puesto,
        numero_empleado,
        planta,
        turno,
        idrol,
      ],
      callback
    );
  } catch (err) {
    callback(err, null);
  }
};
const createAdmin = async (
  nombre,
  correo,
  contraseña,
  puesto,
  numero_empleado,
  planta,
  turno,
  idrol,
  callback
) => {
  try {
    const query =
      "INSERT INTO users (nombre, correo, contraseña, puesto, numero_empleado, planta, turno, idrol) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(
      query,
      [
        nombre,
        correo,
        contraseña,
        puesto,
        numero_empleado,
        planta,
        turno,
        idrol,
      ],
      callback
    );
  } catch (err) {
    callback(err, null);
  }
};
const updateUser = async (
  idusuario,
  nombre,
  correo,
  contraseña,
  puesto,
  numero_empleado,
  planta,
  turno,
  idrol,
  callback
) => {
  try {
    const query =
      "UPDATE users SET nombre = ?, correo = ?,  contraseña= ?, puesto = ?, numero_empleado = ?, planta = ?, turno = ?, idrol = ? WHERE idusuario = ?";
    db.query(
      query,
      [
        nombre,
        correo,
        contraseña,
        puesto,
        numero_empleado,
        planta,
        turno,
        idrol,
        idusuario,
      ],
      callback
    );
  } catch (err) {
    callback(err, null);
  }
};

const updateUsuario = async (
  idusuario,
  nombre,
  correo,
  contraseña,
  puesto,
  numero_empleado,
  planta,
  turno,
  idrol,
  foto,
  callback
) => {
  try {
    let query;
    let params;

    if (foto) {
      if (contraseña) {
        query =
          "UPDATE users SET nombre = ?, correo = ?, contraseña = ?, puesto = ?, numero_empleado = ?, planta = ?, turno = ?, idrol = ?, foto = ? WHERE idusuario = ?";
        params = [
          nombre,
          correo,
          contraseña,
          puesto,
          numero_empleado,
          planta,
          turno,
          idrol,
          foto,
          idusuario,
        ];
      } else {
        query =
          "UPDATE users SET nombre = ?, correo = ?, puesto = ?, numero_empleado = ?, planta = ?, turno = ?, idrol = ?, foto = ? WHERE idusuario = ?";
        params = [
          nombre,
          correo,
          puesto,
          numero_empleado,
          planta,
          turno,
          idrol,
          foto,
          idusuario,
        ];
      }
    } else {
      if (contraseña) {
        query =
          "UPDATE users SET nombre = ?, correo = ?, contraseña = ?, puesto = ?, numero_empleado = ?, planta = ?, turno = ?, idrol = ? WHERE idusuario = ?";
        params = [
          nombre,
          correo,
          contraseña,
          puesto,
          numero_empleado,
          planta,
          turno,
          idrol,
          idusuario,
        ];
      } else {
        query =
          "UPDATE users SET nombre = ?, correo = ?, puesto = ?, numero_empleado = ?, planta = ?, turno = ?, idrol = ? WHERE idusuario = ?";
        params = [
          nombre,
          correo,
          puesto,
          numero_empleado,
          planta,
          turno,
          idrol,
          idusuario,
        ];
      }
    }

    db.query(query, params, callback);
  } catch (err) {
    callback(err, null);
  }
};

const deleteUser = (idusuario, callback) => {
  const query = "DELETE FROM users WHERE idusuario = ?";
  db.query(query, [idusuario], callback);
};

// Modelo para la tabla categorias
const createCategoria = async (nombre_categoria, callback) => {
  try {
    const query = "INSERT INTO categorias (nombre_categoria) VALUES (?)";
    db.query(query, [nombre_categoria], callback);
  } catch (err) {
    callback(err, null);
  }
};

const updateCategoria = async (id_categoria, nombre_categoria, callback) => {
  try {
    const query =
      "UPDATE categorias SET nombre_categoria = ? WHERE id_categoria = ?";
    db.query(query, [nombre_categoria, id_categoria], callback);
  } catch (err) {
    callback(err, null);
  }
};

const deleteCategoria = (id_categoria, callback) => {
  const query = "DELETE FROM categorias WHERE id_categoria = ?";
  db.query(query, [id_categoria], callback);
};

// Modelo para la tabla encuestas
const createEncuesta = async (
  nombre_encuesta,
  descripcion,
  id_categoria,
  idusuario,
  callback
) => {
  try {
    const query =
      "INSERT INTO encuestas (nombre_encuesta, descripcion, id_categoria, idusuario) VALUES (?, ?, ?, ?)";
    db.query(
      query,
      [nombre_encuesta, descripcion, id_categoria, idusuario],
      callback
    );
  } catch (err) {
    callback(err, null);
  }
};

const updateEncuesta = async (
  id_encuesta,
  nombre_encuesta,
  descripcion,
  id_categoria,
  idusuario,
  callback
) => {
  try {
    const query =
      "UPDATE encuestas SET nombre_encuesta = ?, descripcion = ?, id_categoria = ?, idusuario = ? WHERE id_encuesta = ?";
    db.query(
      query,
      [nombre_encuesta, descripcion, id_categoria, idusuario, id_encuesta],
      callback
    );
  } catch (err) {
    callback(err, null);
  }
};

const deleteEncuesta = (id_encuesta, callback) => {
  const query = "DELETE FROM encuestas WHERE id_encuesta = ?";
  db.query(query, [id_encuesta], callback);
};

// Modelo para la tabla preguntas
const createPregunta = (
  texto_pregunta,
  tipo_pregunta,
  id_encuesta,
  callback
) => {
  const query =
    "INSERT INTO preguntas (texto_pregunta, tipo_pregunta, id_encuesta) VALUES (?, ?, ?)";
  db.query(
    query,
    [texto_pregunta, tipo_pregunta, id_encuesta],
    (err, results) => {
      if (err) {
        console.error("Error en la consulta SQL:", err);
        return callback(err, null);
      }
      callback(null, results);
    }
  );
};

const updatePregunta = async (
  id_pregunta,
  texto_pregunta,
  tipo_pregunta,
  id_encuesta,
  callback
) => {
  try {
    const query =
      "UPDATE preguntas SET texto_pregunta = ?, tipo_pregunta = ?, id_encuesta = ? WHERE id_pregunta = ?";
    db.query(
      query,
      [texto_pregunta, tipo_pregunta, id_encuesta, id_pregunta],
      callback
    );
  } catch (err) {
    callback(err, null);
  }
};

const deletePregunta = (id_pregunta, callback) => {
  const query = "DELETE FROM preguntas WHERE id_pregunta = ?";
  db.query(query, [id_pregunta], callback);
};

// Modelo para la tabla opciones_respuesta
const createOpcionRespuesta = async (id_pregunta, texto_opcion, callback) => {
  try {
    const query =
      "INSERT INTO opciones_respuesta (id_pregunta, texto_opcion) VALUES (?, ?)";
    db.query(query, [id_pregunta, texto_opcion], callback);
  } catch (err) {
    callback(err, null);
  }
};

const updateOpcionRespuesta = async (
  id_opcion,
  id_pregunta,
  texto_opcion,
  callback
) => {
  try {
    const query =
      "UPDATE opciones_respuesta SET id_pregunta = ?, texto_opcion = ? WHERE id_opcion = ?";
    db.query(query, [id_pregunta, texto_opcion, id_opcion], callback);
  } catch (err) {
    callback(err, null);
  }
};

const deleteOpcionRespuesta = (id_opcion, callback) => {
  const query = "DELETE FROM opciones_respuesta WHERE id_opcion = ?";
  db.query(query, [id_opcion], callback);
};

// Modelo para la tabla respuestas
const createRespuesta = async (
  id_pregunta,
  id_opcion,
  texto_respuesta,
  idusuario,
  id_encuesta,
  id_asignacion,
  callback
) => {
  try {
    const query = `
      INSERT INTO respuestas 
        (id_pregunta, id_opcion, texto_respuesta, idusuario, id_encuesta, id_asignacion) 
      VALUES 
        (?, ?, ?, ?, ?, ?)
    `;
    db.query(
      query,
      [
        id_pregunta,
        id_opcion,
        texto_respuesta,
        idusuario,
        id_encuesta,
        id_asignacion,
      ],
      callback
    );
  } catch (err) {
    callback(err, null);
  }
};
const updateRespuesta = async (
  id_respuesta,
  id_pregunta,
  id_opcion,
  texto_respuesta,
  idusuario,
  id_encuesta,
  callback
) => {
  try {
    const query =
      "UPDATE respuestas SET id_pregunta = ?, id_opcion = ?, texto_respuesta = ?, idusuario = ?, id_encuesta = ? WHERE id_respuesta = ?";
    db.query(
      query,
      [
        id_pregunta,
        id_opcion,
        texto_respuesta,
        idusuario,
        id_encuesta,
        id_respuesta,
      ],
      callback
    );
  } catch (err) {
    callback(err, null);
  }
};

const deleteRespuesta = (id_respuesta, callback) => {
  const query = "DELETE FROM respuestas WHERE id_respuesta = ?";
  db.query(query, [id_respuesta], callback);
};

// Modelo para la tabla encuestas_asignadas
const createEncuestaAsignada = (idusuario, id_encuesta, cantidad, callback) => {
  const query =
    "INSERT INTO encuestas_asignadas (idusuario, id_encuesta, cantidad) VALUES (?, ?, ?)";

  db.query(query, [idusuario, id_encuesta, cantidad], (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }

    // Devuelve el id_asignacion generado
    const id_asignacion = results.insertId;
    callback(null, id_asignacion);
  });
};

const updateEncuestaAsignada = async (
  id_asignacion,
  idusuario,
  id_encuesta,
  cantidad,
  callback
) => {
  try {
    const query =
      "UPDATE encuestas_asignadas SET idusuario = ?, id_encuesta = ?, cantidad = ? WHERE id_asignacion = ?";
    db.query(
      query,
      [idusuario, id_encuesta, cantidad, id_asignacion],
      callback
    );
  } catch (err) {
    callback(err, null);
  }
};

const deleteEncuestaAsignada = (id_asignacion, callback) => {
  const query = "DELETE FROM encuestas_asignadas WHERE id_asignacion = ?";
  db.query(query, [id_asignacion], callback);
};

//!LOGIN & authenticateUser

// Función para autenticar usuario
const authenticateUser = (correo, contraseña, callback) => {
  const query = "SELECT * FROM users WHERE correo = ?";
  db.query(query, [correo], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    if (results.length === 0) {
      return callback(new Error("Usuario no encontrado"), null);
    }

    const user = results[0];
    // Comparar directamente la contraseña (sin encriptación)
    if (contraseña !== user.contraseña) {
      return callback(new Error("Contraseña incorrecta"), null);
    }

    // Generar remember_token
    const remember_token = crypto.randomBytes(16).toString("hex");
    const updateTokenQuery =
      "UPDATE users SET remember_token = ? WHERE correo = ?";
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
app.post("/login", (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res
      .status(400)
      .json({ message: "Correo y contraseña son obligatorios" });
  }

  authenticateUser(correo, contraseña, (err, user) => {
    if (err) {
      res.status(401).json({ message: err.message });
      return;
    }
    res.status(200).json({
      message: "Login exitoso",
      user,
      remember_token: user.remember_token,
    });
  });
});

// Endpoint POST para logout
app.post("/logout", (req, res) => {
  const { remember_token } = req.body;

  if (!remember_token) {
    return res
      .status(400)
      .json({ message: "El token es obligatorio para cerrar sesión" });
  }

  const query =
    "UPDATE users SET remember_token = NULL WHERE remember_token = ?";
  db.query(query, [remember_token], (err) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(200).json({ message: "Logout exitoso" });
  });
});

// Endpoint para verificar el token
app.post("/auth/check-token", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "El token es obligatorio" });
  }

  const query = "SELECT * FROM users WHERE remember_token = ?";
  db.query(query, [token], (err, results) => {
    if (err || results.length === 0) {
      res.status(401).json({ message: "Token inválido" });
      return;
    }
    res.status(200).json({ user: results[0] });
  });
});

//! METODOS

// Endpoint GET para obtener todos los roles
app.get("/roles", (req, res) => {
  const query = "SELECT * FROM rol";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(200).json(results);
  });
});

app.get("/roles/:idrol", (req, res) => {
  const { idrol } = req.params; // Cambiado de "id" a "idrol"
  const query = "SELECT * FROM rol WHERE idrol = ?";

  db.query(query, [idrol], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: "Rol no encontrado" });
      return;
    }
    res.status(200).json(results[0]); // Envía el primer resultado como objeto
  });
});

// Endpoint POST para registrar un rol
app.post("/nuevo-rol", async (req, res) => {
  const { nomrol } = req.body;
  createRol(nomrol, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(201).json({ message: "Rol agregado exitosamente" });
  });
});

// Endpoint PUT para actualizar un rol
app.put("/actualizar-rol/:idrol", async (req, res) => {
  const { idrol } = req.params;
  const { nomrol } = req.body;
  updateRol(idrol, nomrol, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ message: "Rol no encontrado" });
      return;
    }
    res.status(200).json({ message: "Rol actualizado exitosamente" });
  });
});

// Endpoint DELETE para eliminar un rol
app.delete("/eliminar-rol/:idrol", (req, res) => {
  const { idrol } = req.params;
  deleteRol(idrol, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ message: "Rol no encontrado" });
      return;
    }
    res.status(200).json({ message: "Rol eliminado exitosamente" });
  });
});

//! BUSCAR rol
app.get("/buscar-rol", (req, res) => {
  let query = `
    SELECT * 
    FROM rol
    WHERE 1=1
  `;
  const queryParams = [];
  const campos = ["nomrol", "idrol"];
  if (req.query.termino) {
    const termino = `%${req.query.termino}%`;
    query += ` AND (${campos.map((campo) => `${campo} LIKE ?`).join(" OR ")})`;
    campos.forEach(() => queryParams.push(termino));
  } else {
    campos.forEach((campo) => {
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
app.get("/buscar-permiso", (req, res) => {
  let query = `
    SELECT * 
    FROM permiso
    WHERE 1=1
  `;
  const queryParams = [];
  const campos = ["nompermiso", "idpermiso", "clave"];
  if (req.query.termino) {
    const termino = `%${req.query.termino}%`;
    query += ` AND (${campos.map((campo) => `${campo} LIKE ?`).join(" OR ")})`;
    campos.forEach(() => queryParams.push(termino));
  } else {
    campos.forEach((campo) => {
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
app.get("/permisos", (req, res) => {
  const query = "SELECT * FROM permiso";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(200).json(results);
  });
});

// buscar permiso por ID
app.get("/permisos/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM permiso WHERE idpermiso = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: "Permiso no encontrado" });
      return;
    }
    res.status(200).json(results[0]);
  });
});

// Endpoint POST para registrar un permiso
app.post("/nuevo-permiso", async (req, res) => {
  const { nompermiso, clave } = req.body;
  createPermiso(nompermiso, clave, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(201).json({ message: "Permiso registrado exitosamente" });
  });
});

// Endpoint PUT para actualizar un permiso
app.put("/actualizar-permiso/:idpermiso", async (req, res) => {
  const { idpermiso } = req.params;
  const { nompermiso, clave } = req.body;
  updatePermiso(idpermiso, nompermiso, clave, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ message: "Permiso no encontrado" });
      return;
    }
    res.status(200).json({ message: "Permiso actualizado exitosamente" });
  });
});

// Endpoint DELETE para eliminar un permiso
app.delete("/eliminar-permiso/:idpermiso", (req, res) => {
  const { idpermiso } = req.params;
  deletePermiso(idpermiso, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ message: "Permiso no encontrado" });
      return;
    }
    res.status(200).json({ message: "Permiso eliminado exitosamente" });
  });
});

// Endpoint GET para obtener todas las relaciones rol-permiso
app.get("/rolxpermiso", (req, res) => {
  const query = "SELECT * FROM rolxpermiso";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(200).json(results);
  });
});

app.get("/rolxpermiso/:idrol", (req, res) => {
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

app.post("/agregar-rolxpermiso", async (req, res) => {
  const { idrol, idpermiso } = req.body;

  // Verificar que el rol exista
  const roleQuery = "SELECT * FROM rol WHERE idrol = ?";
  db.query(roleQuery, [idrol], (roleErr, roleResults) => {
    if (roleErr) {
      res.status(500).send(roleErr);
      return;
    }
    if (roleResults.length === 0) {
      res.status(404).json({ message: "Rol no encontrado" });
      return;
    }

    // Verificar que el permiso exista
    const permisoQuery = "SELECT * FROM permiso WHERE idpermiso = ?";
    db.query(permisoQuery, [idpermiso], (permisoErr, permisoResults) => {
      if (permisoErr) {
        res.status(500).send(permisoErr);
        return;
      }
      if (permisoResults.length === 0) {
        res.status(404).json({ message: "Permiso no encontrado" });
        return;
      }

      // Crear la relación rol-permiso
      createRolxPermiso(idrol, idpermiso, (createErr, createResults) => {
        if (createErr) {
          res.status(500).send(createErr);
          return;
        }
        res
          .status(201)
          .json({ message: "Relación rol-permiso agregada exitosamente" });
      });
    });
  });
});

// Endpoint para actualizar el permiso de un rol específico
app.put("/actualizar-rolxpermiso/:idrol", (req, res) => {
  const { idrol } = req.params;
  const { idpermiso } = req.body;

  if (typeof idpermiso !== "number") {
    res.status(400).json({ message: "idpermiso debe ser un número válido" });
    return;
  }

  updateRolxPermiso(idrol, idpermiso, (updateErr, updateResults) => {
    if (updateErr) {
      res.status(500).send(updateErr);
      return;
    }
    if (updateResults.affectedRows === 0) {
      res.status(404).json({ message: "Relación rol-permiso no encontrada" });
      return;
    }
    res
      .status(200)
      .json({ message: "Permiso del rol actualizado exitosamente" });
  });
});

//endpoint Delete para eliminar una relacion rolxpermimso

app.delete("/eliminar-rolxpermiso", async (req, res) => {
  const { idrol, idpermiso } = req.body;

  deleteRolxPermiso(idrol, idpermiso, (deleteErr, deleteResults) => {
    if (deleteErr) {
      res.status(500).send(deleteErr);
      return;
    }
    if (deleteResults.affectedRows === 0) {
      res.status(404).json({ message: "Relación rol-permiso no encontrada" });
      return;
    }
    res
      .status(200)
      .json({ message: "Relación rol-permiso eliminada exitosamente" });
  });
});

// Endpoint GET para obtener todos los usuarios
app.get("/usuarios", (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(200).json(results);
  });
});

// Endpoint POST para registrar un usuario
app.post("/nuevo-usuario", async (req, res) => {
  const {
    nombre,
    correo,
    contraseña,
    puesto,
    numero_empleado,
    planta,
    turno,
    idrol,
  } = req.body;
  createUser(
    nombre,
    correo,
    contraseña,
    puesto,
    numero_empleado,
    planta,
    turno,
    idrol,
    (err, results) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.status(201).json({ message: "Usuario registrado exitosamente" });
    }
  );
});

// Endpoint POST para registrar un administrador
app.post("/nuevo-admin", async (req, res) => {
  const { nombre, correo, contraseña, puesto, numero_empleado, planta, turno } =
    req.body;
  const idrol = 1; // ID de rol para administrador

  try {
    createAdmin(
      nombre,
      correo,
      contraseña,
      puesto,
      numero_empleado,
      planta,
      turno,
      idrol,
      (err, results) => {
        if (err) {
          console.error("Error al registrar admin:", err); // Log para errores
          res.status(500).json({ error: "Error al registrar admin" });
          return;
        }
        res.status(201).json({ message: "Admin registrado exitosamente" });
      }
    );
  } catch (error) {
    console.error("Error no controlado:", error); // Log para errores inesperados
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Endpoint PUT para actualizar un usuario
app.put("/actualizar-usuario/:idusuario", async (req, res) => {
  const { idusuario } = req.params;
  const {
    nombre,
    correo,
    contraseña,
    puesto,
    numero_empleado,
    planta,
    turno,
    idrol,
  } = req.body;
  updateUser(
    idusuario,
    nombre,
    correo,
    contraseña,
    puesto,
    numero_empleado,
    planta,
    turno,
    idrol,
    (err, results) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }
      res.status(200).json({ message: "Usuario actualizado exitosamente" });
    }
  );
});

app.put(
  "/actualizar-perfil/:idusuario",
  upload.single("foto"),
  async (req, res) => {
    const { idusuario } = req.params;
    const {
      nombre,
      correo,
      contraseña,
      puesto,
      numero_empleado,
      planta,
      turno,
      idrol,
    } = req.body;

    // Obtener solo el nombre del archivo sin la carpeta "uploads"
    const foto = req.file ? path.basename(req.file.path) : null;

    console.log("Datos recibidos:", {
      idusuario,
      nombre,
      correo,
      contraseña,
      puesto,
      numero_empleado,
      planta,
      turno,
      idrol,
      foto,
    });

    updateUsuario(
      idusuario,
      nombre,
      correo,
      contraseña,
      puesto,
      numero_empleado,
      planta,
      turno,
      idrol,
      foto,
      (err, results) => {
        if (err) {
          console.error("Error en la consulta SQL:", err);
          return res
            .status(500)
            .json({ message: "Error en la base de datos", error: err.message });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json({ message: "Usuario actualizado exitosamente" });
      }
    );
  }
);

// Endpoint DELETE para eliminar un usuario
app.delete("/eliminar-usuario/:idusuario", (req, res) => {
  const { idusuario } = req.params;
  deleteUser(idusuario, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }
    res.status(200).json({ message: "Usuario eliminado exitosamente" });
  });
});

// Endpoint GET para obtener un usuario por ID
app.get("/perfil-usuario/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM users WHERE idusuario = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }
    res.status(200).json(results[0]);
  });
});

app.get("/usuarios/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM users WHERE idusuario = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }
    res.status(200).json(results[0]);
  });
});

//! BUSCAR USUARIO
app.get("/buscar-usuarios", (req, res) => {
  let query = `
    SELECT users.*, rol.nomrol 
    FROM users 
    LEFT JOIN rol ON users.idrol = rol.idrol 
    WHERE 1=1
  `;
  const queryParams = [];

  const campos = [
    "nombre",
    "puesto",
    "correo",
    "numero_empleado",
    "planta",
    "turno",
    "users.idrol",
  ];

  if (req.query.termino) {
    const termino = `%${req.query.termino}%`;
    query += ` AND (${campos.map((campo) => `${campo} LIKE ?`).join(" OR ")})`;
    campos.forEach(() => queryParams.push(termino));
  } else {
    campos.forEach((campo) => {
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
app.get("/categorias", (req, res) => {
  db.query("SELECT * FROM categorias", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});

app.get("/categoria/:id", (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT * FROM categorias WHERE id_categoria = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(404).json({ message: "Categoría no encontrada" });
      res.status(200).json(results[0]);
    }
  );
});

app.post("/categoria", (req, res) => {
  const { nombre_categoria } = req.body;
  if (!nombre_categoria)
    return res
      .status(400)
      .json({ message: "El nombre de la categoría es requerido" });

  createCategoria(nombre_categoria, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Categoría creada", id: results.insertId });
  });
});

app.put("/categoria/:id", (req, res) => {
  const { id } = req.params;
  const { nombre_categoria } = req.body;
  if (!nombre_categoria)
    return res
      .status(400)
      .json({ message: "El nombre de la categoría es requerido" });

  updateCategoria(id, nombre_categoria, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0)
      return res.status(404).json({ message: "Categoría no encontrada" });
    res.status(200).json({ message: "Categoría actualizada" });
  });
});

app.delete("/categoria/:id", (req, res) => {
  const { id } = req.params;
  deleteCategoria(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0)
      return res.status(404).json({ message: "Categoría no encontrada" });
    res.status(200).json({ message: "Categoría eliminada" });
  });
});

app.get("/buscar-categoria", (req, res) => {
  let query = "SELECT * FROM categorias WHERE 1=1";
  const queryParams = [];
  const campos = ["nombre_categoria", "id_categoria"];

  if (req.query.termino) {
    const termino = `%${req.query.termino}%`;
    query += ` AND (${campos.map((campo) => `${campo} LIKE ?`).join(" OR ")})`;
    campos.forEach(() => queryParams.push(termino));
  } else {
    campos.forEach((campo) => {
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
app.get("/encuestas", (req, res) => {
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
app.get("/buscar-encuestas", (req, res) => {
  let query = `
    SELECT encuestas.*, categorias.nombre_categoria AS categoria, users.nombre AS usuario 
    FROM encuestas 
    LEFT JOIN categorias ON encuestas.id_categoria = categorias.id_categoria
    LEFT JOIN users ON encuestas.idusuario = users.idusuario
    WHERE 1=1
  `;
  const queryParams = [];
  const campos = [
    "nombre_encuesta",
    "descripcion",
    "encuestas.id_categoria",
    "encuestas.idusuario",
  ];

  if (req.query.termino) {
    const termino = `%${req.query.termino}%`;
    query += ` AND (${campos.map((campo) => `${campo} LIKE ?`).join(" OR ")})`;
    campos.forEach(() => queryParams.push(termino));
  } else {
    campos.forEach((campo) => {
      if (req.query[campo]) {
        query += ` AND ${campo} LIKE ?`;
        queryParams.push(`%${req.query[campo]}%`);
      }
    });
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error al buscar encuestas:", err);
      return res.status(500).json({ error: "Error al buscar encuestas" });
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
app.post("/nueva-encuesta", (req, res) => {
  const { nombre_encuesta, descripcion, id_categoria, idusuario } = req.body;

  // Validar que se envíen todos los campos
  if (!nombre_encuesta || !descripcion || !id_categoria || !idusuario) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  // Llamar a la función para crear la encuesta
  createEncuesta(
    nombre_encuesta,
    descripcion,
    id_categoria,
    idusuario,
    (err, results) => {
      if (err) {
        console.error("Error al registrar una encuesta:", err);
        return res
          .status(500)
          .json({ error: "Error al registrar una encuesta" });
      }
      res.status(201).json({
        message: "Encuesta registrada exitosamente",
        id_encuesta: results.insertId,
      });
    }
  );
});

// Endpoint PUT para actualizar una encuesta
app.put("/actualizar-encuesta/:id_encuesta", (req, res) => {
  const { id_encuesta } = req.params;
  const { nombre_encuesta, descripcion, id_categoria, id_usuario } = req.body;

  // Validar que se envíen todos los campos
  if (!nombre_encuesta || !descripcion || !id_categoria || !id_usuario) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  updateEncuesta(
    id_encuesta,
    nombre_encuesta,
    descripcion,
    id_categoria,
    id_usuario,
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ message: "Encuesta no encontrada" });
        return;
      }
      res.status(200).json({ message: "Encuesta actualizada exitosamente" });
    }
  );
});

// Endpoint DELETE para eliminar una encuesta
app.delete("/eliminar-encuesta/:id_encuesta", (req, res) => {
  const { id_encuesta } = req.params;
  deleteEncuesta(id_encuesta, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ message: "Encuesta no encontrada" });
      return;
    }
    res.status(200).json({ message: "Encuesta eliminada exitosamente" });
  });
});

// Endpoint GET para obtener todas las preguntas
app.get("/preguntas", (req, res) => {
  const query = "SELECT * FROM preguntas";
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
app.post("/nueva-pregunta", (req, res) => {
  const { texto_pregunta, tipo_pregunta, id_encuesta } = req.body;

  // Validar que se envíen todos los campos
  if (!texto_pregunta || !tipo_pregunta || !id_encuesta) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  // Validar que tipo_pregunta sea uno de los valores permitidos
  const tiposPermitidos = ["opcion_multiple", "parrafo", "texto_corto"];
  if (!tiposPermitidos.includes(tipo_pregunta)) {
    return res.status(400).json({ error: "Tipo de pregunta no válido" });
  }

  // Llamar a la función para crear la pregunta
  createPregunta(texto_pregunta, tipo_pregunta, id_encuesta, (err, results) => {
    if (err) {
      console.error("Error al registrar pregunta:", err);
      return res.status(500).json({ error: "Error al registrar pregunta" });
    }
    res.status(201).json({
      message: "Pregunta registrada exitosamente",
      id_pregunta: results.insertId,
    });
  });
});

// Endpoint PUT para actualizar una pregunta
app.put("/actualizar-pregunta/:id_pregunta", (req, res) => {
  const { id_pregunta } = req.params;
  const { texto_pregunta, tipo_pregunta, id_encuesta } = req.body;
  updatePregunta(
    id_pregunta,
    texto_pregunta,
    tipo_pregunta,
    id_encuesta,
    (err, results) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ message: "Pregunta no encontrada" });
        return;
      }
      res.status(200).json({ message: "Pregunta actualizada exitosamente" });
    }
  );
});

// Endpoint DELETE para eliminar una pregunta
app.delete("/eliminar-pregunta/:id_pregunta", (req, res) => {
  const { id_pregunta } = req.params;
  deletePregunta(id_pregunta, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ message: "Pregunta no encontrada" });
      return;
    }
    res.status(200).json({ message: "Pregunta eliminada exitosamente" });
  });
});

// Endpoint GET para obtener todas las opciones de respuesta
app.get("/opciones-respuesta", (req, res) => {
  const query = "SELECT * FROM opcionesrespuesta";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener opciones de respuesta:", err);
      res.status(500).json({ error: "Error al obtener opciones de respuesta" });
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
app.post("/nueva-opcion-respuesta", (req, res) => {
  const { texto_opcion, id_pregunta } = req.body;

  // Validar que se envíen todos los campos
  if (!texto_opcion || !id_pregunta) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  // Llamar a la función para crear la opción de respuesta
  createOpcionRespuesta(id_pregunta, texto_opcion, (err, results) => {
    if (err) {
      console.error("Error al registrar opción de respuesta:", err);
      return res
        .status(500)
        .json({ error: "Error al registrar opción de respuesta" });
    }
    res
      .status(201)
      .json({ message: "Opción de respuesta registrada exitosamente" });
  });
});

// Endpoint PUT para actualizar una opción de respuesta
app.put("/actualizar-opcion-respuesta/:id_opcion", (req, res) => {
  const { id_opcion } = req.params;
  const { texto_opcion, id_pregunta } = req.body;

  updateOpcionRespuesta(
    id_opcion,
    id_pregunta,
    texto_opcion,
    (err, results) => {
      if (err) {
        console.error("Error al actualizar opción de respuesta:", err);
        res
          .status(500)
          .json({ error: "Error al actualizar opción de respuesta" });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ message: "Opción de respuesta no encontrada" });
        return;
      }
      res
        .status(200)
        .json({ message: "Opción de respuesta actualizada exitosamente" });
    }
  );
});

// Endpoint DELETE para eliminar una opción de respuesta
app.delete("/eliminar-opcion-respuesta/:id_opcion", (req, res) => {
  const { id_opcion } = req.params;

  deleteOpcionRespuesta(id_opcion, (err, results) => {
    if (err) {
      console.error("Error al eliminar opción de respuesta:", err);
      res.status(500).json({ error: "Error al eliminar opción de respuesta" });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ message: "Opción de respuesta no encontrada" });
      return;
    }
    res
      .status(200)
      .json({ message: "Opción de respuesta eliminada exitosamente" });
  });
});

// Método GET para obtener una encuesta con preguntas y opciones de respuesta
app.get("/encuestas/:id", (req, res) => {
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
      preguntas: [],
    };

    // Agrupar preguntas y opciones de respuesta
    results.forEach((row) => {
      if (row.id_pregunta) {
        const pregunta = {
          id_pregunta: row.id_pregunta,
          texto_pregunta: row.texto_pregunta,
          tipo_pregunta: row.tipo_pregunta,
          opciones: [],
        };

        if (row.id_opcion) {
          pregunta.opciones.push({
            id_opcion: row.id_opcion,
            texto_opcion: row.texto_opcion,
          });
        }

        // Verifica si la pregunta ya fue agregada para evitar duplicados
        const existingPregunta = encuesta.preguntas.find(
          (p) => p.id_pregunta === row.id_pregunta
        );
        if (existingPregunta) {
          existingPregunta.opciones.push({
            id_opcion: row.id_opcion,
            texto_opcion: row.texto_opcion,
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
app.get("/encuestas/categoria/:categoriaId", (req, res) => {
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
      return res
        .status(404)
        .json({ message: "No hay encuestas para esta categoría." });
    }

    const encuestas = results.map((row) => ({
      id_encuesta: row.id_encuesta,
      nombre_encuesta: row.nombre_encuesta,
      descripcion: row.descripcion,
      categoria: {
        id_categoria: row.id_categoria,
        nombre_categoria: row.nombre_categoria,
      },
    }));

    res.json(encuestas);
  });
});

// Endpoint GET para obtener todas las respuestas
app.get("/respuestas", (req, res) => {
  const query = "SELECT * FROM respuestas";
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
app.post("/nueva-respuesta", (req, res) => {
  const {
    id_pregunta,
    id_opcion,
    texto_respuesta,
    idusuario,
    id_encuesta,
    id_asignacion,
  } = req.body;

  // Validar campos obligatorios
  if (!id_pregunta || !idusuario || !id_encuesta || !id_asignacion) {
    return res.status(400).json({
      error:
        "Los campos id_pregunta, idusuario, id_encuesta e id_asignacion son obligatorios",
    });
  }

  // Si es una pregunta de opción múltiple, id_opcion es obligatorio
  if (id_opcion === undefined && texto_respuesta === undefined) {
    return res
      .status(400)
      .json({ error: "Debe proporcionar id_opcion o texto_respuesta" });
  }

  // Llamar a la función createRespuesta para insertar la respuesta
  createRespuesta(
    id_pregunta,
    id_opcion,
    texto_respuesta,
    idusuario,
    id_encuesta,
    id_asignacion,
    (err, results) => {
      if (err) {
        console.error("Error al registrar respuesta:", err);
        return res.status(500).json({ error: "Error al registrar respuesta" });
      }
      res.status(201).json({ message: "Respuesta registrada exitosamente" });
    }
  );
});

// Endpoint PUT para actualizar una respuesta
app.put("/actualizar-respuesta/:id_respuesta", (req, res) => {
  const { id_respuesta } = req.params;
  const { id_pregunta, id_opcion, texto_respuesta, idusuario } = req.body;

  if (!id_pregunta || !id_opcion || !texto_respuesta || !idusuario) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  updateRespuesta(
    id_respuesta,
    id_pregunta,
    id_opcion,
    texto_respuesta,
    idusuario,
    (err, results) => {
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
    }
  );
});

// Endpoint DELETE para eliminar una respuesta
app.delete("/eliminar-respuesta/:id_respuesta", (req, res) => {
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

app.get("/encuestas-asignadas", (req, res) => {
  const { search, filter } = req.query; // Captura el término de búsqueda y el filtro

  let query = `
    SELECT 
      ea.id_asignacion,
      u.nombre,
      e.nombre_encuesta AS encuesta,
      ea.cantidad,
      DATE(ea.fecha_creacion) AS fecha_creacion, -- Formatear solo la fecha en la consulta SQL
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
      case "nombre":
        query += ` AND u.nombre LIKE ?`;
        queryParams.push(`%${search}%`);
        break;
      case "encuesta":
        query += ` AND e.nombre_encuesta LIKE ?`;
        queryParams.push(`%${search}%`);
        break;
      case "cantidad":
        query += ` AND ea.cantidad = ?`;
        queryParams.push(search);
        break;
      case "fecha":
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

// // Endpoint GET para obtener una encuesta asignada por ID
app.get("/encuesta-asignada/:id_asignacion", (req, res) => {
  const { id_asignacion } = req.params;
  const query = "SELECT * FROM encuestas_asignadas WHERE id_asignacion = ?";

  db.query(query, [id_asignacion], (err, results) => {
    if (err) {
      console.error("Error al obtener encuesta asignada:", err);
      res.status(500).json({ error: "Error al obtener encuesta asignada" });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: "Encuesta asignada no encontrada" });
      return;
    }

    // Formatear la fecha (manteniendo solo 'YYYY-MM-DD')
    const encuesta = results[0];
    if (encuesta.fecha_creacion) {
      encuesta.fecha_creacion = new Date(encuesta.fecha_creacion)
        .toISOString()
        .split("T")[0];
    }

    res.status(200).json(encuesta);
  });
});

app.get("/mis-encuestas/:idusuario", (req, res) => {
  const { idusuario } = req.params;

  const query = `
    SELECT 
      ea.id_asignacion, 
      ea.idusuario, 
      ea.id_encuesta, 
      ea.cantidad, 
      ea.fecha_creacion,
      ea.estado AS estado_original,
      e.nombre_encuesta, 
      u.nombre,
      -- Verificamos si todas las repeticiones están completas (11×10 respuestas)
      CASE 
        WHEN (
          SELECT COUNT(*) 
          FROM respuestas r 
          WHERE r.id_asignacion = ea.id_asignacion
          AND r.idusuario = ea.idusuario
        ) >= (ea.cantidad * (SELECT COUNT(*) FROM preguntas p WHERE p.id_encuesta = ea.id_encuesta))
        THEN 'completado' 
        ELSE 'pendiente' 
      END AS estado_calculado,
      -- Calculamos cuántas repeticiones completó (cada una con sus 10 preguntas)
      LEAST(
        FLOOR(
          (SELECT COUNT(*) 
           FROM respuestas r 
           WHERE r.id_asignacion = ea.id_asignacion
           AND r.idusuario = ea.idusuario) / 
          (SELECT COUNT(*) FROM preguntas p WHERE p.id_encuesta = ea.id_encuesta)
        ),
        ea.cantidad
      ) AS repeticiones_completadas
    FROM encuestas_asignadas ea
    JOIN encuestas e ON ea.id_encuesta = e.id_encuesta
    JOIN users u ON ea.idusuario = u.idusuario
    WHERE ea.idusuario = ?;
  `;

  db.query(query, [idusuario], (err, results) => {
    if (err) {
      console.error("Error al obtener encuestas asignadas:", err);
      res.status(500).json({ error: "Error al obtener encuestas asignadas" });
      return;
    }

    // Procesamos los resultados para usar el estado calculado
    const processedResults = results.map((item) => ({
      ...item,
      estado: item.estado_calculado,
      completadas: item.repeticiones_completadas,
    }));

    res.status(200).json(processedResults);
  });
});

// Endpoint POST para asignar una nueva encuesta
app.post("/nueva-encuesta-asignada", (req, res) => {
  const { idusuario, id_encuesta, cantidad } = req.body;

  createEncuestaAsignada(
    idusuario,
    id_encuesta,
    cantidad,
    (err, id_asignacion) => {
      if (err) {
        console.error("Error al registrar encuesta asignada:", err);
        res.status(500).json({ error: "Error al registrar encuesta asignada" });
        return;
      }

      // Devuelve el id_asignacion en la respuesta
      res.status(201).json({
        message: "Encuesta asignada registrada exitosamente",
        id_asignacion: id_asignacion,
      });
    }
  );
});

app.put("/actualizar-encuesta-asignada/:id_asignacion", (req, res) => {
  const { id_asignacion } = req.params;
  const { idusuario, id_encuesta, cantidad, estado, fecha_creacion } = req.body;

  // Formatear la fecha (manteniendo solo 'YYYY-MM-DD')
  const fechaFormateada = new Date(fecha_creacion).toISOString().split("T")[0];

  const query = `
    UPDATE encuestas_asignadas 
    SET idusuario = ?, id_encuesta = ?, cantidad = ?, estado = ?, fecha_creacion = ?
    WHERE id_asignacion = ?`;

  db.query(
    query,
    [idusuario, id_encuesta, cantidad, estado, fechaFormateada, id_asignacion],
    (err, results) => {
      if (err) {
        console.error("Error al actualizar asignación:", err);
        return res
          .status(500)
          .json({ error: "Error al actualizar asignación" });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Asignación no encontrada" });
      }
      res.status(200).json({ message: "Asignación actualizada correctamente" });
    }
  );
});

app.put("/verificar-completado/:idusuario/:id_encuesta", (req, res) => {
  const { idusuario, id_encuesta } = req.params;

  // Consulta para obtener la cantidad asignada y el número de respuestas únicas por asignación
  const query = `
    SELECT 
      ea.id_asignacion,
      ea.cantidad AS cantidad_asignada,
      (SELECT COUNT(DISTINCT r.fecha_creacion) 
       FROM respuestas r 
       WHERE r.idusuario = ea.idusuario 
         AND r.id_encuesta = ea.id_encuesta
         AND r.id_asignacion = ea.id_asignacion  -- Filtra por id_asignacion
      ) AS cantidad_respuestas
    FROM 
      encuestas_asignadas ea
    WHERE 
      ea.idusuario = ? 
      AND ea.id_encuesta = ?;
  `;

  // Ejecutar la consulta
  db.query(query, [idusuario, id_encuesta], (err, results) => {
    if (err) {
      console.error("Error al verificar el estado de la encuesta:", err);
      return res
        .status(500)
        .json({ error: "Error al verificar el estado de la encuesta" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "Encuesta no encontrada para el usuario" });
    }

    // Iterar sobre cada asignación (por si hay múltiples asignaciones)
    results.forEach((asignacion) => {
      const { id_asignacion, cantidad_asignada, cantidad_respuestas } =
        asignacion;

      // Verificar si la cantidad de respuestas coincide con la cantidad asignada
      if (cantidad_respuestas >= cantidad_asignada) {
        // Actualizar el estado a "completado" para esta asignación
        const updateQuery = `
          UPDATE encuestas_asignadas
          SET estado = 'completado'
          WHERE id_asignacion = ?;
        `;

        db.query(updateQuery, [id_asignacion], (err, updateResults) => {
          if (err) {
            console.error("Error al actualizar el estado de la encuesta:", err);
            return res
              .status(500)
              .json({ error: "Error al actualizar el estado de la encuesta" });
          }
        });
      }
    });

    return res.status(200).json({ message: "Verificación completada" });
  });
});

app.get("/respuestas-asignacion/:id_asignacion", (req, res) => {
  const { id_asignacion } = req.params;

  const query = `
    SELECT 
      r.id_respuesta,
      r.id_asignacion,
      r.id_encuesta,
      e.nombre_encuesta,
      p.id_pregunta,
      p.texto_pregunta,
      p.tipo_pregunta,
      o.id_opcion,
      o.texto_opcion,
      r.texto_respuesta,
      DATE_FORMAT(r.fecha_creacion, '%Y-%m-%d %H:%i:%s') as fecha_exacta,
      u.nombre AS usuario
    FROM 
      respuestas r
    LEFT JOIN 
      encuestas e ON r.id_encuesta = e.id_encuesta
    LEFT JOIN 
      preguntas p ON r.id_pregunta = p.id_pregunta
    LEFT JOIN 
      opciones_respuesta o ON r.id_opcion = o.id_opcion
    LEFT JOIN 
      users u ON r.idusuario = u.idusuario
    WHERE 
      r.id_asignacion = ?
    ORDER BY
      r.fecha_creacion, r.id_pregunta
  `;

  db.query(query, [id_asignacion], (err, results) => {
    if (err) {
      console.error("Error al obtener respuestas:", err);
      return res.status(500).json({ error: "Error al obtener respuestas" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron respuestas para esta asignación" });
    }

    // Agrupar por fecha exacta (formateada como string para evitar problemas de milisegundos)
    const respuestasAgrupadas = results.reduce((grupos, respuesta) => {
      const fechaKey = respuesta.fecha_exacta;

      if (!grupos[fechaKey]) {
        grupos[fechaKey] = {
          id_asignacion: respuesta.id_asignacion,
          id_encuesta: respuesta.id_encuesta,
          nombre_encuesta: respuesta.nombre_encuesta,
          usuario: respuesta.usuario,
          fecha_creacion: respuesta.fecha_exacta,
          completada: true,
          respuestas: [],
        };
      }

      grupos[fechaKey].respuestas.push({
        id_respuesta: respuesta.id_respuesta,
        id_pregunta: respuesta.id_pregunta,
        texto_pregunta: respuesta.texto_pregunta,
        tipo_pregunta: respuesta.tipo_pregunta,
        id_opcion: respuesta.id_opcion,
        texto_opcion: respuesta.texto_opcion,
        texto_respuesta: respuesta.texto_respuesta,
      });

      return grupos;
    }, {});

    // Convertir a array y ordenar por fecha (más reciente primero)
    const resultadoFinal = Object.values(respuestasAgrupadas).sort((a, b) => {
      return new Date(b.fecha_creacion) - new Date(a.fecha_creacion);
    });

    res.status(200).json(resultadoFinal);
  });
});

// Endpoint DELETE para eliminar una encuesta asignada
app.delete("/eliminar-encuesta-asignada/:id_asignacion", (req, res) => {
  const { id_asignacion } = req.params;

  deleteEncuestaAsignada(id_asignacion, (err, results) => {
    if (err) {
      console.error("Error al eliminar encuesta asignada:", err);
      res.status(500).json({ error: "Error al eliminar encuesta asignada" });
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ message: "Encuesta asignada no encontrada" });
      return;
    }
    res
      .status(200)
      .json({ message: "Encuesta asignada eliminada exitosamente" });
  });
});

//! DASHBOARD

// Endpoint GET para obtener el total de usuarios
app.get("/api/total-usuarios", (req, res) => {
  const query = "SELECT COUNT(*) AS total_usuarios FROM users";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }

    // Enviar el total de usuarios como respuesta JSON
    res.json({ total_usuarios: result[0].total_usuarios });
  });
});

// Endpoint GET para obtener el total de encuestas completadas
app.get("/api/total-encuestas-completadas", (req, res) => {
  const query = `SELECT COUNT(*) AS total_encuestas_completadas
                 FROM encuestas_asignadas
                 WHERE estado = 'completado';`;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }

    // Enviar el total de encuestas completadas como respuesta JSON
    res.json({
      total_encuestas_completadas: result[0].total_encuestas_completadas,
    });
  });
});

// Endpoint GET para obtener el total de usuarios admin
app.get("/api/total-admins", (req, res) => {
  const query = `
      SELECT COUNT(*) AS cantidad_administradores
      FROM users u
      JOIN rol r ON u.idrol = r.idrol
      WHERE r.nomrol = 'admin';
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }

    // Enviar el total de usuarios admin como respuesta JSON con clave cantidad_administradores
    res.json({ cantidad_administradores: result[0].cantidad_administradores });
  });
});

app.get("/api/encuestas", (req, res) => {
  // Parámetros de consulta
  const { year, month } = req.query;

  // Validación de parámetros
  if (!year || !month) {
    return res
      .status(400)
      .json({
        error: 'Por favor proporciona los parámetros "year" y "month".',
      });
  }

  const query = `
      SELECT 
          DATE(fecha_creacion) AS fecha,
          SUM(cantidad) AS cantidad_encuestas
      FROM encuestas_asignadas
      WHERE estado = 'completado' AND DATE_FORMAT(fecha_creacion, '%Y-%m') = ?
      GROUP BY DATE(fecha_creacion)
      ORDER BY fecha ASC;
  `;

  const formattedDate = `${year}-${month.padStart(2, "0")}`; // Formato 'YYYY-MM'

  db.query(query, [formattedDate], (err, results) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      res
        .status(500)
        .json({ error: "Error al obtener los datos de encuestas." });
      return;
    }

    // Devuelve los resultados en formato JSON
    res.json(results);
  });
});

app.get("/api/respuestas-dinamicas", (req, res) => {
  const { id_encuesta, id_usuario, fecha, id_pregunta_min, id_pregunta_max } =
    req.query;

  // Crear condiciones opcionales para los parámetros
  const condiciones = [];
  const valores = [];

  if (id_encuesta) {
    condiciones.push("e.id_encuesta = ?");
    valores.push(id_encuesta);
  }
  if (id_usuario) {
    condiciones.push("u.idusuario = ?");
    valores.push(id_usuario);
  }
  if (fecha) {
    condiciones.push("DATE(ea.fecha_creacion) = ?");
    valores.push(fecha);
  }
  if (id_pregunta_min && id_pregunta_max) {
    condiciones.push("p.id_pregunta BETWEEN ? AND ?");
    valores.push(id_pregunta_min, id_pregunta_max);
  }

  const whereClause = condiciones.length
    ? `WHERE ${condiciones.join(" AND ")}`
    : "";

  const query = `
      SELECT 
          p.texto_pregunta AS pregunta,
          CASE
              WHEN orp.texto_opcion IS NOT NULL THEN orp.texto_opcion
              ELSE r.texto_respuesta
          END AS respuesta,
          COUNT(*) AS cantidad_respuestas,
          ROUND((COUNT(*) * 100.0 / (
              SELECT COUNT(*)
              FROM respuestas r_sub
              WHERE r_sub.id_pregunta = r.id_pregunta
                AND r_sub.id_encuesta = e.id_encuesta
          )), 2) AS porcentaje
      FROM respuestas r
      JOIN preguntas p ON r.id_pregunta = p.id_pregunta
      JOIN encuestas e ON p.id_encuesta = e.id_encuesta
      LEFT JOIN opciones_respuesta orp ON r.id_opcion = orp.id_opcion
      JOIN encuestas_asignadas ea ON r.id_asignacion = ea.id_asignacion
      JOIN users u ON ea.idusuario = u.idusuario
      ${whereClause}
      GROUP BY p.texto_pregunta, respuesta
      ORDER BY p.id_pregunta, porcentaje DESC;
  `;

  db.query(query, valores, (err, results) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      res.status(500).json({ error: "Error al obtener las respuestas." });
      return;
    }

    res.json(results);
  });
});

// Endpoint para obtener usuarios cuyo rol sea "encuestador"
app.get("/usuarios-rol", (req, res) => {
  const query = `
    SELECT u.idusuario, u.nombre 
    FROM users u
    JOIN rol r ON u.idrol = r.idrol
    WHERE r.nomrol = 'encuestador'
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener usuarios:", err);
      res.status(500).json({ error: "Error al obtener usuarios." });
      return;
    }

    res.json(results);
  });
});

// Endpoint para obtener encuestas asignadas
app.get("/fecha-asignada", (req, res) => {
  const query = `
    SELECT 
        ea.id_asignacion,
        ea.id_encuesta,
        e.nombre_encuesta,
        ea.idusuario,
        u.nombre,
        ea.cantidad,
        ea.fecha_creacion
    FROM encuestas_asignadas ea
    JOIN encuestas e ON ea.id_encuesta = e.id_encuesta
    JOIN users u ON ea.idusuario = u.idusuario
    ORDER BY ea.fecha_creacion DESC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      return res.status(500).send("Error al ejecutar la consulta.");
    }
    res.json(results);
  });
});

// Endpoint para obtener usuarios con rol encuestador, sus asignaciones y cantidad total de encuestas
app.get("/encuestadores/asignaciones", (req, res) => {
  const query = `
    SELECT 
        u.nombre AS usuario,
        COUNT(ea.id_asignacion) AS total_asignaciones,
        SUM(ea.cantidad) AS total_encuestas
    FROM users u
    JOIN rol r ON u.idrol = r.idrol
    JOIN encuestas_asignadas ea ON u.idusuario = ea.idusuario
    WHERE r.nomrol = 'encuestador'
    GROUP BY u.nombre;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al ejecutar la consulta:", err);
      res.status(500).json({ error: "Error al obtener los datos." });
      return;
    }
    res.json(results);
  });
});

app.get("/preguntas-respuestas-texto", (req, res) => {
  const query = `
    SELECT 
    p.id_pregunta,
    p.texto_pregunta,
    r.texto_respuesta,
    e.nombre_encuesta,
    ea.id_asignacion,
    ea.idusuario AS usuario_asignado,
    u.nombre,  -- Recupera el nombre del usuario
    r.fecha_creacion
FROM 
    respuestas r
JOIN 
    preguntas p ON r.id_pregunta = p.id_pregunta
JOIN 
    encuestas e ON p.id_encuesta = e.id_encuesta
JOIN 
    encuestas_asignadas ea ON r.id_asignacion = ea.id_asignacion
JOIN 
    users u ON ea.idusuario = u.idusuario  -- Se une con la tabla users
WHERE 
    r.texto_respuesta IS NOT NULL
    AND r.texto_respuesta != ''
ORDER BY 
    r.fecha_creacion DESC;

  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener preguntas con respuestas de texto:", err);
      res
        .status(500)
        .json({ error: "Error al obtener preguntas con respuestas de texto" });
      return;
    }

    if (results.length === 0) {
      res
        .status(404)
        .json({
          message: "No se encontraron preguntas con respuestas de texto",
        });
      return;
    }

    res.status(200).json(results);
  });
});

app.get("/preguntas-abiertas", (req, res) => {
  const query = `
    SELECT p.* 
    FROM preguntas p
    LEFT JOIN opciones_respuesta o ON p.id_pregunta = o.id_pregunta
    WHERE o.id_opcion IS NULL
    AND p.tipo_pregunta IN ('parrafo', 'texto_corto') -- Aquí defines los tipos de preguntas abiertas
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener preguntas abiertas:", err);
      res.status(500).json({ error: "Error al obtener preguntas abiertas" });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ message: "No se encontraron preguntas abiertas" });
      return;
    }

    res.status(200).json(results);
  });
});

// Endpoint para obtener el total de cantidades según el estado
app.get('/total-cantidades', (req, res) => {
  const consultaSQL = `
      SELECT SUM(cantidad) AS total_cantidad
      FROM encuestas_asignadas
      WHERE estado IN ('pendiente', 'completado');
  `;

  db.query(consultaSQL, (err, resultado) => {
      if (err) {
          res.status(500).send('Error en la consulta');
          return;
      }
      res.json({ total_cantidad: resultado[0].total_cantidad });
  });
});

//?NO COPIES ESTO, LO DEJAMOS PARA EL FINAL
// Inicia el servidor
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Servidor funcionando en el puerto ${port}`);
});
