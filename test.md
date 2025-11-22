# **Entrega 3 - Sistema de Reconocimiento de Actividades en Video (Video Activity Recognition)**

### **Selección de Características, Modelo Final SVM Reducido y Despliegue en Tiempo Real**

## **📌 1. Introducción**

En esta tercera entrega se integran todos los componentes desarrollados en el proyecto para construir un **sistema completo de reconocimiento de actividades humanas (HAR) en tiempo real**, basado en visión por computador y aprendizaje automático.

Los avances principales incluyen:

- Reducción optimizada de características mediante **SelectKBest (ANOVA F-score)**.  

- Entrenamiento de un **SVM reducido con 70 características**, seleccionadas desde ~140 originales.  

- Integración del modelo reducido en un **pipeline de inferencia en tiempo real**.  

- Construcción de una **interfaz visual (UI)** con información biomecánica complementaria.  

- Despliegue multiplataforma mediante **ejecutable en Windows** y **Docker para Linux/Mac**.  

Este README documenta la arquitectura del sistema, la metodología empleada, los resultados obtenidos y las instrucciones de despliegue.

## **📌 2. Objetivos de la Entrega 3**

- Seleccionar un subconjunto óptimo de características que maximice el rendimiento del modelo.  

- Entrenar y validar un modelo reducido que mantenga (o supere) el desempeño del modelo completo.  

- Integrar el modelo reducido en el sistema de inferencia.  

- Construir la aplicación final en tiempo real con:  
  - Predicción de actividad.  

  - Probabilidad asociada.  

  - Métricas posturales (inclinación, ángulos de rodilla).  

  - Paneles superpuestos en video.  

- Desplegar el sistema en forma de:  
  - Ejecutable (.exe) para Windows.  

  - Imagen Docker para Linux/Mac.  

- Documentar limitaciones, mejoras logradas y líneas de trabajo futuro.  

## **📌 3. Metodología de selección de características (Entrega 3)**

En el notebook 01_svm_feature_reduction.ipynb se realizó el proceso sistemático de selección de características:

### **🔹 3.1. Dataset utilizado**

Se empleó el features.csv de la Entrega 2, que contiene:

- Todas las características extraídas por ventana temporal.  

- Labels (actividades).  

- Identificadores de video para hacer particiones estratificadas.  

### **🔹 3.2. Split estratificado por video (GroupShuffleSplit)**

Evita leakage temporal entre frames consecutivos del mismo video.

### **🔹 3.3. Entrenamiento base**

Se entrenó un SVM con todas las características para obtener una línea base.

### **🔹 3.4. Selección de características**

Se evaluaron variantes con:

K ∈ {15, 30, 60, 70, 80, 90, 100}

Cada modelo consistió en:

Pipeline = \[SelectKBest(f_classif, k=K) → StandardScaler → SVM (RBF)\]

### **🔹 3.5. Resultados**

**Mejor modelo reducido:  
<br/>**K = 70

F1-macro = 0.887

- **Total de features seleccionadas:** 70  

**Primeras 10 features más relevantes:  
<br/>**\['knee_left_mean', 'knee_left_std', 'knee_right_mean',

'knee_right_std', 'hip_left_mean', 'hip_left_std',

'hip_right_mean', 'hip_right_std', 'inclination_std',

'vel_left_hip_mean'\]

### **🔹 Archivos generados**

- svm_reduced.joblib - mejor modelo reducido.  

- selected_features.json - lista de características seleccionadas.  

- feature_reduction_summary.md - resumen textual de resultados.  

## **📌 4. Principales descubrimientos (basado en log1 y log2)**

### **✔ Mejoras logradas gracias al muestreo correcto (cada 6 frames)**

- El sistema ahora replica exactamente el muestreo usado en entrenamiento.  

- **Significativa mejora** en las actividades:  
  - Sentarse  

  - Pararse  

### **✔ Estabilidad general**

- Actividades con patrones claros (caminar, caminar hacia atrás, desplazamientos) funcionan con estabilidad.  

### **✔ Limitaciones actuales**

- **Girar (rotate)** permanece como la actividad más difícil:  
  - Variabilidad rotacional alta.  

  - Baja visibilidad de landmarks en giros rápidos.  

  - Falta de features basadas en orientación y rotación axial.  

## **📌 5. Arquitectura del sistema en tiempo real**

El sistema está constituido por 3 componentes principales:

### **🔹 5.1. Predictor temporal (realtime_inference.py)**

Encargado de:

- Buffer temporal de frames (deque).  

Muestreo:  
<br/>frame_sample_every = 6

Cálculo del **FPS efectivo**:  
<br/>effective_fps = fps / 6

- Ensamblaje de ventanas temporales.  

Generación del vector de características vía:  
<br/>frames_to_feature_vector(...)

- Inferencia con:  
  - SVM reducido si existe.  

  - Fallback al SVM full si falta el reducido.  

### **🧠 Lógica de predicción**

Mínimo de frames requeridos para predecir:  
<br/>min_frames = effective_fps × WINDOW_SIZE_SEC

- Se emplea predict_proba (si disponible) o softmax sobre decision_function.  

Salida:  
<br/>(label_predicha, probabilidad)

### **🔹 5.2. Métricas posturales (posture_metrics.py)**

Calculadas en tiempo real:

- trunk_inclination_deg  
    Inclinación del tronco respecto a la vertical.  

- knee_angle_l_deg  

- knee_angle_r_deg  

Son mostradas en la UI para enriquecer el sistema.

### **🔹 5.3. Interfaz visual (UI)**

La UI (ui_app.py) muestra:

#### **Panel 1 (información del modelo)**

- Variante utilizada (reduced/full).  

- FPS estimado.  

- Visibilidad media.  

- Advertencia si visibilidad < VISIBILITY_MIN.  

#### **Panel 2 (actividad)**

- Actividad predicha.  

- Probabilidad asociada.  

- Código de color:  
  - Verde → conf. > 70%  

  - Amarillo → 40-70%  

  - Rojo → < 40%  

#### **Panel 3 (métricas posturales)**

#### **Control de salida:**

Presiona 'q' para salir

## **📌 6. Despliegue del sistema**

### **🔹 6.1. Ejecutable para Windows**

Construido con PyInstaller:

- Script principal: app_entry.py.  

Comando principal ejecuta:  
<br/>run_realtime_app(camera_index=0)

- Manejo de errores robusto:  
  - Si falla, genera error_log.txt.  

### **🔹 6.2. Imagen Docker (Linux/Mac)**

Características del contenedor:

- Basado en python:3.11-slim.  

- Incluye:  
  - OpenCV  

  - MediaPipe  

  - scikit-learn  

  - Numpy, Pandas  

Expone la aplicación mediante:  
<br/>python -m Entrega3.src.online.ui_app

Permite ejecutar en entornos Linux sin necesidad de instalar dependencias.

## **📌 7. Resultados en tiempo real**

### **✔ Actividades que funcionan muy bien**

- Caminar adelante / atrás  

- Movimiento lateral  

- Posturas estáticas  

- Pararse / sentarse (mejorado en Entrega 3)  

### **✔ Actividades con desempeño moderado**

- Girar  
    (por poca visibilidad y falta de features especializadas)  

### **✔ Métricas reportadas en UI**

- Inclinación del tronco (°)  

- Angulo de rodilla izquierda (°)  

- Angulo de rodilla derecha (°)  

- Probabilidad de la actividad  

### **✔ Estabilidad**

- La inferencia es fluida gracias al muestreo reducido.  

- El pipeline es consistente con el entrenamiento → principal mejora.  

## ** 8. Limitaciones y trabajo futuro**

### ** Limitaciones**

- Actividad "girar" sigue siendo la de menor precisión.  

- El sistema depende fuertemente de visibilidad:  
  - luz adecuada  

  - ausencia de oclusiones  

  - distancia óptima de la cámara
