import { Router } from 'express';
import prisma from '../db/prisma';
import { healthRoutes } from './health';
import { authRoutes } from './auth';
import { profileRoutes } from './profile';
import { aboutRoutes } from './about';
import { educationRoutes } from './education';
import { skillsRoutes } from './skills';
import { projectRoutes } from './projects';
import { experienceRoutes } from './experience';
import { certificationRoutes } from './certifications';
import { achievementRoutes } from './achievements';
import { resumeRoutes } from './resume';
import { socialLinksRoutes } from './socialLinks';
import { contactRoutes } from './contact';
import { settingsRoutes } from './settings';
import { analyticsRoutes } from './analytics';
import { uploadRoutes } from './uploads';
import { blogRoutes } from './blog';

const router = Router();

// Core & Monitoring
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);

// Portfolio & CMS Data Modules
router.use('/profile', profileRoutes);
router.use('/about', aboutRoutes);
router.use('/education', educationRoutes);
router.use('/skills', skillsRoutes);
router.use('/projects', projectRoutes);
router.use('/experience', experienceRoutes);
router.use('/certifications', certificationRoutes);
router.use('/achievements', achievementRoutes);
router.use('/resume', resumeRoutes);
router.use('/social-links', socialLinksRoutes);
router.use('/socials', socialLinksRoutes);
router.use('/contact', contactRoutes);
router.use('/blog', blogRoutes);
router.use('/blogs', blogRoutes);
router.use('/settings', settingsRoutes);

// Direct SEO route
router.get('/seo', async (_req, res) => {
  try {
    const seo = await prisma.sEOSettings.findFirst();
    res.status(200).json({ success: true, data: seo });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch SEO settings', error: { code: 'DB_ERROR' } });
  }
});
router.use('/analytics', analyticsRoutes);
router.use('/uploads', uploadRoutes);

export const apiRoutes = router;
