```
proyecto-video-activity-recognition/
├── Entrega1/
│   ├── docs/                 # Documentación inicial (informe, imágenes)
│   │   ├── images/           # Imagenes usadas para los informes
│   │   └── informe.md
│   ├── notebooks/            # EDA y exploración inicial
│   │   └── EDA_COMP.ipynb
│   ├── src/                  # Extracción de landmarks y scripts auxiliares
│   │   ├── load_video_info_to_supabase.py
│   │   └── mediapipe_extract.py
│   ├── README.md             # Resumen de la primera entrega
│   ├── requirements.txt
│   └── .gitignore
├── Entrega2/
│   ├── docs/
│   │   └── informe.md        # Documentación de la fase de modelado
│   ├── experiments/
│   │   └── logs/             # Registro de experimentos (log1, log2, log3)
│   ├── models/               # Modelos entrenados
│   │   ├── label_encoder.joblib
│   │   ├── rf_best.joblib
│   │   ├── svm_best.joblib
│   │   └── xgb_best.joblib
│   ├── results/              # Métricas, gráficas, reportes y features
│   ├── notebooks/            # Pipeline reproducible
│   │   ├── 01_preprocesamiento.ipynb
│   │   ├── 02_modelado.ipynb
│   │   └── 03_resultados.ipynb
│   ├── src/                  # Código fuente modular
│   │   ├── features/
│   │   ├── models/
│   │   └── utils/
│   ├── README.md
│   └── requirements.txt
├── Entrega3/
│   ├── docs/
│   ├── experiments/
│   └── src/
├── sources/                  # Recursos adicionales (DDL, modelos, imágenes)
├── Dockerfile                # Imagen para despliegue
├── app_entry.py              # Entry point de la app
├── build_exe.py              # Script de generación de ejecutable
├── VideoActivityRecognition.spec
├── estructura_proyecto.md
├── report.md                 # Reporte final del proyecto
├── LICENSE
└── README.md
```
