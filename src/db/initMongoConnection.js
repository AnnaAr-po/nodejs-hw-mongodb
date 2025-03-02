// mongodb+srv://annartyuh90:wEv3PKwK1OLfuJTU@cluster0.9y3qj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0


import mongoose from 'mongoose';

const MongoDB_URL = `mongodb+srv://annartyuh90:wEv3PKwK1OLfuJTU@cluster0.9y3qj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

export const initMongoConnection = async () => {
  return mongoose.connect(MongoDB_URL);
};
console.log('Mongo connection successfully established!');