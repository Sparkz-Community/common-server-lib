// // const { packages: { lodash: { lget, lunset, lmergeWith } } } = require('@iy4u/common-utils');
const {models:{Common}} = require('@iy4u/common-server-lib');

module.exports = {
  ...Common
};


// const {packages: {lodash: {lmergeWith}}} = require('@iy4u/common-utils');
// // const {models: { Common: {
// //   uuid,
// //   Color,
// //   UniquePhone,
// //   Phone,
// //   Images,
// //   Files,
// //   Address,
// //   Theme,
// //   RRULE,
// //   Settings,
// //   commonFieldsFn,
// //   privacyEnum,
// //   currencyEnum,
// //   GeoLocation,
// //   Video,
// //   ownerEnum,
// //   message,
// //   statusEnum,
// //   Identity,
// //   domainNameEnum,
// //   hostsEnum
// // }}} = require('@iy4u/common-server-lib');
// const { schemaCustomizer, arrayUnique, removeListFromArray } = require('../utils/extensionUtils');
// //
// // const mongoose = require('mongoose');
// // const {Schema} = mongoose;
//
// // eslint-disable-next-line no-unused-vars
// const uuid = (app) => {
//
//   let dt = new Date().getTime();
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//     const r = (dt + Math.random() * 16) % 16 | 0;
//     dt = Math.floor(dt / 16);
//     return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
//   });
// };
//
// // const privacyEnum =[
// //   'public',
// //   'permission',
// //   'private'
// // ];
//
// function privacyEnum(app, { extend_list = [], remove_list = [] } = {}) {
//
//   const orig_list = [
//     'public',
//     'permission',
//     'private'
//   ];
//
//   removeListFromArray(orig_list, remove_list);
//
//   return arrayUnique(orig_list.concat(extend_list));
//
// }
//
// // const currencyEnum = [
// //   'usd',
// //   'ngn'
// // ];
//
// function currencyEnum(app, { extend_list = [], remove_list = [] } = {}) {
//
//   const orig_list = [
//     'usd',
//     'ngn'
//   ];
//
//   removeListFromArray(orig_list, remove_list);
//
//   return arrayUnique(orig_list.concat(extend_list));
//
// }
//
// // const ownerEnum = [
// //   'peoples',
// //   'organizations'
// // ];
//
// function ownerEnum(app, { extend_list = [], remove_list = [] } = {}) {
//
//   const orig_list = [
//     'peoples',
//     'orgs'
//   ];
//
//   removeListFromArray(orig_list, remove_list);
//
//   return arrayUnique(orig_list.concat(extend_list));
//
// }
//
// // const statusEnum = [
// //   'Accepted',
// //   'Pending',
// //   'Rejected',
// //   'Counteroffer',
// //   'Resolved'
// // ];
//
// function statusEnum(app, { extend_list = [], remove_list = [] } = {}) {
//
//   const orig_list = [
//     'Accepted',
//     'Pending',
//     'Rejected',
//     'Counteroffer',
//     'Resolved'
//   ];
//
//   removeListFromArray(orig_list, remove_list);
//
//   return arrayUnique(orig_list.concat(extend_list));
//
// }
//
// // const domainNameEnum =[
// //   '.com',
// //   '.net',
// //   '.co',
// //   '.us',
// //   '.org',
// //   '.edu'
// // ];
//
// function domainNameEnum(app, { extend_list = [], remove_list = [] } = {}) {
//
//   const orig_list = [
//     '.com',
//     '.net',
//     '.co',
//     '.us',
//     '.org',
//     '.edu'
//   ];
//
//   removeListFromArray(orig_list, remove_list);
//
//   return arrayUnique(orig_list.concat(extend_list));
//
// }
//
// // const hostsEnum =  [
// //   'www',
// //   'app',
// //   'dev'
// // ];
// function hostsEnum(app, { extend_list = [], remove_list = [] } = {}) {
//
//   const orig_list = [
//     'www',
//     'app',
//     'dev'
//   ];
//
//   removeListFromArray(orig_list, remove_list);
//
//   return arrayUnique(orig_list.concat(extend_list));
//
// }
//
// // const HSLA = new Schema({
// //   h: {type: mongoose.Types.Decimal128, required: false, min: 0, max: 1},
// //   s: {type: mongoose.Types.Decimal128, required: false, min: 0, max: 1},
// //   l: {type: mongoose.Types.Decimal128, required: false, min: 0, max: 1},
// //   a: {type: mongoose.Types.Decimal128, required: false, min: 0, max: 1},
// // }, {_id: false});
//
// function HSLA(app, { extend_schema = {}, schema_remove_paths = [] } = {}) {
//   const mongooseClient = app.get('mongooseClient');
//   const { Schema } = mongooseClient;
//   const orig_schema = {
//     h: { type: mongooseClient.Types.Decimal128, required: false, min: 0, max: 1 },
//     s: { type: mongooseClient.Types.Decimal128, required: false, min: 0, max: 1 },
//     l: { type: mongooseClient.Types.Decimal128, required: false, min: 0, max: 1 },
//     a: { type: mongooseClient.Types.Decimal128, required: false, min: 0, max: 1 },
//   };
//
//   schema_remove_paths.map(path => lunset(orig_schema, path));
//
//   return new Schema(lmergeWith(orig_schema, extend_schema, schemaCustomizer), {
//     _id: false,
//   });
// }
//
// // const HSVA = new Schema({
// //   h: {type: mongoose.Types.Decimal128, required: false, min: 0, max: 1},
// //   s: {type: mongoose.Types.Decimal128, required: false, min: 0, max: 1},
// //   v: {type: mongoose.Types.Decimal128, required: false, min: 0, max: 1},
// //   a: {type: mongoose.Types.Decimal128, required: false, min: 0, max: 1},
// // }, {_id: false});
//
// function HSVA(app, { extend_schema = {}, schema_remove_paths = [] } = {}) {
//   const mongooseClient = app.get('mongooseClient');
//   const { Schema } = mongooseClient;
//   const orig_schema = {
//     h: { type: mongooseClient.Types.Decimal128, required: false, min: 0, max: 1 },
//     s: { type: mongooseClient.Types.Decimal128, required: false, min: 0, max: 1 },
//     v: { type: mongooseClient.Types.Decimal128, required: false, min: 0, max: 1 },
//     a: { type: mongooseClient.Types.Decimal128, required: false, min: 0, max: 1 },
//   };
//
//   schema_remove_paths.map(path => lunset(orig_schema, path));
//
//   return new Schema(lmergeWith(orig_schema, extend_schema, schemaCustomizer), {
//     _id: false,
//   });
// }
//
// // const RGBA = new Schema(
// //   {
// //     r: {type: mongoose.Types.Decimal128, required: false, min: 0, max: 1},
// //     g: {type: mongoose.Types.Decimal128, required: false, min: 0, max: 1},
// //     b: {type: mongoose.Types.Decimal128, required: false, min: 0, max: 1},
// //     a: {type: mongoose.Types.Decimal128, required: false, min: 0, max: 1},
// //
// //   }, {_id: false});
//
// function RGBA(app, { extend_schema = {}, schema_remove_paths = [] } = {}) {
//   const mongooseClient = app.get('mongooseClient');
//   const { Schema } = mongooseClient;
//   const orig_schema = {
//     r: { type: mongooseClient.Types.Decimal128, required: false, min: 0, max: 1 },
//     g: { type: mongooseClient.Types.Decimal128, required: false, min: 0, max: 1 },
//     b: { type: mongooseClient.Types.Decimal128, required: false, min: 0, max: 1 },
//     a: { type: mongooseClient.Types.Decimal128, required: false, min: 0, max: 1 },
//   };
//
//   schema_remove_paths.map(path => lunset(orig_schema, path));
//
//   return new Schema(lmergeWith(orig_schema, extend_schema, schemaCustomizer), {
//     _id: false,
//   });
// }
//
// // const Color = new Schema({
// //   hue: {type: mongoose.Types.Decimal128, required: false, min: 0, max: 1},
// //   alpha: {type: mongoose.Types.Decimal128, required: false},
// //   hex: {type: String, required: false, match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/},
// //   hexa: {type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/},
// //   hsla: {HSLA},
// //   hsva: {HSVA},
// //   rgba: {RGBA},
// // }, {_id: false});
//
// function Color(app, { extend_schema = {}, schema_remove_paths = [] } = {}) {
//   const mongooseClient = app.get('mongooseClient');
//   const { Schema } = mongooseClient;
//   const orig_schema = {
//     hue: { type: mongooseClient.Types.Decimal128, required: false, min: 0, max: 1 },
//     alpha: { type: mongooseClient.Types.Decimal128, required: false },
//     hex: { type: String, required: false, match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ },
//     hexa: { type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ },
//     hsla: HSLA(app),
//     hsva: HSVA(app),
//     rgba: RGBA(app),
//   };
//
//   schema_remove_paths.map(path => lunset(orig_schema, path));
//
//   return new Schema(lmergeWith(orig_schema, extend_schema, schemaCustomizer), {
//     _id: false,
//   });
// }
//
// // const UniquePhone = new Schema({
// //   phoneType: {type: String, required: false},
// //   number: {
// //     input: {type: String, required: false},
// //     international: {type: String, required: false},
// //     national: {type: String, required: false},
// //     e164: {type: String, required: true, unique: true},
// //     rfc3966: {type: String, required: false},
// //     significant: {type: String, required: false},
// //   },
// //   regionCode: {type: String, required: false},
// //   valid: {type: Boolean, required: false},
// //   possible: {type: Boolean, required: false},
// //   possibility: {type: String, required: false},
// //   isValid: {type: Boolean, required: false},
// //   country: {
// //     name: {type: String, required: false},
// //     iso2: {type: String, required: false},
// //     dialCode: {type: String, required: false},
// //     priority: {type: Number, required: false},
// //     areaCodes: {type: String, required: false},
// //   },
// //   canBeInternationallyDialled: {type: Boolean, required: false},
// //   type: {type: String, required: false},
// // });
//
// function UniquePhone(app, { extend_schema = {}, schema_remove_paths = [] } = {}) {
//   const mongooseClient = app.get('mongooseClient');
//   const { Schema } = mongooseClient;
//   const orig_schema = {
//     phoneType: { type: String, required: false },
//     number: {
//       input: { type: String, required: false },
//       international: { type: String, required: false },
//       national: { type: String, required: false },
//       e164: { type: String, required: true, unique: true },
//       rfc3966: { type: String, required: false },
//       significant: { type: String, required: false },
//     },
//     regionCode: { type: String, required: false },
//     valid: { type: Boolean, required: false },
//     possible: { type: Boolean, required: false },
//     possibility: { type: String, required: false },
//     isValid: { type: Boolean, required: false },
//     country: {
//       name: { type: String, required: false },
//       iso2: { type: String, required: false },
//       dialCode: { type: String, required: false },
//       priority: { type: Number, required: false },
//       areaCodes: { type: String, required: false },
//     },
//     canBeInternationallyDialled: { type: Boolean, required: false },
//     type: { type: String, required: false },
//   };
//
//   schema_remove_paths.map(path => lunset(orig_schema, path));
//
//   return new Schema(lmergeWith(orig_schema, extend_schema, schemaCustomizer), {});
// }
//
// // const Phone = new Schema({
// //   phoneType: {type: String, required: false},
// //   number: {
// //     input: {type: String, required: false},
// //     international: {type: String, required: false},
// //     national: {type: String, required: false},
// //     e164: {type: String, required: false},
// //     rfc3966: {type: String, required: false},
// //     significant: {type: String, required: false},
// //   },
// //   regionCode: {type: String, required: false},
// //   valid: {type: Boolean, required: false},
// //   possible: {type: Boolean, required: false},
// //   possibility: {type: String, required: false},
// //   isValid: {type: Boolean, required: false},
// //   country: {
// //     name: {type: String, required: false},
// //     iso2: {type: String, required: false},
// //     dialCode: {type: String, required: false},
// //     priority: {type: Number, required: false},
// //     areaCodes: {type: String, required: false},
// //   },
// //   canBeInternationallyDialled: {type: Boolean, required: false},
// //   type: {type: String, required: false},
// // });
//
// function Phone(app, { extend_schema = {}, schema_remove_paths = [] } = {}) {
//
//   const orig_schema = {
//     phoneType: { type: String, required: false },
//     number: {
//       input: { type: String, required: false },
//       international: { type: String, required: false },
//       national: { type: String, required: false },
//       e164: { type: String, required: false },
//       rfc3966: { type: String, required: false },
//       significant: { type: String, required: false },
//     },
//     regionCode: { type: String, required: false },
//     valid: { type: Boolean, required: false },
//     possible: { type: Boolean, required: false },
//     possibility: { type: String, required: false },
//     isValid: { type: Boolean, required: false },
//     country: {
//       name: { type: String, required: false },
//       iso2: { type: String, required: false },
//       dialCode: { type: String, required: false },
//       priority: { type: Number, required: false },
//       areaCodes: { type: String, required: false },
//     },
//     canBeInternationallyDialled: { type: Boolean, required: false },
//     type: { type: String, required: false },
//   };
//
//   schema_remove_paths.map(path => lunset(orig_schema, path));
//   const mongooseClient = app.get('mongooseClient');
//   const { Schema } = mongooseClient;
//   return new Schema(lmergeWith(orig_schema, extend_schema, schemaCustomizer), {});
// }
//
// // // eslint-disable-next-line no-unused-vars
// // const newPhone = new Schema({
// //   phoneType: {type: String, required: false},
// //   number: {type: String, required: false},
// //   formatted: {type: String, required: false},
// //   nationalNumber: {type: String, required: false},
// //   valid: {type: Boolean, required: false},
// //   countryCode: {type: String, required: false},
// //   countryCallingCode: {type: String, required: false},
// //   country: {
// //     name: {type: String, required: false},
// //     iso2: {type: String, required: false},
// //     dialCode: {type: String, required: false},
// //     priority: {type: Number, required: false},
// //     areaCodes: {type: String, required: false},
// //   },
// // });
// //
// // // eslint-disable-next-line no-unused-vars
// // const PhoneNumber = new Schema({
// //   phoneType: {type: String, required: false},
// //   phoneNumber: {type: String, required: false},
// //   nationalNumber: {type: String, required: false},
// //   formatNational: {type: String, required: false},
// //   formattedNumber: {type: String, required: false},
// //   e164: {type: String, required: false},
// //   formatInternational: {type: String, required: false},
// //   uri: {type: String, required: false},
// //   isValid: {type: Boolean, required: false},
// //   countryCode: {type: String, required: false},
// //   countryCallingCode: {type: String, required: false},
// //   type: {type: String, required: false},
// // });
//
// // const Images = new Schema({
// //   raw: {
// //     _id: { type: Schema.Types.ObjectId, required: false, ref: 'file-uploader' },
// //     file: { type: String, required: false }
// //   }
// // }, { _id: false, timestamps: false });
//
// function Images(app, { extend_schema = {}, schema_remove_paths = [] } = {}) {
//   const mongooseClient = app.get('mongooseClient');
//   const { Schema } = mongooseClient;
//   const orig_schema = {
//     raw: {
//       _id: { type: Schema.Types.ObjectId, required: false, ref: 'file-uploader' },
//       file: { type: String, required: false }
//     }
//   };
//
//   schema_remove_paths.map(path => lunset(orig_schema, path));
//
//   return new Schema(lmergeWith(orig_schema, extend_schema, schemaCustomizer), {
//     _id: false, timestamps: false
//   });
// }
//
// // const Files = new Schema({
// //   createdAt: Date,
// //   file: String,
// //   fileId: String,
// //   info: {},
// //   name: String,
// //   originalName: String,
// //   storage: String,
// //   updatedAt: Date,
// //   uploadChannel: String,
// // }, {_id: false});
//
// function Files(app, { extend_schema = {}, schema_remove_paths = [] } = {}) {
//   const mongooseClient = app.get('mongooseClient');
//   const { Schema } = mongooseClient;
//   const orig_schema = {
//     createdAt: Date,
//     file: String,
//     fileId: String,
//     info: {},
//     name: String,
//     originalName: String,
//     storage: String,
//     updatedAt: Date,
//     uploadChannel: String,
//   };
//
//   schema_remove_paths.map(path => lunset(orig_schema, path));
//
//   return new Schema(lmergeWith(orig_schema, extend_schema, schemaCustomizer), {
//     _id: false
//   });
// }
//
// // const Address = new Schema({
// //   address1: {type: String, required: true},
// //   city: {type: String, required: true},
// //   country: {type: String, required: true},
// //   formatted: {type: String, required: false},
// //   latitude: {type: Number, required: true},
// //   longitude: {type: Number, required: true},
// //   name: {type: String, required: false},
// //   postal: {type: String, required: true},
// //   region: {type: String, required: false},
// //   googleAddress: {type: Object, required: false},
// //   tags: {type: Object, required: false},
// //   type: {type: Object, required: false},
// // });
//
// function Address(app, { extend_schema = {}, schema_remove_paths = [] } = {}) {
//   const mongooseClient = app.get('mongooseClient');
//   const { Schema } = mongooseClient;
//   const orig_schema = {
//     address1: { type: String, required: true },
//     city: { type: String, required: true },
//     country: { type: String, required: true },
//     formatted: { type: String, required: false },
//     latitude: { type: Number, required: true },
//     longitude: { type: Number, required: true },
//     name: { type: String, required: false },
//     postal: { type: String, required: true },
//     region: { type: String, required: false },
//     googleAddress: { type: Object, required: false },
//     tags: { type: Object, required: false },
//     type: { type: Object, required: false },
//   };
//
//   schema_remove_paths.map(path => lunset(orig_schema, path));
//
//   return new Schema(lmergeWith(orig_schema, extend_schema, schemaCustomizer), {});
// }
//
// // const Theme = new Schema({
// //   darkMode: {type: Boolean, default: false},
// //   '--q-color-primary': {type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/},
// //   '--q-color-secondary': {type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/},
// //   '--q-color-accent': {type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/},
// //   '--q-color-dark': {type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/},
// //
// //   '--q-color-positive': {type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/},
// //   '--q-color-negative': {type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/},
// //   '--q-color-info': {type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/},
// //   '--q-color-warning': {type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/},
// // }, {_id: false});
//
// function Theme(app, { extend_schema = {}, schema_remove_paths = [] } = {}) {
//   const mongooseClient = app.get('mongooseClient');
//   const { Schema } = mongooseClient;
//   const orig_schema = {
//     darkMode: { type: Boolean, default: false },
//     '--q-color-primary': { type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ },
//     '--q-color-secondary': {
//       type: String,
//       required: false,
//       match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
//     },
//     '--q-color-accent': { type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ },
//     '--q-color-dark': { type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ },
//
//     '--q-color-positive': { type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ },
//     '--q-color-negative': { type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ },
//     '--q-color-info': { type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ },
//     '--q-color-warning': { type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/ },
//   };
//
//   schema_remove_paths.map(path => lunset(orig_schema, path));
//
//   return new Schema(lmergeWith(orig_schema, extend_schema, schemaCustomizer), {
//     _id: false
//   });
// }
//
// // const RRULE = new Schema({
// //   //https://icalendar.org/rrule-tool.html
// //   freq: {
// //     type: String,
// //     enum: ['YEARLY', 'MONTHLY', 'WEEKLY', 'DAILY', 'HOURLY', 'MINUTELY', 'SECONDLY'],
// //   },
// //   dtstart: {type: Date, required: true},
// //   until: Date,
// //   interval: Number,
// //   count: Number,
// //   bymonth: [{type: Number, min: 1, max: 12}], //month of an annual recurrance
// //   byweekday: [String], //ex [TU,TH] first & last sunday [1SU, -1SU]
// //   byhour: [Number],
// //   byminute: [Number],
// //   bysecond: [Number],
// //   bymonthday: [{type: Number, min: 1, max: 31}],
// //   byyearday: [{type: Number, min: 1, max: 365}],
// //   byweekno: [{type: Number, min: 1, max: 52}],
// //   bysetpos: [Number], //The third instance into the month of one of Tuesday, Wednesday, or Thursday, for the next 3 months:
// //   wkst: {type: String, enum: ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']}, //day of the week to start weekly recurrance
// //   tzid: String,
// // }, {_id: false});
//
// function RRULE(app, { extend_schema = {}, schema_remove_paths = [] } = {}) {
//   const mongooseClient = app.get('mongooseClient');
//   const { Schema } = mongooseClient;
//   const orig_schema = {
//     //https://icalendar.org/rrule-tool.html
//     freq: {
//       type: String,
//       enum: ['YEARLY', 'MONTHLY', 'WEEKLY', 'DAILY', 'HOURLY', 'MINUTELY', 'SECONDLY'],
//     },
//     dtstart: { type: Date, required: true },
//     until: Date,
//     interval: Number,
//     count: Number,
//     bymonth: [{ type: Number, min: 1, max: 12 }], //month of an annual recurrance
//     byweekday: [String], //ex [TU,TH] first & last sunday [1SU, -1SU]
//     byhour: [Number],
//     byminute: [Number],
//     bysecond: [Number],
//     bymonthday: [{ type: Number, min: 1, max: 31 }],
//     byyearday: [{ type: Number, min: 1, max: 365 }],
//     byweekno: [{ type: Number, min: 1, max: 52 }],
//     bysetpos: [Number], //The third instance into the month of one of Tuesday, Wednesday, or Thursday, for the next 3 months:
//     wkst: { type: String, enum: ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'] }, //day of the week to start weekly recurrance
//     tzid: String,
//   };
//
//   schema_remove_paths.map(path => lunset(orig_schema, path));
//
//   return new Schema(lmergeWith(orig_schema, extend_schema, schemaCustomizer), {
//     _id: false
//   });
// }
//
// // const Settings = new Schema({
// //   theme: Theme,
// //
// //   instances: {},
// //   applications: {},
// //   hosts: {},
// //   organisations: {},
// //   peoples: {},
// // }, {_id: false});
//
// function Settings(app, { extend_schema = {}, schema_remove_paths = [] } = {}) {
//   const mongooseClient = app.get('mongooseClient');
//   const { Schema } = mongooseClient;
//   const orig_schema = {
//     theme: Theme(app),
//     instances: {},
//     applications: {},
//     hosts: {},
//     routes: {
//       routeIds: [{ type: Schema.Types.ObjectId, ref: 'routes'}]
//     },
//     organizations: {},
//     peoples: {},
//   };
//
//   schema_remove_paths.map(path => lunset(orig_schema, path));
//
//   return new Schema(lmergeWith(orig_schema, extend_schema, schemaCustomizer), {
//     _id: false
//   });
// }
//
// // const GeoLocation = new Schema({
// //   type: { type: String, default: 'FeatureCollection' },
// //   allowFeatures: [{ type: String, enum: ['Point', 'MultiPoint', 'Polygon'] }],
// //   features: [{
// //     type: { type: String, enum: ['Feature'] },
// //     schedule_items: { type: Array }, //uuid
// //     geometry: {
// //       type: { type: String, required: true, enum: ['Point', 'Polygon'], default: 'Point' },
// //       coordinates: { type: Array, required: false },
// //     },
// //     properties: { type: Object, required: false },
// //     addresses: [],
// //   }]
// // });
//
// function GeoLocation(app, { extend_schema = {}, schema_remove_paths = [] } = {}) {
//   const mongooseClient = app.get('mongooseClient');
//   const { Schema } = mongooseClient;
//   const orig_schema = {
//     type: { type: String, default: 'FeatureCollection' },
//     allowFeatures: [{ type: String, enum: ['Point', 'MultiPoint', 'Polygon'] }],
//     features: [{
//       type: { type: String, enum: ['Feature'] },
//       schedule_items: { type: Array }, //uuid
//       geometry: {
//         type: { type: String, required: true, enum: ['Point', 'Polygon'], default: 'Point' },
//         coordinates: { type: Array, required: false },
//       },
//       properties: { type: Object, required: false },
//       addresses: [],
//     }]
//   };
//
//   schema_remove_paths.map(path => lunset(orig_schema, path));
//
//   return new Schema(lmergeWith(orig_schema, extend_schema, schemaCustomizer), {});
// }
//
// // const message = new Schema({
// //   message: { type: String, required: true },
// //   ownerID: { type: Schema.Types.ObjectId, refPath: 'idModel' },
// //   idModel: {type: String, enum: ownerEnum}
// // });
//
// function message(app, { extend_schema = {}, schema_remove_paths = [] } = {}) {
//   const mongooseClient = app.get('mongooseClient');
//   const { Schema } = mongooseClient;
//   const orig_schema = {
//     message: { type: String, required: true },
//     ownerID: { type: Schema.Types.ObjectId, refPath: 'idModel' },
//     idModel: { type: String, enum: ownerEnum(app) }
//   };
//
//   schema_remove_paths.map(path => lunset(orig_schema, path));
//
//   return new Schema(lmergeWith(orig_schema, extend_schema, schemaCustomizer), {});
// }
//
// // const commonFieldsFn = (
// //   {
// //     audited = false,
// //   } = {}) => {
// //   return new Schema({
// //     deleted: {type: Boolean, default: false},
// //     deletedAt: {type: Date, default: null},
// //
// //     createdBy: {
// //       id: {type: Schema.Types.ObjectId, refPath: 'createdByModel'},
// //       createdByModel: {
// //         type: String, enum: ownerEnum,
// //         required(){
// //           return !!this.createdBy.id;
// //         }
// //       },
// //       fingerprint: {type: Schema.Types.ObjectId, ref: 'fingerprints'},
// //       applicationID: {type: Schema.Types.ObjectId, ref: 'applications'},
// //     },
// //
// //     updatedBy: {
// //       id: {type: Schema.Types.ObjectId, refPath: 'updatedByModel'},
// //       updatedByModel: {
// //         type: String,
// //         enum: ownerEnum,
// //         required(){
// //           return !!this.updatedBy.id;
// //         }
// //       },
// //       fingerprint: {type: Schema.Types.ObjectId, ref: 'fingerprints'},
// //       applicationID: {type: Schema.Types.ObjectId, ref: 'applications'},
// //     },
// //
// //     updatedByHistory: [{
// //       id: {type: Schema.Types.ObjectId, refPath: 'updatedByModel'},
// //       updatedByModel: {
// //         type: String,
// //         enum: ownerEnum,
// //       },
// //       fingerprint: {type: Schema.Types.ObjectId, ref: 'fingerprints'},
// //       applicationID: {type: Schema.Types.ObjectId, ref: 'applications'},
// //       updatedAt: {type: Date},
// //     }],
// //
// //     external: {
// //       type: Object,
// //       contains: {
// //         createdBySource: {
// //           id: {
// //             type: String,
// //             required() {
// //               return audited && lget(this,'applicationID');
// //             }
// //           },
// //           Model: {
// //             type: String,
// //             required() {
// //               return  !!lget(this,'createdBySource.id');
// //             }
// //           }
// //         },
// //         updatedBySource: {
// //           id: {
// //             type: String,
// //             required() {
// //               return audited && lget(this,'applicationID');
// //             }
// //           },
// //           Model: {
// //             type: String,
// //             required() {
// //               return  !!lget(this,'updatedBySource.id');
// //             }
// //           }
// //         },
// //         updatedBySourceHistory: [{
// //           updatedBy:  String,
// //           updatedByHistoryModel: String,
// //           updatedAt: {type: Date},
// //         }],
// //         meta: Schema.Types.Mixed
// //       },
// //     }
// //
// //   }, {_id: false});
// // };
//
// const nativePermissions = (app, {
//   extend_schema = {},
//   schema_remove_paths = []
// } = {}) => {
//   const mongooseClient = app.get('mongooseClient');
//   const { Schema } = mongooseClient;
//
//   const schema = new Schema({
//     peoples: {
//       manage: [],
//       own: [],
//       member: []
//     },
//     orgs: {
//       manage: [],
//       own: [],
//       member: []
//     }
//   });
//   schema_remove_paths.map(path => lunset(schema, path));
//
//   return new Schema(lmergeWith(schema, extend_schema, schemaCustomizer), {
//     _id: false
//   });
// };
//
// function commonFieldsFn(app, {
//   audited = false,
//   extend_schema = {},
//   schema_remove_paths = [],
//   requiredFields = [],
//   uniqueFields = []
// } = {}) {
//   const mongooseClient = app.get('mongooseClient');
//   const { Schema } = mongooseClient;
//   const orig_schema = {
//     nativePermissions: nativePermissions(app).obj,
//     deleted: Boolean,
//     deletedAt: { type: Date, default: null },
//     //list of applications that have access to that record of data
//     whiteLabel: {
//       type: Schema.Types.ObjectId, ref: 'white-labels',
//       required() {
//         return requiredFields.includes('white-labels');
//       },
//       unique(){
//         return uniqueFields.includes('white-labels');
//       }
//     },
//     whiteLabels: [{
//       type: Schema.Types.ObjectId, ref: 'white-labels',
//       required() {
//         return requiredFields.includes('white-labels');
//       }
//     }],
//     createdBy: {
//       _id: { type: Schema.Types.ObjectId, refPath: 'createdByModel' },
//       createdByModel: {
//         type: String,
//         enum: ownerEnum(app),
//         required() {
//           return !!lget(this.createdBy, '_id');
//         }
//       },
//       device: { type: Schema.Types.ObjectId, ref: 'devices' },
//       application: { type: Schema.Types.ObjectId, ref: 'applications' },
//     },
//
//     updatedBy: {
//       _id: { type: Schema.Types.ObjectId, refPath: 'updatedByModel' },
//       updatedByModel: {
//         type: String,
//         enum: ownerEnum(app),
//         required() {
//           return !!lget(this.updatedBy, '_id');
//         }
//       },
//       device: { type: Schema.Types.ObjectId, ref: 'devices' },
//       application: { type: Schema.Types.ObjectId, ref: 'applications' },
//     },
//
//     updatedByHistory: [{
//       _id: { type: Schema.Types.ObjectId, refPath: 'updatedByModel' },
//       updatedByModel: {
//         type: String,
//         enum: ownerEnum(app),
//       },
//       device: { type: Schema.Types.ObjectId, ref: 'devices' },
//       application: { type: Schema.Types.ObjectId, ref: 'applications' },
//       updatedAt: Date,
//     }],
//
//
//     external: {
//       type: Object,
//       contains: {
//         createdBySource: {
//           _id: {
//             type: String,
//             required() {
//               return audited && lget(orig_schema, 'application');
//             }
//           },
//           Model: {
//             type: String,
//             required() {
//               return !!lget(this.createdBySource, '_id');
//             }
//           }
//         },
//         updatedBySource: {
//           _id: {
//             type: String,
//             required() {
//               return audited && lget(orig_schema, 'application');
//             }
//           },
//           Model: {
//             type: String,
//             required() {
//               return !!lget(this.updatedBySource, '_id');
//             }
//           }
//         },
//         updatedBySourceHistory: [{
//           updatedBy: String,
//           updatedByHistoryModel: String,
//           updatedAt: Date,
//         }],
//         meta: Schema.Types.Mixed
//       },
//     }
//
//   };
//
//   schema_remove_paths.map(path => lunset(orig_schema, path));
//
//   return new Schema(lmergeWith(orig_schema, extend_schema, schemaCustomizer), {
//     _id: false
//   });
// }
//
//
// // const Video = new Schema({
// //   author: String,
// //   creator: {type: Schema.Types.ObjectId, ref: 'users'},
// //   uploadId: String,
// //   name: String,
// //   description: String,
// //   embed: { type: String, trim: true },
// //   file: { type: String, trim: true },
// //   uriRef: String,
// //   host: String,
// //   uri: { type: String, trim: true },
// //   status: {type: String, enum: [null, 'uploading', 'processing', 'ready', 'error']},
// //   thumbnails: [],
// //   views: [{type: Schema.Types.ObjectId, ref: 'fv-views'}],
// //   ...commonFieldsFn
// // });
//
//
// function Video(app, { extend_schema = {}, schema_remove_paths = [] } = {}) {
//   const mongooseClient = app.get('mongooseClient');
//   const { Schema } = mongooseClient;
//   const orig_schema = {
//     author: String,
//     creator: { type: Schema.Types.ObjectId, ref: 'users' },
//     uploadId: String,
//     name: String,
//     description: String,
//     embed: { type: String, trim: true },
//     file: { type: String, trim: true },
//     uriRef: String,
//     host: String,
//     uri: { type: String, trim: true },
//     status: { type: String, enum: [null, 'uploading', 'processing', 'ready', 'error'] },
//     thumbnails: [],
//     views: [{ type: Schema.Types.ObjectId, ref: 'fv-views' }],
//     ...commonFieldsFn(app).obj
//   };
//
//   schema_remove_paths.map(path => lunset(orig_schema, path));
//
//   return new Schema(lmergeWith(orig_schema, extend_schema, schemaCustomizer), {});
// }
//
// // const Identity = new Schema({
// //   id: {type: Schema.Types.ObjectId, refPath: 'idModel'},
// //   idModel: {type: String, enum: ownerEnum},
// //   manager: {type: Boolean, default: false}
// // });
// //
// function Identity(app, { extend_schema = {}, schema_remove_paths = [] } = {}) {
//   const mongooseClient = app.get('mongooseClient');
//   const { Schema } = mongooseClient;
//
//   const orig_schema = {
//     id: { type: Schema.Types.ObjectId, refPath: 'idModel' },
//     idModel: { type: String, enum: ownerEnum(app) },
//     manager: { type: Boolean, default: false }
//   };
//
//   schema_remove_paths.map(path => lunset(orig_schema, path));
//
//   return new Schema(lmergeWith(orig_schema, extend_schema, schemaCustomizer), {});
// }
//
// module.exports = {
//   uuid,
//   Color,
//   UniquePhone,
//   Phone,
//   Images,
//   Files,
//   Address,
//   Theme,
//   RRULE,
//   Settings,
//   commonFieldsFn,
//   privacyEnum,
//   currencyEnum,
//   GeoLocation,
//   Video,
//   ownerEnum,
//   message,
//   statusEnum,
//   Identity,
//   domainNameEnum,
//   hostsEnum
// };
//
