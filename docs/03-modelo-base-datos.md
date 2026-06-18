# Modelo de base de datos

El modelo inicial cubre miembros, categorías, tareas recurrentes, rotación de miembros, asignaciones generadas e historial de cambios.

## Tablas principales

### `family_members`

Representa a un miembro de la familia.

Campos recomendados:

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid | Primary key. |
| `name` | varchar | Nombre visible. |
| `email` | varchar nullable | Opcional por ahora. |
| `is_active` | boolean | Permite ocultar miembros sin borrar historial. |
| `created_at` | timestamp | Fecha de creación. |
| `updated_at` | timestamp | Fecha de actualización. |

### `task_categories`

Agrupa tareas por tipo.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid | Primary key. |
| `name` | varchar | Nombre único de categoría. |
| `description` | text nullable | Descripción opcional. |
| `created_at` | timestamp | Fecha de creación. |
| `updated_at` | timestamp | Fecha de actualización. |

### `tasks`

Define una tarea recurrente.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid | Primary key. |
| `category_id` | uuid nullable | FK a `task_categories`. |
| `title` | varchar | Nombre de la tarea. |
| `description` | text nullable | Detalle opcional. |
| `recurrence_type` | enum | Tipo de recurrencia. |
| `day_of_week` | enum nullable | Día sugerido si aplica semanalmente. |
| `is_active` | boolean | Activa/inactiva. |
| `created_at` | timestamp | Fecha de creación. |
| `updated_at` | timestamp | Fecha de actualización. |

### `task_rotation_members`

Define qué miembros participan en la rotación de una tarea y en qué orden.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid | Primary key. |
| `task_id` | uuid | FK a `tasks`. |
| `member_id` | uuid | FK a `family_members`. |
| `position` | int | Orden dentro de la rotación. |
| `is_active` | boolean | Permite pausar un miembro en una rotación. |
| `created_at` | timestamp | Fecha de creación. |
| `updated_at` | timestamp | Fecha de actualización. |

### `task_assignments`

Representa una instancia concreta de una tarea asignada a un miembro en una fecha.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid | Primary key. |
| `task_id` | uuid | FK a `tasks`. |
| `assigned_member_id` | uuid | FK a `family_members`. |
| `scheduled_for` | date | Fecha programada. |
| `status` | enum | Estado de la asignación. |
| `completed_at` | timestamp nullable | Fecha de finalización. |
| `notes` | text nullable | Comentarios opcionales. |
| `created_at` | timestamp | Fecha de creación. |
| `updated_at` | timestamp | Fecha de actualización. |

### `task_assignment_logs`

Historial de cambios relevantes de una asignación.

| Campo | Tipo | Notas |
|---|---|---|
| `id` | uuid | Primary key. |
| `assignment_id` | uuid | FK a `task_assignments`. |
| `changed_by_member_id` | uuid nullable | FK a `family_members`. Nullable hasta tener autenticación. |
| `from_status` | enum nullable | Estado anterior. |
| `to_status` | enum | Estado nuevo. |
| `message` | text nullable | Motivo o detalle. |
| `created_at` | timestamp | Fecha del evento. |

## Enums iniciales

### `TaskRecurrenceType`

```ts
enum TaskRecurrenceType {
  WEEKLY = 'weekly',
}
```

Se empieza solo con semanal para mantener el MVP enfocado. Luego puede crecer a diaria, mensual o personalizada.

### `DayOfWeek`

```ts
enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}
```

### `TaskAssignmentStatus`

```ts
enum TaskAssignmentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
  EXPIRED = 'expired',
}
```

## Relaciones

- Una categoría tiene muchas tareas.
- Una tarea pertenece opcionalmente a una categoría.
- Una tarea tiene muchos miembros de rotación.
- Un miembro puede participar en muchas rotaciones.
- Una tarea tiene muchas asignaciones.
- Un miembro puede tener muchas asignaciones.
- Una asignación tiene muchos logs.

## Diagrama textual

```txt
Members
  ├─< task_rotation_members >─ tasks >─ task_categories
  └─< task_assignments >───────┘
           └─< task_assignment_logs
```

## Reglas de negocio base

- Un miembro representa a un miembro de la familia.
- Una tarea puede repetirse semanalmente.
- Una tarea puede tener una rotación de miembros.
- La API debe poder generar asignaciones futuras.
- Una asignación puede estar pendiente, completada, omitida o vencida.
- Todo cambio relevante de estado debe quedar en historial.
- No se debe borrar físicamente información importante si afecta historial.

