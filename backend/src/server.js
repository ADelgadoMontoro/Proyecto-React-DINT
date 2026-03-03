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

  const enriched = db.videojuegos
    .map((v) => {
      const owner = db.users.find((u) => Number(u.id) === Number(v.userId));
      return {
        ...v,
        usuario: owner ? owner.username : "desconocido"
      };
    })
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));

  const data = enriched.slice(offset, offset + limit);
  return res.json({ data, ...buildPaginated(enriched, page, limit) });
});

app.get("/videojuegos/mios", authRequired, (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const db = readDb();

  const mine = db.videojuegos
    .filter((v) => Number(v.userId) === Number(req.user.sub))
    .map((v) => ({ ...v, usuario: req.user.username }))
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

  const owner = db.users.find((u) => Number(u.id) === Number(game.userId));
  return res.json({
    ...game,
    usuario: owner ? owner.username : "desconocido"
  });
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
    userId: req.user.sub,
    createdAt: new Date().toISOString()
  };

  db.videojuegos.push(newGame);
  writeDb(db);

  return res.status(201).json({ ...newGame, usuario: req.user.username });
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
