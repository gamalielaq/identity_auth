# Plan de migraciones TypeORM

Las tablas se crearán mediante migraciones de TypeORM. No se usará `synchronize: true` para crear o modificar el esquema.

## Configuración esperada

Se configurará un `DataSource` separado para CLI de TypeORM, por ejemplo:

```txt
src/database/data-source.ts
```

Ese archivo deberá:

- Leer variables de entorno.
- Configurar MySQL.
- Registrar entidades.
- Registrar migraciones.
- Tener `synchronize: false`.

## Variables de entorno sugeridas

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=family_tasks
```

## Scripts npm sugeridos

```json
{
  "scripts": {
    "typeorm": "typeorm-ts-node-commonjs -d src/database/data-source.ts",
    "migration:generate": "npm run typeorm -- migration:generate",
    "migration:create": "npm run typeorm -- migration:create",
    "migration:run": "npm run typeorm -- migration:run",
    "migration:revert": "npm run typeorm -- migration:revert"
  }
}
```

> Si el proyecto usa ESM, los comandos pueden requerir `typeorm-ts-node-esm`. Esto se validará durante la fase de configuración.

## Crear migración inicial

Comando sugerido:

```bash
npm run migration:generate -- src/database/migrations/InitialSchema
```

La migración inicial debe crear:

- `family_members`
- `task_categories`
- `tasks`
- `task_rotation_members`
- `task_assignments`
- `task_assignment_logs`

## Ejecutar migraciones

```bash
npm run migration:run
```

Este comando aplicará las migraciones pendientes en la base de datos configurada.

## Revertir migraciones

```bash
npm run migration:revert
```

Este comando revierte la última migración aplicada.

## Reglas importantes

- `synchronize` debe quedar en `false`.
- Las tablas se crean con migraciones.
- Cada cambio estructural debe tener su propia migración.
- Las migraciones deben revisarse antes de ejecutarse en ambientes compartidos.
- Las entidades y las migraciones deben evolucionar juntas.

