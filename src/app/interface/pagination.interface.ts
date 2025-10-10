export interface Pagination<T> {
  totalElements:                number;
  totalPages:                   number;
  content:                      T;
  size:                         number;
  page:                         string;
}
