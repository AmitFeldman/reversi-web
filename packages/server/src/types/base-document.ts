import {Document} from 'mongoose';

interface BaseDocument extends Document {
  date: Date;
}

export type {BaseDocument};
