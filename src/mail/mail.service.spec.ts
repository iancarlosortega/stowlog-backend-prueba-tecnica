import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { MailService } from '@/mail/mail.service';

describe('MailService', () => {
	let service: MailService;
	let mailerService: MailerService;

	const to = 'iancarlosortegaleon@gmail.com';
	const subject = 'New task created';
	const content = 'Your task has been created successfully.';

	const mockMailerService = {
		sendMail: jest.fn(),
	};

	beforeEach(async () => {
		jest.clearAllMocks();
		jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MailService,
				{
					provide: MailerService,
					useValue: mockMailerService,
				},
			],
		}).compile();

		service = module.get<MailService>(MailService);
		mailerService = module.get<MailerService>(MailerService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should send an email successfully', async () => {
		mockMailerService.sendMail.mockResolvedValue(undefined);
		await service.sendMail(to, subject, content);

		expect(mailerService.sendMail).toHaveBeenCalledWith({
			to,
			subject,
			text: content,
			html: `<p>${content}</p>`,
		});
	});

	it('should throw an error when email sending fails', async () => {
		const errorMessage = 'Error sending email';

		mockMailerService.sendMail.mockRejectedValue(new Error(errorMessage));

		await expect(service.sendMail(to, subject, content)).rejects.toThrow(
			`Failed to send email: ${errorMessage}`,
		);
		expect(mailerService.sendMail).toHaveBeenCalledWith({
			to,
			subject,
			text: content,
			html: `<p>${content}</p>`,
		});
	});
});
