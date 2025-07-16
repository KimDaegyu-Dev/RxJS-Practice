import { filter, from } from "rxjs";

const user$ = from([
  {
    name: "유비",
    birthYear: 161,
    nationality: "촉",
  },
  {
    name: "관우",
    birthYear: 162,
    nationality: "촉",
  },
  {
    name: "손권",
    birthYear: 182,
    nationality: "오",
  },
  {
    name: "조조",
    birthYear: 155,
    nationality: "위",
  },
]).pipe(filter((user) => user.nationality === "촉"));

const observer = (user: {
  name: string;
  birthYear: number;
  nationality: string;
}) => {
  console.log(user);
};

user$.subscribe(observer);
