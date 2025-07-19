import {
  merge,
  fromEvent,
  share,
  tap,
  switchMap,
  map,
  partition,
  first,
  Observable,
} from "rxjs";
import { ajax } from "rxjs/ajax";

export function parseHash() {
  //routeId_routeName
  // 버스ㅡ노선ID_버스번호
  const [routeId, routeNum] = location.hash.slice(1).split("_");
  return { routeId, routeNum };
}

export function createShare$() {
  const changedHash$ = merge(
    fromEvent(window, "load"),
    fromEvent(window, "hashchange")
  ).pipe(map(parseHash), share());

  let [render$, search$] = partition(changedHash$, (hash) => hash.routeId);
  render$ = render$.pipe(
    switchMap(({ routeId }) =>
      ajax.getJSON(`http://localhost:3002/station/pass/${routeId}`)
    ),
    handleAjax("busRouteStationList")
  );
  return { render$, search$: search$.pipe(geolocation) };
}
function handleAjax(key) {
  return tap((data) => {
    console.log(data[key]);
  });
}

function geolocation() {
  const defaultPosition = {
    coords: {
      longitude: 127.028611,
      latitude: 37.498056,
    },
  };

  return new Observable((observer) => {
    if (navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          // 위치 정보
        },
        (error) => {
          // 위치 정보 오류
        },
        {
          timeout: 1000,
        }
      );
    } else {
      observer.next(defaultPosition);
    }
  }).pipe(
    map((position) => position.coords),
    first()
  );
}
