import {
  animationFrameScheduler,
  concat,
  interval,
  map,
  takeWhile,
  of,
  defer,
} from "rxjs";

function animation(from: number, to: number, duration: number) {
  return defer(() => {
    const scheduler = animationFrameScheduler;
    const start = scheduler.now();
    const DURATION = duration;
    let animation$ = interval(0, scheduler).pipe(
      map(() => (scheduler.now() - start) / DURATION),
      takeWhile((progress) => progress <= 1)
    );
    animation$ = concat(animation$, of(1)).pipe(
      map((rate) => from + (to - from) * rate)
    );
    return animation$;
  });
}

const animation$ = animation(100, 500, 1000);
setTimeout(() => {
  animation$.subscribe((progress) => {
    console.log(progress);
  });
}, 500);
