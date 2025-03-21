import { SORT_ORDER } from '../constants/index.js';
import createError from 'http-errors';
import { Contacts } from '../models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';


export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = Contacts.find();

  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  const contactsCount = await Contacts.find()
    .merge(contactsQuery)
    .countDocuments();

  const totalPages = Math.ceil(contactsCount / perPage);
  if (page > totalPages) {
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

export const getContactById = async (contactId) => {
  const contact = await Contacts.findById(contactId);
  return contact;
};
export const createContact = async (payload) => {
    try {
        console.log("Received payload:", payload);
        const contact = await Contacts.create(payload);
        return contact;
    } catch (error) {
        console.error("Error creating contact:", error);
        throw error;
    }
};

export const updateContact = async (contactId, payload, options = {}) => {
  const result = await Contacts.findOneAndUpdate(
    { _id: contactId },
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

export const deleteContact = async (contactId) => {
  const contact = await Contacts.findOneAndDelete({
    _id: contactId,
  });
  return contact;
};


















// import { Contact } from '../models/contact.js';
// import { calculatePaginationData } from '../utils/calculatePaginationData.js';
// import SORT_ORDER from '../constants/index.js';
// import createError from 'http-errors';

// export const getAllContacts = async ({
//   page = 1,
//   perPage = 10,
//   sortOrder = SORT_ORDER.ASC,
//   sortBy = 'name',
//   filter = {},
// }) => {
//   const limit = perPage;
//   const skip = (page - 1) * perPage;

//   const contactsQuery = Contact.find();

//   if (filter.type) {
//     contactsQuery.where('contactType').equals(filter.type);
//   }

//   if (filter.isFavourite) {
//     contactsQuery.where('isFavourite').equals(filter.isFavourite);
//   }

//     const contactsCount = await Contact.find()
//     .merge(contactsQuery)
//     .countDocuments();

//   const totalPages = Math.ceil(contactsCount / perPage);
//   if (page > totalPages) {
//     throw createError(400, 'Invalid page number');
//   }

//   const contacts = await contactsQuery
//     .skip(skip)
//     .limit(limit)
//     .sort({ [sortBy]: sortOrder })
//     .exec();

//   const paginationData = calculatePaginationData(contactsCount, perPage, page);

//   return {
//     data: contacts,
//     ...paginationData,
//   };
//   };


// export const getContactById = async (contactId) => {
//   return await Contact.findById(contactId);
// };

// export const createContact = async (req, res, next) => {
//     console.log("Received body:", req.body); // Додали логування

//     const newContact = await Contact.create(req.body);
//     res.status(201).json(newContact);
// };
// export const deleteContact = async (contactId) => {
//   const contact = await Contact.findByIdAndDelete({
//     _id: contactId,
//   });
//   return contact;
// };

// export const updateContact = async (contactId, payload) => {
//   const rawResult = await Contact.findByIdAndUpdate(
//     contactId,
//     payload,
//     { new: true },
//   );
//   if (!rawResult) return null;

//   return rawResult;
// };













// export const getAllContacts = async ({
//   page = 1,
//   perPage = 10,
//   sortOrder = SORT_ORDER.ASC,
//   sortBy = 'name',
//   filter = {},
// }) => {
//   const limit = perPage;
//   const skip = (page - 1) * perPage;

//   const contactsQuery = Contact.find();

//   if (filter.type) {
//     contactsQuery.where('contactType').equals(filter.type);
//   }

//   if (filter.isFavourite === true) {
//     contactsQuery.where('isFavourite').equals(true);
//   } else if (filter.isFavourite === false) {
//     contactsQuery.where('isFavourite').equals(false);
//   }

//   const [contactsCount, contacts] = await Promise.all([
//     Contact.find().merge(contactsQuery).countDocuments(),
//     contactsQuery
//       .limit(limit)
//       .skip(skip)
//       .sort({ [sortBy]: sortOrder })
//       .exec(),
//   ]);
//   const paginationData = calculatePaginationData(contactsCount, page, perPage);
//   return {
//     data: contacts,
//     ...paginationData,
//   };
// };

// export const getContactById = async (id) => {
//   return await Contact.findById(id);
// };

// export const createContact = async (contactData) => {
//   return await Contact.create(contactData);
// };

// export const updateContact = async (id, contactData) => {
//   return await Contact.findByIdAndUpdate(id, contactData, { new: true });
// };

// export const deleteContact = async (id) => {
//   return await Contact.findByIdAndDelete(id);
// };
