import { Request, Response } from 'express';
import { Filter, getFirestore } from 'firebase-admin/firestore';

const register = async (req: Request, res: Response) => {
  try {
    const db = getFirestore();
    const userExists = await db
      .collection('users')
      .where( Filter.or(
        Filter.where('uid', '==', req.authUser.uid),
        Filter.where('email', '==', req.authUser.email)
      ))
      .get();

    if (!userExists.empty) {
      return res.status(409).send({ message: 'User already exists' });
    }

    const user = await db
      .collection('users')
      .doc(req.authUser.uid)
      .set({
        name: req.authUser.displayName || '',
        email: req.authUser.email,
        uid: req.authUser.uid,
      });

    return res.status(201).send({ user });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export { register };
