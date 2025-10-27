param namePrefix string = 'mytodoapp'
param location string = resourceGroup().location

// var keyVaultName = '${namePrefix}-kv-${uniqueString(resourceGroup().id)}'

@minLength(5)
@maxLength(50)
@description('Provide a globally unique name of your Azure Container Registry')
param acrName string = '${namePrefix}acr${uniqueString(resourceGroup().id)}'

module acr 'modules/acr.bicep' = {
  name: 'acrModule'
  params: {
    location: location
    acrName: acrName
  }
}

output acrName string = acr.outputs.acrName

// @secure()
// param sqlAdminPassword string = newGuid()

// module keyVault 'modules/keyvault.bicep' = {
//   name: 'keyVaultModule'
//   params: {
//     location: location
//     keyVaultName: keyVaultName
//     sqlAdminPassword: sqlAdminPassword
//   }
// }

module mysql 'modules/mysql.bicep' = {
  name: 'mysqlModule'
  params: {
    namePrefix: namePrefix
    location: location
    administratorLogin: 'sqladminuser'
    administratorLoginPassword: 'sqlAdminPassword123'
  }
}

module redis 'modules/redis.bicep' = {
  name: 'redisModule'
  params: {
    namePrefix: namePrefix
    location: location
  }
}

