import { buildApp } from "./app.js";
import { appConfig } from "./config/app.config.js";

export const startServer = async (): Promise<void> => {
  const app = buildApp();

  try {
    await app.listen({
      host: appConfig.host,
      port: appConfig.port,
    });
    
    console.log(`API listening on http://${appConfig.host}:${appConfig.port}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
