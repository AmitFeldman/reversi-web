import {Document} from 'mongoose';

export interface BaseDocument extends Document {
  date: Date;
}
