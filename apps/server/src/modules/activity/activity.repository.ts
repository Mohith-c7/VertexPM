import { db } from "../../db";

export class ActivityRepository {
  async createLog(data: any) {
    return db.activityLog.create({
      data,
    });
  }

  async findLogs(filters: any, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    
    return db.$transaction([
      db.activityLog.count({ where: filters }),
      db.activityLog.findMany({
        where: filters,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          actor: {
            select: { id: true, firstName: true, lastName: true, avatarUrl: true }
          }
        }
      })
    ]);
  }
}
