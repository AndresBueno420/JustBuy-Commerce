const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Cargar variables de entorno (asegúrate de que .env existe en la raíz /app)
dotenv.config();

// =========================================================================
// 1. Configuración de la Conexión a AWS RDS con Sequelize
// =========================================================================

// Sequelize recibe las credenciales y configuración del ambiente
const sequelize = new Sequelize(
    process.env.DB_NAME,       // Nombre de la base de datos (e.g., 'fc_store')
    process.env.DB_USER,       // Nombre de usuario de RDS (e.g., 'admin')
    process.env.DB_PASSWORD,   // Contraseña del usuario de RDS (¡SECRETO!)
    {
        host: process.env.DB_HOST, // Endpoint de la instancia RDS (e.g., 'fc-store.abcdef.us-east-1.rds.amazonaws.com')
        dialect: 'postgres',       // O 'mysql', 'mariadb', según el motor que elijas en RDS
        port: process.env.DB_PORT, // Puerto (e.g., 5432 para PostgreSQL, 3306 para MySQL)
        logging: false,            // Desactiva los logs SQL en la consola (opcional, pero recomendado en producción)
        
        // Configuraciones específicas para un entorno de nube (importante para el curso)
        dialectOptions: {
            ssl: {
                require: true,
                // Si usas un certificado específico, se configuraría aquí. 
                // Para AWS RDS estándar, a menudo puedes usar el valor por defecto o desactivar la verificación estricta:
                rejectUnauthorized: false
            }
        },
        pool: {
            max: 5,  // Máximo número de conexiones en el pool
            min: 0,  // Mínimo número de conexiones en el pool
            acquire: 30000,
            idle: 10000
        }
    }
);

// =========================================================================
// 2. Exportar la Conexión
// =========================================================================

module.exports = sequelize;