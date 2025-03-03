import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


// const MongoDB_URL = `mongodb+srv://annartyuh90:wEv3PKwK1OLfuJTU@cluster0.9y3qj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// export const initMongoConnection = async () => {
//   return mongoose.connect(MongoDB_URL);
// };
// console.log('Mongo connection successfully established!');

import { getEnvVar } from '../utils/getEnvVar.js';

export const initMongoConnection = async () => {
  try {
    const user = getEnvVar('MONGODB_USER');
    const pwd = getEnvVar('MONGODB_PASSWORD');
    const url = getEnvVar('MONGODB_URL');
    const db = getEnvVar('MONGODB_DB');

    await mongoose.connect(
      `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`,
    );
    console.log('Mongo connection successfully established!');
  } catch (e) {
    console.log('Error while setting up mongo connection', e);
    throw e;
  }
};