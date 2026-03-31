import { Book } from "./types";

export const MOCK_BOOKS: Book[] = [
  {
    id: "1",
    title: "속삭이는 버드나무",
    author: "사라 젠킨스",
    coverUrl: "https://picsum.photos/seed/willow/800/1200",
    description: "마음으로 듣는 이들에게 이야기를 들려주는 마법의 나무예요. 고대 숲 한복판에 다른 어떤 나무와도 다른 나무가 서 있었어요. 그 잎사귀는 부드러운 은빛으로 반짝였고, 가지는 별을 향해 뻗어 있는 것 같았어요.",
    category: "전래동화",
    likes: 1240,
    length: "24 페이지",
    language: "한국어",
    format: "디지털 + 양장본",
    rating: 4.9,
    pages: [
      {
        id: "p1",
        pageNumber: 1,
        text: "옛날 옛적, 바람이 비밀을 노래하는 숲에 말을 할 수 있는 버드나무가 살고 있었어요. 하지만 그 나무는 우리처럼 말로 하지 않았어요. 잎사귀의 바스락거림과 가지의 흔들림으로 이야기했죠.",
        imageUrl: "https://picsum.photos/seed/willow1/1200/800"
      },
      {
        id: "p2",
        pageNumber: 2,
        text: "어린 레오만이 버드나무의 속삭임을 들을 수 있었어요. 매일 오후, 레오는 나무 그늘 아래 앉아 고대 용과 잊혀진 왕국에 대한 이야기를 듣곤 했어요.",
        imageUrl: "https://picsum.photos/seed/willow2/1200/800"
      }
    ],
    reviews: [
      {
        id: "r1",
        user: "에밀리 왓슨",
        avatar: "https://i.pravatar.cc/150?u=emily",
        rating: 5,
        comment: "우리 딸이 이 이야기를 정말 좋아해요! 일러스트가 정말 숨이 막힐 정도로 아름다워요.",
        date: "2일 전"
      }
    ]
  },
  {
    id: "2",
    title: "우주 고양이들",
    author: "레오 스타 박사",
    coverUrl: "https://picsum.photos/seed/space/800/1200",
    description: "세 마리의 모험심 강한 고양이들이 궁극의 실타래를 찾아 은하계를 여행해요.",
    category: "공상과학",
    likes: 856,
    length: "18 페이지",
    language: "한국어",
    format: "디지털",
    rating: 4.7,
    pages: [],
    reviews: []
  },
  {
    id: "3",
    title: "황금 나침반",
    author: "필립 풀먼",
    coverUrl: "https://picsum.photos/seed/compass/800/1200",
    description: "친구를 구하고 '더스트'에 대한 진실을 발견하기 위해 얼어붙은 북쪽으로 떠나는 여정이에요.",
    category: "모험",
    likes: 3421,
    length: "32 페이지",
    language: "한국어",
    format: "디지털 + 양장본",
    rating: 5.0,
    pages: [],
    reviews: []
  }
];

export const CATEGORIES = ["전체", "전래동화", "공상과학", "모험", "교육", "미스터리"];
export const STYLES = [
  { id: 'watercolor', name: '마법 수채화', description: '부드럽고 몽환적이며 유기적인 느낌' },
  { id: 'oil', name: '클래식 유화', description: '풍부한 질감과 깊은 색감' },
  { id: 'sketch', name: '연필 스케치', description: '손으로 그린 듯한 따뜻함과 디테일' },
  { id: '3d', name: '모던 3D', description: '생동감 넘치고 영화 같은 느낌' },
  { id: 'anime', name: '애니메이션', description: '역동적이고 표현력이 풍부한 스타일' }
];
