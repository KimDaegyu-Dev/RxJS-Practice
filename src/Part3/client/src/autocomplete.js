import {
  debounceTime,
  partition,
  distinctUntilChanged,
  fromEvent,
  map,
  retry,
  share,
  switchMap,
  tap,
  finalize,
  merge,
} from "rxjs";
import { ajax } from "rxjs/ajax";

export default class AutoComplete {
  constructor($autocomplete) {
    this.$input = $autocomplete.querySelector("input");
    this.$layer = $autocomplete.querySelector(".layer");
    this.$loading = $autocomplete.querySelector(".loading");
    let [search$, reset$] = partition(
      this.createKeyup$(),
      (query) => query.trim().length > 0
    );
    search$ = search$.pipe(
      tap(this.showLoading()),
      switchMap((query) => ajax.getJSON(`http://localhost:3002/bus/${query}`)),
      tap((data) => console.log(data)),
      map((data) => data.busRouteList),
      retry(2),
      tap(this.hideLoading()),
      finalize(() => this.reset())
    );
    search$.subscribe((items) => this.render(items));
    reset$ = merge(
      reset$,
      fromEvent(this.$layer, "click").pipe(
        map((evt) => evt.target.closest("li")),
        // li가 아닌 곳을 클릭하면 null이므로 필터링
        // li를 클릭한 경우에만 reset 트리거
        // filter(Boolean) 대신 아래처럼 사용
        switchMap((li) => (li ? [li] : []))
      )
    );
    reset$.subscribe(() => this.reset());
  }
  showLoading() {
    this.$loading.style.display = "block";
  }
  hideLoading() {
    this.$loading.style.display = "none";
  }
  reset() {
    this.hideLoading();
    this.$layer.style.display = "none";
  }
  render(buses) {
    this.$layer.innerHTML = buses
      .map((bus) => {
        return `<li><a href="#">
        <strong>${bus.routeName}</strong>
      <span>${bus.regionName}</span>
      <div>${bus.routeTypeName}</div>
      </a></li>`;
      })
      .join("");
    this.$layer.style.display = "block";
  }
  createKeyup$() {
    return fromEvent(this.$input, "keyup").pipe(
      debounceTime(300),
      map((event) => event.target.value),
      distinctUntilChanged(),
      share()
    );
  }
}
