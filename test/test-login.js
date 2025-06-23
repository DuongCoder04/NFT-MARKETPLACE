// test/test-login.js
import { ethers } from 'ethers';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🧾 Đường dẫn file chứa ví
const walletPath = path.join(__dirname, 'wallet1.json');

// 🪪 Tạo hoặc đọc ví
let wallet;
if (fs.existsSync(walletPath)) {
  const { privateKey } = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
  wallet = new ethers.Wallet(privateKey);
  console.log('🔁 Dùng lại ví cũ:', wallet.address);
} else {
  wallet = ethers.Wallet.createRandom();
  fs.writeFileSync(
    walletPath,
    JSON.stringify(
      { address: wallet.address, privateKey: wallet.privateKey },
      null,
      2,
    ),
  );
  console.log('🆕 Tạo ví mới:', wallet.address);
}

// 🌐 Backend URL
const backendURL = 'http://localhost:3000';

async function login() {
  // 🚪 Bước 1: Lấy nonce/message
  const nonceRes = await axios.post(`${backendURL}/auth/request-message`, {
    wallet: wallet.address,
  });

  const messageToSign = nonceRes.data.message; // ✅ Sửa ở đây
  console.log('📩 Thông điệp từ backend:', messageToSign);

  // ✍️ Bước 2: Ký message
  const signature = await wallet.signMessage(messageToSign);
  console.log('✍️ Chữ ký:', signature);

  // 🔐 Bước 3: Đăng nhập
  const loginRes = await axios.post(`${backendURL}/auth/login`, {
    wallet: wallet.address,
    signature,
  });

  console.log('✅ Đăng nhập thành công! JWT:', loginRes.data.token.accessToken);
}

login().catch((err) => {
  console.error('❌ Lỗi đăng nhập:', err.response?.data || err.message);
});
