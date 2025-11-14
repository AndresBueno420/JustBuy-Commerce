#!/bin/bash
            
yum update -y
yum install -y git
yum install -y https://s3.amazonaws.com/ec2-downloads-windows/SSMAgent/latest/linux_amd64/amazon-ssm-agent.rpm
systemctl enable amazon-ssm-agent
systemctl start amazon-ssm-agent
su - ec2-user -c "
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
        . /home/ec2-user/.nvm/nvm.sh
        nvm install 18
        npm install -g pm2
    "
cd /home/ec2-user
git clone https://github.com/AndresBueno420/JustBuy-Commerce.git
APP_PATH="/home/ec2-user/JustBuy-Commerce/app"
cd $APP_PATH
 echo "NODE_ENV=production" > .env
echo "PORT=3000" >> .env
echo "DB_HOST=${RDSInstance.Endpoint.Address}" >> .env
echo "DB_PORT=${RDSInstance.Endpoint.Port}" >> .env
echo "DB_NAME=${DBName}" >> .env
echo "DB_USER=${DBUser}" >> .env
echo "DB_PASS=${DBPassword}" >> .env
echo "SESSION_SECRET=${SessionSecret}" >> .env
echo "MERCADOPAGO_ACCESS_TOKEN=${MPAccessToken}" >> .env
chown -R ec2-user:ec2-user /home/ec2-user/JustBuy-Commerce
su - ec2-user -c "cd $APP_PATH && npm install"
            
su - ec2-user -c "
    . /home/ec2-user/.nvm/nvm.sh
    cd $APP_PATH
    npm run seed
"

su - ec2-user -c "
    . /home/ec2-user/.nvm/nvm.sh
    cd $APP_PATH
    pm2 start $APP_PATH/server.js -n \"ecommerce-app\"
    pm2 startup
    pm2 save
"