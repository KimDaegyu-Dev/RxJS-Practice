import { Observable } from "rxjs";

const observable = new Observable((subscriber: any) => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
});

observable.subscribe((value: any) => {
  console.log(value);
});
