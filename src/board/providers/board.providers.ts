import { Connection } from 'mongoose';
import { MongooseModel } from 'src/shared/database/mongoose/constants';
import { Database } from 'src/shared/database/constants';
import { boardSchema } from '../model/board';

export const boardProviders = [
  {
    provide: MongooseModel.BOARD,
    useFactory: (connection: Connection) => connection.model('Board', boardSchema),
    inject: [Database.CONNECTION]
  }
];
