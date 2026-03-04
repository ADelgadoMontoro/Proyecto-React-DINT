import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.BACKEND_PORT) || 8787;
const JWT_SECRET = process.env.JWT_SECRET || "dev_super_secret_change_me";
const DB_PATH = path.join(__dirname, "..", "data", "db.json");

const app = express();
app.use(cors());
app.use(express.json());

const ensureDb = () => {
  if (!fs.existsSync(DB_PATH)) {
    const adminPassword = bcrypt.hashSync("admin123", 10);
    const initialDb = {
      users: [
        {
          id: 1,
          username: "admin",
          email: "admin@local.dev",
          passwordHash: adminPassword,
          role: "admin",
          createdAt: new Date().toISOString()
        }
      ],
      videojuegos: []
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialDb, null, 2), "utf-8");
  }
};

const readDb = () => {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
};

const writeDb = (db) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
};

const nextId = (items) => {
  if (!items.length) return 1;
  return Math.max(...items.map((item) => Number(item.id))) + 1;
};

const nextCommentId = (videojuegos) => {
  const ids = videojuegos.flatMap((g) => (Array.isArray(g.comentarios) ? g.comentarios.map((c) => Number(c.id)) : []));
  if (!ids.length) return 1;
  return Math.max(...ids) + 1;
};

const cleanUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  role: user.role
});

const parsePagination = (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

const buildPaginated = (items, page, limit) => {
  const total = items.length;
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  return {
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  };
};

const enrichGame = (game, users, currentUserId = null) => {
  const owner = users.find((u) => Number(u.id) === Number(game.userId));
  const votos = Array.isArray(game.votos) ? game.votos : [];
  const likes = votos.filter((v) => v.tipo === "like").length;
  const dislikes = votos.filter((v) => v.tipo === "dislike").length;
  const votoUsuario = votos.find((v) => Number(v.userId) === Number(currentUserId))?.tipo || null;

  const comentarios = Array.isArray(game.comentarios)
    ? game.comentarios.map((c) => {
        const autor = users.find((u) => Number(u.id) === Number(c.userId));
        return {
          ...c,
          usuario: c.usuario || (autor ? autor.username : "desconocido"),
          respuestas: Array.isArray(c.respuestas) ? c.respuestas : []
        };
      })
    : [];

  return {
    ...game,
    usuario: owner ? owner.username : "desconocido",
    likes,
    dislikes,
    popularidad: likes - dislikes,
    votoUsuario,
    comentarios
  };
};

const authRequired = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Token no enviado" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (_) {
    return res.status(401).json({ message: "Token invalido o caducado" });
  }
};

app.get("/health", (_, res) => {
  res.json({ ok: true, service: "videojuegos-backend" });
});

app.post("/auth/register", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "username, email y password son obligatorios" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "La password debe tener al menos 6 caracteres" });
  }

  const db = readDb();
  const exists = db.users.some(
    (u) => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase()
  );

  if (exists) {
    return res.status(409).json({ message: "Usuario o email ya existe" });
  }

  const newUser = {
    id: nextId(db.users),
    username,
    email,
    passwordHash: bcrypt.hashSync(password, 10),
    role: "user",
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDb(db);

  return res.status(201).json({ user: cleanUser(newUser) });
});

app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "username y password son obligatorios" });
  }

  const db = readDb();
  const user = db.users.find((u) => u.username.toLowerCase() === String(username).toLowerCase());

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ message: "Credenciales incorrectas" });
  }

  const token = jwt.sign(
    { sub: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  return res.json({ token, user: cleanUser(user) });
});

app.get("/videojuegos", authRequired, (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const db = readDb();
  const ordenarPor = req.query.orden || "fecha";

  const enriched = db.videojuegos.map((v) => enrichGame(v, db.users, req.user.sub));

  if (ordenarPor === "popularidad") {
    enriched.sort((a, b) => {
      if (b.popularidad !== a.popularidad) return b.popularidad - a.popularidad;
      return String(b.createdAt).localeCompare(String(a.createdAt));
    });
  } else {
    enriched.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  }

  const data = enriched.slice(offset, offset + limit);
  return res.json({ data, ...buildPaginated(enriched, page, limit) });
});

app.get("/videojuegos/mios", authRequired, (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const db = readDb();

  const mine = db.videojuegos
    .filter((v) => Number(v.userId) === Number(req.user.sub))
    .map((v) => enrichGame(v, db.users, req.user.sub))
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));

  const data = mine.slice(offset, offset + limit);
  return res.json({ data, ...buildPaginated(mine, page, limit) });
});

app.get("/videojuegos/:id", authRequired, (req, res) => {
  const db = readDb();
  const game = db.videojuegos.find((v) => Number(v.id) === Number(req.params.id));

  if (!game) {
    return res.status(404).json({ message: "Videojuego no encontrado" });
  }

  return res.json(enrichGame(game, db.users, req.user.sub));
});

app.post("/videojuegos", authRequired, (req, res) => {
  const {
    nombre,
    descripcion,
    fechaLanzamiento,
    compania,
    plataformas,
    categorias,
    precio,
    urlImagen,
    urlVideo
  } = req.body;

  if (!nombre || !descripcion) {
    return res.status(400).json({ message: "nombre y descripcion son obligatorios" });
  }

  const db = readDb();
  const newGame = {
    id: nextId(db.videojuegos),
    nombre,
    descripcion,
    fechaLanzamiento: fechaLanzamiento || "",
    compania: compania || "",
    plataformas: Array.isArray(plataformas) ? plataformas : [],
    categorias: Array.isArray(categorias) ? categorias : [],
    precio: Number(precio) || 0,
    urlImagen: urlImagen || "",
    urlVideo: urlVideo || "",
    votos: [],
    comentarios: [],
    userId: req.user.sub,
    createdAt: new Date().toISOString()
  };

  db.videojuegos.push(newGame);
  writeDb(db);

  return res.status(201).json({ ...newGame, usuario: req.user.username });
});

app.post("/videojuegos/:id/votar", authRequired, (req, res) => {
  const { tipo } = req.body;
  if (tipo !== "like" && tipo !== "dislike") {
    return res.status(400).json({ message: "tipo debe ser like o dislike" });
  }

  const db = readDb();
  const game = db.videojuegos.find((v) => Number(v.id) === Number(req.params.id));

  if (!game) {
    return res.status(404).json({ message: "Videojuego no encontrado" });
  }

  if (!Array.isArray(game.votos)) {
    game.votos = [];
  }

  const yaVoto = game.votos.some((v) => Number(v.userId) === Number(req.user.sub));
  if (yaVoto) {
    return res.status(409).json({ message: "Ya has votado este videojuego" });
  }

  game.votos.push({
    userId: req.user.sub,
    tipo,
    createdAt: new Date().toISOString()
  });

  writeDb(db);

  return res.json({
    message: "Voto registrado",
    game: enrichGame(game, db.users, req.user.sub)
  });
});

app.post("/videojuegos/:id/comentarios", authRequired, (req, res) => {
  const { texto } = req.body;
  if (!texto || String(texto).trim() === "") {
    return res.status(400).json({ message: "El comentario no puede estar vacio" });
  }

  const db = readDb();
  const game = db.videojuegos.find((v) => Number(v.id) === Number(req.params.id));

  if (!game) {
    return res.status(404).json({ message: "Videojuego no encontrado" });
  }

  if (!Array.isArray(game.comentarios)) {
    game.comentarios = [];
  }

  const nuevoComentario = {
    id: nextCommentId(db.videojuegos),
    userId: req.user.sub,
    usuario: req.user.username,
    texto: String(texto).trim(),
    respuestas: [],
    createdAt: new Date().toISOString()
  };

  game.comentarios.push(nuevoComentario);
  writeDb(db);

  return res.status(201).json({
    message: "Comentario añadido",
    comentario: nuevoComentario
  });
});

app.delete("/videojuegos/:id", authRequired, (req, res) => {
  const db = readDb();
  const index = db.videojuegos.findIndex((v) => Number(v.id) === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ message: "Videojuego no encontrado" });
  }

  const game = db.videojuegos[index];
  const isOwner = Number(game.userId) === Number(req.user.sub);
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: "No tienes permisos para eliminar este videojuego" });
  }

  db.videojuegos.splice(index, 1);
  writeDb(db);

  return res.json({ message: "Videojuego eliminado" });
});

ensureDb();

app.listen(PORT, () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});
