import { Router, Request, Response } from 'express';
import prisma from '../db/prisma';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { ApiResponse } from '@amit/shared';

const router = Router();

// GET /api/about (Public)
router.get('/', async (_req: Request, res: Response<ApiResponse>) => {
  try {
    const profile = await prisma.profile.findFirst();
    const education = await prisma.education.findMany({
      orderBy: { order: 'asc' },
    });
    const skillsCount = await prisma.skill.count();
    const projectsCount = await prisma.project.count({ where: { published: true } });

    res.status(200).json({
      success: true,
      data: {
        name: profile?.name || 'Amit Chauhan',
        headline: profile?.headline,
        tagline: profile?.tagline,
        shortBio: profile?.shortBio,
        fullBio: profile?.fullBio,
        bannerUrl: profile?.bannerUrl,
        location: profile?.location,
        academicStatus: profile?.currentStatus,
        availability: profile?.availability,
        education,
        stats: {
          skillsCount,
          projectsCount,
          yearsOfExperience: profile?.yearsOfExperience || 0,
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve about data',
      error: { code: 'DB_ERROR' },
    });
  }
});

// PUT /api/about (Admin Only)
router.put('/', requireAuth, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const { fullBio, shortBio, headline, tagline, bannerUrl } = req.body;

    const updated = await prisma.profile.upsert({
      where: { id: 'default' },
      update: {
        ...(fullBio !== undefined ? { fullBio } : {}),
        ...(shortBio !== undefined ? { shortBio } : {}),
        ...(headline !== undefined ? { headline } : {}),
        ...(tagline !== undefined ? { tagline } : {}),
        ...(bannerUrl !== undefined ? { bannerUrl } : {}),
      },
      create: {
        id: 'default',
        name: 'Amit Chauhan',
        headline: headline || 'Software Engineer & AI Developer',
        tagline: tagline || 'Computer Science',
        shortBio: shortBio || 'Developer, Programmer, Gamer, Coder',
        fullBio: fullBio || 'I am someone who thrives on learning, problem-solving, and continuous growth.',
        bannerUrl: bannerUrl || null,
        location: 'Mumbai, India',
        email: 'amitchn28@gmail.com',
        currentStatus: 'CS Student • Fourth Year',
      },
    });

    res.status(200).json({
      success: true,
      message: 'About section updated successfully',
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update about section',
      error: { code: 'UPDATE_ERROR', details: (err as Error).message },
    });
  }
});

export const aboutRoutes = router;

