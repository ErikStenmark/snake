import { EventPayloadType, EventTopics } from '../events';

export type TopicSubscriptionHandler<T extends EventTopics> = (payload: EventPayloadType<T>) => void;

export interface IPubSub {
  broadcast<T extends EventTopics>(payload: EventPayloadType<T>): void;
  subscribe<T extends EventTopics>(topic: T, handler: TopicSubscriptionHandler<T>): symbol;
  unsubscribe(subscriptionSymbol: symbol): void;
}

type TopicItem = {
  handler: TopicSubscriptionHandler<any>;
  subscriptionSymbol: symbol;
}

export default class PubSub implements IPubSub {

  private topics: { [key: string]: TopicItem[] } = {};
  public broadcast<T extends EventTopics>(payload: EventPayloadType<T>): void {
    const topicItems = this.topics[payload.topic] || [];

    topicItems.forEach(async (topicItem) => {
      topicItem.handler({ ...payload });
    });
  }

  public subscribe<T extends EventTopics>(topic: T, handler: TopicSubscriptionHandler<T>): symbol {
    const topicUpper = topic.toLocaleUpperCase();
    const subscriptionSymbol = Symbol();

    if (!this.topics[topicUpper]) {
      this.topics[topicUpper] = [];
    }

    this.topics[topicUpper].push({
      subscriptionSymbol,
      handler
    });

    return subscriptionSymbol;
  }

  public unsubscribe(subscriptionSymbol: symbol): void {
    for (const topicKey of Object.keys(this.topics)) {
      const topicItems = this.topics[topicKey];

      for (let i = 0; i < topicItems.length; i++) {
        if (topicItems[i].subscriptionSymbol === subscriptionSymbol) {
          topicItems.splice(i, 1);
          return;
        }
      }
    }
  }

}