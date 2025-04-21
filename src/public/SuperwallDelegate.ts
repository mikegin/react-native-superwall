import { PaywallInfo } from './PaywallInfo';
import { SubscriptionStatus } from './SubscriptionStatus';
import { SuperwallEventInfo } from './SuperwallEventInfo';
import { RedemptionResult } from './RedemptionResult';

export abstract class SuperwallDelegate {
  abstract subscriptionStatusDidChange(
    from: SubscriptionStatus,
    to: SubscriptionStatus
  ): void;
  abstract handleSuperwallEvent(eventInfo: SuperwallEventInfo): void;
  abstract handleCustomPaywallAction(name: string): void;
  abstract willDismissPaywall(paywallInfo: PaywallInfo): void;
  abstract willPresentPaywall(paywallInfo: PaywallInfo): void;
  abstract didDismissPaywall(paywallInfo: PaywallInfo): void;
  abstract didPresentPaywall(paywallInfo: PaywallInfo): void;
  abstract paywallWillOpenURL(url: URL): void;
  abstract paywallWillOpenDeepLink(url: URL): void;
  abstract didRedeemLink(result: RedemptionResult): void;
  abstract willRedeemLink(): void;
  abstract handleLog(
    level: string,
    scope: string,
    message?: string,
    info?: Map<string, any>,
    error?: string
  ): void;
}
