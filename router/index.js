var controller = require('../controller/index');
module.exports = function(app){
    //首页
    app.get('/',controller.index);
    app.get('/webgl',controller.webgl);

};