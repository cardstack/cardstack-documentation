module.exports = function findBadLineBreaks(filepath, links) {
  let results = [];
  links.forEach(function (link) {
    if (link.includes('docs.cardstack.com/')) {
      results.push({ fileToFix: filepath, makeThisARelativePath: link });
    }
  });
  return results;
};
