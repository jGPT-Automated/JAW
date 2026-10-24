// Single Vercel Function for the whole API (vercel.json rewrites /api/* here).
import app from "../server/app.js";

export default { fetch: app.fetch };
