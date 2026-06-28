import { IOperatorHandler } from '../types/filter.types.js';

export const EqualsHandler: IOperatorHandler = {
  build: (field, value) => ({ [field]: { equals: value } })
};

export const NotEqualsHandler: IOperatorHandler = {
  build: (field, value) => ({ [field]: { not: value } })
};

export const ContainsHandler: IOperatorHandler = {
  build: (field, value) => ({ [field]: { contains: value, mode: 'insensitive' } })
};

export const NotContainsHandler: IOperatorHandler = {
  build: (field, value) => ({ [field]: { not: { contains: value, mode: 'insensitive' } } })
};

export const StartsWithHandler: IOperatorHandler = {
  build: (field, value) => ({ [field]: { startsWith: value, mode: 'insensitive' } })
};

export const EndsWithHandler: IOperatorHandler = {
  build: (field, value) => ({ [field]: { endsWith: value, mode: 'insensitive' } })
};

export const GreaterThanHandler: IOperatorHandler = {
  build: (field, value) => ({ [field]: { gt: value } })
};

export const LessThanHandler: IOperatorHandler = {
  build: (field, value) => ({ [field]: { lt: value } })
};

export const GreaterThanOrEqualsHandler: IOperatorHandler = {
  build: (field, value) => ({ [field]: { gte: value } })
};

export const LessThanOrEqualsHandler: IOperatorHandler = {
  build: (field, value) => ({ [field]: { lte: value } })
};

export const InHandler: IOperatorHandler = {
  build: (field, value) => ({ [field]: { in: Array.isArray(value) ? value : [value] } })
};

export const NotInHandler: IOperatorHandler = {
  build: (field, value) => ({ [field]: { notIn: Array.isArray(value) ? value : [value] } })
};

export const IsNullHandler: IOperatorHandler = {
  build: (field) => ({ [field]: null })
};

export const IsNotNullHandler: IOperatorHandler = {
  build: (field) => ({ [field]: { not: null } })
};

export const BetweenHandler: IOperatorHandler = {
  build: (field, value) => {
    if (!Array.isArray(value) || value.length !== 2) {
      throw new Error(`'between' operator requires an array of 2 values`);
    }
    return { [field]: { gte: value[0], lte: value[1] } };
  }
};

export const NotBetweenHandler: IOperatorHandler = {
  build: (field, value) => {
    if (!Array.isArray(value) || value.length !== 2) {
      throw new Error(`'not_between' operator requires an array of 2 values`);
    }
    return {
      OR: [
        { [field]: { lt: value[0] } },
        { [field]: { gt: value[1] } }
      ]
    };
  }
};
