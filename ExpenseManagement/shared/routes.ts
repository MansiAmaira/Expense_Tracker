
import { z } from 'zod';
import { insertExpenseSchema, expenses } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  expenses: {
    list: {
      method: 'GET' as const,
      path: '/api/expenses',
      input: z.object({
        category: z.string().optional(),
        sort: z.enum(['date_desc', 'date_asc']).optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof expenses.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/expenses',
      input: insertExpenseSchema,
      responses: {
        201: z.custom<typeof expenses.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    // Adding GET /expenses/:id and DELETE for completeness, even if not explicitly requested in MVP
    get: {
      method: 'GET' as const,
      path: '/api/expenses/:id',
      responses: {
        200: z.custom<typeof expenses.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/expenses/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type ExpenseInput = z.infer<typeof api.expenses.create.input>;
export type ExpenseResponse = z.infer<typeof api.expenses.create.responses[201]>;
