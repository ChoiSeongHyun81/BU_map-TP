import { useState } from "react";
import "./Login.css"; 
import logo from "../assets/mapLogo.png";
import { useNavigate } from "react-router-dom";

function Login() {
  const [student_id, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const goToRegister = () => {
    navigate("/register");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!student_id || !password) {
      alert("학번/아이디, 비밀번호를 입력해주세요.");
      return;
    }
    navigate("/app") 
  };

  return (
    <div className="login-root">
      <div className="login-card">
        <img 
          src={logo}
          className="img"
          style={{
            width:"161px",
            height:"161px"
          }}
        />

        <form onSubmit={handleSubmit} className="form">
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
            로그인
          </button>

        </form>
        <button className="register-button" onClick={goToRegister}>
            회원가입
        </button>

      </div>
    </div>
  );
}

export default Login;
