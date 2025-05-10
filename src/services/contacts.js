import { SORT_ORDER } from '../constants/index.js';
import createError from 'http-errors';
import { Contacts } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';


export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId, 
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = Contacts.find({ userId });

  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  const contactsCount = await Contacts.find({ userId })
    .merge(contactsQuery)
    .countDocuments();

  const totalPages = Math.ceil(contactsCount / perPage);
  if (page > totalPages && contactsCount > 0) {
    throw createError(400, 'Invalid page number');
  }

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, userId) => {
  const contact = await Contacts.findOne({ _id: contactId, userId });
  return contact;
};

export const createContact = async (payload, userId) => {
  try {
    console.log("Received payload:", payload);
    const contact = await Contacts.create({ ...payload, userId });
    return contact;
  } catch (error) {
    console.error("Error creating contact:", error);
    throw error;
  }
};

export const updateContact = async (contactId, payload, userId, options = {}) => {
  const result = await Contacts.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );
  if (!result || !result.value) return null;

  return {
    contact: result.value,
    isNew: Boolean(result?.lastErrorObject?.upserted),
  };
};

export const deleteContact = async (contactId, userId) => {
  const contact = await Contacts.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return contact;
};