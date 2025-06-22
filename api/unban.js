const nodemailer = require("nodemailer");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  let body = '';
  await new Promise((resolve) => {
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", resolve);
  });

  let data;
  try {
    data = JSON.parse(body);
  } catch (e) {
    return res.status(400).send("❌ Gagal parsing data.");
  }

  const { phone, email, g1, g2 } = data;
  if (!phone || !email) {
    return res.status(400).send("❌ Nomor dan email wajib diisi.");
  }

  const gmailList = [];

  if (g1) {
    gmailList.push({
      user: "akun9nuyul77@gmail.com",
      pass: "iqmccaymlhyudtrs"
    });
  }

  if (g2) {
    gmailList.push({
      user: "honorofnuyul2@gmail.com",
      pass: "vgsrfevyxdvskscw"
    });
  }

  if (gmailList.length === 0) {
    return res.status(400).send("❌ Minimal satu Gmail harus dipilih.");
  }

  const messages = [
    `Halo Tim WhatsApp 👋,\nSaya tidak pernah melanggar kebijakan apa pun. Nomor saya diblokir tiba-tiba dan saya sangat butuh aksesnya untuk urusan keluarga. Mohon bantuannya membuka blokir untuk nomor: ${phone}. Email saya: ${email}. Terima kasih 🙏`,
    `WhatsApp thân mến,\nTôi chưa bao giờ sử dụng ứng dụng sai mục đích. Việc khóa tài khoản khiến tôi gặp nhiều khó khăn. Xin hãy mở khóa số: ${phone}. Đây là email của tôi: ${email}. Mong nhận được phản hồi sớm 😢`,
    `Hi WhatsApp,\nI’m genuinely confused why my account got banned. I use it only to talk with family and classmates. Please take another look and unban this number: ${phone}. You can reach me at: ${email}. Appreciate it a lot! 🙌`,
    `Estimado equipo de WhatsApp,\nSiempre utilicé su plataforma con respeto. No entiendo la razón del bloqueo. Les ruego revisar el número: ${phone}. Mi correo: ${email}. Gracias de corazón ❤️`,
    `WhatsAppサポートへ\n私は規則を守って使ってきました。突然アカウントが凍結されて困惑しています。番号：${phone}、メール：${email}。ご対応をお願いします。`,
    `Bonjour WhatsApp,\nJe n'ai jamais enfreint les règles et mon compte a été bloqué sans raison. Merci de bien vouloir revoir mon dossier. Mon numéro : ${phone}, Email : ${email}. Merci pour votre compréhension.`,
    `Hallo WhatsApp-Team,\nMein Konto wurde ohne Vorwarnung gesperrt. Ich habe die App nur privat genutzt. Bitte prüfen Sie den Fall erneut: ${phone}. Kontakt: ${email}. Vielen Dank im Voraus! 🙏`,
    `Здравствуйте, служба поддержки WhatsApp,\nМой аккаунт заблокировали, и я не понимаю, почему. Пожалуйста, помогите восстановить номер: ${phone}. Почта: ${email}. Буду признателен.`,
    `سلام تیم واتساپ،\nاکانت من ناگهانی بسته شده و من هیچ خلافی نکردم. لطفاً شماره ${phone} را بررسی کرده و رفع مسدودی کنید. ایمیل من: ${email}. سپاسگزارم 🙏`,
    `สวัสดีทีมงาน WhatsApp\nบัญชีของฉันถูกแบนโดยไม่ทราบสาเหตุ ฉันใช้งานตามปกติเท่านั้น รบกวนตรวจสอบหมายเลข: ${phone} อีเมลของฉันคือ: ${email} ขอบคุณมากค่ะ 🥺`
  ];

  try {
    for (let g = 0; g < gmailList.length; g++) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailList[g].user,
          pass: gmailList[g].pass
        }
      });

      for (let i = 0; i < messages.length; i++) {
        await transporter.sendMail({
          from: `"Unban Appeal" <${gmailList[g].user}>`,
          to: "support@support.whatsapp.com",
          subject: `Please unban number ${phone}`,
          text: messages[i]
        });

        console.log(`✅ Gmail ${g + 1} - Email ${i + 1} terkirim`);
        if (i < messages.length - 1) await delay(1500);
      }
    }

    res.status(200).send(`✅ Email berhasil dikirim (${gmailList.length * messages.length} total email)`);
  } catch (err) {
    console.error("❌ Gagal kirim email:", err);
    res.status(500).send("❌ Gagal mengirim email.");
  }
};
