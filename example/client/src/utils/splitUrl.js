

export const splitUrl =(url='http://xyz.samson.co:8080')=>{
  const splitByCollon = url.split(':');
  const protocol = splitByCollon[0];
  const port =splitByCollon[2];
  const fqdn =splitByCollon[1].replace(new RegExp('//', 'g'),'');
  let domain;
  let host;
  if(((fqdn.match(new RegExp('.', 'g')) || []).length>1)){
  const domainArray = fqdn.split('.');
    host = domainArray.shift();
    domain = domainArray.join('.');
  }else if(((fqdn.match(new RegExp('.', 'g')) || []).length===1)){
    domain=fqdn;
    host='';
  };
  return {protocol,port,fqdn,domain,host};
};
