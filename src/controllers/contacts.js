import createError from 'http-errors';
import mongoose from 'mongoose';
import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
} from '../services/contacts.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';



export const createContactController = async (req, res, next) => {
  try {

    const userId = req.user._id;
    const photo = req.file;

    const { error } = createContactSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: 400,
        message: 'Validation Error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    if (!photo) {
      return res.status(400).json({
        status: 400,
        message: 'Photo is required',
      });
    }

    let photoUrl;
    const useCloudinary = getEnvVar('ENABLE_CLOUDINARY') === 'true';

    if (photo) {
      photoUrl = useCloudinary
        ? await saveFileToCloudinary(photo)
        : await saveFileToUploadDir(photo);
    }

    const contactPayload = {
      ...req.body,
      photo: photoUrl,
    };

    const newContact = await createContact(contactPayload, userId);

    res.status(201).json({
      status: 201,
      message: 'Successfully created new contact',
      data: newContact,
    });
  } catch (error) {
    console.error("💥 Error in createContactController:", error.stack);
    next(error);
  }
};


export const updateContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    console.log('req.user:', req.user);
    const userId = req.user._id;
    const photo = req.file;

    if (!mongoose.isValidObjectId(contactId)) {
      return next(createError(400, 'Invalid ID format'));
    }

    const { error } = createContactSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: 400,
        message: 'Validation Error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    let photoUrl;
    if (photo) {
      photoUrl = getEnvVar('ENABLE_CLOUDINARY') === 'true'
        ? await saveFileToCloudinary(photo)
        : await saveFileToUploadDir(photo);
    }

    const updatedContact = await updateContact(contactId, { 
      ...req.body, 
      ...(photoUrl && { photo: photoUrl }),
      userId
    });

    if (!updatedContact) {
      return next(createError(404, 'Contact not found'));
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully updated contact',
      data: updatedContact
    });
  } catch (error) {
    console.error("Error in updateContactController:", error.stack);
    next(error);
  }
};

export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    console.log('req.user:', req.user);
    const userId = req.user._id;
    const photo = req.file;

    if (!mongoose.isValidObjectId(contactId)) {
      return next(createError(400, 'Invalid ID format'));
    }

    const { error } = updateContactSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: 400,
        message: 'Validation Error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    let updateData = { ...req.body };
    
    if (photo) {
      const photoUrl = getEnvVar('ENABLE_CLOUDINARY') === 'true'
        ? await saveFileToCloudinary(photo)
        : await saveFileToUploadDir(photo);
      
      updateData.photo = photoUrl;
    }

    const updatedContact = await updateContact(contactId, { 
      ...updateData,
      userId
    });

    if (!updatedContact) {
      return next(createError(404, 'Contact not found'));
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully updated contact',
      data: updatedContact
    });
  } catch (error) {
    console.error("Error in patchContactController:", error.stack);
    next(error);
  }
};


export const getContactsController = async (req, res, next) => {
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortOrder, sortBy } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);
    const userId = req.user._id;

    const contacts = await getAllContacts({
      page,
      perPage,
      sortOrder,
      sortBy,
      filter,
      userId, 
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    console.error("Error in getContactsController:", error.stack);
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    
    if (!mongoose.isValidObjectId(contactId)) {
      return next(createError(400, 'Invalid ID format'));
    }

  
    const contact = await getContactById(contactId, userId);

    if (!contact) {
      return next(createError(404, 'Contact not found'));
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    console.error("Error in getContactByIdController:", error.stack);
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    
    if (!mongoose.isValidObjectId(contactId)) {
      return next(createError(400, 'Invalid ID format'));
    }

   
    const contact = await deleteContact(contactId, userId);

    if (!contact) {
      return next(createError(404, 'Contact not found'));
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error in deleteContactController:", error.stack);
    next(error);
  }
};