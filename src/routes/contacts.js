import { Router } from 'express';
import {
  getContactByIdController,
  getContactsController,
  createContactController,
  patchContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';

const contactRouter  = Router();

contactRouter .use(authenticate);
contactRouter .get('/', ctrlWrapper(getContactsController));

contactRouter .get('/', ctrlWrapper(getContactsController));

contactRouter .get(
  '/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
);

contactRouter .post(
  '/',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);
contactRouter .patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

contactRouter .put(
  '/:contactId',
  isValidId,
  validateBody(createContactSchema),
  ctrlWrapper(updateContactController),
);

contactRouter .delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
);

export default contactRouter ;