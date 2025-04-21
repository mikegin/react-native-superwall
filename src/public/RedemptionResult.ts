/**
 * The result of redeeming a code via web checkout.
 */
export type RedemptionResult =
  | RedemptionResult.Success
  | RedemptionResult.Error
  | RedemptionResult.ExpiredCode
  | RedemptionResult.InvalidCode
  | RedemptionResult.ExpiredSubscription;

export namespace RedemptionResult {
  export type Success = {
    status: 'success';
    code: string;
    redemptionInfo: RedemptionInfo;
  };

  export type Error = {
    status: 'error';
    code: string;
    error: ErrorInfo;
  };

  export type ExpiredCode = {
    status: 'codeExpired';
    code: string;
    expired: ExpiredCodeInfo;
  };

  export type InvalidCode = {
    status: 'invalidCode';
    code: string;
  };

  export type ExpiredSubscription = {
    status: 'expiredSubscription';
    code: string;
    redemptionInfo: RedemptionInfo;
  };

  /**
   * Information about the redemption.
   */
  export interface RedemptionInfo {
    ownership: Ownership;
    purchaserInfo: PurchaserInfo;
    paywallInfo?: PaywallInfo;
    entitlements: Entitlement[];
    [key: string]: any;
  }

  export type Ownership =
    | {
        type: 'APP_USER';
        appUserId: string;
      }
    | {
        type: 'DEVICE';
        deviceId: string;
      };

  export interface PurchaserInfo {
    appUserId: string;
    email?: string;
    storeIdentifiers: StoreIdentifiers;
  }

  export type StoreIdentifiers =
    | {
        store: 'STRIPE';
        stripeCustomerId: string;
        stripeSubscriptionIds: string[];
      }
    | {
        store: string;
        [key: string]: any;
      };

  export interface PaywallInfo {
    identifier: string;
    placementName: string;
    placementParams: Record<string, any>;
    variantId: string;
    experimentId: string;
  }

  export interface Entitlement {
    id: string;
    type: any;
  }

  export interface ErrorInfo {
    message?: string;
    [key: string]: any;
  }

  export interface ExpiredCodeInfo {
    resent: boolean;
    obfuscatedEmail?: string;
    [key: string]: any;
  }

  // Constructors
  export function Success(
    code: string,
    redemptionInfo: RedemptionInfo
  ): Success {
    return {
      status: 'success',
      code,
      redemptionInfo,
    };
  }

  export function Error(code: string, error: ErrorInfo): Error {
    return {
      status: 'error',
      code,
      error,
    };
  }

  export function ExpiredCode(
    code: string,
    expired: ExpiredCodeInfo
  ): ExpiredCode {
    return {
      status: 'codeExpired',
      code,
      expired,
    };
  }

  export function InvalidCode(code: string): InvalidCode {
    return {
      status: 'invalidCode',
      code,
    };
  }

  export function ExpiredSubscription(
    code: string,
    redemptionInfo: RedemptionInfo
  ): ExpiredSubscription {
    return {
      status: 'expiredSubscription',
      code,
      redemptionInfo,
    };
  }

  // Parsers
  export function fromJson(json: any): RedemptionResult {
    if (!json || typeof json !== 'object') return InvalidCode('');

    const { status, code } = json;

    switch (status) {
      case 'success':
        return Success(code, json.redemptionInfo || {});
      case 'error':
        return Error(code, json.error || {});
      case 'codeExpired':
        return ExpiredCode(code, json.expired || {});
      case 'expiredSubscription':
        return ExpiredSubscription(code, json.redemptionInfo || {});
      case 'invalidCode':
      default:
        return InvalidCode(code || '');
    }
  }

  export function toJson(result: RedemptionResult): any {
    switch (result.status) {
      case 'success':
        return {
          status: result.status,
          code: result.code,
          redemptionInfo: result.redemptionInfo,
        };
      case 'error':
        return {
          status: result.status,
          code: result.code,
          error: result.error,
        };
      case 'codeExpired':
        return {
          status: result.status,
          code: result.code,
          expired: result.expired,
        };
      case 'expiredSubscription':
        return {
          status: result.status,
          code: result.code,
          redemptionInfo: result.redemptionInfo,
        };
      case 'invalidCode':
        return {
          status: result.status,
          code: result.code,
        };
    }
  }

  export function getStripeSubscriptionIds(
    result: RedemptionResult
  ): string[] | undefined {
    switch (result.status) {
      case 'success':
      case 'expiredSubscription':
        const storeIdentifiers = result.redemptionInfo.storeIdentifiers;
        if (storeIdentifiers.store === 'STRIPE') {
          return storeIdentifiers.stripeSubscriptionIds;
        }
        return undefined;
      default:
        return undefined;
    }
  }

  export function getCode(result: RedemptionResult): string {
    return result.code;
  }
}
