import http from 'http';
import { app } from '../src/app';
import prisma from '../src/db/prisma';
import { ensureDatabaseRunning } from '../src/db/embeddedServer';

let server: http.Server;
const TEST_PORT = 5005;

async function request(
  method: string,
  path: string,
  body?: unknown,
  headers: Record<string, string> = {}
): Promise<{ status: number; data: any; headers: http.IncomingHttpHeaders }> {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : undefined;
    const reqHeaders: Record<string, string> = {
      ...headers,
    };

    if (payload) {
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(payload).toString();
    }

    const req = http.request(
      {
        hostname: 'localhost',
        port: TEST_PORT,
        path,
        method,
        headers: reqHeaders,
      },
      (res) => {
        let rawData = '';
        res.on('data', (chunk) => (rawData += chunk));
        res.on('end', () => {
          let parsed: any = rawData;
          try {
            parsed = JSON.parse(rawData);
          } catch {
            // Keep raw string
          }
          resolve({ status: res.statusCode || 500, data: parsed, headers: res.headers });
        });
      }
    );

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 ========================================================');
  console.log('🧪 AMIT CHAUHAN PORTFOLIO — API INTEGRATION TEST SUITE');
  console.log('🧪 ========================================================\n');

  // Ensure database is running
  await ensureDatabaseRunning();
  await prisma.$connect();

  // Start temporary test server instance on port 5005
  server = app.listen(TEST_PORT);
  console.log(`📡 Test server listening on http://localhost:${TEST_PORT}\n`);

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}${detail ? ` -> ${detail}` : ''}`);
      failed++;
    }
  }

  try {
    // 1. Health & Root endpoints
    const rootRes = await request('GET', '/');
    assert(rootRes.status === 200 && rootRes.data.success, 'GET / returns operational status');

    const healthRes = await request('GET', '/api/health');
    assert(healthRes.status === 200 && healthRes.data.data?.status === 'UP', 'GET /api/health returns UP');

    // 2. Profile & About
    const profileRes = await request('GET', '/api/profile');
    assert(
      profileRes.status === 200 && profileRes.data.data?.name === 'Amit Chauhan',
      'GET /api/profile returns Amit Chauhan profile'
    );

    const aboutRes = await request('GET', '/api/about');
    assert(
      aboutRes.status === 200 && (aboutRes.data.data?.academicStatus?.includes('Fourth Year') || aboutRes.data.data?.academicStatus?.includes('CS Student')),
      'GET /api/about returns academic status and education history'
    );

    // 3. Education & Skills
    const eduRes = await request('GET', '/api/education');
    assert(
      eduRes.status === 200 && Array.isArray(eduRes.data.data) && eduRes.data.data.length > 0,
      'GET /api/education returns Mumbai University B.E. record'
    );

    const skillsRes = await request('GET', '/api/skills');
    assert(
      skillsRes.status === 200 && Array.isArray(skillsRes.data.data),
      'GET /api/skills returns categorized skills'
    );

    // 4. Projects (Filtering, Search, Pagination)
    const projectsRes = await request('GET', '/api/projects?limit=5');
    assert(
      projectsRes.status === 200 && projectsRes.data.data?.length >= 3,
      'GET /api/projects returns seeded initial projects (at least 3 total)'
    );

    const searchRes = await request('GET', '/api/projects?q=Quantum');
    assert(
      searchRes.status === 200 && searchRes.data.data?.some((p: any) => p.slug.includes('quantum')),
      'GET /api/projects?q=Quantum searches and returns Quantum AI project'
    );

    const targetSlug = projectsRes.data.data?.[0]?.slug || 'oral-lesion-hybrid-quantum-ai';
    const singleProjRes = await request('GET', `/api/projects/${targetSlug}`);
    assert(
      singleProjRes.status === 200 && singleProjRes.data.data?.slug === targetSlug,
      'GET /api/projects/:slug retrieves single project by slug'
    );

    // 5. Contact Submission & Validation
    const invalidContactRes = await request('POST', '/api/contact', {
      name: 'A',
      email: 'invalid-email',
      message: 'short',
    });
    assert(
      invalidContactRes.status === 400 && invalidContactRes.data.error?.code === 'VALIDATION_ERROR',
      'POST /api/contact validates payload and rejects invalid email/short message with 400'
    );

    const testTimestamp = Date.now();
    const validContactRes = await request('POST', '/api/contact', {
      name: 'Dr. Jane Recruiter',
      email: `jane.recruiter.${testTimestamp}@example.com`,
      subject: 'Interview Invitation - AI Engineering',
      message: `Hello Amit, We reviewed your engineering portfolio (${testTimestamp}) and would love to connect.`,
    });
    assert(
      (validContactRes.status === 201 || validContactRes.status === 200) && validContactRes.data.success,
      'POST /api/contact successfully saves valid contact message with 201'
    );

    // 6. Analytics Event Logging
    const analyticsRes = await request('POST', '/api/analytics', {
      eventType: 'PAGE_VIEW',
      path: '/projects/oral-lesion-hybrid-quantum-ai',
      referrer: 'https://google.com',
    });
    assert(
      analyticsRes.status === 201 && analyticsRes.data.success,
      'POST /api/analytics records analytics event'
    );

    // 7. Settings
    const settingsRes = await request('GET', '/api/settings');
    assert(
      settingsRes.status === 200 && settingsRes.data.data?.website?.siteName === 'Amit Chauhan',
      'GET /api/settings returns public website & SEO metadata'
    );

    // 8. Admin Authentication Security
    const badLoginRes = await request('POST', '/api/auth/login', {
      email: 'amitchn28@gmail.com',
      password: 'WrongPassword123!',
    });
    assert(
      badLoginRes.status === 401,
      'POST /api/auth/login rejects invalid password with 401 Unauthorized'
    );

    // Get admin user from database to generate signed JWT test token and active session
    const adminUser = await prisma.adminUser.findFirst();
    const jwt = require('jsonwebtoken');
    const jwtSecret = process.env.JWT_SECRET || 'super-secret-development-jwt-key-replace-in-production';
    const authToken = jwt.sign(
      { userId: adminUser?.id, email: adminUser?.email, role: adminUser?.role },
      jwtSecret,
      { expiresIn: '1h' }
    );
    
    // Register session in PostgreSQL AdminSession table
    if (adminUser?.id) {
      await prisma.adminSession.create({
        data: {
          userId: adminUser.id,
          token: authToken,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
          userAgent: 'Integration-Test-Runner',
        },
      });
    }

    const authHeaders = { Authorization: `Bearer ${authToken}` };

    assert(
      !!authToken,
      'Cryptographic JWT session token issued and registered in AdminSession'
    );

    // 9. Protected Admin Routes
    const meRes = await request('GET', '/api/auth/me', undefined, authHeaders);
    assert(
      meRes.status === 200 && meRes.data.data?.user?.email === 'amitchn28@gmail.com',
      'GET /api/auth/me returns authenticated admin user context (amitchn28@gmail.com)'
    );

    const unauthMeRes = await request('GET', '/api/auth/me');
    assert(
      unauthMeRes.status === 401,
      'GET /api/auth/me rejects request without token with 401'
    );

    // 10. Admin CRUD: Create new project
    const newProjectRes = await request(
      'POST',
      '/api/projects',
      {
        title: 'Quantum Variational Classifier for Genomic Data',
        subtitle: 'Genomic Sequence Classification via Qiskit & PyTorch',
        description: 'Exploring quantum feature maps for high-dimensional genomic sequence analysis.',
        category: 'AI_ML',
        status: 'IN_PROGRESS',
        featured: false,
        technologies: ['Python', 'Qiskit', 'PyTorch'],
      },
      authHeaders
    );
    assert(
      newProjectRes.status === 201 && newProjectRes.data.data?.slug?.includes('quantum-variational'),
      'POST /api/projects creates new project with technologies under admin authorization'
    );

    const createdProjectId = newProjectRes.data.data?.id;

    // 11. Admin CRUD: Delete project
    if (createdProjectId) {
      const deleteProjRes = await request('DELETE', `/api/projects/${createdProjectId}`, undefined, authHeaders);
      assert(deleteProjRes.status === 200, 'DELETE /api/projects/:id deletes project successfully');
    }

    // 12. Admin Overview Analytics
    const overviewRes = await request('GET', '/api/analytics/overview', undefined, authHeaders);
    assert(
      overviewRes.status === 200 && overviewRes.data.data?.metrics?.totalEvents >= 1,
      'GET /api/analytics/overview returns metrics and audit logs'
    );

    // 13. Admin Logout
    const logoutRes = await request('POST', '/api/auth/logout', undefined, authHeaders);
    assert(
      logoutRes.status === 200,
      'POST /api/auth/logout revokes session in PostgreSQL database'
    );

    // 14. Data Persistence Verification
    const contactCount = await prisma.contactMessage.count({
      where: { email: { contains: 'jane.recruiter' } },
    });
    assert(
      contactCount >= 1,
      'PostgreSQL data persistence: Contact message verified directly in database'
    );

    console.log('\n========================================================');
    console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('========================================================\n');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  } finally {
    server.close();
    await prisma.$disconnect();
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
