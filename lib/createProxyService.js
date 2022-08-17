module.exports = function (app, name) {
  app.use(`/${name}`, {
    find (params) {
      let instance = params.instance;
      return app.service(`${instance._id}/${name}`).find(params);
    },
    get (id, params) {
      let instance = params.instance;
      return app.service(`${instance._id}/${name}`).get(id, params);
    },
    create (data, params) {
      let instance = params.instance;
      return app.service(`${instance._id}/${name}`).create(data, params);
    },
    update (id, data, params) {
      let instance = params.instance;
      return app.service(`${instance._id}/${name}`).update(id, data, params);
    },
    patch (id, data, params) {
      let instance = params.instance;
      return app.service(`${instance._id}/${name}`).patch(id, data, params);
    },
    remove (id, params) {
      let instance = params.instance;
      return app.service(`${instance._id}/${name}`).remove(id, params);
    }
  });
};
