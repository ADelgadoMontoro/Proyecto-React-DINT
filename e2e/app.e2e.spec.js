import { expect, test } from "@playwright/test";

const login = async (page, username = "admin", password = "admin123") => {
  await page.goto("/login");
  await page.getByLabel("Usuario").fill(username);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/videojuegos$/);
  await expect(page.getByRole("heading", { name: "Todos los videojuegos" })).toBeVisible();
};

const getResultsCount = async (page) => {
  await expect(page.getByTestId("results-count")).toBeVisible();
  const text = await page.getByTestId("results-count").textContent();
  const match = text?.match(/(\d+)/);
  return Number(match?.[1] || 0);
};

const createGame = async (page, title) => {
  await page.getByRole("link", { name: "Nuevo" }).click();
  await expect(page).toHaveURL(/\/videojuegos\/nuevo$/);

  await page.locator('input[name=\"nombre\"]').fill(title);
  await page.locator('textarea[name=\"descripcion\"]').fill("Videojuego de prueba E2E para crear, ver detalle y borrar.");
  await page.locator('input[name=\"compania\"]').fill("E2E Studio");
  await page.locator('input[name=\"fechaLanzamiento\"]').fill("2026-03-04");
  await page.locator('input[name=\"precio\"]').fill("19.99");
  await page.locator('input[name=\"plataformas\"]').fill("PC,PS5");
  await page.locator('input[name=\"categorias\"]').fill("Aventura,Rol");
  await page.locator('input[name=\"urlImagen\"]').fill("https://picsum.photos/seed/e2e-game/800/450");
  await page.locator('input[name=\"urlVideo\"]').fill("https://www.youtube.com/watch?v=dQw4w9WgXcQ");

  await page.getByRole("button", { name: "Crear videojuego" }).click();
  await expect(page).toHaveURL(/\/videojuegos\/\d+$/);
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
};

test("Registro de usuario y login correcto", async ({ page }) => {
  const now = Date.now();
  const username = `e2e_user_${now}`;
  const email = `e2e_${now}@mail.com`;
  const password = "admin123";

  await page.goto("/register");
  await page.getByLabel("Usuario").fill(username);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password (min 6)").fill(password);
  await page.getByRole("button", { name: "Crear cuenta" }).click();

  await expect(page.getByText("Registro correcto. Ya puedes iniciar sesion.")).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel("Usuario").fill(username);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Entrar" }).click();

  await expect(page).toHaveURL(/\/videojuegos$/);
  await expect(page.getByRole("heading", { name: "Todos los videojuegos" })).toBeVisible();
});

test("Login incorrecto muestra error", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Usuario").fill("usuario_invalido");
  await page.getByLabel("Password").fill("mal123456");
  await page.getByRole("button", { name: "Entrar" }).click();

  await expect(page.getByText("Credenciales incorrectas")).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});

test("Redireccion a login al entrar en ruta protegida sin sesion", async ({ page }) => {
  await page.goto("/games");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Iniciar sesion" })).toBeVisible();
});

test("Listado de videojuegos renderiza nombre, portada y precio", async ({ page }) => {
  await login(page);

  const cards = page.getByTestId("game-card");
  await expect(page.getByRole("heading", { name: "Todos los videojuegos" })).toBeVisible();
  await expect(cards.first()).toBeVisible();
  expect(await cards.count()).toBeGreaterThan(0);

  await expect(cards.first().getByTestId("game-title")).toBeVisible();
  await expect(cards.first().getByTestId("game-image")).toBeVisible();
  await expect(cards.first().getByTestId("game-price")).toBeVisible();
});

test("Busqueda filtra el listado", async ({ page }) => {
  await login(page);

  const before = await getResultsCount(page);
  await page.getByTestId("search-input").fill("MotoGP 23");

  const filteredCards = page.getByTestId("game-card");
  await expect(filteredCards.first()).toContainText("MotoGP 23");

  const after = await getResultsCount(page);
  expect(after).toBeLessThan(before);
});

test("Filtros por categorias y plataformas cambian resultados", async ({ page }) => {
  await login(page);

  await page.getByLabel("Rol").check();
  await page.getByLabel("Aventura").check();
  const countWithTwoCategories = await getResultsCount(page);

  await page.getByLabel("Aventura").uncheck();
  const countOnlyRol = await getResultsCount(page);
  expect(countOnlyRol).toBeLessThan(countWithTwoCategories);

  await page.getByLabel("Rol").uncheck();

  await page.getByLabel("Switch").check();
  await page.getByLabel("Xbox One").check();
  const countWithTwoPlatforms = await getResultsCount(page);

  await page.getByLabel("Xbox One").uncheck();
  const countOnlySwitch = await getResultsCount(page);
  expect(countOnlySwitch).toBeLessThan(countWithTwoPlatforms);
});

test("Paginacion cambia elementos y pagina activa", async ({ page }) => {
  await login(page);

  await page.getByTestId("page-size-select").click();
  await page.getByRole("option", { name: "3" }).click();

  const firstTitlePage1 = await page.getByTestId("game-title").first().textContent();

  const pagination = page.getByTestId("pagination");
  await pagination.getByRole("button", { name: "2" }).click();

  await expect(pagination.getByRole("button", { name: "2" })).toHaveAttribute("aria-current", "page");

  const firstTitlePage2 = await page.getByTestId("game-title").first().textContent();
  expect(firstTitlePage2).not.toBe(firstTitlePage1);
});

test("Crear videojuego y comprobar que aparece en mis videojuegos", async ({ page }) => {
  const title = `E2E Nuevo ${Date.now()}`;
  await login(page, "Adrian", "admin123");

  await createGame(page, title);

  await page.getByRole("link", { name: "Mis videojuegos" }).click();
  await expect(page).toHaveURL(/\/mis-videojuegos$/);
  await expect(page.getByTestId("game-card").filter({ hasText: title })).toHaveCount(1);
});

test("Ver detalle muestra campos clave", async ({ page }) => {
  await login(page);

  await page.getByTestId("detail-link").first().click();

  await expect(page).toHaveURL(/\/videojuegos\/\d+$/);
  await expect(page.getByText("Usuario:")).toBeVisible();
  await expect(page.getByText("Descripcion:")).toBeVisible();
  await expect(page.getByText("Precio:")).toBeVisible();
  await expect(page.getByRole("button", { name: "Reportar inapropiado" })).toBeVisible();
});

test("Eliminar videojuego desde detalle y comprobar que desaparece", async ({ page }) => {
  const title = `E2E Borrar ${Date.now()}`;
  await login(page, "Luis", "admin123");

  await createGame(page, title);

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Eliminar" }).click();

  await expect(page).toHaveURL(/\/videojuegos$/);

  await page.getByRole("link", { name: "Mis videojuegos" }).click();
  await expect(page.getByTestId("game-card").filter({ hasText: title })).toHaveCount(0);
});

test("Logout y bloqueo de rutas protegidas", async ({ page }) => {
  await login(page);

  await page.getByRole("button", { name: "Salir" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.goto("/videojuegos");
  await expect(page).toHaveURL(/\/login$/);
});
