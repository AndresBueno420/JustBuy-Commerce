# **Estructura del Repositorio – Proyecto de Reconocimiento de Actividades en Video**

Este repositorio contiene el desarrollo completo del proyecto de **Reconocimiento de Actividades Humanas en Video usando Pose Estimation**, siguiendo la metodología **CRISP-DM** y entregado en tres fases: **preprocesamiento inicial**, **modelado**, y **despliegue en tiempo real**.

El objetivo de esta estructura es garantizar **claridad**, **trazabilidad**, **reproducibilidad**, y una navegación sencilla tanto para evaluadores como para futuros mantenedores del proyecto.

---

# **Visión General del Proyecto**

Cada entrega se encuentra organizada dentro de su propia carpeta (`Entrega1/`, `Entrega2/`, `Entrega3/`), y en conjunto reflejan el ciclo completo:

- **Extracción de landmarks con MediaPipe**  
- **Generación y almacenaje de features biomecánicas**  
- **Entrenamiento y comparación de modelos supervisados** (SVM, Random Forest, XGBoost)  
- **Reducción de características y optimización**  
- **Implementación de inferencia en tiempo real con UI**  
- **Despliegue con Docker y ejecutables empaquetados**  

---

# 🗂️ **Estructura General del Repositorio**

´´´
📦 proyecto-video-activity-recognition/
│
├── Entrega1/
│ ├── 📂 docs/ # Documentación inicial (informe, imágenes)
│ │ └── 📂 images/ # Imagenes usadas para los informes
| | └── informe.md
│ ├── 📂 notebooks/ # EDA y exploración inicial
│ │ └── EDA_COMP.ipynb
│ ├── 📂 src/ # Extracción de landmarks y scripts auxiliares
│ │ ├── load_video_info_to_supabase.py
│ │ └── mediapipe_extract.py
│ ├── 📜 README.md # Resumen de la primera entrega
│ ├── 📜 requirements.txt
│ └── 📜 .gitignore
│
├── Entrega2/
│ ├── 📂 docs/
│ │ └── informe.md # Documentación de la fase de modelado
│ ├── 📂 experiments/
│ │ ├── 📂 logs/ # Registro de experimentos (log1, log2, log3)
| | |  ├── log 1.md
| | |  ├── log 2.md
| | |  └── log 3.md
│ │ ├── 📂 models/ # Modelos entrenados
│ │ │ ├── label_encoder.joblib
│ │ │ ├── rf_best.joblib
│ │ │ ├── svm_best.joblib
│ │ │ └── xgb_best.joblib
│ │ └── 📂 results/ # Métricas, gráficas, reportes y features
│ ├── 📂 notebooks/ # Pipeline reproducible: preprocesamiento, modelado y resultados
│ │ ├── 01_preprocesamiento.ipynb
│ │ ├── 02_modelado.ipynb
│ │ └── 03_resultados.ipynb
│ ├── 📂 src/ # Código fuente modular
│ │ ├── 📂 features/ # Ingeniería de características biomecánicas
│ │ │ └── feature_engineering.py
│ │ ├── 📂 models/ # Entrenamiento de modelos
│ │ │ └── train_models.py
│ │ ├── 📂 utils/ # Utilidades (carga de datos, helpers)
│ │ │ └── data_utils.py
│ │ └── prepare_dataset.py
│ ├── 📜 README.md
│ └── 📜 requirements.txt
│
├── Entrega3/
│ ├── 📂 docs/
│ │ └── manual_usuario.md # Guía del usuario final y manual de uso
│ ├── 📂 experiments/
│ │ ├── 📂 logs/
│ │ ├── 📂 models/ # Modelos finales 
│ │ ├── 📂 results/ # Reducción de features y análisis final
│ │ └── 📂 notebooks/ # Notebooks de reducción y pruebas de despliegue
│ ├── 📂 src/
│ │ ├── 📂 models/
│ │ │ └── load_artifacts.py # Carga de modelos y artefactos
│ │ ├── 📂 online/ 
│ │ │ ├── realtime_inference.py
│ │ │ ├── posture_metrics.py
│ │ │ └── ui_app.py
│ │ ├── 📂 utils/
│ │ │ ├── config.py
│ │ │ └── preprocessing.py
│ │ ├── 📜 README.md
│ │ └── 📜 requirements.txt
└── 📂 sources/ # Recursos adicionales (DDL, modelos, imágenes)
  ├── 📜 Dockerfile # Imagen para despliegue
  ├── 📜 app_entry.py # Entry point de la app
  ├── 📜 build_exe.py # Script de generación de ejecutable
  ├── 📜 VideoActivityRecognition.spec
  ├── 📜 estructura_proyecto.md
  ├── 📜 report.md # Reporte final del proyecto
  ├── 📜 LICENSE
  └── 📜 README.md
´´´

# 🚀 **Cómo Navegar el Repositorio**

1. **Entrega1/** — preprocesamiento y extracción inicial  
2. **Entrega2/** — ingeniería de features y modelado  
3. **Entrega3/** — reducción de features, UI e inferencia real-time  
