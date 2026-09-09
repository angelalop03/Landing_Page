# Modelos 3D

Coloca aquí los `.glb` descargados de Sketchfab.

## Cómo descargar de Sketchfab correctamente

1. Busca un modelo y filtra por **Downloadable** y licencia **CC** (revisa si exige atribución).
2. En la página del modelo, botón **Download 3D Model** → elige **glTF (.glb)** (autocontenido, texturas incluidas).
3. Guarda el archivo aquí, ej: `public/models/retro-monitor.glb`.
4. Si el modelo pesa mucho (>5-10 MB), comprímelo con `gltf-transform`:
   ```bash
   npx @gltf-transform/cli optimize public/models/retro-monitor.glb public/models/retro-monitor.glb --compress draco
   ```

## Cómo usarlo en la escena

En `src/scene/DeskSetup.tsx`, sustituye el placeholder por el modelo real dentro del `<Hotspot>` correspondiente:

```tsx
import Model from './Model'

<Hotspot ...>
  <Model url="/models/retro-monitor.glb" scale={0.5} />
</Hotspot>
```

Ajusta `scale`/`position`/`rotation` hasta que encaje con el resto del escritorio.

## Atribución

Si la licencia lo exige, añade un pequeño crédito visible en la UI (ej. en el panel de "Sobre mí" o un footer), con el nombre del autor y enlace a Sketchfab.
