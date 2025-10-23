param namePrefix string = 'mytodoapp'
param location string = resourceGroup().location
@secure()
param mysqlAdminPassword string

resource mysqlServer 'Microsoft.DBforMySQL/flexibleServers@2024-12-30' = {
  name: '${namePrefix}-mysql'
  location: location
  sku: {
    name: 'Standard_B1ms'
    tier: 'Burstable'
  }
  properties: {
    administratorLogin: 'sqlAdmin'
    administratorLoginPassword: mysqlAdminPassword
    version: '8.0'
    storage: {
      storageSizeGB: 2
    }
  }
}
