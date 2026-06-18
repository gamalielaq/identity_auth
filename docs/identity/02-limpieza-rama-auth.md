# Limpieza de rama auth

Se eliminan de esta rama los módulos de negocio:

- families
- members / family_members
- tasks
- task-categories
- task-rotations
- task-assignments

También se reemplazan las migraciones de negocio por una migración limpia de identidad.

Se conserva:

- configuración base NestJS
- config/env
- database/data-source
- auth
- users
- applications
- sessions
- common
