import { ethers } from 'ethers';
import axios from 'axios';

// Tạo ví ảo
const wallet = ethers.Wallet.createRandom();

async function login() {
  console.log('🆕 Ví được tạo:', wallet.address);

  // Bước 1: Gửi yêu cầu lấy message từ backend
  const { data } = await axios.post(
    'http://localhost:3000/auth/request-message',
    {
      wallet: wallet.address,
    },
  );

  const messageToSign = data.message.message; // Lấy chuỗi đúng
  console.log('📩 Thông điệp từ backend:', messageToSign);

  // Bước 2: Ký thông điệp
  const signature = await wallet.signMessage(messageToSign);
  console.log('✍️ Chữ ký:', signature);

  // Bước 3: Gửi chữ ký và ví để login
  const { data: loginResult } = await axios.post(
    'http://localhost:3000/auth/login',
    {
      wallet: wallet.address,
      signature,
    },
  );

  console.log('✅ Đăng nhập thành công! JWT:', loginResult.token);
}

login().catch((err) => {
  console.error('❌ Lỗi đăng nhập:', err.response?.data || err.message);
});
