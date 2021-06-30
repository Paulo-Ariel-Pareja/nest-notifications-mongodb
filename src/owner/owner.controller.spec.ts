import { Test, TestingModule } from '@nestjs/testing';
import { OwnerController } from './owner.controller';
import { OwnerService } from './owner.service';
import { Owner } from '../models/owner.models';

describe('OwnerController', () => {
    let controller: OwnerController;
    let service: OwnerService;

    beforeEach(async () => {
        const ApiServiceProvider = {
            provide: OwnerService,
            useFactory: () => ({
                getMessagesActive: jest.fn(() => true),
            }),
        };
        const app: TestingModule = await Test.createTestingModule({
            controllers: [OwnerController],
            providers: [OwnerService, ApiServiceProvider],
        }).compile();
        controller = app.get<OwnerController>(OwnerController);
        service = app.get<OwnerService>(OwnerService);
    });

    afterEach(() => {
        jest.restoreAllMocks();
        jest.resetAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(service).toBeDefined();
    });

    describe('getMessages Method', () => {
        it('should get an owner messages', async () => {
            const mockResult: unknown = {
                uuid: '1233',
                messages:[]
              };
              jest.spyOn(service, 'getMessagesActive').mockImplementation(async () => mockResult as Promise<Owner>);
              const owner = await controller.getMessages('1233');
              expect(owner.owner.uuid).toBe('1233');
        });

        it('should throw error on get an owner messages', async () => {
            jest.spyOn(service, 'getMessagesActive').mockImplementation(() => {
              throw new Error('Not Found Exception');
            });
            try {
              await controller.getMessages('123');
            } catch (e) {
              expect(e.message).toBe('Not Found Exception');
              expect(e.status).toBe(400);
              expect(e.response.error).toBe('Bad Request');
            }
          });
    });
});