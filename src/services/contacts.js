import { Contact } from '../models/contact.js';
import { calculatePaginationData  } from '../utils/calculatePaginationData.js';
import SORT_ORDER from '../constants/index.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = 'name',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = Contact.find();

  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }

  if (filter.isFavourite === true) {
    contactsQuery.where('isFavourite').equals(true);
  } else if (filter.isFavourite === false) {
    contactsQuery.where('isFavourite').equals(false);
  }

  const [contactsCount, contacts] = await Promise.all([
    Contact.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .limit(limit)
      .skip(skip)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);
  const paginationData = calculatePaginationData (contactsCount, page, perPage);
  return {
    data: contacts,
    ...paginationData,
  };
};



export const getContactById = async (id) => {
  return await Contact.findById(id);
};

export const createContact = async (contactData) => {
  return await Contact.create(contactData);
};

export const updateContact = async (id, contactData) => {
  return await Contact.findByIdAndUpdate(id, contactData, { new: true });
};

export const deleteContact = async (id) => {
  return await Contact.findByIdAndDelete(id);
};
