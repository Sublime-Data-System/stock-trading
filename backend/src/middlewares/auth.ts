import {Request, Response, NextFunction} from 'express';
import admin from 'firebase-admin'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token: string = req?.header("Authorization")?.replace("Bearer ", "") as string
    const decodedToken: DecodedIdToken = await admin.auth().verifyIdToken(token)

    if (!decodedToken) {
      return res.status(401).send({message: 'Unauthorized'});
    }

    req.authUser = decodedToken

    next()
  } catch (error) {
    return res.status(401).send({message: 'Unauthorized'});
  }
}