# Plan de endpoints API

Los endpoints iniciales priorizan CRUD simple, configuración de rotaciones y generación de asignaciones.

## Convenciones de respuesta

Respuesta simple recomendada:

```json
{
  "data": {},
  "message": "Operation completed successfully"
}
```

Para listados:

```json
{
  "data": [],
  "meta": {
    "total": 0
  }
}
```

## Members

### Crear miembro

| Campo | Valor |
|---|---|
| Método | `POST` |
| Ruta | `/members` |
| Descripción | Crea un miembro de la familia. |

Request body:

```json
{
  "name": "Ana",
  "email": "ana@example.com"
}
```

Response esperado:

```json
{
  "data": {
    "id": "uuid",
    "name": "Ana",
    "email": "ana@example.com",
    "isActive": true
  }
}
```

### Listar miembros

| Campo | Valor |
|---|---|
| Método | `GET` |
| Ruta | `/members` |
| Descripción | Lista miembros activos. |

Response esperado:

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Ana",
      "email": "ana@example.com",
      "isActive": true
    }
  ]
}
```

## Task categories

### Crear categoría

| Campo | Valor |
|---|---|
| Método | `POST` |
| Ruta | `/task-categories` |
| Descripción | Crea una categoría de tareas. |

Request body:

```json
{
  "name": "Limpieza",
  "description": "Tareas generales de limpieza"
}
```

Response esperado:

```json
{
  "data": {
    "id": "uuid",
    "name": "Limpieza",
    "description": "Tareas generales de limpieza"
  }
}
```

## Tasks

### Crear tarea

| Campo | Valor |
|---|---|
| Método | `POST` |
| Ruta | `/tasks` |
| Descripción | Crea una tarea recurrente. |

Request body:

```json
{
  "title": "Limpiar cocina",
  "description": "Limpiar mesada, cocina y piso",
  "categoryId": "uuid",
  "recurrenceType": "weekly",
  "dayOfWeek": "saturday"
}
```

Response esperado:

```json
{
  "data": {
    "id": "uuid",
    "title": "Limpiar cocina",
    "recurrenceType": "weekly",
    "dayOfWeek": "saturday",
    "isActive": true
  }
}
```

## Task rotations

### Configurar rotación de tarea

| Campo | Valor |
|---|---|
| Método | `PUT` |
| Ruta | `/tasks/:taskId/rotation` |
| Descripción | Define los miembros que rotan en una tarea y su orden. |

Request body:

```json
{
  "members": [
    { "memberId": "uuid-member-1", "position": 1 },
    { "memberId": "uuid-member-2", "position": 2 }
  ]
}
```

Response esperado:

```json
{
  "data": {
    "taskId": "uuid-task",
    "members": [
      { "memberId": "uuid-member-1", "position": 1 },
      { "memberId": "uuid-member-2", "position": 2 }
    ]
  }
}
```

## Task assignments

### Generar asignaciones

| Campo | Valor |
|---|---|
| Método | `POST` |
| Ruta | `/task-assignments/generate` |
| Descripción | Genera asignaciones para un rango de fechas. |

Request body:

```json
{
  "from": "2026-06-22",
  "to": "2026-06-28"
}
```

Response esperado:

```json
{
  "data": {
    "generated": 5,
    "skippedExisting": 2
  }
}
```

### Listar asignaciones por semana

| Campo | Valor |
|---|---|
| Método | `GET` |
| Ruta | `/task-assignments?from=2026-06-22&to=2026-06-28` |
| Descripción | Lista asignaciones dentro de un rango semanal. |

Response esperado:

```json
{
  "data": [
    {
      "id": "uuid",
      "task": { "id": "uuid", "title": "Limpiar cocina" },
      "assignedMember": { "id": "uuid", "name": "Ana" },
      "scheduledFor": "2026-06-27",
      "status": "pending"
    }
  ]
}
```

### Marcar tarea como completada

| Campo | Valor |
|---|---|
| Método | `PATCH` |
| Ruta | `/task-assignments/:id/complete` |
| Descripción | Marca una asignación como completada. |

Request body:

```json
{
  "notes": "Realizada por la mañana"
}
```

Response esperado:

```json
{
  "data": {
    "id": "uuid",
    "status": "completed",
    "completedAt": "2026-06-27T10:00:00.000Z"
  }
}
```

### Marcar tarea como no realizada

| Campo | Valor |
|---|---|
| Método | `PATCH` |
| Ruta | `/task-assignments/:id/skip` |
| Descripción | Marca una asignación como omitida/no realizada. |

Request body:

```json
{
  "reason": "No hubo tiempo"
}
```

Response esperado:

```json
{
  "data": {
    "id": "uuid",
    "status": "skipped"
  }
}
```

### Ver historial de asignación

| Campo | Valor |
|---|---|
| Método | `GET` |
| Ruta | `/task-assignments/:id/logs` |
| Descripción | Lista cambios de estado de una asignación. |

Response esperado:

```json
{
  "data": [
    {
      "id": "uuid",
      "fromStatus": "pending",
      "toStatus": "completed",
      "message": "Realizada por la mañana",
      "createdAt": "2026-06-27T10:00:00.000Z"
    }
  ]
}
```

