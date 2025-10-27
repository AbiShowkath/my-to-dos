param namePrefix string = 'mytodoapp'
param location string = resourceGroup().location

resource redisCache 'Microsoft.Cache/redis@2024-11-01' = {
  name: '${namePrefix}_redis'
  location: location
  properties: {
    sku: {
      name: 'Basic'
      family: 'C'
      capacity: 0
    }
    enableNonSslPort: false
  }
}
