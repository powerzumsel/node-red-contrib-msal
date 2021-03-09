# node-red-contrib-msal

[Node RED](https://nodered.org) node to authenticate using MSAL.  

Mainly based on Azure docs and [samples](https://github.com/Azure-Samples/ms-identity-node/)  

## Installation via the Web-Interface

1. Open the menu in the upper right corner  
2. Choose **Manage Palette**  
3. Under **Install**, search for: *node-red-contrib-msal*  

## Installation via the command line

1. Navigate to your Node RED user directory, usally `$HOME/.node-red`  
2. Run the following command:  

```shell
npm install node-red-contrib-msal
```

---

## Prerequisites

Already registered App on Azure Portal.

## Usage

This node is using `Redirect Method`  
Enter:

- `Scopes` :  e.g. **user.read**  
- `Init URL` : Url that will lead to Azure Login: **/login2azure**  
- `Local Redirect URL` : RedirectUrl that will listen on Azure Login Response: **/redirect**  
**Note: On Azure Portal you have to add the complete REDIRECT URL !!!  
Running NR on `http://localhost:1880` then you have to add `http://localhost:1880/redirect` for your app in Azure Portal !  
This node will patch up the complete REDIRECT URL on its own and pass it to msal!**  

Node will send Response Object

## Config Node

- Application (client) ID  
- Application (client) Secret
- Authority

---
