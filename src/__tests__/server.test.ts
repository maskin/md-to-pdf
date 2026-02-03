import request from 'supertest';
import app from '../server';

describe('Server API', () => {
  it('should return health status', async () => {
    const response = await request(app).get('/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok', service: 'md-to-pdf' });
  });
  
  it('should return API information on root', async () => {
    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('endpoints');
  });
  
  it('should convert markdown to PDF via /convert endpoint', async () => {
    const markdown = '# Test Document\n\nThis is a test.';
    
    const response = await request(app)
      .post('/convert')
      .send({ markdown })
      .expect(200);
    
    expect(response.headers['content-type']).toBe('application/pdf');
    expect(response.body).toBeInstanceOf(Buffer);
    expect(response.body.length).toBeGreaterThan(0);
  }, 30000);
  
  it('should convert markdown with options', async () => {
    const markdown = '# Landscape Document';
    const options = {
      format: 'Letter',
      landscape: true
    };
    
    const response = await request(app)
      .post('/convert')
      .send({ markdown, options })
      .expect(200);
    
    expect(response.headers['content-type']).toBe('application/pdf');
    expect(response.body.length).toBeGreaterThan(0);
  }, 30000);
  
  it('should return 400 if markdown is missing', async () => {
    const response = await request(app)
      .post('/convert')
      .send({})
      .expect(400);
    
    expect(response.body).toHaveProperty('error');
  });
  
  it('should convert via /convert/simple endpoint', async () => {
    const markdown = '# Simple Test';
    
    const response = await request(app)
      .post('/convert/simple')
      .set('Content-Type', 'text/markdown')
      .send(markdown)
      .expect(200);
    
    expect(response.headers['content-type']).toBe('application/pdf');
    expect(response.body.length).toBeGreaterThan(0);
  }, 30000);
});
