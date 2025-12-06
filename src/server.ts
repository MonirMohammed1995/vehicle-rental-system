import app from "./app";
import { ENV } from "./config/env";
import { initDB } from "./config/db";

const start = async () => {
  try {
    await initDB();
    app.listen(ENV.PORT, () => {
      console.log(`Server started on port ${ENV.PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();
