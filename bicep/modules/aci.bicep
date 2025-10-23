@description('Container Group name.')
param containerGroupName string = 'myContainerGroup'

var container1name = 'aci-tutorial-app'
var container1image = 'mcr.microsoft.com/azuredocs/aci-helloworld:latest'
var container2name = 'aci-tutorial-sidecar'
var container2image = 'mcr.microsoft.com/azuredocs/aci-tutorial-sidecar'

resource containerGroup 'Microsoft.ContainerInstance/containerGroups@2023-05-01' = {
  name: containerGroupName
  location: resourceGroup().location
  properties: {
    containers: [
      {
        name: container1name
        properties: {
          image: container1image
          resources: {
            requests: {
              cpu: 1
              memoryInGB: 1
            }
          }
          ports: [
            {
              port: 80
            }
            {
              port: 8080
            }
          ]
        }
      }
      {
        name: container2name
        properties: {
          image: container2image
          resources: {
            requests: {
              cpu: 1
              memoryInGB: 1
            }
          }
        }
      }
    ]
    osType: 'Linux'
    ipAddress: {
      type: 'Public'
      ports: [
        {
          protocol: 'tcp'
          port: 80
        }
        {
          protocol: 'tcp'
          port: 8080
        }
      ]
    }
  }
}

// output containerIPv4Address string = containerGroup.properties.ipAddress.ip
