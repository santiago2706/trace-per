# TracePerú 🌱 
### Agricultural Traceability + Instant Payments on Stellar

**TracePerú** es un MVP ligero impulsado por blockchain que ayuda a los productores agrícolas a registrar lotes de productos, generar registros de trazabilidad verificables y simular pagos de primas utilizando la **Stellar Testnet**.

Construido para fines de demostración y hackatones, la plataforma se centra en la simplicidad, la transparencia y la accesibilidad para las cadenas de suministro agrícolas rurales.

---

## 🚀 El Problema

Los pequeños productores agrícolas a menudo reciben precios más bajos porque no pueden demostrar fácilmente:

* **Origen del producto**
* **Sostenibilidad**
* **Legalidad**
* **Trazabilidad**

Los compradores internacionales exigen cada vez más cadenas de suministro transparentes y verificables, especialmente para productos como el **cacao, café y quinua**. Los sistemas actuales suelen ser costosos, complejos, centralizados e inaccesibles para el pequeño productor.

---

## 💡 La Solución

TracePerú proporciona un flujo de trabajo de trazabilidad simple potenciado por Stellar. La plataforma permite a los productores:

1.  **Conectar una Wallet Stellar** (Freighter).
2.  **Registrar lotes agrícolas** con metadatos clave.
3.  **Generar trazabilidad basada en QR**.
4.  **Verificar registros públicamente**.
5.  **Simular pagos de primas** en la red de prueba de Stellar.

Cada lote genera un ID único, una página de verificación pública, un código QR y una referencia de transacción en la blockchain.

---

## ✨ Características Principales

* **✅ Conexión de Billetera:** Integración con Freighter Wallet y soporte para Stellar Testnet.
* **✅ Registro de Lotes:** Registro detallado de productor, producto, cantidad, ubicación e imágenes.
* **✅ Verificación QR:** Cada lote genera un código QR vinculado a una página de verificación pública.
* **✅ Integración con Stellar Testnet:** Soporte para transacciones reales en Testnet, visualización de hashes de transacciones y sensación de verificación blockchain real.
* **✅ Flujo de Verificación del Comprador:** Página pública que muestra info del producto, detalles del productor, estado de pago y estatus de verificación.
* **✅ UI/UX Moderna:** Diseño responsivo con estética *Agritech + Fintech* limpia, utilizando un dashboard estilo startup.

---

## 🛠 Tech Stack

| Tecnología | Propósito |
| :--- | :--- |
| **Next.js** | Framework de Frontend |
| **TypeScript** | Tipado seguro |
| **TailwindCSS** | Estilizado de UI |
| **shadcn/ui** | Componentes de interfaz |
| **Supabase** | Base de datos y almacenamiento de imágenes |
| **Stellar SDK** | Integración con la Blockchain de Stellar |
| **Freighter** | Billetera para la firma de transacciones |
| **Vercel** | Despliegue y Hosting |

---

## 🔗 Integración con Stellar

TracePerú utiliza la **Stellar Testnet** para simular flujos de pago y verificación ligera.
- **Implementado:** Conexión de wallet, simulación de transacciones, visualización de hash de transacción y UX de verificación blockchain.
- **Enfoque:** El proyecto evita intencionalmente una arquitectura compleja de contratos inteligentes para mantener la velocidad del MVP y la facilidad de uso.

---

## 📦 Instalación

Sigue estos pasos para ejecutar el proyecto localmente:

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/TU_USUARIO/traceperu-mvp.git](https://github.com/TU_USUARIO/traceperu-mvp.git)
Instalar dependencias:

Bash
npm install
Configurar variables de entorno:
Crea un archivo .env.local con tus credenciales de Supabase y Stellar (si aplica).

Ejecutar en modo desarrollo:

Bash
npm run dev
📸 Flujo de la Demo
Conectar Freighter Wallet.

Registrar un Lote Agrícola.

Generar el Código QR.

Abrir la Página de Verificación Pública.

Simular el Pago Stellar.

Visualizar el Hash de la Transacción.

🎯 Alcance del MVP
Este proyecto fue diseñado como un MVP ligero para hackatón. El objetivo fue demostrar:

Usabilidad de la blockchain en el campo.

Trazabilidad agrícola real.

Verificación mediante QR.

Pagos instantáneos vía Stellar.

🚧 Mejoras Futuras
[ ] Onboarding real para cooperativas agrarias.

[ ] Marketplace en vivo para compradores internacionales.

[ ] Implementación de Smart Contracts con Soroban.

[ ] Capas de certificación ESG (Ambiental, Social y de Gobernanza).

[ ] Tokenización de lotes agrícolas.

[ ] Soporte "Offline-first" para zonas rurales con baja conectividad.
