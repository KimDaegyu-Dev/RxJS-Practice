import { Observable } from "rxjs";

const numbers$ = new Observable((subcriber) => {
  try {
    subcriber.next(1);
    subcriber.next(2);
    subcriber.next(3);
    // subcriber.complete();
    throw new Error("error");
  } catch (error) {
    subcriber.error(error);
  } finally {
    //subscriber.next()는 값을 전송합니다.
    // subscriber.error()가 호출되면 스트림은 즉시 종료되고, 이후의 모든 next, error, complete 호출은 무시됩니다.
    // subscriber.complete()는 정상 종료 시 호출됩니다.
    //subscriber.error(...)가 호출된 이후에는 subscriber.complete()는 무시됩니다.
    // finally는 에러가 발생하더라도 실행되지만, 에러가 발생하면 종료되기 때문에 에러가 발생하면 실행되지 않습니다.

    subcriber.complete();
  }
});

numbers$.subscribe({
  next: (number) => {
    console.log(number);
  },
  error: (error) => {
    console.log(error);
  },
  complete: () => {
    console.log("complete");
  },
});
