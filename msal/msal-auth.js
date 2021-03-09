module.exports = function(RED) {	
	function MsalAuth(n) {
		var node = this;		
		RED.nodes.createNode(this, n);	
		
		node.homeAccountId = "";
		node.initUrl= n.initUrl;
		node.redirectUrl= n.redirectUrl;
		
		node.azurescopes= n.azurescopes;
		const configNode = RED.nodes.getNode(n.config);
		const pca = configNode.pca;
		node.status({fill:"red",shape:"ring",text:"disconnected"});
		

		
		//INIT-URL  local starting point to shift to Azure Login when requested  (".../login2azure")
		//console.log(node.initUrl);

		//REDIRECT-URL  local redirect url that this node will listen on to fetch response object (".../redirect")
		//console.log(node.redirectUrl);
		
		

		node.on('input', (msg, send, done) => {		
			
			if (msg.update == true)
			{
				
				if(node.homeAccountId){
					
					const msalTokenCache = pca.getTokenCache(); 
					const account = msalTokenCache.getAccountByHomeId(node.homeAccountId);
					// Build silent request
					const silentRequest = {
						account: account,
						scopes: [node.azurescopes],
					};
			
					// Acquire Token Silently
					pca.acquireTokenSilent(silentRequest)
					.then((response) => { 
						//console.log("acquireTokenSilent Response received");   
						//console.log("\nacquireTokenSilent Response: \n:", response);	 
						var msg = { "payload" : response};
						node.status({fill:"green",shape:"dot",text:"Authentication refreshed"});				
						send(msg);
						done();
					})
					.catch((error) => {
						console.log(error);            
					});
				}
			}		
			
		});


		//listening for Init Url to shift to Azure Login
		RED.httpNode.get(node.initUrl, function(req, res){

			//AZURE-REDIRECT-URL <redirectUri> 
			// FQDN redirect url that has to 
			// be set inside Azure for you registered app (http://localhost:1880/redirect")
			// HERE: patched up from node red url + entered redirect url
			const noderedurl = req.protocol+"://"+req.hostname +":"+ RED.settings.uiPort;
			const authCodeUrlParameters = {
				scopes: [node.azurescopes],
				redirectUri: noderedurl + node.redirectUrl
			};
			pca.getAuthCodeUrl(authCodeUrlParameters).then(function(response) {					
				res.redirect(response);				
				}).catch((error) => console.log(JSON.stringify(error)));
			
		});

					

		//listening on local redirect url to fetch response 
		RED.httpNode.get(node.redirectUrl, function(req, res){

			const noderedurl = req.protocol+"://"+req.hostname +":"+ RED.settings.uiPort;	
			// console.log(noderedurl + node.redirectUrl )		;			
			const tokenRequest = {
				code: req.query.code,
				scopes: [node.azurescopes],
				redirectUri: noderedurl + node.redirectUrl  
			};		

			pca.acquireTokenByCode(tokenRequest).then((response) => {
				console.log("\nacquireTokenByCode Response: \n:", response);				
				node.homeAccountId = response.account.homeAccountId;			
				var msg = { "payload" : response};
				node.status({fill:"green",shape:"dot",text:"Authenticated"});				
				node.send(msg);		   
		
			}).catch((error) => console.log(JSON.stringify(error)));

			res.sendStatus(202);	
			//res.redirect('/ui');		
						
		});	
		
	}
	RED.nodes.registerType("msal-auth",MsalAuth);
}