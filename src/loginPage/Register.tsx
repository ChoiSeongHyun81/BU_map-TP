import { useState } from "react";
import { isAxiosError } from "axios";
import "./Login.css";
import { signup } from "../lib/authApi";
import { useUiStore } from "../stores/uiStore";
import type { SignupRequest } from "../types/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [nickname, setNickname] = useState(""); // 닉네임
  const [student_id, setStudentId] = useState(""); // 아이디
  const [password, setPassword] = useState(""); // 패스워드
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { pushToast } = useUiStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (submitting) return;
    if (!nickname || !student_id || !password) {
      setError("이름, 학번/아이디, 비밀번호를 입력해주세요.");
      return;
    }

    const body: SignupRequest = { nickname, student_id, password };
    setSubmitting(true);
    setError(null);

    signup(body)
      .then(() => {
        pushToast({ message: "회원가입이 완료되었습니다. 로그인해주세요.", type: "success" });
        navigate("/");
      })
      .catch((err) => {
        if (isAxiosError(err) && err.response?.status === 409) {
          setError("이미 존재하는 학번입니다.");
        } else {
          setError("회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="login-root">
      <div className="login-card">

        <form onSubmit={handleSubmit} className="form"> 
        <div className="form-group"> {/* 이름 */}
            <label htmlFor="Nickname">이름</label> 
            <input
              id="student_id"
              type="text"
              placeholder="이름을 입력하세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              style={{
                backgroundColor: "#e9e9e9"
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="student_id">아이디</label>
            <input
              id="student_id"
              type="text"
              placeholder="예: 202512345"
              value={student_id}
              onChange={(e) => setStudentId(e.target.value)}
              style={{
                backgroundColor: "#e9e9e9"
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                backgroundColor: "#e9e9e9"
              }}
            />
          </div> 

          {error && (
            <div className="text-red-600 text-sm" style={{ marginTop: 4 }}>
              {error}
            </div>
          )}

          <button type="submit" className="login-button" disabled={submitting}>
            {submitting ? "처리 중..." : "회원가입"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Register;
