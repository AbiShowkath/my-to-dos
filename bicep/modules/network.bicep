param location string
param virtualNetworkName string
param infraSubnetName string
param networkSecurityGroupName string
param addressPrefix string
param infraSubnetAddressPrefix string

resource networkSecurityGroup 'Microsoft.Network/networkSecurityGroups@2023-09-01' = {
  name: networkSecurityGroupName
  location: location
  properties: {
    securityRules: [
      {
        name: 'SSH'
        properties: {
          priority: 1000
          protocol: 'Tcp'
          access: 'Allow'
          direction: 'Inbound'
          sourceAddressPrefix: '*'
          sourcePortRange: '*'
          destinationAddressPrefix: '*'
          destinationPortRange: '22'
        }
      }
    ]
  }
}

resource virtualNetwork 'Microsoft.Network/virtualNetworks@2023-09-01' = {
  name: virtualNetworkName
  location: location
  properties: {
    addressSpace: {
      addressPrefixes: [
        addressPrefix
      ]
    }
    subnets: [
      {
        name: infraSubnetName
        properties: {
          addressPrefix: infraSubnetAddressPrefix
          delegations: [
            {
              name: 'delegation'
              properties: {
                serviceName: 'Microsoft.App/environments'
              }
            }
          ]
        }
      }
    ]
  }
}

output virtualNetworkId string = virtualNetwork.id
output networkSecurityGroupId string = networkSecurityGroup.id
output networkSubnetId string = virtualNetwork.properties.subnets[0].id
output infraSubnetId string = resourceId('Microsoft.Network/virtualNetworks/subnets', virtualNetworkName, infraSubnetName)
