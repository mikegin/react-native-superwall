import Foundation
import SuperwallKit

extension RedemptionResult {
  func toJson() -> [String: Any] {
    switch self {
    case let .success(code, redemptionInfo):
      return [
        "status": "success",
        "code": code,
        "redemptionInfo": redemptionInfo.toJson()
      ]

    case let .error(code, error):
      return [
        "status": "error",
        "code": code,
        "error": error.toJson()
      ]

    case let .expiredCode(code, info):
      return [
        "status": "codeExpired",
        "code": code,
        "expired": info.toJson()
      ]

    case let .invalidCode(code):
      return [
        "status": "invalidCode",
        "code": code
      ]

    case let .expiredSubscription(code, redemptionInfo):
      return [
        "status": "expiredSubscription",
        "code": code,
        "redemptionInfo": redemptionInfo.toJson()
      ]
    }
  }
}

extension RedemptionResult.RedemptionInfo {
  func toJson() -> [String: Any] {
    return [
      "ownership": ownership.toJson(),
      "purchaserInfo": purchaserInfo.toJson(),
      "paywallInfo": paywallInfo?.toJson() as Any,
      "entitlements": Array(entitlements.map { $0.toJson() })
    ]
  }
}

extension RedemptionResult.RedemptionInfo.Ownership {
  func toJson() -> [String: Any] {
    switch self {
    case .appUser(let id):
      return ["type": "APP_USER", "appUserId": id]
    case .device(let id):
      return ["type": "DEVICE", "deviceId": id]
    }
  }
}

extension RedemptionResult.RedemptionInfo.PurchaserInfo {
  func toJson() -> [String: Any] {
    return [
      "appUserId": appUserId,
      "email": email as Any,
      "storeIdentifiers": storeIdentifiers.toJson()
    ]
  }
}

extension RedemptionResult.RedemptionInfo.PurchaserInfo.StoreIdentifiers {
  func toJson() -> [String: Any] {
    switch self {
    case let .stripe(customerId, subscriptionIds):
      return [
        "store": "STRIPE",
        "stripeCustomerId": customerId,
        "stripeSubscriptionIds": subscriptionIds
      ]
    case let .unknown(store, info):
      return [
        "store": store,
        "additionalInfo": info
      ]
    }
  }
}

extension RedemptionResult.RedemptionInfo.PaywallInfo {
  func toJson() -> [String: Any] {
    return [
      "identifier": identifier,
      "placementName": placementName,
      "placementParams": placementParams,
      "variantId": variantId,
      "experimentId": experimentId
    ]
  }
}

extension RedemptionResult.ErrorInfo {
  func toJson() -> [String: Any] {
    return ["message": message]
  }
}

extension RedemptionResult.ExpiredCodeInfo {
  func toJson() -> [String: Any] {
    return [
      "resent": resent,
      "obfuscatedEmail": obfuscatedEmail as Any
    ]
  }
}
