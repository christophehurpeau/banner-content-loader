const loaderUtils = require('loader-utils');
const SourceNode = require('source-map').SourceNode;
const SourceMapConsumer = require('source-map').SourceMapConsumer;

module.exports = function (content, sourceMap) {
  if (this.cacheable) this.cacheable();
  const self = this;
  const callback = this.async();
  let { prefix, postfix, delimiter } = loaderUtils.getOptions(this);
  if (!delimiter) delimiter = '';

  // Prepare prefix
  prefix = prefix == null ? '' : prefix + delimiter;

  // Prepare postfix
  postfix = postfix == null ? '' : delimiter + postfix;

  // Build content
  if (sourceMap) {
    const currentRequest = loaderUtils.getCurrentRequest(self);
    const node = SourceNode.fromStringWithSourceMap(content, new SourceMapConsumer(sourceMap));
    node.prepend(prefix);
    node.add(postfix);
    const result = node.toStringWithSourceMap({
      file: currentRequest,
    });
    callback(null, result.code, result.map.toJSON());
  } else {
    callback(null, prefix + content + postfix);
  }
};
