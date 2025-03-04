import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import contactsRouter from './routes/contacts.js';

export function setupServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(pino());
  app.use(express.json());

  app.use('/contacts', contactsRouter);

  app.use('*', (req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}










// import { Contact } from './models/contacts.js';
// import dotenv from 'dotenv';


// dotenv.config();

// export function setupServer() {
//   const app = express();
//   const PORT = process.env.PORT || 3000;

//   app.use(cors());
//   app.use(pino());

 
// app.get('/contacts', async (req, res, next) => {
//     try {
//       const contacts = await Contact.find();

//       res.status(200).json({
//         status: 200,
//         message: 'Successfully found contacts!',
//         data: contacts,
//       });
//     } catch (error) {
//       next(error);
//     }
//   });

//   app.get('/contacts/:contactid', async (req, res) => {
//     const { contactid } = req.params;

//     try {
//       const contact = await Contact.findById(contactid);

//       if (!contact) {
//         return res.status(404).json({
//           status: 404,
//           message: `Contact with id ${contactid} not found!`,
//         });
//       }

//       res.status(200).json({
//         status: 200,
//         message: `Successfully found contact with id ${contactid}!`,
//         data: contact,
//       });
//     } catch (error) {
//       res.status(500).json({
//         status: 500,
//         message: 'Server error',
//         error: error.message,
//       });
//     }
//   });

//   app.use('*', (req, res, next) => {
//     res.status(404).json({
//       message: 'Not found',
//     });
//   });

//   app.use((err, req, res, next) => {
//     res.status(500).json({
//       message: 'Something went wrong',
//       error: err.message,
//     });
//   });

//   app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });
// }