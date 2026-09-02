# ShipLog mobile

App móvil de [ShipLog](https://github.com/erasmoh/shiplog) (Expo / React Native + TypeScript). Usa **el mismo backend Supabase** que la web: mismas tablas (`projects`, `entries`), mismas políticas RLS y la misma cuenta. No necesita servidor propio: el cliente habla directo con Supabase y la seguridad la garantiza RLS.

## Qué hace

- Login con magic link (el enlace abre la app vía deep link `shiplog://auth/callback`).
- Lista de proyectos, crear/editar/eliminar proyecto.
- Detalle de proyecto con timeline agrupada por semana ISO.
- Registrar/editar/borrar ships (título, tipo, fecha, detalle, tags).

## Requisitos

- Node 22.
- Backend: el Supabase local del repo `shiplog` corriendo (`npm run supabase:start` allí), o un proyecto Supabase en la nube con la misma migración.
- Para probar en dispositivo: [Expo Go](https://expo.dev/go) o un emulador Android / simulador iOS.

## Setup

```bash
npm install
cp .env.example .env   # rellena EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY (la misma "publishable key" que usa la web)
npm start              # abre el dev server de Expo; pulsa a (Android), i (iOS) o w (web)
```

> Si usas Supabase local desde un emulador Android, cambia `EXPO_PUBLIC_SUPABASE_URL` a `http://10.0.2.2:54321` (alias del host desde el emulador). En dispositivo físico usa la IP LAN de tu máquina.

### Redirect del magic link

Supabase solo redirige a URLs permitidas. En `supabase/config.toml` del repo `shiplog` (o en Auth → URL Configuration en la nube) debe estar:

```toml
additional_redirect_urls = [..., "shiplog://**", "exp://**"]
```

`exp://**` es necesario mientras pruebes con Expo Go; `shiplog://**` para builds nativas (scheme definido en `app.json`).

## Scripts

```bash
npm run lint
npm run typecheck
npx expo export --platform android   # comprueba que el bundle compila
```

## Estructura

```
src/app/            rutas (expo-router)
  login.tsx         magic link
  auth/callback.tsx intercambio del código PKCE
  (app)/            rutas protegidas: proyectos, detalle, formularios
src/components/     ui.tsx, project-form, entry-form, timeline
src/lib/            supabase.ts, session.tsx, use-query.ts, week.ts, slug.ts, constants.ts
src/lib/database.types.ts  tipos generados en el repo shiplog (npm run db:types) — copiar al cambiar el esquema
```
