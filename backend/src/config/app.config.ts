export default () => {
  const nodeEnv = process.env.NODE_ENV || 'development';

  // Validar variables críticas en producción
  if (nodeEnv !== 'development') {
    const requiredVars = [
      'JWT_SECRET',
      'DB_HOST',
      'DB_USERNAME',
      'DB_PASSWORD',
      'DB_DATABASE',
      'PORT',
      'NODE_ENV',
    ];

    const missingVars = requiredVars.filter((varName) => !process.env[varName]);

    if (missingVars.length > 0) {
      console.error(
        '❌ Variables de entorno requeridas faltantes:',
        missingVars,
      );
      console.error('💡 Configuración requerida: cp .env.example .env');
      console.error(
        '🔧 Guía de configuración: https://github.com/tu-repo/backend/README.md#configuración-de-entorno',
      );

      throw new Error(
        `❌ Variables de entorno requeridas faltantes: ${missingVars.join(', ')}. El servidor no puede iniciar en producción sin estas variables.`,
      );
    }

    // Validar formato de variables específicas
    const port = process.env.PORT;
    if (port && isNaN(parseInt(port))) {
      throw new Error(
        `❌ PORT debe ser un número válido. Valor actual: ${port}`,
      );
    }

    const corsOrigins = process.env.CORS_ORIGINS;
    if (
      corsOrigins &&
      !corsOrigins.includes('http://') &&
      !corsOrigins.includes('https://')
    ) {
      throw new Error(
        `❌ CORS_ORIGINS debe contener URLs válidas con http:// o https://. Valor actual: ${corsOrigins}`,
      );
    }
  }

  return {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv,
    apiPrefix: process.env.API_PREFIX || 'api/v1',

    database: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_DATABASE || 'sistema_parqueadero',
    },

    jwt: {
      secret: process.env.JWT_SECRET, // Sin fallback - debe estar definido en producción
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    },

    security: {
      bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
    },

    throttling: {
      ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
      limit: parseInt(process.env.THROTTLE_LIMIT || '10', 10),
    },

    cors: {
      origins: process.env.CORS_ORIGINS
        ? process.env.CORS_ORIGINS.split(',')
        : ['http://localhost:4200'],
      credentials: process.env.CORS_ORIGINS ? true : false, // Solo credentials si hay whitelist definida
    },
  };
};
