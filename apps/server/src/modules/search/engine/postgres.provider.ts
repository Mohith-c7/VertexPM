import { PrismaClient } from "@prisma/client";
import type { GlobalSearchQuery } from "@vertexpm/validation";
import type { SearchProvider } from "./provider.interface";
import type { SearchResponse, GroupedSearchResults, SearchResultItem } from "../types";


function calculateRelevance(title: string, desc: string, query: string): number {
  const q = query.toLowerCase();
  const t = title.toLowerCase();
  const d = (desc || '').toLowerCase();
  let score = 0;
  if (t === q) score += 20;
  else if (t.startsWith(q)) score += 15;
  else if (t.includes(q)) score += 10;
  
  if (d.includes(q)) score += 3;
  
  const terms = q.split(/\s+/);
  for (const term of terms) {
    if (term.length > 1) {
      if (t.includes(term)) score += 2;
      if (d.includes(term)) score += 0.5;
    }
  }
  return score || 1;
}

export class PostgresSearchProvider implements SearchProvider {
  constructor(private prisma: PrismaClient) {}

  async search(query: GlobalSearchQuery): Promise<SearchResponse> {
    const startTime = Date.now();
    const { q, limit = 20, offset = 0, type, workspaceId, projectId, boardId } = query;

    const typesToSearch = type 
      ? (Array.isArray(type) ? type : [type])
      : ["workspace", "project", "board", "column", "workitem", "comment", "user"];

    const searchStr = `%${q}%`;
    const ftsQuery = q.split(' ').map(term => term + ':*').join(' & ');

    const results: GroupedSearchResults[] = [];
    let totalItems = 0;

    for (const t of typesToSearch) {
      let items: SearchResultItem[] = [];
      let groupTotal = 0;

      switch (t) {
        case "workspace": {
          const [data, count] = await Promise.all([
            this.prisma.workspace.findMany({
              where: {
                OR: [
                  { name: { search: ftsQuery } },
                  { description: { search: ftsQuery } },
                  { name: { contains: q, mode: "insensitive" } },
                  { description: { contains: q, mode: "insensitive" } },
                ],
                ...(workspaceId ? { id: workspaceId } : {})
              },
              take: limit,
              skip: offset,
            }),
            this.prisma.workspace.count({
              where: {
                OR: [
                  { name: { search: ftsQuery } },
                  { description: { search: ftsQuery } },
                  { name: { contains: q, mode: "insensitive" } },
                  { description: { contains: q, mode: "insensitive" } },
                ],
                ...(workspaceId ? { id: workspaceId } : {})
              }
            })
          ]);
          items = data.map(d => ({
            id: d.id,
            type: "workspace",
            title: d.name,
            description: d.description || undefined,
            score: 1,
            createdAt: d.createdAt,
            updatedAt: d.updatedAt
          }));
          groupTotal = count;
          break;
        }
        case "project": {
          const [data, count] = await Promise.all([
            this.prisma.project.findMany({
              where: {
                OR: [
                  { name: { search: ftsQuery } },
                  { description: { search: ftsQuery } },
                  { key: { search: ftsQuery } },
                  { name: { contains: q, mode: "insensitive" } },
                  { description: { contains: q, mode: "insensitive" } },
                  { key: { contains: q, mode: "insensitive" } },
                ],
                ...(workspaceId ? { workspaceId } : {}),
                ...(projectId ? { id: projectId } : {})
              },
              take: limit,
              skip: offset,
            }),
            this.prisma.project.count({
              where: {
                OR: [
                  { name: { search: ftsQuery } },
                  { description: { search: ftsQuery } },
                  { key: { search: ftsQuery } },
                  { name: { contains: q, mode: "insensitive" } },
                  { description: { contains: q, mode: "insensitive" } },
                  { key: { contains: q, mode: "insensitive" } },
                ],
                ...(workspaceId ? { workspaceId } : {}),
                ...(projectId ? { id: projectId } : {})
              }
            })
          ]);
          items = data.map(d => ({
            id: d.id,
            type: "project",
            title: d.name,
            description: d.description || undefined,
            score: 1,
            createdAt: d.createdAt,
            updatedAt: d.updatedAt
          }));
          groupTotal = count;
          break;
        }
        case "board": {
          const [data, count] = await Promise.all([
            this.prisma.board.findMany({
              where: {
                OR: [
                  { name: { search: ftsQuery } },
                  { description: { search: ftsQuery } },
                  { name: { contains: q, mode: "insensitive" } },
                  { description: { contains: q, mode: "insensitive" } },
                ],
                ...(projectId ? { projectId } : {}),
                ...(boardId ? { id: boardId } : {})
              },
              take: limit,
              skip: offset,
            }),
            this.prisma.board.count({
              where: {
                OR: [
                  { name: { search: ftsQuery } },
                  { description: { search: ftsQuery } },
                  { name: { contains: q, mode: "insensitive" } },
                  { description: { contains: q, mode: "insensitive" } },
                ],
                ...(projectId ? { projectId } : {}),
                ...(boardId ? { id: boardId } : {})
              }
            })
          ]);
          items = data.map(d => ({
            id: d.id,
            type: "board",
            title: d.name,
            description: d.description || undefined,
            score: 1,
            createdAt: d.createdAt,
            updatedAt: d.updatedAt
          }));
          groupTotal = count;
          break;
        }
        case "workitem": {
          const [data, count] = await Promise.all([
            this.prisma.workItem.findMany({
              where: {
                OR: [
                  { title: { search: ftsQuery } },
                  { description: { search: ftsQuery } },
                  { title: { contains: q, mode: "insensitive" } },
                  { description: { contains: q, mode: "insensitive" } },
                ],
                ...(boardId ? { boardId } : {})
              },
              take: limit,
              skip: offset,
            }),
            this.prisma.workItem.count({
              where: {
                OR: [
                  { title: { search: ftsQuery } },
                  { description: { search: ftsQuery } },
                  { title: { contains: q, mode: "insensitive" } },
                  { description: { contains: q, mode: "insensitive" } },
                ],
                ...(boardId ? { boardId } : {})
              }
            })
          ]);
          items = data.map(d => ({
            id: d.id,
            type: "workitem",
            title: d.title,
            description: d.description || undefined,
            score: 1,
            createdAt: d.createdAt,
            updatedAt: d.updatedAt
          }));
          groupTotal = count;
          break;
        }
        case "comment": {
          const [data, count] = await Promise.all([
            this.prisma.comment.findMany({
              where: {
                OR: [
                  { content: { search: ftsQuery } },
                  { content: { contains: q, mode: "insensitive" } }
                ]
              },
              take: limit,
              skip: offset,
            }),
            this.prisma.comment.count({
              where: {
                OR: [
                  { content: { search: ftsQuery } },
                  { content: { contains: q, mode: "insensitive" } }
                ]
              }
            })
          ]);
          items = data.map(d => ({
            id: d.id,
            type: "comment",
            title: d.content.substring(0, 50),
            description: d.content,
            score: 1,
            createdAt: d.createdAt,
            updatedAt: d.updatedAt
          }));
          groupTotal = count;
          break;
        }
        case "user": {
          const [data, count] = await Promise.all([
            this.prisma.user.findMany({
              where: {
                OR: [
                  { firstName: { search: ftsQuery } },
                  { lastName: { search: ftsQuery } },
                  { email: { search: ftsQuery } },
                  { firstName: { contains: q, mode: "insensitive" } },
                  { lastName: { contains: q, mode: "insensitive" } },
                  { email: { contains: q, mode: "insensitive" } },
                ]
              },
              take: limit,
              skip: offset,
            }),
            this.prisma.user.count({
              where: {
                OR: [
                  { firstName: { search: ftsQuery } },
                  { lastName: { search: ftsQuery } },
                  { email: { search: ftsQuery } },
                  { firstName: { contains: q, mode: "insensitive" } },
                  { lastName: { contains: q, mode: "insensitive" } },
                  { email: { contains: q, mode: "insensitive" } },
                ]
              }
            })
          ]);
          items = data.map(d => ({
            id: d.id,
            type: "user",
            title: `${d.firstName} ${d.lastName}`,
            description: d.email,
            score: 1,
            createdAt: d.createdAt,
            updatedAt: d.updatedAt
          }));
          groupTotal = count;
          break;
        }
      }

      if (items.length > 0) {
        results.push({
          type: t,
          items,
          total: groupTotal
        });
        totalItems += groupTotal;
      }
    }

    const took = Date.now() - startTime;
    return {
      results,
      total: totalItems,
      took
    };
  }

  async suggestions(query: string, workspaceId?: string, limit: number = 5): Promise<string[]> {
    const ftsQuery = query.split(' ').map(term => term + ':*').join(' & ');
    const results = await this.prisma.workItem.findMany({
      where: {
        OR: [
          { title: { search: ftsQuery } },
          { title: { contains: query, mode: "insensitive" } }
        ]
      },
      select: { title: true },
      take: limit
    });
    return results.map(r => r.title);
  }
}
