export type Building = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  desc?: string;
  image?: string;
  address?: string;
  category?: string;
  openingHours?: string;
  website?: string;
};

//건물별로 id 겹치지 않게 수정 + 내용추가(조사? 필요)
//현재 내용 추가 안된 건물들 상세정보 누를시 기본정보로 나오는데, 내용 추가하면 변경사항 적용됩니다.
export const buildings: Building[] = [
  {
    id: 'jihae',
    name: '지혜관',
    lat: 36.8386952,
    lng: 127.1843804,
    desc: '지혜관이다',
    address: "충남 천안시 동남구 백석대학로 1",
    category: "학교 건물",
    openingHours: "08:00 ~ 22:00",
    website: "https://www.bu.ac.kr",
  },
  {
    id: 'baekseokHall',
    name: '백석홀',
    lat: 36.8394851,
    lng: 127.1826048,
    desc: '공연/행사 공간',
    address: "충남 천안시 동남구 백석대학로 1",
    category: "대형 건물",
    openingHours: "08:00 ~ 22:00",
    website: "https://www.bu.ac.kr",
  },
  {
    id: '1',
    name: '인성관',
    lat: 36.839395,
    lng: 127.1835919,
    desc: '인성관이다',
  },
  {
    id: '2',
    name: '자유관',
    lat: 36.8384719,
    lng: 127.1832593,
    desc: '자유관이다',
  },
  {
    id: '3',
    name: '본부동',
    lat: 36.8393392,
    lng: 127.1860005,
    desc: '본부동이다',
  },
  {
    id: '4',
    name: '스포츠센터',
    lat: 36.8381285,
    lng: 127.1854801,
    desc: '스포츠센터다',
  },
  {
    id: 'baekseoksaenghwal',
    name: '백석생활관',
    lat: 36.8424531,
    lng: 127.1851439,
    desc: '예시',
  },
  {
    id: '5',
    name: '승리관',
    lat: 36.8417061,
    lng: 127.185852,
    desc: '예시',
  },
  {
    id: '6',
    name: '체육관',
    lat: 36.8414098,
    lng: 127.1873594,
    desc: '예시',
  },
  {
    id: '7',
    name: '조형관',
    lat: 36.8408818,
    lng: 127.1883948,
    desc: '예시',
  },
  {
    id: '8',
    name: '목양관',
    lat: 36.8408474,
    lng: 127.1837116,
    desc: '예시',
  },
  {
    id: '9',
    name: '학생복지관',
    lat: 36.8405813,
    lng: 127.1825368,
    desc: '예시',
  },
  {
    id: 'jinri',
    name: '진리관',
    lat: 36.8401262,
    lng: 127.184586,
    desc: '예시',
  },
  {
    id: 'music',
    name: '음악관',
    lat: 36.8400961,
    lng: 127.1853639,
    desc: '예시',
  },
  {
    id: '10',
    name: '교수회관',
    lat: 36.8396368,
    lng: 127.1848757,
    desc: '예시',
  },
  {
    id: '11',
    name: '은혜관',
    lat: 36.8385978,
    lng: 127.1820058,
    desc: '예시',
  },
  {
    id: '12',
    name: '창조관',
    lat: 36.8374042,
    lng: 127.1824295,
    desc: '예시',
  },
  {
    id: '13',
    name: '백석학술정보관',
    lat: 36.8377434,
    lng: 127.184012,
    desc: '예시',
  },
  {
    id: '14',
    name: '예술대학동',
    lat: 36.838718,
    lng: 127.187515,
    desc: '예시',
  },
  {
    id: '15',
    name: '글로벌 외식산업관',
    lat: 36.8374802,
    lng: 127.185143,
    desc: '예시',
  },
];
