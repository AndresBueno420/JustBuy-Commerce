[![IaC Tool](https://img.shields.io/badge/IaC-CloudFormation-orange?logo=amazon-aws)](https://aws.amazon.com/cloudformation/)
[![Cloud Provider](https://img.shields.io/badge/Cloud-AWS-232F3E?logo=amazon-aws&logoColor=FF9900)](https://aws.amazon.com/)
[![Back-end](https://img.shields.io/badge/Backend-Node.js%20%26%20Express-448833?logo=nodedotjs)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-AWS%20RDS-527FFF?logo=amazon-aws)](https://aws.amazon.com/rds/)

```math
K(\mathbf{x}_i, \mathbf{x}_j) = \mathbf{x}_i^T \mathbf{x}_j
```
#Scalable E-commerce Deployment on AWS with IaC $\mu$, $\sigma$

## Project Overview

This project focuses on deploying a simulated **E-commerce Platform** on Amazon Web Services (**AWS**) using **Infrastructure as Code (IaC)** principles. We have leveraged **AWS CloudFormation** to build a secure, highly-available, and scalable three-tier architecture that can be deployed repeatedly and reliably.

### 🏛️ Context & Course Details

| Field | Details |
| :--- | :--- |
| **Institution** | Universidad ICESI |
| **Course** | Plataformas III (Infrastructure III) |
| **Project Members** | Andres Bueno Cardona, Jean Paul Atkinson Vidales |
| **Primary Tool** | AWS CloudFormation |

---

## 🎯 Project Goal

Our main goal was to deploy a simple e-commerce application (built with **Node.js/Express.js**) on AWS, ensuring it meets the following core requirements:

1.  **Scalability:** Implementation of an **Auto Scaling Group (ASG)** behind an **Application Load Balancer (ALB)** to handle traffic spikes.
2.  **Security:** Using a **Virtual Private Cloud (VPC)** with private subnets for application servers and the database, accessed securely via a **Bastion Host** and **Session Manager**.
3.  **Reproducibility:** Defining **all** infrastructure (Network, Compute, Database) through **CloudFormation templates**.

---

## Application Components

The deployed application includes the following basic functionalities:

* **Front-end:** HTML, CSS, and JavaScript (Client-side logic).
* **Back-end:** Node.js with Express.js, providing a **REST API**.
* **Database:** AWS **RDS** (Database Engine), ensuring persistent data storage.

---

## AWS Architecture Deployed

The infrastructure is defined in the `cloudformation/` folder and follows best practices for cloud deployments:

| Component | Purpose | AWS Service(s) |
| :--- | :--- | :--- |
| **Network** | Secure isolation and connectivity. | VPC, Subnets (Public/Private), Internet Gateway, NAT Gateway. |
| **Load Balancing** | Distributes incoming web traffic across multiple servers. | Application Load Balancer (ALB). |
| **Application Layer** | Runs the Node.js application. | EC2 Instances within an Auto Scaling Group (ASG). |
| **Database Layer** | Stores persistent application data. | AWS RDS (e.g., PostgreSQL/MySQL) in a Private Subnet. |
| **Monitoring** | Tracks performance and sends alerts. | CloudWatch (Metrics & Alarms) and SNS (Notifications). |
| **Secure Access** | Securely manages remote access to EC2. | Bastion Host, Session Manager. |



-----


1. **SVM (Support Vector Machine)**  
   - Implementado con `sklearn.svm.SVC` en un pipeline con `StandardScaler`.
   - El objetivo matemático del SVM es encontrar un hiperplano óptimo que maximice el margen (la distancia) entre los vectores de soporte de las diferentes clases en el espacio de       características.Justificación de Hiperparámetros: Dado que los datos pueden no ser linealmente separables, se exploraron diferentes kernels :Lineal:
```math
K(\mathbf{x}_i, \mathbf{x}_j) = \mathbf{x}_i^T \mathbf{x}_j
```
   RBF (Base Radial):
```math
K(\mathbf{x}_i, \mathbf{x}_j) = \exp(-\gamma \|\mathbf{x}_i - \mathbf{x}_j\|^2)
```

   que mapea los datos a un espacio de mayor dimensión.El hiperparámetro  $C$ 7 (parámetro de regularización) se ajustó para controlar la penalización por clasificación incorrecta, gestionando así el balance entre un margen amplio y la minimización de los errores de entrenamiento.
   - Ajuste de hiperparámetros mediante `GridSearchCV` con validación cruzada (k=3).  
   - Parámetros explorados: `C`, `kernel` (`linear`, `rbf`), `gamma`.  

2. **Random Forest**  
   - Modelo de ensamblado de árboles (`sklearn.ensemble.RandomForestClassifier`).
   - El modelo construye múltiples árboles de decisión (n_estimators) 9 sobre subconjuntos aleatorios de las características. La decisión de división en cada nodo se optimiza minimizando una métrica de impureza, en este caso, el Índice de Gini:
```math
Gini = 1 - \sum_{i=1}^{C} (p_i)^2
```
   donde $p_i$ es la probabilidad de que una muestra en el nodo pertenezca a la clase $i$. Se exploraron también max_depth y min_samples_split para controlar la profundidad de los árboles y prevenir el sobreajuste.
   - Ajuste con rejilla de hiperparámetros (`n_estimators`, `max_depth`, `min_samples_split`, `min_samples_leaf`).  
   - Permite extraer **importancia de características**, útil para interpretación.

3. **XGBoost**  
   - Clasificador de gradiente optimizado (`xgboost.XGBClassifier`).
   - A diferencia del RF, XGBoost construye árboles de forma secuencial. Cada nuevo árbol se entrena para corregir los errores residuales del modelo anterior, optimizando iterativamente el gradiente de una función de pérdida (como la log-loss para clasificación multiclase). 
   - Parámetros: `max_depth`, `learning_rate`, `subsample`, `colsample_bytree`.  
   - Entrenado con validación cruzada idéntica (cv=3, f1-weighted).  

El proceso de entrenamiento se centraliza en `src/models/train_models.py`, 
donde se definen los **grids**, la división de datos (80 % train / 20 % test), 
y se exportan los artefactos entrenados (`.joblib`) junto con los reportes JSON 
y las matrices de confusión.

### 2.4. Métrica de Evaluación
Como métrica de evaluación principal para la optimización (GridSearchCV) y la comparación final, se seleccionó el F1-Macro Score131313.Justificación Matemática: El F1-Score es la media armónica de la Precisión y el Recall:
```math 
F_1 = 2 \cdot \frac{Precision \cdot Recall}{Precision + Recall}
```
Esta métrica es ideal para datasets con desbalance de clases, como el actual (donde clases como caminar son más frecuentes que girar). Al utilizar el promedio 'macro'14, se calcula el F1-Score para cada clase de forma independiente y luego se promedia, asegurando que el rendimiento en clases minoritarias tenga el mismo peso en la evaluación final que el de las clases mayoritarias.

