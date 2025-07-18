import {
  asyncScheduler,
  asapScheduler,
  observeOn,
  of,
  subscribeOn,
  tap,
} from "rxjs";

const obs$ = of("A", "B", "C").pipe(
  // null 스케줄러
  tap((v) => console.log(v, "데이터 처리 1")),
  tap((v) => console.log(v, "데이터 처리 2")),
  // 이후 작업은 asyncScheduler 스케줄러
  observeOn(asyncScheduler),
  tap((v) => console.log(v, "데이터 처리 3")),
  tap((v) => console.log(v, "데이터 처리 4")),
  // 이후 작업은 asap 스케줄러
  observeOn(asapScheduler),
  tap((v) => console.log(v, "데이터 처리 5")),
  tap((v) => console.log(v, "데이터 처리 6"))
  //   observeOn(asyncScheduler),
  //   subscribeOn(asyncScheduler)
);

console.log("subscribe 전");
setTimeout(() => {
  const start = new Date().getTime();
  console.log("1초 후 subscribe");
  obs$.subscribe((value) => {
    console.log(value);
  });
  const end = new Date().getTime();
  console.log(`subscribe 후 ${end - start}ms`);
}, 1000);

// 기본 스케줄러 사용 시
// subscribe 전
// 1초 후 subscribe
// A 데이터 처리 1
// A 데이터 처리 2
// A 데이터 처리 3
// A 데이터 처리 4
// A
// B 데이터 처리 1
// B 데이터 처리 2
// B 데이터 처리 3
// B 데이터 처리 4
// B
// C 데이터 처리 1
// C 데이터 처리 2
// C 데이터 처리 3
// C 데이터 처리 4
// C
// subscribe 후 1ms

// subscribeOn(asyncScheduler) 사용 시
// subscribe 전
// 1초 후 subscribe
// subscribe 후 0ms
// A 데이터 처리 1
// A 데이터 처리 2
// A 데이터 처리 3
// A 데이터 처리 4
// A
// B 데이터 처리 1
// B 데이터 처리 2
// B 데이터 처리 3
// B 데이터 처리 4
// B
// C 데이터 처리 1
// C 데이터 처리 2
// C 데이터 처리 3
// C 데이터 처
// C

// observeOn(asyncScheduler) 사용 시
// subscribe 전
// 1초 후 subscribe
// subscribe 후 0ms
// A 데이터 처리 1
// A 데이터 처리 2
// A 데이터 처리 3
// A 데이터 처리 4
// B 데이터 처리 1
// B 데이터 처리 2
// B 데이터 처리 3
// B 데이터 처리 4
// C 데이터 처리 1
// C 데이터 처리 2
// C 데이터 처리 3
// C 데이터 처리 4
// subscribe 후 1ms
// A
// B
// C

// observeOn(asyncScheduler), subscribeOn(asyncScheduler) 사용 시
// subscribe 전
// 1초 후 subscribe
// subscribe 후 2ms
// A 데이터 처리 1
// A 데이터 처리 2
// A 데이터 처리 3
// A 데이터 처리 4
// B 데이터 처리 1
// B 데이터 처리 2
// B 데이터 처리 3
// B 데이터 처리 4
// C 데이터 처리 1
// C 데이터 처리 2
// C 데이터 처리 3
// C 데이터 처리 4
// A
// B
// C
