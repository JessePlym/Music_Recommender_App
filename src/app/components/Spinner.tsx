import React from 'react'

export default function Spinner() {
  const spinAnimation = 
    `@keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
      }
    `
  return (
    <>
      <style>{spinAnimation}</style>
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "30vh",
      }}>
        <div style={{
          border: "16px solid #f3f3f3",
          borderTop: "16px solid #3498db",
          borderRadius: "50%",
          width: "120px",
          height: "120px",
          animation: "spin 2s linear infinite"
        }}>
        </div>
      </div>
    </>
  )
}
