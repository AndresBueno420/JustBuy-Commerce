proyecto-video-activity-recognition/
│
├── Entrega1/
│   ├── docs/
│   │   ├── informe.md
│   │   └── images/
│   ├── notebooks/
│   │   └── EDA_COMP.ipynb
│   ├── src/
│   │   ├── load_video_info_to_supabase.py
│   │   └── mediapipe_extract.py
│   ├── requirements.txt
│   └── README.md
│
├── Entrega2/
│   ├── docs/
│   │   └── informe.md
│   ├── experiments/
│   │   ├── logs/
│   │   │   ├── log1.md
│   │   │   ├── log2.md
│   │   │   └── log3.md
│   │   ├── models/
│   │   │   ├── label_encoder.joblib
│   │   │   ├── rf_best.joblib
│   │   │   ├── svm_best.joblib
│   │   │   └── xgb_best.joblib
│   │   └── results/
│   │       ├── features.csv
│   │       ├── models_summary.json
│   │       ├── rf_confusion_matrix.png
│   │       └── xgb_feature_importance_top20.png
│   ├── notebooks/
│   │   ├── 01_preprocesamiento.ipynb
│   │   ├── 02_modelado.ipynb
│   │   └── 03_resultados.ipynb
│   ├── src/
│   │   ├── features/
│   │   │   └── feature_engineering.py
│   │   ├── models/
│   │   │   └── train_models.py
│   │   ├── utils/
│   │   │   └── data_utils.py
│   │   └── prepare_dataset.py
│   ├── requirements.txt
│   └── README.md
│
├── Entrega3/
│   ├── docs/
│   │   └── manual_usuario.md
│   ├── experiments/
│   │   ├── logs/
│   │   ├── models/
│   │   │   ├── svm_full.joblib
│   │   │   └── svm_reduced.joblib
│   │   └── results/
│   │       ├── selected_features.json
│   │       └── feature_reduction_summary.md
│   ├── notebooks/
│   │   ├── 01_svm_feature_reduction.ipynb
│   │   └── 02_deployment_tests.ipynb
│   ├── src/
│   │   ├── models/
│   │   │   └── load_artifacts.py
│   │   ├── online/
│   │   │   ├── realtime_inference.py
│   │   │   ├── posture_metrics.py
│   │   │   └── ui_app.py
│   │   ├── utils/
│   │   │   ├── config.py
│   │   │   └── preprocessing.py
│   │   └── README.md
│   ├── sources/
│   │   ├── Modelo de la Base de datos.png
│   │   └── scriptDDL.sql
│   ├── Dockerfile
│   ├── app_entry.py
│   ├── build_exe.py
│   ├── VideoActivityRecognition.spec
│   ├── estructura_proyecto.md
│   ├── report.md
│   ├── LICENSE
│   └── README.md
│
└── README.md
