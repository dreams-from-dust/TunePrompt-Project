import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
} from "./middlewares/clerkProxyMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// 1. Logging Middleware
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// 2. Clerk Proxy - MUST be mounted before express.json()
app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

// 3. Robust CORS configuration for Standalone APKs
// Explicitly allowing all origins for testing. If this works, 
// refine it to your specific domain later.
app.use(cors({ 
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. API Routes
app.use("/api", router);

// 5. Basic Catch-all for debugging
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;