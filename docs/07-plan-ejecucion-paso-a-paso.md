# Plan de ejecución paso a paso

Este plan permite avanzar por fases. No se implementa código todavía. Más adelante se podrá pedir: `ejecuta fase 1`, `ejecuta fase 2`, etc.

## Fase 1: Configuración base del proyecto NestJS

Objetivo:

- Validar el proyecto NestJS base y dejarlo preparado para módulos limpios.

Checklist:

- [x] Revisar estructura inicial del proyecto.
- [x] Confirmar scripts de desarrollo y build.
- [x] Configurar formato/lint si falta.
- [x] Definir estructura base de carpetas.
- [x] Verificar que la app levante localmente.

Resultado:

- Proyecto NestJS base detectado con `src/`, `test/`, `package.json`, ESLint, Prettier, Jest y scripts estándar.
- No se crearon carpetas vacías todavía: se crearán por fase cuando haya código real que ubicar. Esto evita estructura artificial.
- Build verificado con `npm.cmd run build`.
- Test unitario base verificado con `npm.cmd test`.
- Arranque HTTP verificado creando la app Nest compilada y consultando `GET /`, con respuesta `Hello World!`.

Nota:

- En PowerShell, `npm run ...` falló por política local de ejecución de scripts sobre `npm.ps1`. Para este entorno se usó `npm.cmd ...`, que ejecuta correctamente los scripts.

## Fase 2: Configuración MySQL + TypeORM + env

Objetivo:

- Conectar NestJS con MySQL usando TypeORM y variables de entorno.

Checklist:

- [x] Instalar dependencias necesarias.
- [x] Configurar `@nestjs/config`.
- [x] Crear validación de variables de entorno.
- [x] Crear `DatabaseModule`.
- [x] Crear `data-source.ts` para migraciones.
- [x] Confirmar `synchronize: false`.

Resultado:

- Dependencias instaladas: `@nestjs/config`, `@nestjs/typeorm`, `typeorm`, `mysql2`, `joi` y `dotenv`.
- `ConfigModule` configurado como global con validación de variables de entorno.
- `DatabaseModule` configurado con `TypeOrmModule.forRootAsync`.
- `src/database/data-source.ts` creado para comandos CLI de TypeORM.
- `.env.example` creado con variables base de MySQL.
- `.gitignore` creado para evitar subir `.env`, `node_modules`, `dist` y `coverage`.
- Scripts de migraciones agregados en `package.json`.
- Build verificado con `npm.cmd run build`.
- Tests verificados con `npm.cmd test`.
- Lint verificado con `npm.cmd run lint`.
- CLI de TypeORM verificada con `npm.cmd run typeorm -- --version`, respondiendo `0.3.28`.

Nota:

- La aplicación ya intenta conectarse a MySQL al iniciar. Para levantarla localmente hace falta crear un `.env` real basado en `.env.example` y tener disponible la base de datos configurada.

## Fase 3: Diseño de entidades

Objetivo:

- Crear entidades TypeORM limpias para el modelo inicial.

Checklist:

- [x] Crear entidad `FamilyMember`.
- [x] Crear entidad `TaskCategory`.
- [x] Crear entidad `Task`.
- [x] Crear entidad `TaskRotationMember`.
- [x] Crear entidad `TaskAssignment`.
- [x] Crear entidad `TaskAssignmentLog`.
- [x] Crear enums compartidos.
- [x] Definir relaciones TypeORM.

Resultado:

- `.env` local creado desde `.env.example`.
- Enums creados en `src/common/enums`.
- Entidades creadas por dominio:
  - `src/members/entities/family-member.entity.ts`
  - `src/task-categories/entities/task-category.entity.ts`
  - `src/tasks/entities/task.entity.ts`
  - `src/task-rotations/entities/task-rotation-member.entity.ts`
  - `src/task-assignments/entities/task-assignment.entity.ts`
  - `src/task-assignments/entities/task-assignment-log.entity.ts`
- Relaciones TypeORM definidas para categorías, tareas, rotaciones, asignaciones e historial.
- Índices únicos definidos para evitar duplicados básicos:
  - un mismo usuario repetido en la rotación de una tarea;
  - una misma posición repetida dentro de una tarea;
  - una asignación duplicada para la misma tarea y fecha.
- Build verificado con `npm.cmd run build`.
- Tests verificados con `npm.cmd test`.
- Lint verificado con `npm.cmd run lint`.
- CLI de TypeORM verificada con `npm.cmd run typeorm -- --version`.

Nota:

- Esta fase define modelo y relaciones, pero todavía no crea tablas en MySQL. Eso corresponde a la Fase 4 con migraciones.

## Fase 4: Migración inicial

Objetivo:

- Crear y ejecutar la migración inicial del esquema.

Checklist:

- [x] Generar migración inicial.
- [x] Revisar SQL generado.
- [x] Ejecutar migración en MySQL local.
- [x] Verificar tablas creadas.
- [x] Confirmar que la app no depende de `synchronize`.

Resultado:

- Base de datos local `family_tasks` creada si no existía.
- Migración inicial generada:
  - `src/database/migrations/1781802374016-InitialSchema.ts`
- La migración crea:
  - `family_members`
  - `task_categories`
  - `tasks`
  - `task_rotation_members`
  - `task_assignments`
  - `task_assignment_logs`
  - `migrations`
- SQL revisado: incluye claves primarias, enums, índices únicos y foreign keys esperadas.
- Migración ejecutada con `npm.cmd run migration:run`.
- Estado verificado con `npm.cmd run typeorm -- migration:show`, mostrando `InitialSchema1781802374016` aplicada.
- Tablas verificadas con consulta directa a MySQL.
- Build verificado con `npm.cmd run build`.
- Tests verificados con `npm.cmd test`.
- Lint verificado con `npm.cmd run lint`.

Nota:

- `synchronize` sigue desactivado. La estructura de la base quedó creada por migración, como corresponde.

## Fase 5: CRUD miembros y categorías

Objetivo:

- Implementar endpoints básicos para miembros y categorías.

Checklist:

- [x] Crear módulo `members`.
- [x] Crear DTOs `CreateMemberDto` y `UpdateMemberDto`.
- [x] Implementar CRUD básico de miembros.
- [x] Crear módulo `task-categories`.
- [x] Crear DTOs de categorías.
- [x] Implementar CRUD básico de categorías.
- [x] Agregar validaciones con `class-validator`.

Resultado:

- Dependencias instaladas: `class-validator` y `class-transformer`.
- `ValidationPipe` global configurado con:
  - `whitelist: true`
  - `forbidNonWhitelisted: true`
  - `transform: true`
- Módulo `members` creado con controller, service, DTOs y repositorio TypeORM.
- Módulo `task-categories` creado con controller, service, DTOs y repositorio TypeORM.
- `DELETE /members/:id` desactiva el miembro con `isActive = false` para preservar historial futuro.
- `DELETE /task-categories/:id` elimina la categoría; las tareas futuras podrán quedar con `category_id = null` por la FK `ON DELETE SET NULL`.
- Configuración runtime de TypeORM ajustada para registrar todas las entidades del modelo inicial, evitando errores de metadata en relaciones todavía no expuestas por módulos funcionales.
- Build verificado con `npm.cmd run build`.
- Tests verificados con `npm.cmd test`.
- Lint verificado con `npm.cmd run lint`.
- Schema verificado con `npm.cmd run typeorm -- schema:log`, sin queries pendientes.
- Endpoints verificados localmente:
  - `GET /members`
  - `POST /members`
  - `PATCH /members/:id`
  - `DELETE /members/:id`
  - `GET /task-categories`
  - `POST /task-categories`
  - `DELETE /task-categories/:id`

Nota:

- Para no ensuciar la base local, los datos temporales usados en la verificación fueron limpiados al finalizar la prueba.

## Fase 6: CRUD tareas

Objetivo:

- Implementar administración de tareas recurrentes.

Checklist:

- [x] Crear módulo `tasks`.
- [x] Crear DTOs `CreateTaskDto` y `UpdateTaskDto`.
- [x] Validar recurrencia semanal.
- [x] Asociar tarea a categoría opcional.
- [x] Implementar CRUD básico.
- [x] Evitar borrado destructivo si hay historial relacionado.

Resultado:

- Módulo `tasks` creado con controller, service, DTOs y repositorios TypeORM.
- DTOs creados:
  - `CreateTaskDto`
  - `UpdateTaskDto`
- Validaciones agregadas para:
  - `title`
  - `description`
  - `categoryId`
  - `recurrenceType`
  - `dayOfWeek`
  - `isActive`
- `categoryId` es opcional, pero si se envía debe existir en `task_categories`.
- `recurrenceType` queda limitado al enum inicial `weekly`.
- `DELETE /tasks/:id` desactiva la tarea con `isActive = false`, evitando borrado destructivo.
- `TasksModule` registrado en `AppModule`.
- Build verificado con `npm.cmd run build`.
- Tests verificados con `npm.cmd test`.
- Lint verificado con `npm.cmd run lint`.
- Endpoints verificados localmente:
  - `POST /tasks`
  - `GET /tasks`
  - `GET /tasks/:id`
  - `PATCH /tasks/:id`
  - `DELETE /tasks/:id`

Nota:

- Para no ensuciar la base local, los datos temporales usados en la verificación fueron limpiados al finalizar la prueba.

## Fase 7: Rotación de miembros por tarea

Objetivo:

- Permitir configurar qué usuarios participan en cada tarea y en qué orden.

Checklist:

- [x] Crear módulo `task-rotations`.
- [x] Crear DTO para configurar rotación.
- [x] Validar que la tarea exista.
- [x] Validar que los usuarios existan.
- [x] Validar posiciones únicas.
- [x] Implementar reemplazo completo de rotación por tarea.
- [x] Implementar consulta de rotación por tarea.

Resultado:

- Módulo `task-rotations` creado con controller, service, DTO y repositorios TypeORM.
- DTO creado:
  - `SetTaskRotationDto`
- La configuración de rotación valida:
  - que la tarea exista;
  - que los usuarios existan y estén activos;
  - que no haya usuarios repetidos;
  - que no haya posiciones repetidas;
  - que cada posición sea un entero mayor o igual a `1`.
- `PUT /tasks/:taskId/rotation` reemplaza la rotación completa de una tarea dentro de una transacción.
- `GET /tasks/:taskId/rotation` consulta la rotación ordenada por posición.
- `DELETE /tasks/:taskId/rotation/:memberId` elimina un miembro de la rotación.
- `TaskRotationsModule` registrado en `AppModule`.
- Build verificado con `npm.cmd run build`.
- Tests verificados con `npm.cmd test`.
- Lint verificado con `npm.cmd run lint`.
- Endpoints verificados localmente:
  - `PUT /tasks/:taskId/rotation`
  - `GET /tasks/:taskId/rotation`
  - `DELETE /tasks/:taskId/rotation/:memberId`

Nota:

- Para no ensuciar la base local, los datos temporales usados en la verificación fueron limpiados al finalizar la prueba.

## Trabajo transversal: refactor `users` a `family_members`

Objetivo:

- Separar correctamente el concepto de cuenta de login del concepto de miembro/perfil familiar antes de implementar autenticación.

Resultado:

- Se decidió que `UserAccount` será la entidad futura para correo + contraseña.
- Se renombró el concepto actual de `users` a `family_members`.
- Se creó el módulo `members` en lugar de `users`.
- Se eliminaron los endpoints `/users` y fueron reemplazados por `/members`.
- Se actualizó `task_rotation_members`:
  - `user_id` pasó a `member_id`.
- Se actualizó `task_assignments`:
  - `assigned_user_id` pasó a `assigned_member_id`.
- Se actualizó `task_assignment_logs`:
  - `changed_by_user_id` pasó a `changed_by_member_id`.
- Se creó y ejecutó la migración:
  - `src/database/migrations/1781810000000-RenameUsersToFamilyMembers.ts`
- Migraciones verificadas con `npm.cmd run typeorm -- migration:show`.
- Build verificado con `npm.cmd run build`.
- Tests verificados con `npm.cmd test`.
- Lint verificado con `npm.cmd run lint`.
- Endpoints verificados localmente:
  - `POST /members`
  - `GET /members`
  - `PUT /tasks/:taskId/rotation` usando `memberId`
  - `GET /tasks/:taskId/rotation`
  - `DELETE /tasks/:taskId/rotation/:memberId`

Nota:

- Este refactor es previo a auth. Evita mezclar “cuenta que inicia sesión” con “perfil/miembro familiar”, igual que Netflix separa cuenta de perfiles.

## Trabajo transversal: Swagger / OpenAPI

Objetivo:

- Exponer documentación interactiva para inspeccionar y probar la API durante el desarrollo.

Resultado:

- Dependencias instaladas:
  - `@nestjs/swagger`
  - `swagger-ui-express`
- Swagger configurado en `src/main.ts`.
- Documentación interactiva disponible en:
  - `GET /api`
- Documento OpenAPI JSON disponible en:
  - `GET /api-json`
- Verificado con `npm.cmd run build`.
- Verificado con `npm.cmd test`.
- Verificado con `npm.cmd run lint`.
- Verificado levantando la app y consultando `/api-json`, con respuesta `200` y `9` rutas documentadas.
- DTOs documentados con `@ApiProperty` y `@ApiPropertyOptional` para que Swagger muestre propiedades y `Example Value` correctamente en:
  - members
  - task-categories
  - tasks
  - task-rotations

Nota:

- Este cambio no reemplaza la Fase 8. Es una mejora transversal para poder revisar y probar mejor los endpoints ya construidos y los que siguen.

## Trabajo transversal: Autenticación familiar - Fase 1

Objetivo:

- Crear la base de cuenta familiar con `user_accounts`, manteniendo separados los perfiles `family_members`.

Resultado:

- Entidades creadas:
  - `Family`
  - `UserAccount`
  - `RefreshToken`
  - `MemberPin`
- `family_members` ahora pertenece a una familia y soporta rol, avatar/color/icono e indicador admin.
- Migración aplicada:
  - `AddFamilyAuthSchema1781815000000`
- Endpoints implementados:
  - `POST /auth/register`
  - `POST /auth/login`
  - `POST /auth/refresh`
  - `POST /auth/logout`
- Verificado con:
  - `npm.cmd run build`
  - `npm.cmd test`
  - `npm.cmd run lint`
  - `npm.cmd run typeorm -- schema:log`
  - prueba funcional de register/login/refresh/logout.

Pendiente:

- Agregar guards JWT.
- Implementar `GET /families/current`.
- Ajustar `/members` para resolver la familia desde el token.
- Implementar login de perfil con PIN.

## Fase 8: Generación de asignaciones

Objetivo:

- Generar asignaciones futuras usando tareas activas y rotaciones configuradas.

Checklist:

- [ ] Crear módulo `task-assignments`.
- [ ] Crear DTO `GenerateAssignmentsDto`.
- [ ] Generar asignaciones por rango de fechas.
- [ ] Evitar duplicados para la misma tarea y fecha.
- [ ] Determinar usuario asignado según rotación.
- [ ] Devolver resumen de asignaciones generadas.

## Fase 9: Estados e historial

Objetivo:

- Permitir cambios de estado y registrar historial.

Checklist:

- [ ] Implementar completar asignación.
- [ ] Implementar marcar como omitida/no realizada.
- [ ] Implementar vencimiento si corresponde.
- [ ] Crear logs por cambio de estado.
- [ ] Consultar historial de una asignación.
- [ ] Validar transiciones de estado permitidas.

## Fase 10: Validaciones y limpieza final

Objetivo:

- Dejar el backend consistente, validado y preparado para frontend Angular/Ionic.

Checklist:

- [ ] Revisar DTOs create/update.
- [ ] Revisar responses consistentes.
- [ ] Agregar pipes globales de validación.
- [ ] Revisar errores HTTP.
- [ ] Revisar nombres de rutas.
- [ ] Ejecutar build.
- [ ] Documentar comandos finales.

## Regla de avance

No avanzar a una fase nueva sin haber verificado la anterior. La idea no es correr: es construir base sólida. Una API mal modelada se paga después con intereses.

