export const env = {
    REACT_APP_API_URL: `http://localhost:9000/api`,
    REACT_APP_TIMEOUT: 2500,
    NODE_ENV: "dev",
};

export const __prod__ = env.NODE_ENV === "prod" ? true : false;
