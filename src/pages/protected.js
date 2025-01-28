// pages/protected.js
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <h1>Welcome to the protected page!</h1>
    </ProtectedRoute>
  );
}
