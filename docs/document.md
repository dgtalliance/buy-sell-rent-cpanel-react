# 📘 **Documentación del API – IdxForms**

Base URL de los endpoints:

```
/api/idxforms
```

Todos los endpoints requieren:

- `registration_key` como campo obligatorio para escritura (crear/editar)
- En las consultas de listado, el `registration_key` debe venir como parámetro para filtrar los resultados

---

# 📌 **Entidad IdxForms**

Campos:

| Campo            | Tipo         | Obligatorio | Descripción                                             |
| ---------------- | ------------ | ----------- | ------------------------------------------------------- |
| id               | int          | No          | Autogenerado                                            |
| registration_key | string       | Sí          | Clave que agrupa los formularios por cliente            |
| name             | string       | Sí          | Nombre del formulario                                   |
| formType         | string       | Sí          | Tipo de formulario (ej: Buy, Sell)                      |
| slug             | string       | Sí          | Slug único                                              |
| steps            | JSON         | No          | Lista de steps, cada uno puede tener `background_image` |
| background_image | string (URL) | No          | Imagen principal del formulario                         |
| createdAt        | datetime     | No          | Generado automáticamente                                |
| modifiedIn       | datetime     | No          | Actualizado automáticamente                             |

---

# 📤 **📦 Manejo de imágenes (`background_image`)**

### Las reglas son:

### 🔹 En **create**:

- Si `background_image` o los `steps[].background_image` vienen **base64**, se suben a S3 y se guardan como URL.
- Si vienen vacíos, se guardan como vacío.
- Si vienen como URL, se mantiene la URL.

### 🔹 En **edit**:

- Si vienen como URL → se mantiene.
- Si vienen como base64 → se suben a S3 y se reemplaza por URL.
- Siempre se guarda una URL en la base de datos.

---

# 📍 **ENDPOINTS**

---

# 🔹 **1. Listar con paginación**

### GET `/api/idxforms`

### Query params:

| Param              | Tipo   | Descripción                       |
| ------------------ | ------ | --------------------------------- |
| `registration_key` | string | **Obligatorio**                   |
| `page`             | int    | Página actual (default: 1)        |
| `limit`            | int    | Cantidad por página (default: 20) |

### Ejemplo:

```
GET /api/idxforms?registration_key=123&page=1&limit=10
```

### Respuesta:

```json
{
  "page": 1,
  "limit": 10,
  "total": 42,
  "items": [
    {
      "id": 1,
      "name": "...",
      "slug": "..."
    }
  ]
}
```

---

# 🔹 **2. Obtener por ID**

### GET `/api/idxforms/{id}`

### Ejemplo:

```
GET /api/idxforms/55
```

### Respuesta:

```json
{
  "id": 55,
  "registration_key": "123",
  "name": "Form X",
  "background_image": "https://s3.amazonaws.com/bucket/formimg.png",
  "steps": [...]
}
```

---

# 🔹 **3. Obtener por SLUG**

### GET `/api/idxforms/slug/{slug}`

### Ejemplo:

```
GET /api/idxforms/slug/buyers-guide
```

### Respuesta:

```json
{
  "id": 1,
  "slug": "buyers-guide",
  "registration_key": "123",
  "steps": [...]
}
```

---

# 🔹 **4. Crear**

### POST `/api/idxforms`

### Body JSON:

```json
{
  "registration_key": "123",
  "name": "name123",
  "formType": "Buy",
  "slug": "name123",
  "background_image": "base64image",
  "steps": [
    {
      "question": "What Are You Looking To Buy?",
      "questionType": "select_multiple",
      "options": ["CONDO", "SINGLE FAMILY HOME"],
      "background_image": ""
    },
    {
      "question": "What's Your Price Range?",
      "questionType": "select_simple",
      "options": ["BELOW $1M", "$1M TO $3M"],
      "background_image": "base64image"
    }
  ]
}
```

### Respuesta:

```json
{
  "status": "success",
  "id": 77
}
```

---

# 🔹 **5. Editar**

### PUT `/api/idxforms/{id}`

### Reglas sobre imágenes:

- Si el valor es base64 → subir a S3 → reemplazar por URL
- Si es URL → mantener
- Si está vacío → mantener vacío

### Ejemplo body:

```json
{
  "name": "New Name",
  "background_image": "base64...",
  "steps": [
    {
      "question": "...",
      "background_image": "https://s3.amazon/...existing.jpg"
    }
  ]
}
```

### Respuesta:

```json
{
  "status": "success"
}
```

---

# 🔹 **6. Eliminar**

### DELETE `/api/idxforms/{id}`

### Ejemplo:

```
DELETE /api/idxforms/55
```

### Respuesta:

```json
{
  "status": "deleted"
}
```

---

# 🌐 **Formato final de un registro almacenado**

```json
{
  "id": 20,
  "registration_key": "123",
  "name": "name123",
  "formType": "Buy",
  "slug": "name123",
  "background_image": "https://s3.amazon.com/bucket/form-bg.jpg",
  "steps": [
    {
      "question": "What Are You Looking To Buy?",
      "questionType": "select_multiple",
      "options": ["CONDO", "SINGLE FAMILY HOME"],
      "background_image": ""
    },
    {
      "question": "What's Your Price Range?",
      "questionType": "select_simple",
      "options": ["BELOW $1M", "$1M TO $3M"],
      "background_image": "https://s3.amazon.com/bucket/step2.jpg"
    }
  ]
}
```
