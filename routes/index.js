/**
 * Created by pro on 15/4/19.
 */

module.exports = function(app){
	app.get('/', function *(next) {

	    yield this.render('index', {
	        data : 'linjie koa web'
	    });
	    
	});

	app.get('/admin', function *(){
	    yield this.render('admin');
	});
}