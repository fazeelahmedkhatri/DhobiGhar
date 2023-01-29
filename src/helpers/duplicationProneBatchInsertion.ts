import { EntityManager, EntityTarget, ObjectLiteral } from 'typeorm';

export default function <T extends object>(
  manager: EntityManager,
  values: T[],
  model: EntityTarget<ObjectLiteral>,
  parameters: (keyof T)[],
) {
  try {
    const entity = manager.getRepository(model);
    const promises = values.map((value) => {
      const where_object: Partial<Record<keyof T, any>> = {};
      for (const param of parameters) {
        if (
          Object.keys(value).includes(param.toString()) &&
          !Object.keys(where_object).includes(param.toString())
        ) {
          where_object[param] = value[param];
        }
      }
      return entity.findOne({ where: where_object }).then(async (item) => {
        if (item !== null) {
          return item;
        }
        const new_item = await entity.save(value);
        return new_item;
      });
    });
    const results = Promise.all(promises);
    return results;
  } catch (error) {
    return error;
  }
}
