import { CrudServiceStub } from '../../shared/abstracts/crud-service/crud-service.stub';

export class BoardServiceStub extends CrudServiceStub {
  public findOne = jest.fn();
  public addStory = jest.fn();
}
