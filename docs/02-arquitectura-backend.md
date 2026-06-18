# Arquitectura backend

La API se organizará con una arquitectura modular de NestJS, separando responsabilidades por dominio sin introducir complejidad innecesaria.

## Decisión principal

Usaremos módulos por dominio, servicios con lógica de negocio, controllers para HTTP, DTOs para contratos de entrada y entidades TypeORM para persistencia.

## Estructura recomendada

```txt
src/
  app.module.ts
  main.ts
  config/
    env.validation.ts
    database.config.ts
  database/
    database.module.ts
    migrations/
  common/
    enums/
    filters/
    interceptors/
  members/
    dto/
    entities/
    members.controller.ts
    members.module.ts
    members.service.ts
  task-categories/
    dto/
    entities/
    task-categories.controller.ts
    task-categories.module.ts
    task-categories.service.ts
  tasks/
    dto/
    entities/
    tasks.controller.ts
    tasks.module.ts
    tasks.service.ts
  task-rotations/
    dto/
    entities/
    task-rotations.controller.ts
    task-rotations.module.ts
    task-rotations.service.ts
  task-assignments/
    dto/
    entities/
    task-assignments.controller.ts
    task-assignments.module.ts
    task-assignments.service.ts
```

## Responsabilidades por capa

| Capa | Responsabilidad |
|---|---|
| Controller | Recibir requests HTTP y devolver responses. |
| DTO | Validar y documentar datos de entrada. |
| Service | Ejecutar reglas de negocio. |
| Entity | Mapear tablas y relaciones de base de datos. |
| Database module | Centralizar configuración TypeORM. |
| Config module | Centralizar variables de entorno. |

## Módulos por dominio

- `family_members`: miembros de la familia.
- `task-categories`: agrupación de tareas.
- `tasks`: definición de tareas recurrentes.
- `task-rotations`: miembros que participan en la rotación de una tarea.
- `task-assignments`: asignaciones generadas, estados e historial.
- `database`: conexión y migraciones.
- `config`: configuración por entorno.

## Por qué TypeORM + migrations

TypeORM permite trabajar con entidades TypeScript y relaciones claras. Las migraciones permiten versionar la estructura de la base de datos de forma controlada.

Ventajas:

- Cambios reproducibles entre ambientes.
- Historial claro de evolución del esquema.
- Menos riesgo de diferencias entre desarrollo y producción.
- Mejor integración con revisión de código.

## Por qué no usar `synchronize: true`

`synchronize: true` modifica la base de datos automáticamente al iniciar la aplicación. Es cómodo al principio, pero peligroso fuera de prototipos.

Riesgos:

- Puede alterar o borrar columnas sin revisión explícita.
- No deja historial auditable del cambio.
- Puede generar diferencias entre ambientes.
- Es riesgoso para producción y datos reales.

Decisión: usar `synchronize: false` siempre como práctica base y crear tablas mediante migraciones.

