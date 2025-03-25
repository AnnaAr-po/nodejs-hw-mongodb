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
import { createContactSchema, updateContactSchema } from '../validation/validatecontacts.js';


const formatValidationErrors = (error) => {
  return error.details.map(detail => ({
    field: detail.path.join('.'),
    type: detail.type,            
    message: detail.message       
  }));
};

export const createContactController = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        status: 400,
        message: 'Validation Error',
        errors: formatValidationErrors(error)
      });
    }

    const contact = await createContact(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully created contact!',
      data: contact,
    });
  } catch (error) {
    console.error("Error in createContactController:", error.stack);
    next(error);
  }
};

export const updateContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    
    if (!mongoose.isValidObjectId(contactId)) {
      return next(createError(400, 'Invalid ID format'));
    }

    const { error } = createContactSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
      return res.status(400).json({
        status: 400,
        message: 'Validation Error',
        errors: formatValidationErrors(error)
      });
    }

    const updatedContact = await updateContact(contactId, req.body);

    if (!updatedContact) {
      return next(createError(404, 'Contact not found'));
    }
    
    res.status(200).json({
      status: 200,
      message: 'Successfully updated contact',
      data: updatedContact,
    });
  } catch (error) {
    console.error("Error in updateContactController:", error.stack);
    next(error);
  }
};

export const patchContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    
    if (!mongoose.isValidObjectId(contactId)) {
      return next(createError(400, 'Invalid ID format'));
    }

    const { error } = updateContactSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
      return res.status(400).json({
        status: 400,
        message: 'Validation Error',
        errors: formatValidationErrors(error)
      });
    }

    const updatedContact = await updateContact(contactId, req.body);

    if (!updatedContact) {
      return next(createError(404, 'Contact not found'));
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully updated contact',
      data: updatedContact,
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

    const contacts = await getAllContacts({
      page,
      perPage,
      sortOrder,
      sortBy,
      filter,
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
    if (!mongoose.isValidObjectId(contactId)) {
      return next(createError(400, 'Invalid ID format'));
    }

    const contact = await getContactById(contactId);

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
    if (!mongoose.isValidObjectId(contactId)) {
      return next(createError(400, 'Invalid ID format'));
    }

    const contact = await deleteContact(contactId);

    if (!contact) {
      return next(createError(404, 'Contact not found'));
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error in deleteContactController:", error.stack);
    next(error);
  }
};