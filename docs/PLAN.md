# Plan de autenticación, registro y perfiles familiares

Este documento define el diseño funcional y técnico del flujo de registro, autenticación y selección de perfiles para la aplicación familiar. No implementa código; deja decisiones claras para construir después sin improvisar.

## Decisión principal

La aplicación tendrá una cuenta principal por familia para autenticarse con correo y contraseña. Dentro de esa familia existirán miembros/perfiles que no tendrán correo ni contraseña propia. Cada miembro accederá mediante un PIN de 4 dígitos después de que la cuenta familiar haya iniciado sesión.

La experiencia se inspira en Netflix: primero se valida la cuenta familiar, después se elige el perfil, y finalmente se confirma identidad simple con PIN.

## Alcance del MVP

Incluido en MVP:

- Registro de familia con cuenta administradora.
- Login con correo y contraseña.
- JWT access token.
- Refresh token persistente.
- Listado de miembros de la familia autenticada.
- Creación y edición de miembros.
- PIN de 4 dígitos por miembro.
- Login/selección de miembro con PIN.
- Logout.

Fuera del MVP inicial:

- Verificación obligatoria de correo.
- Invitaciones por email.
- Google Login.
- Multi-administradores avanzado.
- Recuperación de cuenta con flujo completo por email.
- 2FA.
- Permisos granulares complejos.

## Registro inicial

### Flujo funcional

1. El usuario abre la app por primera vez.
2. Ingresa:
   - correo electrónico;
   - contraseña;
   - nombre de la familia;
   - nombre del administrador.
3. El backend crea:
   - una familia;
   - una cuenta principal administradora;
   - un miembro administrador dentro de esa familia.
4. El backend devuelve tokens de sesión y el miembro administrador creado.
5. La app entra a la experiencia autenticada.

### Campos sugeridos

```json
{
  "email": "familia@example.com",
  "password": "StrongPassword123!",
  "familyName": "Familia García",
  "adminName": "Mamá"
}
```

### Validación de correo

Para el MVP, la verificación de correo puede quedar pendiente.

Decisión:

- Guardar `emailVerifiedAt` como nullable desde el inicio.
- Permitir login aunque `emailVerifiedAt` sea null durante el MVP.
- Preparar el modelo para activar verificación más adelante sin romper datos.

Tradeoff:

| Opción | Ventaja | Costo |
|---|---|---|
| Sin verificación en MVP | Menos fricción, desarrollo más rápido | Riesgo de emails falsos |
| Verificación obligatoria | Más seguridad y calidad de datos | Más complejidad: email service, tokens, pantallas |

Para esta app familiar, conviene empezar sin verificación obligatoria, pero con el campo listo.

## Inicio de sesión

### Flujo funcional recomendado

1. El usuario ingresa correo y contraseña.
2. El backend valida la cuenta principal.
3. El backend devuelve:
   - access token temporal;
   - refresh token;
   - datos mínimos de la familia;
   - lista de miembros disponibles.
4. La app muestra la pantalla de perfiles familiares.
5. El usuario selecciona un miembro.
6. La app pide PIN de 4 dígitos.
7. El backend valida el PIN.
8. El backend devuelve sesión activa de miembro.
9. La app entra al dashboard con contexto de familia + miembro.

### Por qué dos pasos

Separar cuenta familiar y perfil evita pedir correo/contraseña a niños o miembros no técnicos. También permite cambiar de perfil sin cerrar sesión completa.

La cuenta familiar responde a la pregunta:

> ¿Esta familia puede entrar a la app?

El PIN responde a:

> ¿Qué miembro de esta familia está usando la app ahora?

## Miembros familiares

### Datos del miembro

Un miembro representa a una persona dentro de una familia.

Campos sugeridos:

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | uuid | Identificador del miembro |
| `familyId` | uuid | Familia a la que pertenece |
| `name` | varchar | Nombre visible |
| `role` | enum | `adult` o `child` |
| `avatarUrl` | varchar nullable | Foto/avatar opcional |
| `color` | varchar nullable | Color de perfil |
| `icon` | varchar nullable | Icono opcional |
| `isAdmin` | boolean | Puede administrar familia/configuración |
| `isActive` | boolean | Permite ocultar sin borrar historial |
| `createdAt` | timestamp | Fecha de creación |
| `updatedAt` | timestamp | Fecha de actualización |

### Reglas

- Un miembro no requiere correo.
- Un miembro no requiere contraseña.
- Cada miembro puede tener un PIN de 4 dígitos.
- Un miembro inactivo no debe poder iniciar sesión con PIN.
- No borrar miembros con historial; usar `isActive = false`.

## Modelo backend propuesto

### Entidades principales

```txt
Family
  ├─ UserAccount
  ├─ FamilyMember
  │    └─ MemberPin
  └─ RefreshToken
```

### `families`

Responsabilidad: agrupar miembros, tareas y configuración familiar.

Campos:

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid | Primary key |
| `name` | varchar | Nombre de familia |
| `created_at` | timestamp | Creación |
| `updated_at` | timestamp | Actualización |

### `user_accounts`

Responsabilidad: credenciales principales para entrar a una familia.

Campos:

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid | Primary key |
| `family_id` | uuid | FK a `families` |
| `email` | varchar unique | Login principal |
| `password_hash` | varchar | Hash de contraseña |
| `email_verified_at` | timestamp nullable | Preparado para futuro |
| `is_active` | boolean | Bloqueo/desactivación |
| `last_login_at` | timestamp nullable | Auditoría simple |
| `created_at` | timestamp | Creación |
| `updated_at` | timestamp | Actualización |

### `family_members`

Responsabilidad: perfiles/personas dentro de una familia.

Campos:

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid | Primary key |
| `family_id` | uuid | FK a `families` |
| `name` | varchar | Nombre visible |
| `role` | enum | `adult`, `child` |
| `avatar_url` | varchar nullable | Avatar/foto |
| `color` | varchar nullable | Color del perfil |
| `icon` | varchar nullable | Icono del perfil |
| `is_admin` | boolean | Admin dentro de familia |
| `is_active` | boolean | Soft delete funcional |
| `created_at` | timestamp | Creación |
| `updated_at` | timestamp | Actualización |

### `member_pins`

Responsabilidad: almacenar PIN hasheado del miembro.

Campos:

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid | Primary key |
| `member_id` | uuid unique | FK a `family_members` |
| `pin_hash` | varchar | PIN hasheado |
| `failed_attempts` | int | Intentos fallidos |
| `locked_until` | timestamp nullable | Bloqueo temporal |
| `created_at` | timestamp | Creación |
| `updated_at` | timestamp | Actualización |

### `refresh_tokens`

Responsabilidad: persistir sesiones renovables.

Campos:

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid | Primary key |
| `family_id` | uuid | FK a `families` |
| `user_account_id` | uuid | FK a `user_accounts` |
| `member_id` | uuid nullable | Miembro seleccionado, si aplica |
| `token_hash` | varchar | Hash del refresh token |
| `expires_at` | timestamp | Expiración |
| `revoked_at` | timestamp nullable | Logout/revocación |
| `created_at` | timestamp | Creación |
| `updated_at` | timestamp | Actualización |

## Relaciones

```txt
families 1 ── * user_accounts
families 1 ── * family_members
family_members 1 ── 1 member_pins
user_accounts 1 ── * refresh_tokens
family_members 1 ── * refresh_tokens
```

## Endpoints propuestos

### Auth

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/auth/register` | Crea familia, cuenta principal y miembro admin |
| `POST` | `/auth/login` | Login con correo y contraseña |
| `POST` | `/auth/refresh` | Renueva access token |
| `POST` | `/auth/logout` | Revoca refresh token actual |
| `POST` | `/auth/logout-all` | Revoca todas las sesiones de la cuenta |
| `POST` | `/auth/change-password` | Cambia contraseña autenticada |
| `POST` | `/auth/forgot-password` | Solicita recuperación futura |
| `POST` | `/auth/reset-password` | Ejecuta recuperación futura |

### Familia

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/families/current` | Devuelve familia actual |
| `PATCH` | `/families/current` | Actualiza nombre/configuración básica |

### Miembros

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/members` | Lista miembros activos de la familia |
| `POST` | `/members` | Crea miembro |
| `GET` | `/members/:id` | Obtiene miembro |
| `PUT` | `/members/:id` | Actualiza miembro |
| `DELETE` | `/members/:id` | Desactiva miembro |
| `POST` | `/members/:id/pin` | Crea o cambia PIN |
| `POST` | `/members/login` | Valida PIN y selecciona perfil |

## DTOs propuestos

Organización recomendada:

```txt
src/auth/dto/requests/
src/auth/dto/responses/
src/members/dto/requests/
src/members/dto/responses/
src/families/dto/requests/
src/families/dto/responses/
```

### `POST /auth/register`

Request:

```json
{
  "email": "familia@example.com",
  "password": "StrongPassword123!",
  "familyName": "Familia García",
  "adminName": "Mamá",
  "adminPin": "1234"
}
```

Response:

```json
{
  "data": {
    "family": {
      "id": "uuid",
      "name": "Familia García"
    },
    "account": {
      "id": "uuid",
      "email": "familia@example.com",
      "emailVerified": false
    },
    "member": {
      "id": "uuid",
      "name": "Mamá",
      "role": "adult",
      "isAdmin": true
    },
    "tokens": {
      "accessToken": "jwt",
      "refreshToken": "opaque-token"
    }
  }
}
```

### `POST /auth/login`

Request:

```json
{
  "email": "familia@example.com",
  "password": "StrongPassword123!"
}
```

Response:

```json
{
  "data": {
    "family": {
      "id": "uuid",
      "name": "Familia García"
    },
    "members": [
      {
        "id": "uuid",
        "name": "Mamá",
        "role": "adult",
        "avatarUrl": null,
        "color": "#FFB703",
        "icon": "home",
        "isAdmin": true
      }
    ],
    "tokens": {
      "accessToken": "jwt",
      "refreshToken": "opaque-token"
    }
  }
}
```

### `POST /members/login`

Request:

```json
{
  "memberId": "uuid",
  "pin": "1234"
}
```

Response:

```json
{
  "data": {
    "member": {
      "id": "uuid",
      "name": "Mamá",
      "role": "adult",
      "isAdmin": true
    },
    "tokens": {
      "accessToken": "jwt-with-member-context",
      "refreshToken": "opaque-token"
    }
  }
}
```

### `GET /families/current`

Response:

```json
{
  "data": {
    "id": "uuid",
    "name": "Familia García"
  }
}
```

### `GET /members`

Response:

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Mamá",
      "role": "adult",
      "avatarUrl": null,
      "color": "#FFB703",
      "icon": "home",
      "isAdmin": true,
      "isActive": true
    }
  ]
}
```

### `POST /members`

Request:

```json
{
  "name": "Juan",
  "role": "child",
  "avatarUrl": null,
  "color": "#219EBC",
  "icon": "star",
  "pin": "4321"
}
```

Response:

```json
{
  "data": {
    "id": "uuid",
    "name": "Juan",
    "role": "child",
    "avatarUrl": null,
    "color": "#219EBC",
    "icon": "star",
    "isAdmin": false,
    "isActive": true
  }
}
```

### `PUT /members/:id`

Request:

```json
{
  "name": "Juan",
  "role": "child",
  "avatarUrl": null,
  "color": "#8ECAE6",
  "icon": "rocket",
  "isActive": true
}
```

Response:

```json
{
  "data": {
    "id": "uuid",
    "name": "Juan",
    "role": "child",
    "avatarUrl": null,
    "color": "#8ECAE6",
    "icon": "rocket",
    "isAdmin": false,
    "isActive": true
  }
}
```

### `POST /members/:id/pin`

Request:

```json
{
  "pin": "4321"
}
```

Response:

```json
{
  "data": null,
  "message": "PIN updated successfully"
}
```

## Seguridad

### Contraseñas

- Hashear con `bcrypt` o `argon2`.
- No guardar contraseñas en texto plano.
- Validar longitud mínima y complejidad básica.
- Cambios de contraseña deben revocar refresh tokens existentes.

Recomendación MVP: `bcrypt` por simplicidad y adopción en NestJS.

### PIN de 4 dígitos

El PIN también debe hashearse. No es una contraseña fuerte; es una barrera de perfil dentro de una cuenta ya autenticada.

Reglas:

- Exactamente 4 dígitos.
- Guardar `pin_hash`, nunca el PIN real.
- Validar intentos fallidos.
- Bloquear temporalmente tras varios intentos.

Recomendación MVP:

- 5 intentos fallidos.
- Bloqueo por 5 minutos.

### JWT

Usar access token corto.

Payload sugerido antes de seleccionar miembro:

```json
{
  "sub": "userAccountId",
  "familyId": "uuid",
  "type": "family_session"
}
```

Payload sugerido después de seleccionar miembro:

```json
{
  "sub": "userAccountId",
  "familyId": "uuid",
  "memberId": "uuid",
  "role": "adult",
  "isAdmin": true,
  "type": "member_session"
}
```

Expiración sugerida:

- Access token: 15 minutos.
- Refresh token: 7 a 30 días.

### Refresh token

Usar token opaco aleatorio, no JWT, y guardar solo hash en base de datos.

Reglas:

- Rotar refresh token en cada `/auth/refresh`.
- Revocar token anterior al rotar.
- Guardar `revokedAt`.
- Asociar token a familia, cuenta y opcionalmente miembro.

### Persistencia de sesión

En app móvil Angular/Ionic:

- Guardar refresh token en almacenamiento seguro cuando sea posible.
- Mantener access token en memoria o storage controlado.
- Al abrir la app, intentar `/auth/refresh`.
- Si el token familiar existe pero no hay miembro seleccionado, mostrar perfiles.
- Si existe sesión de miembro, entrar directo al dashboard.

### Recuperación de contraseña

No obligatoria en MVP, pero el diseño debe reservar endpoints y entidad futura:

- `password_reset_tokens`
- token hasheado;
- expiración corta;
- uso único.

### Cambio de contraseña

Debe requerir:

- contraseña actual;
- nueva contraseña;
- confirmación.

Después de cambiar:

- revocar refresh tokens existentes;
- emitir nueva sesión o pedir login nuevamente.

## Roles y permisos

### Roles de miembro

```ts
enum FamilyMemberRole {
  ADULT = 'adult',
  CHILD = 'child',
}
```

### Regla simple MVP

- `adult` puede administrar tareas, miembros y rotaciones.
- `child` puede ver y marcar tareas asignadas.
- `isAdmin` habilita configuración sensible de familia.

No conviene crear permisos granulares todavía. Eso sería arquitectura de lujo antes de tener uso real. Primero MVP, después refinamiento.

## Impacto sobre el modelo actual

Originalmente existía `users` como miembro familiar simple. Para autenticación familiar conviene evolucionar el nombre conceptual:

- Opción A: mantener `users` como miembros y agregar `families`, `user_accounts`, `member_pins`.
- Opción B: migrar `users` a `family_members` para que el lenguaje del dominio sea más claro.

Recomendación: Opción B antes de crecer demasiado.

Por qué:

- `User` suele significar cuenta con login.
- En esta app, el miembro no tiene email/contraseña.
- `FamilyMember` expresa mejor el dominio.

Tradeoff:

| Opción | Ventaja | Costo |
|---|---|---|
| Mantener `users` | Menos refactor ahora | Ambigüedad futura entre cuenta y miembro |
| Renombrar a `family_members` | Dominio claro y escalable | Requiere migración/refactor |

Para hacer las cosas bien, conviene pagar el costo ahora, antes de implementar auth.

## Roadmap

### Fase 1: Registro y autenticación

Objetivos:

- Crear entidades `Family`, `UserAccount`, `RefreshToken`.
- Registrar familia + cuenta principal + miembro admin.
- Login con correo y contraseña.
- Emitir access token y refresh token.

Checklist:

- [x] Diseñar migración de `families`.
- [x] Diseñar migración de `user_accounts`.
- [x] Diseñar migración de `refresh_tokens`.
- [x] Crear `AuthModule`.
- [x] Crear `FamiliesModule` básico.
- [x] Crear password hashing service.
- [x] Implementar `POST /auth/register`.
- [x] Implementar `POST /auth/login`.
- [x] Implementar `POST /auth/refresh`.
- [x] Implementar `POST /auth/logout`.

### Fase 2: Miembros de la familia

Objetivos:

- Evolucionar `users` hacia `family_members` o adaptar el modelo actual.
- Gestionar miembros sin correo ni contraseña.

Checklist:

- [x] Definir si se renombra `users` a `family_members`.
- [x] Agregar `family_id` a miembros.
- [x] Agregar `role`, `avatar_url`, `color`, `icon`, `is_admin`.
- [ ] Implementar `GET /members`.
- [ ] Implementar `POST /members`.
- [ ] Implementar `PUT /members/:id`.
- [ ] Implementar `DELETE /members/:id` como desactivación.

### Fase 3: PIN y selección de perfiles

Objetivos:

- Permitir selección de perfil con PIN.
- Emitir sesión con contexto de miembro.

Checklist:

- [x] Crear `member_pins`.
- [x] Hashear PIN.
- [ ] Implementar bloqueo temporal por intentos fallidos.
- [ ] Implementar `POST /members/:id/pin`.
- [ ] Implementar `POST /members/login`.
- [ ] Ajustar JWT para incluir `memberId`.

### Fase 4: Persistencia de sesión

Objetivos:

- Renovar sesiones de forma segura.
- Mantener sesión familiar y sesión de miembro.

Checklist:

- [x] Rotar refresh tokens.
- [x] Revocar tokens al logout.
- [ ] Asociar refresh token a miembro seleccionado cuando corresponda.
- [ ] Agregar `logout-all`.
- [ ] Definir estrategia de almacenamiento para Angular/Ionic.

### Fase 5: Funciones futuras

Objetivos:

- Preparar crecimiento sin romper arquitectura.

Posibles mejoras:

- Verificación de correo.
- Invitaciones por email.
- Google Login.
- Recuperación de contraseña completa.
- Multi-admin avanzado.
- Auditoría de acciones sensibles.
- Permisos más granulares.
- Avatar upload real.
- Control parental para acciones de niños.

## Recomendación final

Antes de implementar auth, conviene resolver una decisión de arquitectura: si `users` seguirá significando miembro familiar o si se renombrará a `family_members`.

Mi recomendación técnica es renombrar a `family_members`. Es más claro, evita confusión con `user_accounts`, y deja el dominio bien parado para crecer. Si no hacemos esto ahora, después vas a pagar el costo cuando ya haya más endpoints, migraciones y relaciones. Mejor corregir los cimientos antes de levantar más pisos.

## Estado de ejecución

Decisión tomada: se renombró el concepto actual de `users` a `family_members`.

Resultado:

- `users` dejó de representar miembros familiares.
- `family_members` representa perfiles/personas de una familia.
- `user_accounts` queda reservado para la futura cuenta con correo y contraseña.
- Las relaciones de tareas, rotaciones e historial ahora apuntan a miembros:
  - `task_rotation_members.member_id`
  - `task_assignments.assigned_member_id`
  - `task_assignment_logs.changed_by_member_id`
- Los endpoints de miembros ahora usan `/members`.

Esto deja el modelo alineado con la experiencia tipo Netflix:

```txt
Cuenta familiar / user_account
  ├─ Perfil / family_member
  ├─ Perfil / family_member
  └─ Perfil / family_member
```

## Estado de ejecución de autenticación

Fase 1 implementada:

- Se crearon las entidades `Family`, `UserAccount`, `RefreshToken` y `MemberPin`.
- Se agregó `family_id`, `role`, `avatar_url`, `color`, `icon` e `is_admin` a `family_members`.
- Se creó la migración `AddFamilyAuthSchema`.
- Se implementaron:
  - `POST /auth/register`
  - `POST /auth/login`
  - `POST /auth/refresh`
  - `POST /auth/logout`
- El refresh token se guarda como hash y se rota en `/auth/refresh`.
- La contraseña y el PIN inicial del administrador se guardan hasheados.

Pendiente para las próximas fases:

- Proteger endpoints con guards JWT.
- Implementar `GET /families/current`.
- Ajustar `/members` para tomar `familyId` desde el JWT en lugar del body.
- Implementar selección de perfil con `POST /members/login`.
- Implementar cambio de PIN e intentos fallidos.

