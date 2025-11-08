import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { buildings, type Building } from "./buildings";

declare global {
  interface Window {
    naver: any;
    navermap_authFailure?: () => void;
  }
}

type LatLng = { lat: number; lng: number };

// 중심(진리관 부근)
const INIT: LatLng = { lat: 36.839322, lng: 127.185228 };

/** 캠퍼스 범위: 지도 이동/확대 제한 (원치 않으면 BOUNDS, keepInBounds, zoom 제한 제거 가능) */
const BOUNDS_SW: LatLng = { lat: 36.8335, lng: 127.1800 };
const BOUNDS_NE: LatLng = { lat: 36.8415, lng: 127.1870 };
const MIN_ZOOM = 16;
const MAX_ZOOM = 20;

export default function App() {
   const location = useLocation();
  if (location.pathname.startsWith("/detail")) {
    return null; // 새 창(detail 페이지)에서는 지도 렌더링 안 함
  }
  const mapDivRef = useRef<HTMLDivElement | null>(null);

  // 좌표 찍기(임시 핀) 상태
  const [clicked, setClicked] = useState<LatLng | null>(null);
  const tempMarkerRef = useRef<any | null>(null);

  useEffect(() => {
    const { naver } = window;
    if (!naver || !mapDivRef.current) return;

    // 지도 생성
    const map = new naver.maps.Map(mapDivRef.current, {
      center: new naver.maps.LatLng(INIT.lat, INIT.lng),
      zoom: 18,
      mapTypeControl: true,
      zoomControl: true,
      scaleControl: true,
    });

    // 1) 빌딩 마커 + 말풍선
    const markers: any[] = [];
    const infoWindows: any[] = [];

    const openInfo = (idx: number) => {
      infoWindows.forEach((inf, i) => (i === idx ? inf.open(map, markers[i]) : inf.close()));
    };

    buildings.forEach((b: Building, idx: number) => {
      const pos = new naver.maps.LatLng(b.lat, b.lng);
      const marker = new naver.maps.Marker({ map, position: pos, title: b.name });
      markers.push(marker);

      //고유 버튼 id 생성
      const btnId = `detail-btn-${b.id}`;

      //infowindow ui 수정필요
      const html =
        `<div style="padding:8px 10px;font-size:13px;max-width:220px">
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
         </div>`;

      const info = new naver.maps.InfoWindow({ content: html });
      infoWindows.push(info);

      naver.maps.Event.addListener(marker, "click", () => {
        openInfo(idx);
        map.panTo(pos);

        // InfoWindow 열릴 때 버튼 이벤트 등록
      naver.maps.Event.once(map, "idle", () => {
        const btn = document.getElementById(btnId);
        if (btn) {
          btn.onclick = (e) => {
            e.stopPropagation();
           window.open(`${window.location.origin}/#/detail/${b.id}`, "_blank");
        };
      }
    });
  });
});

    // 2) 지도 클릭 → 임시 핀(📍) 찍고 좌표 표시
    naver.maps.Event.addListener(map, "click", (e: any) => {
      const lat = e.coord.y;
      const lng = e.coord.x;
      setClicked({ lat, lng });

      if (!tempMarkerRef.current) {
        tempMarkerRef.current = new naver.maps.Marker({
          map,
          position: new naver.maps.LatLng(lat, lng),
          icon: {
            content:
              '<div style="transform:translate(-50%,-100%);font-size:20px">📍</div>',
          },
          draggable: true,
          zIndex: 999,
        });
        // 드래그로 미세조정하면 좌표 갱신
        naver.maps.Event.addListener(tempMarkerRef.current, "dragend", () => {
          const p = tempMarkerRef.current.getPosition();
          setClicked({ lat: p.y, lng: p.x });
        });
      } else {
        tempMarkerRef.current.setPosition(new naver.maps.LatLng(lat, lng));
      }
    });

    // 3) 캠퍼스 밖으로 못 나가게 + 줌 범위 제한(옵션)
    const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
    const keepInBounds = () => {
      const c = map.getCenter();
      const lat = c.y, lng = c.x;
      const clampedLat = clamp(lat, BOUNDS_SW.lat, BOUNDS_NE.lat);
      const clampedLng = clamp(lng, BOUNDS_SW.lng, BOUNDS_NE.lng);
      if (lat !== clampedLat || lng !== clampedLng) {
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

    // 정리
    return () => {
      markers.forEach(m => m.setMap(null));
      infoWindows.forEach((i) => i.close());
      tempMarkerRef.current?.setMap(null);
      tempMarkerRef.current = null;
      map.destroy();
    };
  }, []);

  // 좌표 복사
  const copyClicked = () => {
    if (!clicked) return;
    const text = `{ "lat": ${clicked.lat}, "lng": ${clicked.lng} }`;
    navigator.clipboard?.writeText(text);
    alert("좌표를 복사했습니다:\n" + text + "\n\nbuildings.ts에 붙여 넣으세요!");
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {/* 지도 */}
      <div ref={mapDivRef} style={{ width: "100%", height: "100%" }} />

      {/* 우상단: 좌표 찍기 패널 (임시 핀과 함께 사용) */}
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
              <button onClick={() => {
                tempMarkerRef.current?.setMap(null);
                tempMarkerRef.current = null;
                setClicked(null);
              }}>초기화</button>
            </div>
            <div style={{ marginTop: 6, color: "#555" }}>
              * 지도 클릭으로 이동, <b>마커 드래그</b>로 미세 조정 가능
            </div>
          </>
        ) : (
          <div style={{ color: "#666" }}>지도를 클릭하면 좌표가 표시됩니다.</div>
        )}
      </div>
    </div>
  );
}
