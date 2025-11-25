import { useState } from "react";
import "./Login.css";

function Register() {
  const [nickname, setNickname] = useState(""); // 닉네임
  const [student_id, setStudentId] = useState(""); // 아이디
  const [password, setPassword] = useState(""); // 패스워드

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickname || !student_id || !password) {
      alert("이름, 학번/아이디, 비밀번호를 입력해주세요.");
      return;
    }

    alert("회원가입 성공(아님)"); // 회원가입(가짜) 성공 메세지
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

          <button type="submit" className="login-button">
            회원가입
          </button>

        </form>
      </div>
    </div>
  );
}

export default Register;
