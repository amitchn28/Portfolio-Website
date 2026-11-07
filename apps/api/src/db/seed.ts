import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';
import dotenv from 'dotenv';
import path from 'path';
import { ensureDatabaseRunning } from './embeddedServer';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const prisma = new PrismaClient();

async function main() {
  const isLocalDb = (process.env.DATABASE_URL || '').includes('localhost') || (process.env.DATABASE_URL || '').includes('127.0.0.1');
  if (isLocalDb) {
    await ensureDatabaseRunning();
  }
  console.log('🌱 [Seed] Beginning database seeding...');

  // 1. Seed Administrator User
  const adminEmail = process.env.ADMIN_EMAIL || 'amitchn28@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminSecurePassword2026!';
  const adminName = process.env.ADMIN_NAME || 'Amit Chauhan';

  const passwordHash = await argon2.hash(adminPassword, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
  });

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: adminName,
    },
    create: {
      email: adminEmail,
      passwordHash,
      name: adminName,
      role: 'SUPER_ADMIN',
    },
  });
  console.log(`👤 [Seed] Admin account verified: ${admin.email}`);

  // 2. Seed Personal Profile
  const profile = await prisma.profile.upsert({
    where: { id: 'default' },
    update: {
      name: 'Amit Chauhan',
      headline: 'Aspiring Software Developer | Computer Engineering Student | AI/ML Enthusiast',
      tagline: 'Fourth-Year B.E. Computer Engineering | ARMIET, University of Mumbai',
      shortBio: 'A Computer Engineering student passionate about software development, artificial intelligence, machine learning and building meaningful technology solutions.',
      fullBio: `I am someone who thrives on learning, problem-solving, and continuous growth. My personality blends curiosity, adaptability, and persistence, which helps me approach challenges with optimism and clarity. I value collaboration and clear communication, but I am equally comfortable taking initiative and working independently.

At my core, I am driven by a desire to make an impact, stay open to new perspectives, and keep evolving both personally and professionally.`,
      location: 'Mumbai, India',
      email: process.env.OWNER_EMAIL || 'amitchn28@gmail.com',
      currentStatus: 'CS Student',
      availability: 'OPEN_TO_WORK',
      yearsOfExperience: 0,
    },
    create: {
      id: 'default',
      name: 'Amit Chauhan',
      headline: 'Software Engineer & AI Developer',
      tagline: 'Building intelligent systems, scalable full-stack web applications, and hybrid AI solutions.',
      shortBio: 'A Computer Engineering student passionate about software development, artificial intelligence, machine learning and building meaningful technology solutions.',
      fullBio: `I am someone who thrives on learning, problem-solving, and continuous growth. My personality blends curiosity, adaptability, and persistence, which helps me approach challenges with optimism and clarity. I value collaboration and clear communication, but I am equally comfortable taking initiative and working independently.

At my core, I am driven by a desire to make an impact, stay open to new perspectives, and keep evolving both personally and professionally.`,
      location: 'Mumbai, India',
      email: process.env.OWNER_EMAIL || 'amitchn28@gmail.com',
      currentStatus: 'CS Student',
      availability: 'OPEN_TO_WORK',
      yearsOfExperience: 0,
    },
  });
  console.log(`📄 [Seed] Profile verified for: ${profile.name}`);

  // 3. Seed Education
  await prisma.education.deleteMany({});
  await prisma.education.create({
    data: {
      degree: 'B.E. Computer Engineering',
      fieldOfStudy: 'Computer Engineering',
      institution: 'University of Mumbai (ARMIET)',
      academicStatus: 'Fourth Year',
      startYear: 2023,
      endYear: 2027,
      isCurrent: true,
      order: 1,
      description: 'ARMIET (Alamuri Ratnamala Institute of Engineering and Technology), University of Mumbai. Specialized coursework in algorithms, computer networks, machine learning, and distributed computing.',
    },
  });
  console.log('🎓 [Seed] Education record created for University of Mumbai (ARMIET)');

  // 4. Clean & Seed Skill Categories & Skills
  await prisma.projectTechnology.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.skillCategory.deleteMany({});

  const categories = [
    { name: 'Programming Languages', slug: 'programming-languages', order: 1 },
    { name: 'Frontend Development', slug: 'frontend-development', order: 2 },
    { name: 'Backend Development', slug: 'backend-development', order: 3 },
    { name: 'Databases', slug: 'databases', order: 4 },
    { name: 'Developer Tools', slug: 'developer-tools', order: 5 },
  ];

  const catMap = new Map<string, string>();
  for (const cat of categories) {
    const savedCat = await prisma.skillCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, order: cat.order },
      create: cat,
    });
    catMap.set(cat.slug, savedCat.id);
  }

  // 5. Seed Skills (Categorized matching prompt exactly: 11 skills, 0 fake percentages)
  const initialSkills = [
    // Programming Languages
    { name: 'C++', slug: 'cpp', category: 'programming-languages', featured: true },
    { name: 'Java', slug: 'java', category: 'programming-languages', featured: true },
    { name: 'Python', slug: 'python', category: 'programming-languages', featured: true },
    { name: 'JavaScript', slug: 'javascript', category: 'programming-languages', featured: true },
    
    // Frontend Development
    { name: 'React.js', slug: 'reactjs', category: 'frontend-development', featured: true },
    { name: 'HTML', slug: 'html', category: 'frontend-development', featured: false },
    { name: 'CSS', slug: 'css', category: 'frontend-development', featured: false },
    
    // Backend Development
    { name: 'Node.js', slug: 'nodejs', category: 'backend-development', featured: true },
    
    // Databases
    { name: 'MongoDB', slug: 'mongodb', category: 'databases', featured: true },
    { name: 'SQL', slug: 'sql', category: 'databases', featured: true },
    
    // Developer Tools
    { name: 'Git', slug: 'git', category: 'developer-tools', featured: true },
    { name: 'GitHub', slug: 'github', category: 'developer-tools', featured: true },
  ];

  const skillMap = new Map<string, string>();
  let skillOrder = 1;
  for (const skill of initialSkills) {
    const categoryId = catMap.get(skill.category)!;
    const savedSkill = await prisma.skill.upsert({
      where: { slug: skill.slug },
      update: {
        name: skill.name,
        categoryId,
        featured: skill.featured,
        order: skillOrder++,
      },
      create: {
        name: skill.name,
        slug: skill.slug,
        categoryId,
        featured: skill.featured,
        order: skillOrder++,
      },
    });
    skillMap.set(skill.name, savedSkill.id);
  }
  console.log(`⚡ [Seed] Initial skills seeded (${initialSkills.length} skills)`);

  // 6. Seed Projects
  const initialProjects = [
    {
      slug: 'oral-lesion-hybrid-quantum-ai',
      title: 'Oral Lesion Image Classification and Risk Evaluation Using Hybrid Quantum Artificial Intelligence (QAI-OLI)',
      subtitle: 'Quantum-Classical Hybrid Machine Learning for Early Risk Stratification',
      description: 'An advanced AI/ML research initiative combining dual-backbone deep neural networks with 8-qubit variational quantum circuits for early screening, classification, and risk evaluation of oral precancerous and malignant lesions.',
      content: `### Clinical Relevance
Early identification of oral carcinomas and potentially malignant lesions dramatically elevates 5-year survival rates. Conventional physical examinations suffer from human inter-observer variance, requiring accessible non-invasive automated decision support.

### Six-Stage Hybrid Architecture
1. **Pre-Flight Image Quality Gate:** Analyzes Laplacian variance blur, illumination variance, glare, and color balance before allowing model inference.
2. **Dual-Backbone Feature Extraction:** ConvNeXt-V2 captures macro lesion structure; DenseNet-121 captures dense histological gradients.
3. **8-D PCA Latent Compression:** Compresses concatenated representations into an 8-dimensional quantum state vector.
4. **8-Qubit Parameterized Quantum Circuit (VQC):** Leverages quantum Hilbert space representations using PennyLane and Qiskit Aer simulators.
5. **Grad-CAM Explainable AI:** Delivers transparent saliency heatmaps highlighting histological diagnostic regions.
6. **Clinical Triage Stratification:** Predicts four discrete classes: OCA, OPMD, BSore, and HLT.

### Project-Reported Evaluation Metrics
- Binary Screening Triage: 98.40%
- Four-Class Classification Accuracy: 83.77%
- Malignancy Sensitivity F1: 89.40%
- Macro F1 Across All Classes: 82.90%
- End-to-End Pipeline Latency: < 2.5s

*Notice: Project-reported evaluation metrics on test datasets; not a substitute for clinical diagnosis or regulatory approval.*`,
      category: 'Quantum-Classical AI',
      status: 'IN_PROGRESS',
      featured: true,
      order: 1,
      liveUrl: 'https://qai-oli.vercel.app/',
      githubUrl: 'https://github.com/amitchn28/qai-oli',
      technologies: [
        'Python',
        'PyTorch',
        'ConvNeXt-V2',
        'DenseNet-121',
        'OpenCV',
        'PennyLane',
        'Qiskit Aer',
        'FastAPI',
        'React',
        'TypeScript',
      ],
    },
    {
      slug: 'oral-cancer-detection-cnn',
      title: 'Oral Cancer Detection Using Convolutional Neural Networks',
      subtitle: 'Automated Histopathological & Clinical Pattern Recognition',
      description: 'A deep learning framework exploring convolutional neural network architectures for early detection of oral cancer from biopsy and clinical photographic datasets.',
      content: `### Overview
Investigated deep convolutional architectures (ResNet-50, MobileNet-V2, and VGG-16) for automated classification of oral histological and photographic specimens.

### Technical Implementation
- Implemented intensive data augmentation pipelines (elastic transforms, color jittering, random affine shifts) to prevent overfitting on clinical sample distributions.
- Optimized classification heads using cross-entropy loss with label smoothing.
- Evaluated performance using ROC-AUC curves and confusion matrix sensitivity metrics across diverse lesion subtypes.`,
      category: 'Computer Vision',
      status: 'COMPLETED',
      featured: true,
      order: 2,
      githubUrl: 'https://github.com/amitchn28/oral-cancer-cnn',
      technologies: ['Python', 'PyTorch', 'CNN', 'OpenCV', 'Matplotlib'],
    },
    {
      slug: 'ai-home-energy-auditor',
      title: 'AI Home Energy Auditor — Energy Consumption Analysis and Anomaly Detection',
      subtitle: 'Time-Series Electrical Signal Processing & Predictive Forecasting',
      description: 'A machine learning-driven energy auditing platform that processes smart meter telemetry to detect anomalous consumption, disaggregate appliance loads, and forecast future power demands.',
      content: `### Overview
A residential energy intelligence system designed to analyze time-series power consumption data, identify abnormal energy spikes, and disaggregate major electrical loads without intrusive hardware.

### Key Features
- **Telemetry Ingestion:** Ingests high-frequency electrical telemetry data and extracts rolling statistical features.
- **Anomaly Detection:** Employs Isolation Forests and rolling Z-score filters to flag leakage, faulty appliances, or unexpected energy surges.
- **Predictive Forecasting:** Generates 24-hour ahead consumption forecasts to facilitate peak demand shifting and cost reduction.`,
      category: 'Smart Energy / IoT',
      status: 'IN_PROGRESS',
      featured: true,
      order: 3,
      githubUrl: 'https://github.com/amitchn28/ai-energy-auditor',
      technologies: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'React', 'SQL'],
    },
  ];

  for (const p of initialProjects) {
    const project = await prisma.project.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        subtitle: p.subtitle,
        description: p.description,
        content: p.content,
        category: p.category,
        status: p.status,
        featured: p.featured,
        order: p.order,
        liveUrl: p.liveUrl || null,
        githubUrl: p.githubUrl || null,
        published: true,
      },
      create: {
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle,
        description: p.description,
        content: p.content,
        category: p.category,
        status: p.status,
        featured: p.featured,
        order: p.order,
        liveUrl: p.liveUrl || null,
        githubUrl: p.githubUrl || null,
        published: true,
      },
    });

    // Link technologies
    await prisma.projectTechnology.deleteMany({ where: { projectId: project.id } });
    for (const tech of p.technologies) {
      await prisma.projectTechnology.create({
        data: {
          projectId: project.id,
          name: tech,
          skillId: skillMap.get(tech) || null,
        },
      });
    }
  }
  console.log(`🚀 [Seed] Initial projects seeded (${initialProjects.length} projects)`);

  // 7. Seed Social Links (Authentic profiles from prompt)
  await prisma.socialLink.deleteMany({});
  await prisma.socialLink.createMany({
    data: [
      {
        platform: 'LinkedIn',
        url: 'https://www.linkedin.com/in/amit-chauhan-613833329',
        username: 'amit-chauhan-613833329',
        icon: 'Linkedin',
        order: 1,
        isActive: true,
      },
      {
        platform: 'GitHub',
        url: 'https://github.com/amitchn28',
        username: 'amitchn28',
        icon: 'Github',
        order: 2,
        isActive: true,
      },
      {
        platform: 'LeetCode',
        url: 'https://leetcode.com',
        username: 'Coding Profile',
        icon: 'Code2',
        order: 3,
        isActive: true,
      },
      {
        platform: 'HackerRank',
        url: 'https://hackerrank.com',
        username: 'Problem Solving',
        icon: 'Code',
        order: 4,
        isActive: true,
      },
    ],
  });
  console.log('🌐 [Seed] Authentic social links seeded (LinkedIn, GitHub, LeetCode, HackerRank)');

  // 8. Seed Website & SEO Settings
  await prisma.websiteSettings.upsert({
    where: { id: 'default' },
    update: {
      siteName: 'Amit Chauhan',
      siteTagline: 'Software Engineer & AI Developer',
      contactEmail: process.env.OWNER_EMAIL || 'amitchn28@gmail.com',
      isMaintenance: false,
      allowMessages: true,
      theme: 'mumbai-twilight',
    },
    create: {
      id: 'default',
      siteName: 'Amit Chauhan',
      siteTagline: 'Software Engineer & AI Developer',
      contactEmail: process.env.OWNER_EMAIL || 'amitchn28@gmail.com',
      isMaintenance: false,
      allowMessages: true,
      theme: 'mumbai-twilight',
    },
  });

  await prisma.sEOSettings.upsert({
    where: { id: 'default' },
    update: {
      metaTitle: 'Amit Chauhan — Software Engineer & AI Developer',
      metaDescription: 'Personal portfolio of Amit Chauhan, Computer Engineering student at University of Mumbai (ARMIET) specializing in software development, AI/ML, and intelligent systems.',
      metaKeywords: 'Amit Chauhan, Portfolio, Computer Engineering, University of Mumbai, ARMIET, AI, ML, Deep Learning, React, TypeScript, Node.js',
      canonicalUrl: process.env.VITE_SITE_URL || 'http://localhost:3000',
    },
    create: {
      id: 'default',
      metaTitle: 'Amit Chauhan — Software Engineer & AI Developer',
      metaDescription: 'Personal portfolio of Amit Chauhan, Computer Engineering student at University of Mumbai (ARMIET) specializing in software development, AI/ML, and intelligent systems.',
      metaKeywords: 'Amit Chauhan, Portfolio, Computer Engineering, University of Mumbai, ARMIET, AI, ML, Deep Learning, React, TypeScript, Node.js',
      canonicalUrl: process.env.VITE_SITE_URL || 'http://localhost:3000',
    },
  });

  console.log('✅ [Seed] Database seeding completed successfully.');
  process.exit(0);
}

main()
  .catch((e) => {
    console.error('❌ [Seed] Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
