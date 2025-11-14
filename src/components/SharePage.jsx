import React from "react";
import { FiShare2 } from "react-icons/fi";
import "./SharePage.css";

function SharePage() {
  const url = "https://cptnope.github.io/Via-Menu-Guide";
  
  // Using Google Charts API for QR code generation (no install needed)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="share-page">
      <div className="share-container">
        <h1 className="share-title">
          <FiShare2 /> Share Via Menu Guide
        </h1>
        
        <p className="share-description">
          Scan this QR code or share the link with your coworkers to access the Via Italian Table menu guide.
        </p>

        <div className="qr-code-container">
          <img 
            src={qrCodeUrl} 
            alt="QR Code for Via Menu Guide" 
            className="qr-code"
          />
        </div>

        <div className="share-link-container">
          <input 
            type="text" 
            value={url} 
            readOnly 
            className="share-link-input"
          />
          <button onClick={handleCopyLink} className="copy-button">
            Copy Link
          </button>
        </div>

        <div className="share-instructions">
          <h3>How to use:</h3>
          <ul>
            <li>📱 Point your phone's camera at the QR code</li>
            <li>🔗 Tap the notification to open the menu</li>
            <li>💾 Add to home screen for quick access</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SharePage;
