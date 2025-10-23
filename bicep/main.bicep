param namePrefix string = 'mytodoapp'
param location string = resourceGroup().location

var keyVaultName = '${namePrefix}-kv-${uniqueString(resourceGroup().id)}'

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

@description('Current UTC time for unique password.')
param currentUtc string = utcNow()

var sqlAdminPassword = '${namePrefix}sql${uniqueString(resourceGroup().id, currentUtc)}'

module keyVault 'modules/keyvault.bicep' = {
  name: 'keyVaultModule'
  params: {
    location: location
    keyVaultName: keyVaultName
    sqlAdminPassword: sqlAdminPassword
  }
}

module mysql 'modules/mysql.bicep' = {
  name: 'mysqlModule'
  params: {
    namePrefix: namePrefix
    location: location
    mysqlAdminPassword: sqlAdminPassword
  }
}

module redis 'modules/redis.bicep' = {
  name: 'redisModule'
  params: {
    namePrefix: namePrefix
    location: location
  }
}
