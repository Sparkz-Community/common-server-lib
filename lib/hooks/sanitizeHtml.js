// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const sanitizeHTML = require('sanitize-html');
const {packages:{lodash: {lget, lset}}} = require('@iy4u/common-utils');

const defaultOptions = {
  allowedTags: ['h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
    'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'abbr', 'code', 'hr', 'br', 'div',
    'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe', 'span', 'img'],
  disallowedTagsMode: 'discard',
  allowedAttributes: {
    a: ['href', 'name', 'target'],
    div: ['style'],
    table: ['style'],
    tbody: ['style'],
    th: ['style'],
    td: ['style'],
    span: ['style'],
    p: ['style'],
    // We don't currently allow img itself by default, but this
    // would make sense if we did. You could add srcset here,
    // and if you do the URL is checked for safety
    img: ['src', 'style']
  },
  // Lots of these won't come up by default because we don't allow them
  selfClosing: ['img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta'],
  allowIframeHostnames: ['www.youtube.com', 'www.vimeo.com'],
  // URL schemes we permit
  allowedSchemes: ['http', 'https', 'ftp', 'mailto', 'data'],
  allowedSchemesByTag: {},
  allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
  allowProtocolRelative: true,
  enforceHtmlBoundary: false
};

module.exports = ({ paths = [], sanitizeHTMLOptions = {} } = {}) => {
  return async context => {
    paths.forEach(path => {
      const pathVal = lget(context, path);
      if (pathVal) {
        lset(context, path, sanitizeHTML(pathVal, { ...defaultOptions, ...sanitizeHTMLOptions }));
      }
    });
    return context;
  };
};
