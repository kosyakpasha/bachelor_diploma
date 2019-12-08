class EventBus {
  constructor() {
    this.eventCallbacksPairs = [];
  }

  subscribe( eventType, callback ) {
    const eventCallbacksPair = this.findEventCallbacksPair(eventType);

    if (eventCallbacksPair) {
      eventCallbacksPair.callbacks.push(callback);
    } else {
      this.eventCallbacksPairs.push(new EventCallbacksPair(eventType, callback));
    }
  }

  post( eventType, args ) {
    const eventCallbacksPair = this.findEventCallbacksPair(eventType);

    if(!eventCallbacksPair) {
      console.error('no subscribers for event ' + eventType);
      return;
    }

    eventCallbacksPair.callbacks.forEach( callback => callback(args) );
  }

  findEventCallbacksPair(eventType) {
    return this.eventCallbacksPairs.find( eventObject => eventObject.eventType === eventType );
  }
}

class EventCallbacksPair {
  constructor( eventType, callback ) {
    this.eventType = eventType;
    this.callbacks = [callback];
  }
}
 
export const eventBus = new EventBus();


