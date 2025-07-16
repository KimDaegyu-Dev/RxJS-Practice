import { fromEvent, map, Observable, pluck } from "rxjs";

const currentTarget$ = fromEvent(document.getElementById("app")!, "click").pipe(
  //   pluck("currentTarget"), deprecated
  map((event: Event) => event.currentTarget)
);

const observer = (currentTarget: EventTarget | null) => {
  console.log(currentTarget);
};

currentTarget$.subscribe(observer);
