import axios from 'axios';

const telegramClient = {
  async sendMessage(telegramId, message) {
    try {
      await axios.get(
        `https://api.telegram.org/bot${
          process.env.TELEGRAM_TOKEN
        }/sendMessage?chat_id=${telegramId}&text=${encodeURIComponent(
          message
        )}&disable_web_page_preview=1`
      );
      // eslint-disable-next-line no-empty
    } catch (e) {}
  },

  async getUserInfo(telegramId) {
    try {
      const { data } = await axios.get(
        `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/getChat?chat_id=${telegramId}`
      );

      return data?.result;
    } catch (e) {
      return null;
    }
  },
};

export default telegramClient;
