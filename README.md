# EduJuegos Costa Rica V6

Portal educativo estático en español para estudiantes de 8 a 15 años. Funciona sin servidor, sin cuentas, sin cookies de terceros y sin dependencias externas.

## Contenido

- **14 juegos**: Desafío Matemático, Palabras Mágicas, Laboratorio Científico, Exploradores de Costa Rica, English Adventure, Detectives de Lectura, Geometría en Acción, Guardianes de la Naturaleza, Viajeros del Tiempo, Build a Sentence, Memoria del Saber, Gran Reto Tico, Rutas de Costa Rica y Exploradores del Mundo.
- **10 niveles por juego** (140 niveles en total), con **20 preguntas aleatorias por partida** y desbloqueo con **15 aciertos de 20 (75 %)**.
- **135 países** en la base de geografía mundial, con capitales, continentes y banderas. Para algunos países con capitales múltiples se presenta una capital de referencia.
- **84 cantones** de las 7 provincias de Costa Rica, 94 relaciones de distritos en una **selección no exhaustiva** de cantones, 14 parques nacionales y 12 playas. Revisar los cambios oficiales de división territorial antes de usar como fuente administrativa.
- Progreso individual por apodo guardado en `localStorage` de cada navegador, medallas, estadísticas y sonidos opcionales.

## Publicar en GitHub Pages

1. Descomprime el ZIP.
2. Copia `index.html`, `style.css`, `data.js`, `app.js` y `README.md` en la **raíz** de tu repositorio (por ejemplo, `SantiagoPLAY`).
3. En GitHub abre **Settings → Pages → Build and deployment → Deploy from a branch**.
4. Selecciona la rama `main` y carpeta `/(root)`; guarda y espera a que se publique.
5. Abre la dirección indicada por GitHub Pages. También puedes probar `index.html` directamente sin conexión a internet.

Las banderas del juego mundial se sirven desde `assets/flags/`, por lo que también funcionan sin depender de un CDN durante la partida. Para regenerar o verificar el banco local después de cambiar países, ejecuta `python descargar_banderas.py`; el script obtiene las imágenes faltantes desde FlagCDN y comprueba las 135 banderas.

## Archivos

- `index.html`: estructura accesible y panel de juego.
- `style.css`: diseño adaptable a móvil, tablet y PC.
- `data.js`: datos de geografía y preguntas de referencia.
- `app.js`: motor de preguntas, progresión, medallas y persistencia.
- `build_data.py`: generador opcional de `data.js`, para mantenimiento con Python 3. No es necesario subirlo a GitHub.
- `descargar_banderas.py`: descarga y verifica las imágenes locales de banderas desde FlagCDN.
- `validar_niveles.js`: prueba los 140 niveles, sus opciones, duplicados y recursos visuales.
- `validacion_niveles.md`: reporte generado por el validador.

## Consideraciones

- El progreso queda **solo en el navegador** donde se juega. No se sincroniza entre dispositivos ni se envía a un servidor. Borrar datos del navegador lo elimina.
- Los niveles de matemáticas y geometría generan ejercicios variables; otros bancos usan hechos curados y varían el orden de las preguntas y respuestas. Los niveles avanzados de geografía incorporan tipos adicionales de preguntas. **No todos los juegos disponen de 200 preguntas diferentes por nivel**.
- El proyecto está orientado a práctica y no sustituye los programas oficiales del MEP.
- No se transfieren automáticamente los récords de V5 porque la estructura de datos podría ser distinta; los archivos originales de V5 no se modifican.
- Las preguntas sobre distritos con nombres repetidos pueden ser ambiguas: se recomienda añadir contexto geográfico en futuras revisiones antes de considerar este banco una referencia exhaustiva.

## Privacidad

No se solicita nombre real, correo, teléfono ni ubicación. Se recomienda usar apodos no identificables.
