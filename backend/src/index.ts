import express, { Express, Request, Response } from 'express';
import {json} from 'body-parser'
import admin from 'firebase-admin';
import 'dotenv/config';
import cors from 'cors';
import routes from  './routes'


declare global {
  namespace Express {
    interface Request {
      authUser: any;
    }
  }
}

const app: Express = express();

const firebaseServiceAccount: admin.ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY
};

admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceAccount),
});

app.use(
  cors({
    origin: '*', // only for development
    allowedHeaders: '*',
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE',
    optionsSuccessStatus: 200,
  })
);

app.use(json())

app.use('/api', routes)

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
