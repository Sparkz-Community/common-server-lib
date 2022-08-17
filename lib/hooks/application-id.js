// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const appauthEntity =  context.app.get('appauth').entity || 'application';

    // Get authenticated application
    const  application = context.params[appauthEntity];

    // Extract Submitted Data
    const { data } = context;
    if (application) {
      // Add new Fields
      context.data = {
        ...data, // Preserve submitted data
        applicationID: application._id
      };
    }
    return context;
  };
};
