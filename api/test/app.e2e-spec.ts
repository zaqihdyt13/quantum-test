import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import helmet from 'helmet';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('api');
    app.use(helmet());
    app.enableVersioning({
      type: VersioningType.URI,
    });
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();

    await request(app.getHttpServer())
      .post('/api/v1/staffs')
      .send({
        data: {
          type: 'staff',
          attributes: {
            staffId: 'STF-APP-001',
            username: 'appteststaff',
            firstName: 'App',
            lastName: 'Test',
            email: 'apptest@example.com',
            password: 'password123',
          },
        },
      });

    const loginRes = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({
        data: {
          type: 'auth',
          attributes: {
            username: 'appteststaff',
            password: 'password123',
          },
        },
      });

    authToken =
      loginRes.body.accessToken || loginRes.body.data?.attributes?.accessToken;
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/api/v1/attendances (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/attendances')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
    // .expect('Hello World!');
  });
});
