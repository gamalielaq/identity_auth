# Modelo de base de datos Auth

Tablas objetivo:

```txt
users
applications
user_applications
refresh_tokens
sessions
```

Relaciones:

```txt
users 1 -- * user_applications * -- 1 applications
users 1 -- * refresh_tokens
applications 1 -- * refresh_tokens
refresh_tokens 1 -- 1 sessions
users 1 -- * sessions
applications 1 -- * sessions
```

Índices únicos:

- `users.email`
- `applications.code`
- `applications.client_id`
- `user_applications(user_id, application_id)`
