const dns = require('dns').promises;

const getANameRecord = async(cname)=>{
  return await dns.resolve(cname,'A');
};

module.exports = {
  getANameRecord
};
