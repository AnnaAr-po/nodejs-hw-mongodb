import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from '../services/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from '../validation/validatecontacts.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = express.Router();

router.get('/', ctrlWrapper(getAllContacts));
router.get('/:contactId', isValidId, ctrlWrapper(getContactById));
router.post('/', validateBody(createContactSchema), ctrlWrapper(createContact));
router.patch('/:contactId', isValidId, validateBody(updateContactSchema), ctrlWrapper(updateContact));
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContact));

export default router;