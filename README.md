# 🚚 Sistema de Gestión de Transporte - Personas y Carga

Sistema web/móvil minimalista para la centralización de servicios de transporte de personas y mercancías ("cosas"), diseñado para la captura inmediata de datos, consulta en tiempo real e integración con WhatsApp para contacto directo.

---

## 🎯 Objetivo del Proyecto

Eliminar la pérdida de información operativa (registros en papel o chats dispersos) mediante una base de datos centralizada de fácil acceso para el equipo interno.

---

## 📋 Características Principales

* **Registro Centralizado:** Formulario ágil para registrar origen, destino, tarifa pactada y detalles del servicio.
* **Control de Acceso Fijo:** Configurado exactamente para **8 colaboradores** autorizados con acceso total.
* **Integración con WhatsApp:** Botón directo para iniciar conversaciones por WhatsApp según el servicio seleccionado.
* **Soporte Multilingüe:** Interfaz accesible en múltiples idiomas para atención internacional.
* **Diseño Minimalista:** Interfaz limpia en tonos fríos (`#1A2B4C` / Gris Pizarra) y tipografía neutra sans-serif.
* **Sin Pasarelas ni Rastreo:** Operación simplificada sin cobros automáticos ni mapas de rastreo complejos.

---

## 🎨 Paleta de Colores y Estilo Visual

| Elemento | Color / Valor | Propósito |
| :--- | :--- | :--- |
| **Color Primario** | `#1A2B4C` (Azul Noche) | Encabezados y tarjetas de servicios |
| **Fondo Principal** | `#121824` (Gris Pizarra) | Fondo en modo oscuro descansado |
| **Acento** | `#2B6CB0` (Azul Acero) | Botones de acción principales |
| **Tipografía** | Roboto / Sans-Serif | Lectura clara y sin distracciones |

---

## 📂 Estructura del Repositorio

```text
├── docs/             # Documentación técnica y guía de usuario
├── src/              # Código fuente de la interfaz web y conectores[cite: 1]
│   ├── config/       # Configuración de entornos y base de datos
│   ├── web/          # Frontend de la aplicación (HTML, CSS, JS)[cite: 1]
│   └── integrations/ # Scripts de integración (WhatsApp API/Links)[cite: 1]
├── data/             # Esquemas de base de datos (Google Sheets / SQL)[cite: 1]
└── README.md         # Documentación principal del proyecto