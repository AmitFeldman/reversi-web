import mongoose from 'mongoose';

const isIdValid = (id: any) => id && mongoose.Types.ObjectId.isValid(id);

export {isIdValid};
