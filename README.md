# Ionic Todo + Gemini Chatbot

Aplicación móvil de lista de tareas con categorías, Firebase Remote Config y chatbot IA.


## Autor

*   **Oscar Alejandro Londoño Torres**
*   **Empresa dirigida:** Accenture

## Git Flow
- `main`: releases estables
- `develop`: integración de features
- `feature/*`: nuevas funcionalidades

## Infraestructura de la Aplicación

La aplicación está construida sobre una base moderna de Ionic y Angular, utilizando componentes standalone para una mejor modularidad.

- **Framework**: Ionic 7 con Angular 17.
- **Arquitectura**: Basada en componentes standalone y servicios para la gestión de la lógica de negocio.
- **Almacenamiento Local**: Se utiliza `@capacitor/preferences` para persistir las tareas y categorías directamente en el dispositivo, asegurando que los datos del usuario se mantengan entre sesiones.
- **Servicios en la Nube**:
  - **Firebase Remote Config**: Se emplea para gestionar *feature flags* de forma remota. Un ejemplo clave es la variable `enableChatbot`, que permite activar o desactivar el asistente de IA sin necesidad de actualizar la aplicación.
  - **Google Gemini AI**: El chatbot utiliza el poder de Gemini para procesar el lenguaje natural, permitiendo a los usuarios crear tareas mediante comandos de voz o texto.
- **Acceso a Hardware Nativo**:
  - **Reconocimiento de Voz**: A través del plugin `@capacitor-community/speech-recognition`, la aplicación puede acceder al micrófono del dispositivo para la funcionalidad de dictado de tareas en el chatbot.

## Uso de Programación Reactiva

La programación reactiva se utiliza de forma puntual en la aplicación a través de la librería **RxJS**.

El principal caso de uso se encuentra en `HomePage`, donde la propiedad `tasks$` se define como un `Observable`.

```typescript
tasks$: Observable<Task[]> = of([]);
```

Aunque actualmente se inicializa a partir de un arreglo estático con `from([this.todo.getAll()])`, su naturaleza de `Observable` prepara la aplicación para futuras mejoras, como la conexión a fuentes de datos en tiempo real (por ejemplo, una base de datos como Firestore) donde los cambios se propagarían automáticamente a la vista sin necesidad de recargas manuales. Este enfoque, aunque mínimo, sienta las bases para una arquitectura más robusta y escalable.


## Detalles de Implementación

### Firebase Remote Config para Feature Flags

La aplicación utiliza Firebase Remote Config para controlar la visibilidad de funcionalidades de forma remota, como el Chatbot de IA.

1.  **Servicio (`FirebaseService`):** Este servicio inicializa Firebase y se encarga de obtener los valores de configuración remotos. El método `load()` activa la configuración más reciente.

2.  **Carga en la Página Principal (`HomePage`):** En el `ngOnInit`, la página principal espera a que la configuración de Firebase se cargue y luego obtiene el valor del flag `enableChatbot`.

    ```typescript
    async ngOnInit() {
      await this.firebase.load();
      this.enableChatbot = this.firebase.enableChatbot || false;
      // ...
    }
    ```

3.  **Uso en la Vista (`BadgeComponent`):** El valor de `enableChatbot` se pasa al componente de la barra de pestañas, que utiliza una directiva `*ngIf` para mostrar u ocultar el botón del chatbot.

    ```html
    <ion-tab-button *ngIf="enableChatbot" tab="bot" (click)="openChatbot($event)">
      <!-- ... -->
    </ion-tab-button>
    ```

### Integración con Gemini AI para el Chatbot

El chatbot utiliza la API de Google Gemini para procesar el lenguaje natural y convertir las peticiones del usuario en tareas.

1.  **Servicio (`GeminiService`):** Un servicio dedicado se encarga de realizar las llamadas a la API de Gemini, enviando el texto del usuario.

2.  **Componente del Chatbot (`ChatbotComponent`):** El método `send()` orquesta la interacción:
    - Envía el texto del usuario al `GeminiService`.
    - Recibe una respuesta estructurada con el título y la categoría de la tarea.
    - Utiliza el `TodoService` para añadir la nueva tarea a la lista, asociándola con la categoría correcta.


## Paso a Paso de la Aplicación

### Despliegue

A continuación se detallan los pasos para desplegar la aplicación en diferentes entornos.

#### 1. Desarrollo (Navegador)

Para ejecutar la aplicación en un navegador web para desarrollo y pruebas rápidas:

1.  **Instalar dependencias**:
    ```bash
    npm install
    ```
2.  **Ejecutar el servidor de desarrollo**:
    ```bash
    ionic serve
    ```
    Esto abrirá la aplicación en tu navegador por defecto.

#### 2. Android

Para generar un archivo APK o AAB firmado para producción:

1.  **Construir la aplicación web**:
    ```bash
    ionic build --prod
    ```
2.  **Agregar la plataforma Android** (si es la primera vez):
    ```bash
    npx cap add android
    ```
3.  **Generar un certificado de firma** (si no tienes uno, ejecutar en la raíz del proyecto):
    ```bash
    keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-alias
    ```
    Sigue las instrucciones y guarda el archivo `.jks` en un lugar seguro.
4.  **Sincronizar y abrir en Android Studio**:
    ```bash
    npx cap sync android
    npx cap open android
    ```
5.  **Generar el APK/AAB firmado**: 
Modifica el archivo de la ruta `android/app/build.gradle` y anexa lo siguiente:
    ```bash
    android {
        signingConfigs {
            release {
                storeFile file("/RUTA_AL_CERTIFICADO/keystore.jks")
                storePassword "store_password_certificado"
                keyAlias "alias_certificado"
                keyPassword "password_certificado"
            }
            buildTypes {
                release {
                    signingConfig signingConfigs.release
                    minifyEnabled true
                    proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
                }
            }
            lintOptions {
                checkReleaseBuilds false
                abortOnError false
            }
        }
    }
    ```

    Ésto permitira crear la APK para Android con la firma aplicada.

#### 3. iOS

Para desplegar en un dispositivo iOS, necesitarás una Mac con Xcode instalado.

1.  **Construir la aplicación web**:
    ```bash
    ionic build --prod
    ```
2.  **Agregar la plataforma iOS** (si es la primera vez):
    ```bash
    npx cap add ios
    ```
3.  **Sincronizar y abrir en Xcode**:
    ```bash
    npx cap sync ios
    npx cap open ios
    ```
4.  **Configurar firma y despliegue**: Dentro de Xcode, selecciona tu equipo de desarrollador en la sección "Signing & Capabilities". Desde aquí podrás ejecutar la aplicación en un simulador o dispositivo físico, y archivarla para subirla a la App Store.
