import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';

describe('Attendance (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let attendanceId: string;
  let staffUuid: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('api');
    app.use(helmet());
    app.enableVersioning({
      type: VersioningType.URI,
    });
    app.use(bodyParser.json());
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();

    const staffRes = await request(app.getHttpServer())
      .post('/api/v1/staffs')
      .send({
        staffId: 'STF001',
        username: 'teststaff',
        firstName: 'Test',
        lastName: 'User',
        email: 'teststaff@example.com',
        password: 'password123',
      });

    staffUuid = staffRes.body.data?.id || staffRes.body.id;

    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        username: 'teststaff',
        password: 'password123',
      });

    authToken =
      loginRes.body.accessToken ||
      loginRes.body.data?.accessToken ||
      loginRes.body.token;

    if (!staffUuid && loginRes.body.data?.staff?.id) {
      staffUuid = loginRes.body.data.staff.id;
    }
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('/api/v1/staffs (POST)', () => {
    it('should have created a staff successfully and obtained token', () => {
      expect(authToken).toBeDefined();
    });
  });

  describe('/api/v1/attendances (POST) - Clock In', () => {
    it('should allow staff to clock in', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/attendances')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          attendanceId: 'ATT-111',
          staffId: staffUuid,
          checkInTime: new Date().toISOString(),
          status: 'Present',
        })
        .expect(201);

      attendanceId = response.body.data?.id || response.body.id || 'ATT-111';
      expect(response.status).toEqual(201);
    });
  });

  describe('/api/v1/attendances/:id (PUT) - Clock Out', () => {
    it('should allow staff to update attendance / clock out', async () => {
      const targetId = attendanceId || 'ATT-111';

      const response = await request(app.getHttpServer())
        .put(`/api/v1/attendances/${targetId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          checkOutTime: new Date().toISOString(),
          status: 'Checked Out',
        })
        .expect(200);

      expect(response.status).toEqual(200);
    });
  });

  describe('/api/v1/attendances (GET)', () => {
    it('should return all attendance records', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/attendances')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.status).toEqual(200);
    });
  });
});
