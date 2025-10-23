param location string
param appServicePlanName string
param skuName string
param appServiceKind string

resource appServicePlan 'Microsoft.Web/serverfarms@2024-11-01' = {
  name: appServicePlanName
  location: location
  properties: {
    reserved: true
  }
  sku: {
    name: skuName
  }
  kind: appServiceKind
}

output appServicePlanId string = appServicePlan.id
