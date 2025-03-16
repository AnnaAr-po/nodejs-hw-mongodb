export const calculatePaginationData = (count, page, perPage) => {
  const totalPages = Math.ceil(count / perPage);
  const totalItems = count;
  const nextPage = Boolean(totalPages - page);
  const previosPage = page !== 1;

  return {
    page,
    perPage,
    totalItems,
    totalPages,
    nextPage,
    previosPage,
  };
};