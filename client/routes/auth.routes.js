import express from 'express';
import { signUp, signIn, signOut, getCurrentUser } from '../controllers/auth.controller';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);
router.get('/me', getCurrentUser);

export default router;