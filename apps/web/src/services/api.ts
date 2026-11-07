const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Fallback data ensuring frontend renders perfectly in all states
export const FALLBACK_PROFILE = {
  name: 'Amit Chauhan',
  headline: 'Software Engineer & AI Developer',
  tagline: 'Building intelligent systems, scalable full-stack web applications, and hybrid AI solutions.',
  shortBio: 'CS student focused on building robust full-stack software architectures, high-performance web systems, and intelligent machine learning solutions.',
  fullBio: `I am someone who thrives on learning, problem-solving, and continuous growth. My personality blends curiosity, adaptability, and persistence, which helps me approach challenges with optimism and clarity. I value collaboration and clear communication, but I am equally comfortable taking initiative and working independently.

At my core, I am driven by a desire to make an impact, stay open to new perspectives, and keep evolving both personally and professionally.`,
  avatarUrl: '/avatar.webp',
  resumeUrl: '/Amit_Chauhan_Resume.pdf',
  location: 'Mumbai, India',
  email: '',
  currentStatus: 'CS Student',
  availability: 'OPEN_TO_WORK',
};

export const FALLBACK_EDUCATION = [
  {
    id: 'edu-1',
    degree: 'B.E. Computer Engineering',
    fieldOfStudy: 'Computer Engineering',
    institution: 'ARMIET (Alamuri Ratnamala Institute of Engineering and Technology)',
    university: 'University of Mumbai',
    academicStatus: 'Fourth Year',
    startYear: 2023,
    endYear: 2027,
    isCurrent: true,
    description: 'Pursuing B.E. in Computer Engineering at ARMIET (Alamuri Ratnamala Institute of Engineering and Technology), affiliated with University of Mumbai. Specialized coursework in algorithms, data structures, distributed systems, full-stack architecture, and machine learning.',
  },
];

export const FALLBACK_SKILLS = [
  // Programming Languages
  { id: 's1', name: 'C++', category: 'Programming Languages', categorySlug: 'languages', icon: 'cpp' },
  { id: 's2', name: 'Java', category: 'Programming Languages', categorySlug: 'languages', icon: 'java' },
  { id: 's3', name: 'Python', category: 'Programming Languages', categorySlug: 'languages', icon: 'python' },
  { id: 's4', name: 'JavaScript', category: 'Programming Languages', categorySlug: 'languages', icon: 'javascript' },

  // Frontend Development
  { id: 's5', name: 'React.js', category: 'Frontend Development', categorySlug: 'frontend', icon: 'react' },
  { id: 's6', name: 'HTML', category: 'Frontend Development', categorySlug: 'frontend', icon: 'html' },
  { id: 's7', name: 'CSS', category: 'Frontend Development', categorySlug: 'frontend', icon: 'css' },

  // Backend Development
  { id: 's8', name: 'Node.js', category: 'Backend Development', categorySlug: 'backend', icon: 'nodejs' },

  // Databases
  { id: 's9', name: 'MongoDB', category: 'Databases', categorySlug: 'databases', icon: 'mongodb' },
  { id: 's10', name: 'SQL', category: 'Databases', categorySlug: 'databases', icon: 'sql' },

  // Developer Tools
  { id: 's11', name: 'Git', category: 'Developer Tools', categorySlug: 'tools', icon: 'git' },
  { id: 's12', name: 'GitHub', category: 'Developer Tools', categorySlug: 'tools', icon: 'github' },
];

export const FALLBACK_PROJECTS = [
  {
    id: 'p1',
    slug: 'oral-lesion-hybrid-quantum-ai',
    title: 'Oral Lesion Image Classification and Risk Evaluation Using Hybrid Quantum Artificial Intelligence (QAI-OLI)',
    shortCode: 'QAI-OLI',
    subtitle: 'Dual Deep Backbones & 8-Qubit Variational Quantum Circuit for Clinical Triage',
    description: 'An advanced AI/ML research initiative combining dual-backbone deep neural networks with 8-qubit variational quantum circuits for early screening, classification, and risk evaluation of oral precancerous and malignant lesions.',
    category: 'Quantum-Classical AI',
    status: 'IN_PROGRESS',
    statusLabel: 'CURRENT MAJOR PROJECT',
    featured: true,
    isFlagship: true,
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
      'VQC',
      'FastAPI',
      'React',
      'TypeScript',
    ],
    benchmarks: [
      { label: 'Binary Screening Triage', value: '98.40%', note: 'Benign vs High Risk' },
      { label: 'Four-Class Accuracy', value: '83.77%', note: 'OCA, OPMD, BSore, HLT' },
      { label: 'Malignancy Sensitivity F1', value: '89.40%', note: 'High-risk detection' },
      { label: 'Macro F1 Across Classes', value: '82.90%', note: 'Balanced performance' },
      { label: 'End-to-End Latency', value: '< 2.5s', note: 'Inference runtime' },
    ],
    disclaimer: 'Project-reported evaluation metrics on test datasets; not a substitute for clinical diagnosis or regulatory approval.',
    architectureStages: [
      {
        stage: '01',
        name: 'Pre-Flight Image Quality Gate',
        desc: 'Evaluates Laplacian variance motion blur, illumination uniformity, specular glare, and color interference before allowing image processing.',
      },
      {
        stage: '02',
        name: 'Dual Deep Feature Extraction',
        desc: 'ConvNeXt-V2 captures macro-structural tissue layouts, while DenseNet-121 extracts dense cellular morphology and boundary transition gradients.',
      },
      {
        stage: '03',
        name: 'Feature Fusion & Dimensionality Reduction',
        desc: 'Concatenates deep representations and compresses them via Principal Component Analysis (PCA) into an 8-dimensional quantum latent state vector.',
      },
      {
        stage: '04',
        name: 'Hybrid Quantum Layer (8-Qubit VQC)',
        desc: 'Encodes 8 latent features into quantum superposition states using angle embedding, followed by parameterized rotation gates and entangling CNOT layers on PennyLane and Qiskit Aer simulators.',
      },
      {
        stage: '05',
        name: 'Explainable AI (Grad-CAM Heatmaps)',
        desc: 'Generates gradient-weighted class activation heatmaps to highlight visual tissue areas influencing classification decisions for transparent verification.',
      },
      {
        stage: '06',
        name: 'Clinical Triage Stratification',
        desc: 'Maps quantum expectation values to four clinical triage classes: OCA (Oral Carcinoma), OPMD (Oral Potentially Malignant Disorders), BSore (Benign Sore), and HLT (Healthy Tissue).',
      },
    ],
    content: `### Problem & Clinical Relevance
Oral cancer accounts for a significant proportion of global cancer burdens, with early detection markedly improving patient outcomes. Standard clinical visual examination frequently suffers from subjective variability, while invasive biopsies cannot be universally applied for population-level screening.

### Hybrid Quantum-Classical Innovation
This project implements a hybrid quantum-classical architecture that pairs state-of-the-art vision backbones with variational quantum computing circuits:
1. **Pre-Flight Quality Gate:** Real-time filtering against motion blur, poor lighting, and glare.
2. **Dual-Backbone Ensembling:** ConvNeXt-V2 for macro lesion boundaries + DenseNet-121 for fine histological features.
3. **8-Qubit Parameterized Quantum Circuit:** Explores high-dimensional Hilbert spaces for non-linear decision boundaries using PennyLane & Qiskit Aer.
4. **Grad-CAM Explainability:** Delivers interpretable visual explanations alongside numerical predictions.`,
  },
  {
    id: 'p2',
    slug: 'oral-cancer-detection-cnn',
    title: 'Oral Cancer Detection Using Convolutional Neural Networks',
    shortCode: 'CNN-OCD',
    subtitle: 'Automated Histopathological & Clinical Pattern Recognition',
    description: 'A deep learning framework exploring convolutional neural network architectures for early detection of oral cancer from biopsy and clinical photographic datasets.',
    category: 'Computer Vision',
    status: 'COMPLETED',
    statusLabel: 'COMPLETED',
    featured: true,
    isFlagship: false,
    githubUrl: 'https://github.com/amitchn28/oral-cancer-cnn',
    technologies: ['Python', 'PyTorch', 'CNN', 'OpenCV', 'Matplotlib'],
    content: `### Overview
Investigated deep convolutional architectures (ResNet-50, MobileNet-V2, and VGG-16) for automated classification of oral histological and photographic specimens.

### Technical Implementation
- Implemented intensive data augmentation pipelines (elastic transforms, color jittering, random affine shifts) to prevent overfitting on clinical sample distributions.
- Optimized classification heads using cross-entropy loss with label smoothing.
- Evaluated performance using ROC-AUC curves and confusion matrix sensitivity metrics across diverse lesion subtypes.`,
  },
  {
    id: 'p3',
    slug: 'ai-home-energy-auditor',
    title: 'AI Home Energy Auditor — Energy Consumption Analysis and Anomaly Detection',
    shortCode: 'ENERGY-AI',
    subtitle: 'Time-Series Electrical Signal Processing & Predictive Forecasting',
    description: 'A machine learning-driven energy auditing platform that processes smart meter telemetry to detect anomalous consumption, disaggregate appliance loads, and forecast future power demands.',
    category: 'Smart Energy / IoT',
    status: 'IN_PROGRESS',
    statusLabel: 'IN-PROGRESS',
    featured: true,
    isFlagship: false,
    githubUrl: 'https://github.com/amitchn28/ai-energy-auditor',
    technologies: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'React', 'SQL'],
    content: `### Overview
A residential energy intelligence system designed to analyze time-series power consumption data, identify abnormal energy spikes, and disaggregate major electrical loads without intrusive hardware.

### Key Features
- **Telemetry Ingestion:** Ingests high-frequency electrical telemetry data and extracts rolling statistical features.
- **Anomaly Detection:** Employs Isolation Forests and rolling Z-score filters to flag leakage, faulty appliances, or unexpected energy surges.
- **Predictive Forecasting:** Generates 24-hour ahead consumption forecasts to facilitate peak demand shifting and cost reduction.`,
  },
];

export const FALLBACK_SOCIALS = [
  {
    id: 'soc-1',
    platform: 'LinkedIn',
    url: 'https://www.linkedin.com/in/amit-chauhan-613833329',
    username: 'amit-chauhan-613833329',
    badge: 'CONNECT',
    color: '#0077b5',
  },
  {
    id: 'soc-2',
    platform: 'GitHub',
    url: 'https://github.com/amitchn28',
    username: 'amitchn28',
    badge: 'COMMIT',
    color: '#ffffff',
  },
];

export const portfolioApi = {
  async getSettings() {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json();
      return data.data;
    } catch {
      return {
        website: {
          siteName: 'Amit Chauhan',
          siteTagline: 'Software Engineer & AI Developer',
          contactEmail: 'amitchn28@gmail.com',
          isMaintenance: false,
          theme: 'cyber-dark',
        },
      };
    }
  },

  async getProfile() {
    try {
      const res = await fetch(`${API_BASE}/profile`);
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();
      return data.data;
    } catch {
      return FALLBACK_PROFILE;
    }
  },

  async getEducation() {
    try {
      const res = await fetch(`${API_BASE}/education`);
      if (!res.ok) throw new Error('Failed to fetch education');
      const data = await res.json();
      return data.data;
    } catch {
      return FALLBACK_EDUCATION;
    }
  },

  async getSkills() {
    try {
      const res = await fetch(`${API_BASE}/skills`);
      if (!res.ok) throw new Error('Failed to fetch skills');
      const data = await res.json();
      return data.data;
    } catch {
      return FALLBACK_SKILLS;
    }
  },

  async getProjects() {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      return data.data;
    } catch {
      return FALLBACK_PROJECTS;
    }
  },

  async getSocialLinks() {
    try {
      const res = await fetch(`${API_BASE}/socials`);
      if (!res.ok) throw new Error('Failed to fetch socials');
      const data = await res.json();
      return data.data;
    } catch {
      return FALLBACK_SOCIALS;
    }
  },

  async submitContact(payload: { name: string; email: string; subject?: string; message: string }) {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to submit contact message');
    }
    return res.json();
  },

  async recordEvent(eventType: string, path: string = window.location.pathname, metadata?: Record<string, unknown>) {
    try {
      await fetch(`${API_BASE}/analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          path,
          referrer: document.referrer || null,
          metadata,
        }),
      });
    } catch {
      // Non-blocking telemetry
    }
  },
};
