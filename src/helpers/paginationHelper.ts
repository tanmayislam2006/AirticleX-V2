export type IOption = {
  page?: number | string;
  limit?: number | string;
  sortOrder?: string;
  sortBy?: string;
};
type IOptionResults = {
  page: number;
  limit: number;
  skip: number;
  sortOrder: string;
  sortBy: string;
};
const paginationHelper = (options: IOption): IOptionResults => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 10;
  const skip = (page - 1) * limit;

  const sortBy: string = options.sortBy || 'createdAt';
  const sortOrder: string = options.sortOrder || 'desc';
  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};
export default paginationHelper;
