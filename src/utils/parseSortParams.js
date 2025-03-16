import SORT_ORDER from '../constants/index.js';

const parseSort = (sortOrder) => {
  const isKnowOrder = [SORT_ORDER.ASC, SORT_ORDER.DESC].includes(sortOrder);
  if (isKnowOrder) {
    return sortOrder;
  }
  return SORT_ORDER.ASC;
};

const parseSortBy = (sortBy) => {
  const keys = ['name', 'email', 'isFavorite', 'contactType'];
  if (keys.includes(sortBy)) {
    return sortBy;
  }
  return 'name';
};

export const parseSortParams = (query) => {
  const { sortOrder, sortBy } = query;

  const parsedSortOrder = parseSort(sortOrder);
  const parsedSortBy = parseSortBy(sortBy);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};