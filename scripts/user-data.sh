#!/bin/bash
# 
# Script de Configuración de Instancia (UserData)
# Este script instala Node.js, PM2, clona el repositorio de la app
# y crea el archivo .env con los secretos.
#

# --- 1. Actualizar e Instalar Herramientas Básicas ---
yum update -y
yum install -y git

# --- 2. Instalar Agente SSM (para acceso seguro, como pide el PDF) ---
yum install -y https://s3.amazonaws.com/ec2-downloads-windows/SSMAgent/latest/linux_amd64/amazon-ssm-agent.rpm
systemctl enable amazon-ssm-agent
systemctl start amazon-ssm-agent

# --- 3. Instalar Node.js v18 (usando NVM) ---
# (Se ejecuta como el usuario ec2-user para que los permisos sean correctos)
su - ec2-user -c "
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  . /home/ec2-user/.nvm/nvm.sh
  nvm install 18
  npm install -g pm2
"

# --- 4. Clonar el Repositorio de la Aplicación ---
cd /home/ec2-user
git clone $GIT_REPO_URL # $GIT_REPO_URL será pasado por CloudFormation

# --- 5. Configurar la Aplicación (Crear .env) ---
# (Asumiendo que el código de la app está en la carpeta /app)
APP_PATH="/home/ec2-user/JustBuy-Commerce/app"
cd $APP_PATH

# Crear el archivo .env con los valores inyectados por CloudFormation
echo "NODE_ENV=production" > .env
echo "PORT=3000" >> .env
echo "DB_HOST=$DB_HOST" >> .env
echo "DB_PORT=$DB_PORT" >> .env
echo "DB_NAME=$DB_NAME" >> .env
echo "DB_USER=$DB_USER" >> .env
echo "DB_PASS=$DB_PASSWORD" >> .env
echo "SESSION_SECRET=$SESSION_SECRET" >> .env
echo "MERCADOPAGO_ACCESS_TOKEN=$MP_ACCESS_TOKEN" >> .env

# --- 6. Instalar Dependencias ---
# Cambiar el propietario de los archivos al usuario ec2-user
chown -R ec2-user:ec2-user /home/ec2-user/JustBuy-Commerce
# Instalar dependencias como ec2-user
su - ec2-user -c "cd $APP_PATH && npm install"

# --- 7. Iniciar la Aplicación con PM2 ---
su - ec2-user -c "
  . /home/ec2-user/.nvm/nvm.sh
  cd $APP_PATH
  pm2 start server.js -n \"ecommerce-app\"
  pm2 startup
  pm2 save
"
