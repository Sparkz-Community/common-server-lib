const lget = require('lodash/get');
// const {date} = require('quasar');
// const {formatDate} = date;


module.exports = {
  // eslint-disable-next-line no-unused-vars
  install(Vue) {
    Vue.mixin({
      data() {
        return {
          defaultImage: 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/defaultImage.svg'
        };
      },
      methods: {
        getAvatar(obj, path, size, idx, defaultImg) {
          // let sz = size ? size : 'small';
          let def = defaultImg ? defaultImg : null;
          let sz = 'large';
          // console.log('getting avatar', obj, path, size)
          if (lget(obj, [path]) && !idx && idx !== 0) {
            if (lget(obj, [path, sz, 'file'], '').length) {
              return lget(obj, [path, sz, 'file']);
            } else return null;
          } else if(obj && !path){
            if(idx || idx === 0){
              return lget(obj, [idx, sz, 'file']);
            } else return lget(obj, [sz, 'file']);
          } else if(obj && (idx || idx === 0)){
            if(lget(obj, [path, idx, sz, 'file'], '').length) {
              return lget(obj, [path, idx, sz, 'file']);
            }   else return def;
            // else if(obj && !path) {
            //   console.log('obj no path');
            //   if(idx || idx === 0){
            //     console.log('obj no path and idx');
            //     return lget(obj, [idx, sz, 'file']);
            //   } else return lget(obj, [sz, 'file']);
            // }
          } else return def;
        }
      }
    });
  }
};

