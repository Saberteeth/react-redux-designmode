import Rx from "rxjs";

export class Active {
  /**
   * @param {function(Rx.Subject):void} rule 
   */
  constructor(rule) {
    this.init(rule.bind(this));
  }

  init(rule) {
    this._subject = new Rx.Subject();
    rule(this._subject);
  }

  insert() {
    return e => {
      this.next(e);
    };
  }

  next(e) {
    this._subject.next(e);
  }

  get subject() {
    return this._subject;
  }
}

export class Event {
  /**
   * @param {function(Rx.Observer):void} fun 
   */
  constructor(fun) {
    this._observable = Rx.Observable.create(fun);
  }

  /**
   * @param {function(Rx.Observable):Rx.Observable} fun 
   * @param {any} subRin 
   */

  getAction(fun, handler) {
    return (...events) => {
      const observable = fun(
        this._observable.map(nextEvent => {
          return { ...events, nextEvent };
        })
      );

      if (observable && handler) {
        observable.subscribe(handler);
      }
    };
  }
}

export default Active;
