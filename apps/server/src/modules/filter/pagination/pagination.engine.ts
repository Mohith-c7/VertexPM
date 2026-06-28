export class PaginationEngine {
  static buildPagination(page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    
    return {
      skip,
      take
    };
  }
}
