# App RIPS Assembler JSON

## Información del Proyecto

**URL:** https://rips-assembler.netlify.app/

---

## 📦 Módulos Principales

### 1. Generador de RIPS de formatos .txt a .json

Esta aplicación en **React** permite convertir archivos RIPS en formato `.txt` a `.json`, realizar validaciones, consultar tablas de referencia y descargar los resultados en diferentes formatos.

**Funcionalidades:**

- Carga de archivos `.txt` de RIPS.
- Validación automática de estructura y datos.
- Conversión a formato JSON.
- Descarga del archivo consolidado.

### 2. Generador de RIPS de formato .json a .csv

Convierte archivos RIPS en formato `.json` a archivos en `.csv` compatibles con excel. Validar su estructura y descargar el resultado de la conversión.

**Funcionalidades:**

- Carga archivo `.json` de RIPS.
- Validación automática de estructura y datos.
- Conversión a formatos `.csv`.
- Descarga de archivos transaccional (cabecera).
- Descarga de archivos de usuarios.
- Descarga de archivos de servicios (consultas, procedimientos, medicamentos, hospitalización, urgencias, otros servicios).

### 3. Agrupador de Archivos JSON

Permite cargar lotes de archivos `.json` compatibles con las estructuras de un RIPS, valida y une toda la data de los JSON, al final puede descargar un JSON o un CSV.

**Funcionalidades:**

- Descarga de archivos transaccional (cabecera).
- Descarga de archivos de usuarios.
- Descarga de archivos de servicios (consultas, procedimientos, medicamentos, hospitalización, urgencias, otros servicios).

### 4. Tablas de Referencia SISPRO

Consulta y filtra tablas de referencia oficiales (SISPRO) para códigos y descripciones de servicios, medicamentos, procedimientos, etc.

**Funcionalidades:**

- Visualización de tablas de referencia.
- Filtro por tipo de tabla, código o nombre.
- Búsqueda rápida y navegación sencilla.

### 5. Página de Ayuda y 404 Personalizada

Incluye una sección de ayuda con información útil sobre el uso de la herramienta y una página 404 personalizada para rutas no encontradas.

**Funcionalidades:**

- Guía paso a paso para el uso de la aplicación.
- Página de error amigable y con acceso rápido al inicio.

---

## 🚀 ¿Cómo usar la aplicación?

1. **Llenar** el formulario con el NIT, prefijo y número de factura.
2. **Subir** los archivos `.txt` que desea convertir.
3. **Hacer clic** en "Generar RIPS".
4. **Descargar** el archivo convertido a JSON o los archivos CSV según necesidad.
5. **Consultar** las tablas de referencia para validar códigos y descripciones.

---

## 📥 Instalación en Local

1. **Clonar el repositorio**:

   ```bash
   git clone https://github.com/web-v2/rips-txt-json.git
   cd rips-txt-json
   ```

2. **Instalar dependencias y ejecutar**:

   ```bash
   npm install
   npm run dev
   ```

---

## 📜 Licencia

Este proyecto se distribuye bajo la licencia MIT. Puedes usarlo pero NO modificarlo; cualquier alteración debe ser solicitada al área desarrolladora de la herramienta.

---

## 👤 Autor

- **Samir Vergara**  
  Desarrollador de software
