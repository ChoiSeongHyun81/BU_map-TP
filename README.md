   @@@@ 백석대학교 캠퍼스 지도 프로젝트

이 프로젝트는 백석대학교 캠퍼스 지도 웹앱을 구현하기 위한 팀플입니다.
네이버 지도 API를 기반으로 캠퍼스 건물 위치, 좌표, 상세정보 등을 표시합니다.



  @@@@ 기술 스택

구분	사용 기술
프론트엔드	React + TypeScript + Vite
지도	Naver Maps JavaScript API v3
스타일	기본 CSS
버전 관리	GitHub (공유 및 협업용)




  @@@@ 실행 방법 (cmd)

1. 프로젝트 클론 (깃허브에서)

git clone -b (브랜치 버전) https://github.com/ChoiSeongHyun81/BU_map-TP.git


2️. 패키지 설치

npm install


3️. 개발 서버 실행

npm run dev


4️. 브라우저에서 확인
http://localhost:5173

5. 서버 종료

Ctrl + C
  
  
  @@@@ 주요 기능

백석대학교 캠퍼스 중심으로 지도 표시

지도 클릭 시 좌표 확인 가능

건물 핀 클릭 시 상세정보 표시

건물 좌표 복사 기능



src/

components/      # 컴포넌트 폴더

assets/          # 이미지 및 리소스

App.tsx          # 메인 앱 컴포넌트

main.tsx         # 렌더링 진입 파일

buildings.ts     # 캠퍼스 건물 데이터





 @@@@ 환경 변수 (.env)

이 파일은 깃허브에 올리지 않습니다!
각 팀원은 직접 .env 파일을 만들어 아래처럼 설정해야 합니다.

VITE_NAVER_MAP_CLIENT_ID = 클라이언트_ID





 @@@@ 깃허브 명령어 (파일 수정 후 커밋 & 푸시 방법)

깃허브 명령어 (파일 수정 후 커밋 & 푸시 방법)

1. 현재 폴더가 올바른지 확인
cd C:\Users\pigpi\Desktop\MAP (본인 경로 확인, MAP인지가 중요!)

2. 변경된 파일 확인  (빨간색으로 보임)
git status

3. 변경된 파일 추가  (예시 README.md)
git add README.md

4. 커밋 메시지 작성
git commit -m "README 내용 수정 (프로젝트 설명 추가)"

5. 깃허브로 푸시
git push origin main



 @@@@ 참고 문서

네이버 지도 API 문서
