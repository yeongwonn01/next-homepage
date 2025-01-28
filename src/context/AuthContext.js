import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // 로그인한 유저 정보
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태

  // localStorage에서 유저 정보와 토큰 가져오기
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("user");
    if (token && userInfo) {
      setUser(JSON.parse(userInfo)); // 유저 정보 상태 업데이트
    }
    setIsLoading(false); // 로딩 완료
  }, []);

  // 로그아웃 처리
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// AuthContext 사용을 위한 커스텀 훅
export const useAuth = () => useContext(AuthContext);
