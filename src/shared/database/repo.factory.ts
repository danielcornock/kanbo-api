import { IParams } from '../../config/interfaces/params.interface';

export class RepoService<M> {
  private readonly _model;

  constructor(model: any) {
    this._model = model;
  }

  public static create<M>(model: any) {
    return new RepoService<M>(model);
  }

  public findOne(query: IParams) {
    return this._model.findOne(query);
  }

  public save(data: any) {
    return data.save();
  }
}
