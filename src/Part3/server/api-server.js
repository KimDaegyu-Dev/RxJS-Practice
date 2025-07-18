import { from, switchMap, map, take } from "rxjs";
import express from "express";
import x2j from "xml2json-light";
import cors from "cors";

const app = express();

/*
 * 공공데이터포털 인증키
 * (별도의 인증키로 교체가 필요한 경우 SERVICE_KEY를 수정하셔서 사용하시면 됩니다)
 *
 * 사용가능한 서비스:
 *  - [정류소조회서비스 조회 (경기도)](https://www.data.go.kr/dataset/15000424/openapi.do)
 *  - [버스노선 조회 (경기도)](https://www.data.go.kr/dataset/15000430/openapi.do)
 */
const SERVICE_KEY =
  "aBCeE33mjmqEhr%2F2mSYiVTzbvscZ7pIVretDFwq6tGRTMY3ovfshg6OYTPGUgFHPfAwsHRF%2Bn7Pm4%2FRlE3Y%2BWQ%3D%3D";

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.static("./"));

function createRemote$(url) {
  return from(fetch(url)).pipe(
    switchMap((response) => response.text()),
    map((text) => {
      const response = JSON.parse(text).response;
      const header = response.msgHeader;
      if (header.resultCode === 0) {
        console.log(response.msgBody);
        return response.msgBody;
      } else {
        return new Error({
          code: header.resultCode,
          messge: header.resultMessage,
        });
      }
    }),
    take(1)
  );
}

const regexp = /:(\w+)/gi;
const routes = {
  // [버스노선 조회 (경기도)]
  // 노선번호목록조회: 해당 노선번호의 노선ID, 노선유형, 운행지역 등을 제공한다.
  // http://localhost:3000/bus/15 버스번호(routeName)로 버스 리스트 조회 (자동완성)
  "/bus/:keyword": {
    url: "https://apis.data.go.kr/6410000/busrouteservice/v2/getBusRouteListv2",
  },
  // [정류소조회서비스 (경기도)]
  // 정류소경유노선목록조회: 해당 정류소를 경유하는 모든 노선정보(노선번호, ID, 유형, 운행지역 등)를 제공한다.
  // http://localhost:3000/bus/pass/station/231000300 버스정류소(stationId)를 거쳐가는 버스번호(routeName) 리스트 조회
  "/bus/pass/station/:stationId": {
    url: "https://apis.data.go.kr/6410000/busstationservice/v2/getBusStationViaRouteListv2",
  },
  // [버스노선 조회 (경기도)]
  // 경유정류소목록조회: 해당 노선이 정차하는 경유정류소 목록과 정류소명, 중앙차로여부, 회차점, 좌표값 등을 제공한다.
  // http://localhost:3000/station/pass/231000029 버스 노선(routeId)으로 정류소 리스트 조회
  "/station/pass/:routeId": {
    url: "https://apis.data.go.kr/6410000/busrouteservice/v2/getBusRouteStationListv2",
  },
  // [정류소조회서비스 (경기도)]
  // 주변정류소목록조회: 위치 좌표(WGS84) 변경 200m내에 있는 정류소 목록(정류소명, ID, 정류소번호, 좌표값, 중양차로여부 등)를 제공한다.
  // http://localhost:3000/station/around/127.10989/37.03808 위치좌표 주변 정류소 리스트 조회
  "/station/around/:x/:y": {
    url: "https://apis.data.go.kr/6410000/busstationservice/v2/getBusStationAroundListv2",
  },
};

Object.keys(routes).forEach((path) => {
  app.get(path, function (req, res) {
    let match;
    let param;
    const params = [];
    while ((match = regexp.exec(path))) {
      param = match[1];
      params.push(`&${param}=${req.params[param]}`);
    }
    createRemote$(
      routes[path].url +
        `?serviceKey=${SERVICE_KEY}${params.join("")}&format=json`
    ).subscribe((data) => res.json(data));
  });
});

app.listen(3002, function () {
  console.log("Server listening on port 3002!");
});
