
const proxy = require('http-proxy-middleware') 

module.exports = function(app){
	app.use(
		proxy.createProxyMiddleware('/api',{ 
			target:'http://43.129.181.196',
			changeOrigin:true,
			pathRewrite:{'^/api':''} 
		}),
		proxy.createProxyMiddleware('/api2',{
			target:'http://1.117.86.81',
			changeOrigin:true,
			pathRewrite:{'^/api2':''}
		}),
	)
}
 
 