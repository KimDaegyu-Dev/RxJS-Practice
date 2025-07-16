import { EMPTY, map, mergeMap, NEVER, of, throwError } from "rxjs";

of(1, -2, 3)
  .pipe(map((x) => (x < 0 ? NEVER : x)))
  .subscribe({
    next: (v) => console.log(v),
    error: (e) => console.log(e),
    complete: () => console.log("complete"),
  });
