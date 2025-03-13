import { Contact } from '../models/contact.js';
import createError from 'http-errors';

export const getAllContacts = async (req, res, next) => {
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
};

export const getContactById = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await Contact.findById(contactId);
    if (!contact) throw createError(404, 'Contact not found');

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const newContact = await Contact.create(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
    if (!updatedContact) throw createError(404, 'Contact not found');

    res.status(200).json({
      status: 200,
      message: 'Successfully updated contact!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const deletedContact = await Contact.findByIdAndDelete(contactId);
    if (!deletedContact) throw createError(404, 'Contact not found');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
