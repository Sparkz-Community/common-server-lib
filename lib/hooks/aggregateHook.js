// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { checkContext } = require('feathers-hooks-common');
const {packages:{lodash: {lget}}} = require('@iy4u/common-utils');

module.exports = ({ useParam = true, paramName = '$globalAggregate' } = {}) => {
  return async context => {
    checkContext(context, 'before', ['find'], 'aggregateHook');

    const runHook = useParam ? lget(context, `params.${paramName}`, false) : true;
    if (runHook) {
      // delete context.params.query.deleted;
      let queries = [];
      const { $limit, $skip, $sort, aggregate, ...query } = context.params.query;
      if (Object.keys(query).length) queries.push({ $match: query });
      if (aggregate) queries = queries.concat(aggregate);

      const dataFacet = [];
      if ($sort !== null && $sort !== undefined) dataFacet.push({ $sort });
      if ($skip !== null && $skip !== undefined) dataFacet.push({ $skip });
      if ($limit !== null && $limit !== undefined) dataFacet.push({ $limit });
      queries = queries.concat([
        {
          $facet: {
            metadata: [{ $count: 'total' }, { $addFields: { skip: $skip, limit: $limit } }],
            data: dataFacet
          }
        },
        {
          $project: {
            data: 1,
            // Get total from the first element of the metadata array
            total: { $arrayElemAt: ['$metadata.total', 0] },
            limit: { $arrayElemAt: ['$metadata.limit', 0] },
            skip: { $arrayElemAt: ['$metadata.skip', 0] }
          }
        }
      ]);
      // console.log(queries);

      const [result] = await context.service.Model.aggregate(queries);

      context.result = {
        total: result.total || 0,
        limit: result.limit || $limit,
        skip: result.skip || $skip,
        data: result.data
      };
    }
    return context;
  };
};
