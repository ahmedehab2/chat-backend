import mongoose, {
  FilterQuery,
  Model,
  PopulateOptions,
  QueryOptions,
  UpdateQuery,
  ProjectionType,
} from 'mongoose';
import { AbstractEntity } from './abstract.entity';

export interface PaginationOptions<T> {
  page?: number;
  limit?: number;
  projection?: ProjectionType<T>;
  populate?: PopulateOptions | PopulateOptions[];
  sort?: string | { [key: string]: mongoose.SortOrder };
  queryOptions?: QueryOptions<T>;
}

export abstract class AbstractRepository<T extends AbstractEntity> {
  constructor(protected readonly model: Model<T>) {}

  async create(document: Partial<T>): Promise<T> {
    return this.model.create(document);
  }

  async findOne(
    filterQuery: FilterQuery<T>,
    projection?: ProjectionType<T>,
    populate?: PopulateOptions | PopulateOptions[],
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.model
      .findOne(filterQuery, projection, options)
      .populate(populate)
      .lean<T>()
      .exec();
  }

  async findById(
    id: string,
    projection?: ProjectionType<T>,
    populate?: PopulateOptions | PopulateOptions[],
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.model
      .findById(id, projection, options)
      .populate(populate)
      .lean<T>()
      .exec();
  }

  async findAll(
    filterQuery: FilterQuery<T> = {},
    projection?: ProjectionType<T>,
    populate?: PopulateOptions | PopulateOptions[],
    queryOptions?: QueryOptions<T>,
  ): Promise<T[]> {
    return this.model
      .find(filterQuery, projection, queryOptions)
      .populate(populate)
      .lean<T[]>()
      .exec();
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    updateQuery: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.model
      .findOneAndUpdate(filterQuery, updateQuery, { ...options })
      .lean<T>()
      .exec();
  }

  async findByIdAndUpdate(
    id: string,
    updateQuery: UpdateQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.model
      .findByIdAndUpdate(id, updateQuery, { ...options })
      .lean<T>()
      .exec();
  }

  async findOneAndDelete(
    filterQuery: FilterQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.model.findOneAndDelete(filterQuery, options).lean<T>().exec();
  }

  async findByIdAndDelete(
    id: string,
    options?: QueryOptions<T>,
  ): Promise<T | null> {
    return this.model.findByIdAndDelete(id, options).lean<T>().exec();
  }

  async count(filterQuery: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filterQuery).exec();
  }

  async deleteMany(filterQuery: FilterQuery<T>) {
    return this.model.deleteMany(filterQuery).exec();
  }

  async findAndPaginate(
    filterQuery: FilterQuery<T> = {},
    options?: PaginationOptions<T>,
  ): Promise<{ items: T[]; total: number; page: number; limit: number }> {
    const page = options?.page ?? 1;
    const limit = options?.limit ?? 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.model
        .find(filterQuery, options?.projection, options?.queryOptions)
        .populate(options?.populate)
        .sort(options?.sort)
        .skip(skip)
        .limit(limit)
        .lean<T[]>()
        .exec(),
      this.model.countDocuments(filterQuery).exec(),
    ]);

    return { items, total, page, limit };
  }
}
