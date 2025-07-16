import { Observable } from "rxjs";

const interval$ = new Observable((subscriber) => {
  const interval = setInterval(() => {
    subscriber.next(new Date());
  }, 1000);
  return () => clearInterval(interval);
});

const subscription = interval$.subscribe((date) => {
  console.log(date);
});

setTimeout(() => {
  subscription.unsubscribe();
}, 5000);
