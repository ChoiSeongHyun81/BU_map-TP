import { useEffect, useMemo, useRef, useState } from "react";
import { buildings, type Building } from "./buildings";
import PlaceDetail from "./components/PlaceDetail";

declare global {
  interface Window {
    naver: any;
    navermap_authFailure?: () => void;
  }
}
type LatLng = { lat: number; lng: number };

//초기 위치 고정, 경계, 줌 제한
const INIT: LatLng = { lat: 36.8401262, lng: 127.184586 };
const BOUNDS_SW: LatLng = { lat: 36.8335, lng: 127.1800 };
const BOUNDS_NE: LatLng = { lat: 36.8428, lng: 127.1888 };
const MIN_ZOOM = 16;
const MAX_ZOOM = 20;
const SIDEBAR_W = 360 as const;

export default function App() {
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoRefs = useRef<any[]>([]);
  const tempMarkerRef = useRef<any | null>(null);

  // 공통함수 추가했습니다. (성현)
  const closeAllInfo = () => {
    infoRefs.current.forEach((i) => i.close());
  };

  const registerDetailButtonClick = (btnId: string, buildingId: Building["id"]) => {
    //지도와 지도 객체가 준비가 되어있을때
    const { naver } = window;
    const map = mapRef.current;
    if (!naver || !map) return;                     // 둘중 하나라도 준비 안될시 종료

    naver.maps.Event.once(map, "idle", () => {
      const btn = document.getElementById(btnId);   //버튼찾기
      if (!btn) return;                             //버튼 없으면 그대로 종료

      
      btn.onclick = (e) => {
        e.stopPropagation();

        //새창에서 상세정보 페이지 열기
        window.open(`${window.location.origin}/#/detail/${buildingId}`, "_blank");
      };
    });
  };

  if (location.pathname.startsWith("/detail")) {
    return null;  // 새 창(detail 페이지)에서는 지도 렌더링 안 함
  }

  // 좌표 찍기
  const [clicked, setClicked] = useState<LatLng | null>(null);

  // 검색/선택/패널 모드
  const [q, setQ] = useState("");
  const [activeIdx, setActiveIdx] = useState(-1);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [panelMode, setPanelMode] = useState<"list" | "detail">("list"); // ← 하나의 패널 모드

  //검색 캐싱
  const results = useMemo(() => {
    const kw = q.trim().toLowerCase();
    if (!kw) return [];
    return buildings
      .map((b, i) => ({ b, i }))
      .filter(({ b }) => {
        const bag = [
          b.name,
          b.desc ?? "",
          b.address ?? "",
          b.category ?? "",
          b.openingHours ?? "",
          b.website ?? "",
        ]
          .join(" ")
          .toLowerCase();
        return bag.includes(kw);
      })
      .slice(0, 12);
  }, [q]);

  useEffect(() => {
    const { naver } = window;
    if (!naver || !mapDivRef.current) return;

    //지도 생성
    const map = new naver.maps.Map(mapDivRef.current, {
      center: new naver.maps.LatLng(INIT.lat, INIT.lng),
      zoom: 18,
      mapTypeControl: true,
      zoomControl: true,
      zoomControlOptions: { position: naver.maps.Position.RIGHT_CENTER },
      scaleControl: true,
    });
    mapRef.current = map;

    const openInfo = (idx: number) => {
      infoRefs.current.forEach((inf, i) =>
        i === idx ? inf.open(map, markersRef.current[i]) : inf.close()
      );
    };

    // 캠퍼스 경계/줌 제한
    const clamp = (v: number, min: number, max: number) =>
      Math.min(Math.max(v, min), max);
    const keepInBounds = () => {
      const c = map.getCenter();
      const clampedLat = clamp(c.y, BOUNDS_SW.lat, BOUNDS_NE.lat);
      const clampedLng = clamp(c.x, BOUNDS_SW.lng, BOUNDS_NE.lng);
      if (c.y !== clampedLat || c.x !== clampedLng) {
        map.setCenter(new naver.maps.LatLng(clampedLat, clampedLng));
      }
    };
    naver.maps.Event.addListener(map, "dragend", keepInBounds);
    naver.maps.Event.addListener(map, "idle", keepInBounds);
    naver.maps.Event.addListener(map, "zoom_changed", () => {
      const z = map.getZoom();
      if (z < MIN_ZOOM) map.setZoom(MIN_ZOOM);
      if (z > MAX_ZOOM) map.setZoom(MAX_ZOOM);
    });


    // 마커 & 말풍선
  buildings.forEach((b: Building, idx: number) => {
    const pos = new naver.maps.LatLng(b.lat, b.lng);
    const marker = new naver.maps.Marker({
      map,
      position: pos,
      title: b.name,
    });
    markersRef.current.push(marker);

    // 고유 ID 생성
    const btnId = `detail-btn-${b.id}`;

    // InfoWindow HTML 구성  ps.율리아님이 html 구성 수정부탁드립니다.
  const html = `
    <div style="padding:8px 10px;font-size:13px;max-width:220px">
      <div style="font-weight:700">${b.name}</div>
      ${b.desc ? `<div style="margin-top:4px;color:#555">${b.desc}</div>` : ""}
      <div style="margin-top:6px;font-size:12px;color:#888">
        ${b.lat.toFixed(6)}, ${b.lng.toFixed(6)}
      </div>
      <div style="margin-top:8px;text-align:right">
        <button id="${btnId}"
          style="font-size:12px;color:#0078ff;border:none;background:none;cursor:pointer;">
          상세정보
        </button>
      </div>
    </div>
  `;

  //인포윈도우 창 생성(배열에 저장)
  const info = new naver.maps.InfoWindow({ content: html });
  infoRefs.current.push(info);

  // 마커 클릭 이벤트
  naver.maps.Event.addListener(marker, "click", () => {

    // 1. 모든 말풍선 닫기
    closeAllInfo();  //공동함수

    // 2. 현재 건물 말풍선 열기(클릭한 마커)
    info.open(map, marker);
    map.panTo(pos);  //현재 마커 중심으로 이동

    //ps.즐겨찾기 리스트로 수정예정 (173줄, 232줄)
    setSelectedBuilding(b);   //선택한 마커의 건물 선택
    setPanelMode("detail");   //상세정보 호출 (검색창 밑에 부분)

    // INFO WINDOW 렌더링 이후 버튼 이벤트 등록 (infowindow 창 생성 전에는 버튼 인식을 못함)
    registerDetailButtonClick(btnId, b.id);  //공동함수
  });
});


    // 지도 클릭 → 임시 핀
    naver.maps.Event.addListener(map, "click", (e: any) => {
      const lat = e.coord.y;
      const lng = e.coord.x;
      setClicked({ lat, lng });

      if (!tempMarkerRef.current) {
        tempMarkerRef.current = new naver.maps.Marker({
          map,
          position: new naver.maps.LatLng(lat, lng),
          icon: { content: '<div style="transform:translate(-50%,-100%);font-size:20px">📍</div>' },
          draggable: true,
          zIndex: 999,
        });
        naver.maps.Event.addListener(tempMarkerRef.current, "dragend", () => {
          const p = tempMarkerRef.current.getPosition();
          setClicked({ lat: p.y, lng: p.x });
        });
      } else {
        tempMarkerRef.current.setPosition(new naver.maps.LatLng(lat, lng));
      }
    });

    return () => {
      markersRef.current.forEach((m) => m.setMap(null));
      infoRefs.current.forEach((i) => i.close());
      markersRef.current = [];
      infoRefs.current = [];
      tempMarkerRef.current?.setMap(null);
      tempMarkerRef.current = null;
      map.destroy();
    };
  }, []);

  // 특정 빌딩으로 이동 + 패널 전환 (검색창에서 검색했을때)
  const focusBuilding = (idx: number) => {
    //map, marker, infowindow 객체 가져오기
    const map = mapRef.current;
    const marker = markersRef.current[idx];
    const info = infoRefs.current[idx];
    if (!map || !marker || !info) return;  //3개중 하나라도 없을시 종료

    const pos = marker.getPosition();   //마커를 지도 중심으로
    if (map.getZoom() < 18) map.setZoom(18);
    map.panTo(pos);

     closeAllInfo();   //공동함수
    info.open(map, marker);

    //ps.즐겨찾기 리스트로 수정예정 (173줄, 232줄)
    setSelectedBuilding(buildings[idx]);  //보여줄 건물 정보 불러오기
    setPanelMode("detail");  // 검색 리스트에서 상세정보로 
  };

  // 검색 제출/키보드
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!results.length) return;
    const pick = results[activeIdx >= 0 ? activeIdx : 0];
    focusBuilding(pick.i);
  };
  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((p) => (p + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((p) => (p - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = results[activeIdx >= 0 ? activeIdx : 0];
      if (pick) focusBuilding(pick.i);
    }
  };

  const copyClicked = () => {
    if (!clicked) return;
    const text = `{ "lat": ${clicked.lat}, "lng": ${clicked.lng} }`;
    navigator.clipboard?.writeText(text);
    alert("좌표를 복사했습니다:\n" + text);
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {/* 지도 */}
      <div ref={mapDivRef} style={{ width: "100%", height: "100%" }} />

      {/* ───────────────── 좌측 단일 패널 ───────────────── */}
      <div
        style={{
          position: "fixed",
          top: 12,
          left: 12,
          width: SIDEBAR_W,
          maxWidth: "92vw",
          zIndex: 1100,
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* 상단 검색바 */}
        <form onSubmit={onSubmit} style={{ padding: 12, borderBottom: "1px solid #eee" }}>
          <div style={{ display: "flex", gap: 8 }}>
            {panelMode === "detail" && (
              <button
                type="button"
                onClick={() => setPanelMode("list")}
                title="뒤로가기"
                aria-label="뒤로가기"
                style={{
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  background: "#f9fafb",
                  padding: "0 10px",
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                ←
              </button>
            )}
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPanelMode("list"); // 타이핑하면 자동으로 리스트 모드
              }}
              onKeyDown={onKeyDown}
              placeholder="건물 검색 (예: 진리관, 백석홀, 지혜관)"
              style={{
                flex: 1,
                height: 40,
                padding: "0 12px",
                border: "1px solid #d1d5db",
                borderRadius: 10,
                fontSize: 14,
                outline: "none",
                background: "#fff",
                color: "#111",
              }}
            />
          </div>
        </form>

        {/* 아래 영역: 리스트 or 상세보기 */}
        <div style={{ minHeight: 240, maxHeight: "60vh", overflowY: "auto" }}>
          {panelMode === "list" ? (
            // ── 검색 결과 리스트 ──
            q ? (
              results.length ? (
                results.map(({ b, i }, idx) => (
                  <div
                    key={b.id}
                    onMouseEnter={() => setActiveIdx(idx)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => focusBuilding(i)}
                    style={{
                      display: "flex",
                      gap: 10,
                      padding: "10px 12px",
                      cursor: "pointer",
                      background: idx === activeIdx ? "#f3f4f6" : "#fff",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{b.name}</div>
                      {b.desc && (
                        <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
                          {b.desc}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: 16, fontSize: 13, color: "#666" }}>
                  검색 결과가 없습니다.
                </div>
              )
            ) : (
              <div style={{ padding: 16, fontSize: 13, color: "#666" }}>
                건물명을 검색해 보세요.
              </div>
            )
          ) : (
            //── 상세보기 ──
            //이곳에 즐겨찾기 목록 만들면 될것 같습니다.
            <div style={{ padding: 12 }}>
              {selectedBuilding ? (
                <>
                  //상단이름 강조
                  <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 6 }}>
                    {selectedBuilding.name}
                  </div>
                  <PlaceDetail
                    openingHours={selectedBuilding.openingHours}
                    address={selectedBuilding.address}
                    website={selectedBuilding.website}
                  />
                </>
              ) : (
                <div style={{ color: "#666", fontSize: 13 }}>
                  건물을 선택하면 상세 정보가 표시됩니다.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 우상단 좌표 패널(그대로) */}
      <div
        style={{
          position: "fixed",
          top: 12,
          right: 12,
          zIndex: 1000,
          background: "rgba(255,255,255,0.96)",
          border: "1px solid #ddd",
          borderRadius: 10,
          padding: 10,
          fontSize: 13,
          minWidth: 230,
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 6 }}>좌표 찍기 도구</div>
        {clicked ? (
          <>
            <div>위도(lat): <code>{clicked.lat.toFixed(6)}</code></div>
            <div>경도(lng): <code>{clicked.lng.toFixed(6)}</code></div>
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <button onClick={copyClicked}>복사</button>
              <button
                onClick={() => {
                  tempMarkerRef.current?.setMap(null);
                  tempMarkerRef.current = null;
                  setClicked(null);
                }}
              >
                초기화
              </button>
            </div>
          </>
        ) : (
          <div style={{ color: "#666" }}>지도를 클릭하면 좌표가 표시됩니다.</div>
        )}
      </div>
    </div>
  );
}
