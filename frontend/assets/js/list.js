$(document).ready(function () {
  var template = Handlebars.compile('Handlebars <b>{{doesWhat}}</b>');
  console.log(template({ doesWhat: 'rocks!' }));
});
