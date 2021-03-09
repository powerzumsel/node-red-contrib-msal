module.exports = function(RED) {
	function MsalConfig(n) {
		RED.nodes.createNode(this,n);
		this.clientId = n.clientId;
		this.clientSecret = n.clientSecret;
		this.authority = n.authority;

	
		const msal = require('@azure/msal-node');	


		const config = {
			auth: {
				clientId: this.clientId,
				authority: this.authority,
				clientSecret: this.clientSecret
			},

			cache: {
				cacheLocation: "sessionStorage"
			}
		}

		const pca = new msal.ConfidentialClientApplication(config);
		pca.knownAuthorities = config.auth.authority;	

		this.pca = pca;

	};
	RED.nodes.registerType("msal-config",MsalConfig);
}