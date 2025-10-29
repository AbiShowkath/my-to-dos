param location string = resourceGroup().location
param namePrefix string = 'mytodoapp'

param acrName string
param acrLoginServer string = '${acrName}.azurecr.io'
param frontendImage string = '${acrLoginServer}/${namePrefix}-app:latest'
param backendImage string = '${acrLoginServer}/${namePrefix}-api:latest'

@secure()
param mysqlAdminPassword string = newGuid()

@secure()
param secretKey string = newGuid()

var appName = '${namePrefix}app'

// var subnetAddressPrefix = '10.1.0.0/22'
// var addressPrefix = '10.1.0.0/16'

resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: '${appName}-logs'
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
  }
}

// module network 'modules/network.bicep' = {
//   name: 'networkModule'
//   params: {
//     location: location
//     virtualNetworkName: '${appName}-vnet'
//     subnetName: '${appName}-subnet'
//     networkSecurityGroupName: '${appName}-nsg'
//     addressPrefix: addressPrefix
//     subnetAddressPrefix: subnetAddressPrefix
//   }
// }

// var networkSubnetId = network.outputs.networkSubnetId

resource containerAppEnv 'Microsoft.App/managedEnvironments@2025-01-01' = {
  name: '${appName}-env'
  location: location
  properties: {
    vnetConfiguration: {
      infrastructureSubnetId: resourceId('Microsoft.Network/virtualNetworks/subnets', '${appName}-vnet', '${appName}-subnet')
    }
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalyticsWorkspace.properties.customerId
        sharedKey: logAnalyticsWorkspace.listKeys().primarySharedKey
      }
    }
  }
}

resource redisApp 'Microsoft.App/containerApps@2025-01-01' = {
  name: '${appName}-redis'
  location: location
  properties: {
    managedEnvironmentId: containerAppEnv.id
    configuration: {
      ingress: {
        external: true
        targetPort: 6379
        transport: 'tcp'
        allowInsecure: false
      }
    }
    template: {
      containers: [
        {
          name: 'redis'
          image: 'redis:alpine'
          resources: {
            cpu: 1
            memory: '2.0Gi'
          }
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 1
      }
    }
  }
}

resource mysqlApp 'Microsoft.App/containerApps@2025-01-01' = {
  name: '${appName}-mysql'
  location: location
  properties: {
    managedEnvironmentId: containerAppEnv.id
    configuration: {
      ingress: {
        external: true
        targetPort: 3306
        transport: 'tcp'
        allowInsecure: false
      }
    }
    template: {
      containers: [
        {
          name: 'mysql'
          image: 'mysql:8.0'
          resources: {
            cpu: 1
            memory: '2.0Gi'
          }
          env: [
            {
              name: 'MYSQL_ROOT_PASSWORD'
              value: mysqlAdminPassword
            }
            {
              name: 'MYSQL_DATABASE'
              value: 'mytodo'
            }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 1
      }
    }
  }
}

var mysqlDatabaseUrl = 'mysql+pymysql://root:${mysqlAdminPassword}@${mysqlApp.properties.configuration.ingress.fqdn}:3306/'

resource acr 'Microsoft.ContainerRegistry/registries@2023-07-01' existing = {
  name: acrName
}

// resource mysqlApp 'Microsoft.DBforMySQL/flexibleServers@2024-12-30' existing = {
//   name: '${appName}sqlserver'
// }

// resource redisApp 'Microsoft.Cache/redis@2024-11-01' existing = {
//   name: '${namePrefix}-redis'
// }

resource backendApp 'Microsoft.App/containerApps@2025-01-01' = {
  name: '${appName}-backend'
  location: location
  properties: {
    managedEnvironmentId: containerAppEnv.id
    configuration: {
      ingress: {
        external: true
        targetPort: 8000
        transport: 'auto'
        allowInsecure: false
      }
      secrets: [
        {
          name: 'acr-password'
          value: acr.listCredentials().passwords[0].value
        }
      ]
      registries: [
        {
          server: acrLoginServer
          username: acr.listCredentials().username
          passwordSecretRef: 'acr-password'
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'backend'
          image: backendImage
          
          resources: {
            cpu: 1
            memory: '2.0Gi'
          }
          env: [
            {
              name: 'MYSQL_HOST'
              // value: mysqlApp.properties.fullyQualifiedDomainName
              value: mysqlApp.properties.configuration.ingress.fqdn
            }
            {
              name: 'MYSQL_PORT'
              value: '3306'
            }
            {
              name: 'MYSQL_USER'
              value: 'root'
            }
            {
              name: 'MYSQL_PASSWORD'
              value: 'sqlAdminPassword123'
            }
            {
              name: 'DATABASE_NAME'
              value: 'mytodo'
            }
            {
              name: 'REDIS_HOST'
              value: redisApp.name
            }
            {
              name: 'REDIS_PORT'
              value: '6379'
            }
            {
              name: 'SECRET_KEY'
              value: secretKey
            }
            {
              name: 'DATABASE_URL'
              // value: 'mysql+pymysql://sqladminuser:sqlAdminPassword123@${mysqlApp.properties.fullyQualifiedDomainName}:3306/'
              value: mysqlDatabaseUrl
            }
            {
              name: 'REDIS_URL'
              value: 'redis://${redisApp.name}:6379'
            }
            {
              name: 'ALGORITHM'
              value: 'HS256'
            }
            {
              name: 'ACCESS_TOKEN_EXPIRE_MINUTES'
              value: '30'
            }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 3
      }
    }
  }
}

resource frontendApp 'Microsoft.App/containerApps@2025-01-01' = {
  name: '${appName}-frontend'
  location: location
  properties: {
    managedEnvironmentId: containerAppEnv.id
    configuration: {
      ingress: {
        external: true
        targetPort: 3000
        allowInsecure: false
        transport: 'auto'
      }
      secrets: [
        {
          name: 'acr-password'
          value: acr.listCredentials().passwords[0].value
        }
      ]
      registries: [
        {
          server: acrLoginServer
          username: acr.listCredentials().username
          passwordSecretRef: 'acr-password'
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'frontend'
          image: frontendImage
          resources: {
            cpu: 1
            memory: '2.0Gi'
          }
          env: [
            {
              name: 'REACT_APP_BASE_URL'
              value: 'https://${backendApp.properties.configuration.ingress.fqdn}'
            }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 3
      }
    }
  }
}
