import { Request, Response } from 'express';
import { getFirestore } from 'firebase-admin/firestore';

const register = async (req: Request, res: Response) => {
  try {
    const db = getFirestore();
    const userExists = await db.collection('users').doc(req.authUser.email).get();

    if (userExists.exists) {
      return res.status(409).send({ message: 'User already exists' });
    }

    const user = await db.collection('users').doc(req.authUser.email).set({
      name: req.authUser.name,
      email: req.authUser.email
    });

    return res.status(201).send({ user });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

export { register };
