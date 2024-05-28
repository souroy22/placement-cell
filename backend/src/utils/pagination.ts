import { Request, Response, NextFunction } from "express";
import { Document, Query } from "mongoose";

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: string;
}

interface PaginationResult<T> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: T[];
}

export const paginate = async <T extends Document>(
  query: Query<T[], T>,
  options: PaginationOptions
): Promise<PaginationResult<T>> => {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const sort = options.sort || "";

  const skip = (page - 1) * limit;

  const [total, data] = await Promise.all([
    query.model.countDocuments(query.getQuery()).exec(),
    query.skip(skip).limit(limit).sort(sort).exec(),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    total,
    page,
    limit,
    totalPages,
    data,
  };
};

export const paginateMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { page, limit, sort } = req.query;

  req.pagination = {
    page: parseInt(page as string) || 1,
    limit: parseInt(limit as string) || 10,
    sort: (sort as string) || "",
  };

  next();
};
