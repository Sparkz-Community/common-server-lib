
const stndMethods = ['find', 'get', 'create', 'update', 'patch', 'remove'];

module.exports = function (context, types = [], methods = [], label = 'anonymous') {
  if (types) {
    types = Array.isArray(types) ? types : [types];
    if (!types.includes(context.type)) {
      throw new Error(`The '${label}' hook can only be used as a '${types.join(', ')}' hook.`);
    }
  }

  if (!methods) { return; }
  if (stndMethods.indexOf(context.method) === -1) { return; } // allow custom methods

  const myMethods = Array.isArray(methods) ? methods : [methods]; // safe enough for allowed values

  if (myMethods.length > 0 && myMethods.indexOf(context.method) === -1) {
    const msg = JSON.stringify(myMethods);
    throw new Error(`The '${label}' hook can only be used on the '${msg}' service method(s).`);
  }
};
