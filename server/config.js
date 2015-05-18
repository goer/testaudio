
exports.getConfig = function (){

	return {

		server : {

			port : process.env.OPENSHIFT_NODEJS_PORT || 7170,
			ip : process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0"

		},
		db: {
			host: process.env.OPENSHIFT_MONGODB_DB_HOST || 'localhost' ,
			port: process.env.OPENSHIFT_MONGODB_DB_PORT || 27017,
			name: '-deployd',
			//name: 'audioserver',
			// credentials : {
			// 	username: 'admin',
			// 	password: 'hTUSfXHY-Fbq'
			// }
		}
	}

}