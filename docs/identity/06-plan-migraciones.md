# Plan de migraciones

Reglas:

- No usar `synchronize: true`.
- Usar TypeORM migrations.
- La migración actual de esta rama crea solamente tablas de identidad.
- La migración elimina tablas conocidas de negocio si existen en una base vieja.

Comandos:

```bash
npm.cmd run migration:run
npm.cmd run migration:revert
npm.cmd run typeorm -- schema:log
```
