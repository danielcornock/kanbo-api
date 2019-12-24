import { BaseController } from './base-controller.abstract';
import { CrudService } from '../crud-service/crud-service.abstract';
import { StoryServiceStub } from '../../../story/service/story.service.stub';
import { Document } from 'mongoose';
import { IStory } from '../../../story/model/story';
import { MongooseModelMock } from '../../../testing/mongoose-model.mock';
import { reqUserMock } from '../../../testing/req-user.mock';

import { CrudServiceStub } from '../crud-service/crud-service.stub';

describe('BaseController', () => {
  let controller: BaseController<IStory, CrudService<IStory>>;
  let service: CrudServiceStub;
  let result: any;

  beforeEach(() => {
    service = new CrudServiceStub();
    controller = new BaseController(service as any, { singular: 'document', plural: 'documents' });
  });

  describe('when finding all documents', () => {
    describe('when documents are successfully found', () => {
      beforeEach(async () => {
        (service.findMany as jest.Mock).mockResolvedValue(['documents']);
        result = await controller.findAll(reqUserMock);
      });

      it('should call the document service to fetch all documents', () => {
        expect(service.findMany).toHaveBeenCalledWith('userId');
      });

      it('should return the documents', () => {
        expect(result).toEqual({ documents: ['documents'] });
      });
    });

    describe('when something goes wrong', () => {
      beforeEach(async () => {
        (service.findMany as jest.Mock).mockRejectedValue('rejectedFindMany');
        controller.findAll(reqUserMock).catch(e => (result = e));
      });

      it('should return the error', () => {
        expect(result).toBe('rejectedFindMany');
      });
    });
  });

  describe('when finding a document', () => {
    describe('when a document is found', () => {
      beforeEach(async () => {
        (service.findOne as jest.Mock).mockResolvedValue({
          _id: 'documentId'
        });

        result = await controller.findOne('documentId', reqUserMock);
      });

      it('should call the document service to fetch the document', () => {
        expect(service.findOne).toHaveBeenCalledWith({ _id: 'documentId' }, 'userId');
      });

      it('should return the document', () => {
        expect(result).toEqual({ document: { _id: 'documentId' } });
      });
    });

    describe('when something goes wrong', () => {
      beforeEach(async () => {
        (service.findOne as jest.Mock).mockRejectedValue('rejectedFindOne');
        controller.findOne('documentId', reqUserMock).catch(e => (result = e));
      });

      it('should return the error', () => {
        expect(result).toBe('rejectedFindOne');
      });
    });
  });

  describe('when deleting a document', () => {
    describe('when a document is successfully deleted', () => {
      beforeEach(async () => {
        (service.delete as jest.Mock).mockResolvedValue(undefined);
        result = await controller.delete('documentId', reqUserMock);
      });

      it('should call the document service to delete the document', () => {
        expect(service.delete).toHaveBeenCalledWith({ _id: 'documentId' }, 'userId');
      });

      it('should return undefined', () => {
        expect(result).toBe(undefined);
      });
    });

    describe('when something goes wrong', () => {
      beforeEach(async () => {
        (service.delete as jest.Mock).mockRejectedValue('rejectedDelete');
        controller.delete('documentId', reqUserMock).catch(e => (result = e));
      });

      it('should return the error', () => {
        expect(result).toBe('rejectedDelete');
      });
    });
  });
});
