const nodemailer = require("nodemailer");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const { phone, email } = req.body;

  if (!phone || !email) {
    return res.status(400).send("Nomor dan email wajib diisi.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yarestore3@gmail.com",
      pass: "sykd wdgc atsk lpoy"
    }
  });

  const messages = [
    // Indonesia
    `Halo Tim WhatsApp 👋,\nSaya tidak pernah melanggar kebijakan apa pun. Nomor saya diblokir tiba-tiba dan saya sangat butuh aksesnya untuk urusan keluarga. Mohon bantuannya membuka blokir untuk nomor: ${phone}. Email saya: ${email}. Terima kasih 🙏`,

    // Vietnam
    `WhatsApp thân mến,\nTôi chưa bao giờ sử dụng ứng dụng sai mục đích. Việc khóa tài khoản khiến tôi gặp nhiều khó khăn. Xin hãy mở khóa số: ${phone}. Đây là email của tôi: ${email}. Mong nhận được phản hồi sớm 😢`,

    // English (USA style)
    `Hi WhatsApp,\nI’m genuinely confused why my account got banned. I use it only to talk with family and classmates. Please take another look and unban this number: ${phone}. You can reach me at: ${email}. Appreciate it a lot! 🙌`,

    // Spanish
    `Estimado equipo de WhatsApp,\nSiempre utilicé su plataforma con respeto. No entiendo la razón del bloqueo. Les ruego revisar el número: ${phone}. Mi correo: ${email}. Gracias de corazón ❤️`,

    // Japanese
    `WhatsAppサポートへ\n私は規則を守って使ってきました。突然アカウントが凍結されて困惑しています。番号：${phone}、メール：${email}。ご対応をお願いします。`,

    // French
    `Bonjour WhatsApp,\nJe n'ai jamais enfreint les règles et mon compte a été bloqué sans raison. Merci de bien vouloir revoir mon dossier. Mon numéro : ${phone}, Email : ${email}. Merci pour votre compréhension.`,

    // German
    `Hallo WhatsApp-Team,\nMein Konto wurde ohne Vorwarnung gesperrt. Ich habe die App nur privat genutzt. Bitte prüfen Sie den Fall erneut: ${phone}. Kontakt: ${email}. Vielen Dank im Voraus! 🙏`,

    // Russian
    `Здравствуйте, служба поддержки WhatsApp,\nМой аккаунт заблокировали, и я не понимаю, почему. Пожалуйста, помогите восстановить номер: ${phone}. Почта: ${email}. Буду признателен.`,

    // Persian
    `سلام تیم واتساپ،\nاکانت من ناگهانی بسته شده و من هیچ خلافی نکردم. لطفاً شماره ${phone} را بررسی کرده و رفع مسدودی کنید. ایمیل من: ${email}. سپاسگزارم 🙏`,

    // Thai
    `สวัสดีทีมงาน WhatsApp\nบัญชีของฉันถูกแบนโดยไม่ทราบสาเหตุ ฉันใช้งานตามปกติเท่านั้น รบกวนตรวจสอบหมายเลข: ${phone} อีเมลของฉันคือ: ${email} ขอบคุณมากค่ะ 🥺`
  ];

  try {
    for (let i = 0; i < messages.length; i++) {
      await transporter.sendMail({
        from: `"Unban Appeal" <${email}>`,
        to: "support@support.whatsapp.com",
        subject: `Please unban number ${phone}`,
        text: messages[i]
      });

      console.log(`✅ Email ${i + 1} sent.`);
      if (i < messages.length - 1) {
        await delay(5 * 60 * 1000); // 5 menit delay antar email
      }
    }

    res.status(200).send("✅ Semua email berhasil dikirim (dengan teks beda-beda).");
  } catch (err) {
    console.error("❌ Gagal kirim email:", err);
    res.status(500).send("❌ Gagal mengirim email.");
  }
};
