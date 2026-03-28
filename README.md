<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

<p align="center">
  Currency Exchange Backend — API REST para una casa de cambio digital construida con
  <a href="http://nodejs.org" target="_blank">Node.js</a>,
  <strong>NestJS</strong>, <strong>MongoDB</strong> y <strong>Arquitectura Hexagonal</strong>.
</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank">
    <img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" />
  </a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank">
    <img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" />
  </a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank">
    <img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord" />
  </a>
</p>

---

## Tabla de Contenidos

- [Requisitos](#requisitos)
- [Variables de Entorno](#variables-de-entorno)
- [Levantar con Docker](#levantar-con-docker)
- [Instalacion del Proyecto](#instalacion-del-proyecto)
- [Compilar y Ejecutar](#compilar-y-ejecutar)
- [Seed de Base de Datos (RBAC)](#seed-de-base-de-datos-rbac)
- [Correo de Bienvenida](#correo-de-bienvenida)
- [Endpoints del API](#endpoints-del-api)
- [Ejecutar Tests](#ejecutar-tests)
- [Despliegue](#despliegue)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Recursos](#recursos)

---

## Requisitos

| Herramienta    | Version minima                 |
| -------------- | ------------------------------ |
| Docker         | 24.x                           |
| Docker Compose | 2.x                            |
| Node.js        | 20.x _(solo desarrollo local)_ |
| npm            | 10.x _(solo desarrollo local)_ |

> En un entorno con solo Docker instalado, no se requiere Node.js.

---

## Variables de Entorno

Crea un archivo `.env` en la raiz del proyecto con el siguiente contenido:

```env
# Servidor
NODE_PORT=7000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/currency_exchange_db

# JWT
JWT_SECRET=super_secret_key_for_test
JWT_EXPIRATION_TIME=900000

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_app_password
EMAIL_FROM="Casa de Cambio Digital"

# API externa de tasa de cambio
RATES_URL=https://api.test.cambioseguro.com/api/v1.1/config/rates
```

> Para Gmail, utiliza una [Contrasena de Aplicacion](https://myaccount.google.com/apppasswords) en lugar de tu contrasena personal.

---

## Levantar con Docker

Este es el metodo recomendado. Solo se necesita Docker — no se requiere Node.js instalado localmente.

**1. Clona el repositorio**

```bash
git clone <url-del-repositorio>
cd currency-exchange-backend
```

**2. Crea el archivo `.env`**

Copia el bloque de la seccion [Variables de Entorno](#variables-de-entorno) y ajusta las credenciales de email.

**3. Inicia todos los servicios**

```bash
docker-compose up --build
```

Esto levanta dos contenedores:

- `currency_exchange_app` — API REST en el puerto `7000`
- `currency_exchange_mongo` — MongoDB en el puerto `27017`

**4. Verifica que la aplicacion este corriendo**

```bash
curl http://localhost:7000
```

**5. Ejecuta el Seed de RBAC**

Una vez que los contenedores esten activos, importa los datos base de roles, modulos, permisos y el usuario administrador. Ver seccion [Seed de Base de Datos (RBAC)](#seed-de-base-de-datos-rbac).

**Comandos Docker utiles**

```bash
# Detener contenedores
docker-compose down

# Detener y eliminar volumenes (borra la base de datos)
docker-compose down -v

# Ver logs de la aplicacion
docker-compose logs -f app

# Reiniciar solo el contenedor de la app
docker-compose restart app
```

---

## Instalacion del Proyecto

```bash
npm install
```

---

## Compilar y Ejecutar

```bash
# Modo desarrollo
npm run start

# Modo watch (recarga automatica)
npm run start:dev

# Modo produccion
npm run start:prod
```

> Asegurate de tener MongoDB corriendo antes de iniciar en modo desarrollo.
> Puedes levantarlo con Docker: `docker run -d -p 27017:27017 --name mongo mongo:7.0`

---

## Seed de Base de Datos (RBAC)

El sistema de gestion de usuarios utiliza RBAC (Roles, Modulos y Permisos). Los datos base deben insertarse en MongoDB antes de utilizar cualquier endpoint protegido.

El repositorio incluye los archivos de seed listos para importar en la carpeta `assets/seed/`:

| Archivo                        | Descripcion                                             |
| ------------------------------ | ------------------------------------------------------- |
| `roles.json`                   | Roles del sistema: `ADMIN` y `CLIENT`                   |
| `modules.json`                 | Modulos: `USERS`, `EXCHANGE_RATES`, `EXCHANGE_REQUESTS` |
| `permissions.json`             | Permisos: `CREATE`, `READ`, `UPDATE`, `DELETE`          |
| `role_module_permissions.json` | Asignacion de permisos por rol y modulo                 |
| `users_admin.json`             | Usuario superadmin inicial                              |

**Importar con MongoDB Compass**

1. Abre MongoDB Compass y conectate a `mongodb://localhost:27017/currency_exchange_db`.
2. Para cada archivo, navega a la coleccion correspondiente y usa la opcion **Add Data > Import JSON file**.
3. Importa en este orden para respetar las referencias entre colecciones:
   1. `permissions.json` → coleccion `permissions`
   2. `modules.json` → coleccion `modules`
   3. `roles.json` → coleccion `roles`
   4. `role_module_permissions.json` → coleccion `role_module_permissions`
   5. `users_admin.json` → coleccion `users`

**Importar con mongoimport (linea de comandos)**

```bash
mongoimport --uri "mongodb://localhost:27017/currency_exchange_db" --collection permissions           --file assets/seed/permissions.json            --jsonArray
mongoimport --uri "mongodb://localhost:27017/currency_exchange_db" --collection modules              --file assets/seed/modules.json               --jsonArray
mongoimport --uri "mongodb://localhost:27017/currency_exchange_db" --collection roles               --file assets/seed/roles.json                 --jsonArray
mongoimport --uri "mongodb://localhost:27017/currency_exchange_db" --collection role_module_permissions --file assets/seed/role_module_permissions.json --jsonArray
mongoimport --uri "mongodb://localhost:27017/currency_exchange_db" --collection users               --file assets/seed/users_admin.json           --jsonArray
```

**Credenciales del usuario superadmin**

```
email:    admin123456@gmail.com
password: 123456
```

> No uses estas credenciales en ningun entorno fuera de desarrollo o pruebas locales.

---

## Correo de Bienvenida

Al completar el registro, el sistema envia automaticamente un correo de bienvenida al nuevo usuario utilizando **Nodemailer** con una plantilla HTML renderizada con **Handlebars**.

**Implementacion:**

- Transporte: SMTP (configurado via variables de entorno)
- Motor de plantillas: Handlebars (`.hbs`)
- Ubicacion de la plantilla: `assets/templates/welcome.hbs`
- Disparador: `POST /auth/register` — invocado desde `AuthManagerDomainService` despues de persistir el usuario

**Flujo:**

```
POST /auth/register
    └── AuthManagerDomainService
            ├── DbRepository.createUser()
            └── EmailRepository.sendWelcomeEmail(email, name)
                    └── Nodemailer SMTP → welcome.hbs renderizado → entregado
```

**Variables de contexto de la plantilla:**

| Variable | Descripcion                   |
| -------- | ----------------------------- |
| `name`   | Nombre del usuario registrado |

**Vista previa del correo:**

```
Asunto: Bienvenido a Casa de Cambio Digital

Bienvenido, {name}!
Tu cuenta ha sido creada exitosamente en nuestra plataforma de Casa de Cambio Digital.
Ya puedes iniciar sesion y comenzar a realizar operaciones de compra y venta de divisas
con las mejores tasas del mercado.
```

**Nota sobre Gmail:**

Gmail requiere una Contrasena de Aplicacion cuando la verificacion en dos pasos esta activada. Generala en [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) y configurala como `EMAIL_PASSWORD` en el archivo `.env`. Usar la contrasena normal de la cuenta causara errores de autenticacion.

---

## Endpoints del API

**URL base:** `http://localhost:7000`

### Autenticacion

| Metodo | Ruta             | Acceso  | Descripcion                             |
| ------ | ---------------- | ------- | --------------------------------------- |
| POST   | `/auth/register` | Publico | Registro de usuario + correo bienvenida |
| POST   | `/auth/login`    | Publico | Login — retorna un token JWT            |

**POST /auth/register**

```json
{
  "username": "juanperez",
  "email": "juan@email.com",
  "password": "Password123!",
  "first_name": "Juan",
  "last_name": "Perez"
}
```

**POST /auth/login**

```json
{
  "email": "juan@email.com",
  "password": "Password123!"
}
```

---

### Usuarios

> Requiere `Authorization: Bearer <token>`

| Metodo | Ruta         | Rol   | Descripcion                |
| ------ | ------------ | ----- | -------------------------- |
| GET    | `/users`     | Auth  | Listar usuarios (paginado) |
| GET    | `/users/:id` | Auth  | Obtener usuario por ID     |
| POST   | `/users`     | Admin | Crear usuario              |
| PATCH  | `/users/:id` | Auth  | Actualizar usuario         |
| DELETE | `/users/:id` | Admin | Eliminar usuario           |

Parametros de consulta para `GET /users`:

```
?page=1&limit=10&order=DESC
```

---

### Solicitudes de Cambio

> Requiere `Authorization: Bearer <token>`

| Metodo | Ruta                     | Rol   | Descripcion                                            |
| ------ | ------------------------ | ----- | ------------------------------------------------------ |
| POST   | `/exchange-requests`     | Auth  | Crear solicitud (consulta tasa externa en tiempo real) |
| GET    | `/exchange-requests`     | Auth  | Listar mis solicitudes (paginado)                      |
| GET    | `/exchange-requests/:id` | Auth  | Ver detalle de una solicitud                           |
| DELETE | `/exchange-requests/:id` | Admin | Eliminar solicitud                                     |

**POST /exchange-requests**

```json
{
  "exchange_type": "purchase",
  "amount_sent": 1000.0
}
```

`exchange_type` acepta `"purchase"` (compra) o `"sale"` (venta).

Calculo del monto a recibir:

- Compra: `monto_recibir = monto_enviar * purchase_price`
- Venta: `monto_recibir = monto_enviar / sale_price`

Parametros de consulta para `GET /exchange-requests`:

```
?page=1&limit=10&order=DESC&exchange_type=purchase
```

---

## Ejecutar Tests

```bash
# Tests unitarios
npm run test

# Cobertura de tests
npm run test:cov

# Modo watch
npm run test:watch

# Tests end-to-end
npm run test:e2e
```

---

## Despliegue

Para instrucciones detalladas de despliegue en la nube, consulta [DEPLOYMENT.md](./DEPLOYMENT.md).

El documento describe como desplegar la aplicacion asumiendo:

- Ya existe una instancia de MongoDB con un string de conexion valido.
- La base de datos es publica y no tiene filtro de IP.
- La aplicacion se usara como prototipo.

Se cubren dos opciones: **Railway** (recomendado para prototipos) y **AWS ECS Fargate**.

---

## Arquitectura del Proyecto

El proyecto sigue **Arquitectura Hexagonal** (Puertos y Adaptadores), organizada en tres capas:

```
src/
├── application/          # Casos de uso, DTOs, servicios de aplicacion
│   ├── constants/
│   ├── exception/
│   ├── interface/dto/
│   └── service/          # AuthManagerService, ExchangeManagerService, UserManagerService
│
├── domain/               # Nucleo de negocio — independiente del framework
│   ├── entities/
│   │   ├── schemas/      # Modelos Mongoose
│   │   └── transformer/  # Builders: documento DB -> DTO
│   ├── interfaces/       # Contratos de puertos
│   ├── repository/       # Interfaces de repositorios
│   └── service/          # Domain Services (logica de negocio)
│
└── infrastructure/       # Adaptadores (implementaciones concretas)
    ├── auth/             # Guards, Strategies, Decorators
    ├── controllers/      # Controllers NestJS y Modulos
    ├── modules/          # AppModule
    └── repository/       # DbRepository, EmailRepository, HttpRepository
```

**Patron Domain Service y Builder:**

```
Controller
    └── ApplicationService
            └── DomainService  ──► DbRepository
                    └── Builder       HttpRepository
                            └── DTO (respuesta)
```

- **Domain Service**: Orquesta el flujo de negocio, llama repositorios y builders. No transforma datos directamente.
- **Builder**: Construye y transforma la respuesta final (documento DB a DTO). Aplica logica derivada como calculos y formatos.
- **DbRepository**: Repositorio unico compartido por todos los modulos.

---

## Recursos

- [Documentacion de NestJS](https://docs.nestjs.com)
- [Discord de NestJS](https://discord.gg/G7Qnnhy)
- [Cursos de NestJS](https://courses.nestjs.com/)
- [Documentacion de Mongoose](https://mongoosejs.com/docs/)
- [Passport JWT](https://www.passportjs.org/packages/passport-jwt/)

---

## Licencia

Este proyecto tiene licencia [MIT](https://github.com/nestjs/nest/blob/master/LICENSE).
