declare const _default: () => {
    port: number;
    nodeEnv: string;
    apiPrefix: string;
    database: {
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
    };
    jwt: {
        secret: string | undefined;
        expiresIn: string;
    };
    security: {
        bcryptRounds: number;
    };
    throttling: {
        ttl: number;
        limit: number;
    };
    cors: {
        origins: string[];
        credentials: boolean;
    };
};
export default _default;
