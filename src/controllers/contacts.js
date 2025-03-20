import createError  from 'http-errors';
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

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
});
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (contact) {
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } else {
    throw createError (404, 'Contact not found');
  }
};

export const createContactController = async (req, res) => {
    const contact = await createContact(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully created contact!',
      data: contact,
    });
  };
  
  export const patchContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await updateContact(contactId, req.body);
    if (!result) {
      throw createError (404, `Contact not found`);
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully patch a contact!',
      data: result.contact,
    });
  };
  
  export const updateContactController = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await updateContact(contactId, req.body, { upsert: true });
    if (!result) {
      throw createError (404, `Contact not found`);
    }
    const status = result.isNew ? 201 : 200;
    res.status(status).json({
      status,
      message: `Successfully update a contact!`,
      data: result.contact,
    });
  };
  
  export const deleteContactController = async (req, res) => {
    const { contactId } = req.params;
    const contact = await deleteContact(contactId);
    if (!contact) {
      throw createError (404, `Contact not found`);
    }
    res.status(204).send();
  };