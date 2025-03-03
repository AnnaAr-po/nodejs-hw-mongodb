import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { Contact } from './models/contacts.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';


dotenv.config();

export function setupServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(pino());

 
app.get('/contacts', async (req, res, next) => {
    try {
      const contacts = await Contact.find();

      res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      next(error);
    }
  });

  app.get('/contacts/:contactid', async (req, res) => {
    const { contactid } = req.params;

    try {
      const contact = await Contact.findById(contactid);

      if (!contact) {
        return res.status(404).json({
          status: 404,
          message: `Contact with id ${contactid} not found!`,
        });
      }

      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactid}!`,
        data: contact,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: 'Server error',
        error: error.message,
      });
    }
  });

  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });


    app.get('/test-db', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.status(200).json({ message: 'MongoDB connection is working!' });
  } catch (error) {
    res.status(500).json({ message: 'MongoDB connection failed!', error: error.message });
  }
});

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}