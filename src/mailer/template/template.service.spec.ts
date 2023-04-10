import { Test, TestingModule } from '@nestjs/testing';
import { TemplateService } from './template.service';

describe('TemplateService', () => {
  let service: TemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemplateService],
    }).compile();

    service = module.get<TemplateService>(TemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('compile ejs for variables then mjml for html', () => {
    const mailHtml = service.compileTemplate(
      `<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text><%=foo%></mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`,
      {
        foo: 'bar',
      },
    );
    expect(mailHtml).toMatchSnapshot();
  });

  it('load template from FS', async () => {
    const ejsMjmlTemplate = await service.loadEJSTemplate(
      __dirname + '/../../../templates/test.mjml.ejs',
    );

    expect(ejsMjmlTemplate).toMatchSnapshot();
  });

  it('getConfirmEmailHtml', async () => {
    const html = await service.getConfirmEmailHtml({
      code: 'xxxx',
      webAppUrl: 'http://localhost:3000',
    });

    expect(html).toMatchSnapshot();
  });

  it('resetPasswordEmailHtml', async () => {
    const html = await service.getResetPasswordEmail({
      code: 'asdasd',
      webAppUrl: 'http://localhost:3000',
    });

    expect(html).toMatchSnapshot();
  });
});
