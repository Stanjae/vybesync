/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AdapterFactory,
  AdapterFactoryOptions,
  createAdapterFactory,
} from "better-auth/adapters";
import { client } from "@/sanity/client";

export function sanityAdapter(): AdapterFactory {
  return createAdapterFactory({
    // Configuration
    config: {
      supportsBooleans: true,
      adapterId: "dfbnlmrf",
      adapterName: "Sanity Adapter",
      usePlural: false,
      debugLogs: false,
      transaction: false,
      disableIdGeneration: false,
      supportsDates: true,
      supportsNumericIds: true,
    },

    adapter: () => {
      return {
        create: async ({ model, data }) => {
          const doc = {
            _type: model,
            ...data,
            _id: data.id,
          };
          const result = await client.create(doc);
          return {
            ...result,
            id: result._id,
          };
        },
        update: async ({ model, where, update }) => {
          console.log("update", update, "where", where, "model", model);
          const conditions = [`_type == "${model}"`];

          if (where && where.length > 0) {
            where.forEach((item) => {
              conditions.push(`${item.field} == "${item.value}"`);
            });
          }

          const query = `*[${conditions.join(" && ")}][0]`;
          const existing = await client.fetch(query);

          if (!existing) {
            throw new Error(`Record not found in ${model}`);
          }

          const docId = existing._id;

          const result = await client
            .patch(docId)
            .set({ ...(update as any) })
            .commit();

          return {
            ...result,
            id: result._id,
          };
        },
        /* ------------------------------------FIND MANY-------------------------------------------------------- */
        findMany: async ({ model, where, limit, offset, sortBy }) => {
          const conditions = [`_type == "${model}"`];

          if (where && where.length > 0) {
            where.forEach((item) => {
              conditions.push(`${item.field} == "${item.value}"`);
            });
          }

          let query = `*[${conditions.join(" && ")}]`;

          // Add sorting
          if (sortBy) {
            query += ` | order(${sortBy.field} ${sortBy.direction})`;
          }

          // Add pagination
          if (offset !== undefined && limit !== undefined) {
            query += `[${offset}...${offset + limit}]`;
          } else if (limit !== undefined) {
            query += `[0...${limit}]`;
          }

          const results = await client.fetch(query);

          return results.map((result: any) => ({
            ...result,
            id: result._id,
          }));
        },
        /* ----------------------------------------------DELETE MANY-------------------------------------------------------- */
        deleteMany: async ({ model, where }) => {
          const conditions = [`_type == "${model}"`];

          if (where && where.length > 0) {
            where.forEach((item) => {
              conditions.push(`${item.field} match "${item.value}*"`);
            });
          }

          const query = `*[${conditions.join(" && ")}]`;
          const records = await client.fetch(query);

          if (records.length === 0) {
            return 0;
          }

          // Delete each record individually
          await client.delete({ query });
          return records.length;
        },
        /* ----------------------------------------------DELETE-------------------------------------------------------- */
        delete: async ({ model, where }) => {
          const conditions = [`_type == "${model}"`];

          if (where && where.length > 0) {
            where.forEach((item) => {
              conditions.push(`${item.field} match "${item.value}*"`);
            });
          }
          const query = `*[${conditions.join(" && ")}]`;

          await client.delete({ query });
        },
        /* ----------------------------------------------FIND ONE-------------------------------------------------------- */
        findOne: async ({ model, where }) => {
          const conditions = [`_type == "${model}"`];

          if (where && where.length > 0) {
            where.forEach((item) => {
              conditions.push(`${item.field} match "${item.value}"`);
            });
          }
          const query = `*[${conditions.join(" && ")}][0]`;

          const result = await client.fetch(query);

          if (!result) return null;

          return {
            ...result,
            id: result._id,
          };
        },
        /* ----------------------------------------------UPDATE MANY-------------------------------------------------------- */
        updateMany: async ({ model, where, update }) => {
          console.log("updateMany", update, "where", where, "model", model);
          const conditions = [`_type == "${model}"`];

          if (where && where.length > 0) {
            where.forEach((item) => {
              conditions.push(`${item.field} match "${item.value}"`);
            });
          }
          const query = `*[${conditions.join(" && ")}]`;

          const records = await client.fetch(query);

          // Update each record individually (Sanity doesn't have bulk updates)
          await Promise.all(
            records.map((record: any) =>
              client.patch(record._id).set(update).commit()
            )
          );

          return records.length;
        },

        /* -------------------------------------------------------------------------COUNT-------------------------------------------------------------- */
        count: async ({ model, where }) => {
          console.log("count where", where, "model", model);
          const conditions = [`_type == "${model}"`];

          if (where && where.length > 0) {
            where.forEach((item) => {
              conditions.push(`${item.field} == "${item.value}"`);
            });
          }
          const query = `count(*[${conditions.join(" && ")}])`;
          const result = await client.fetch(query);

          return result;
        },
      };
    },
  } as AdapterFactoryOptions);
}
