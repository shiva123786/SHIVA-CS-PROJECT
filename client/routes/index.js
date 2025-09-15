import express from 'express';
import authRoutes from './auth.routes';
import departmentRoutes from './department.routes';
import eventRoutes from './event.routes';
import mediaRoutes from './media.routes';
import registrationRoutes from './registration.routes';
import contactRoutes from './contact.routes';
import sponsorshipRoutes from './sponsorship.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/departments', departmentRoutes);
router.use('/events', eventRoutes);
router.use('/media', mediaRoutes);
router.use('/registrations', registrationRoutes);
router.use('/contact', contactRoutes);
router.use('/sponsorships', sponsorshipRoutes);

export default router;