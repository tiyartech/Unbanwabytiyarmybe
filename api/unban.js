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

  const messagesA = [
`Halo Tim WhatsApp 👋,\n
Saya pengguna aktif WhatsApp sejak lama.\n
Nomor saya diblokir mendadak tanpa alasan jelas.\n
Mohon pertimbangannya untuk membuka blokir 🙏.\n
Nomor saya: ${phone}\n
Email saya: ${email}\n
Terima kasih 🌟`,

`Hi WhatsApp 💌,\n
My number was suspended suddenly 🆘.\n
I did not violate any policy.\n
Please review and unblock this number: ${phone}.\n
You may contact me via ${email}. Thank you so much 🙏`,

`Xin chào đội ngũ WhatsApp 📞,\n
Tài khoản của tôi bị khóa mà không rõ lý do.\n
Tôi cần liên lạc công việc và gia đình.\n
Số điện thoại: ${phone}\n
Email: ${email}\n
Xin hãy giúp tôi 😭`,

`WhatsAppサポートチームへ 🙇‍♂️,\n
私は常にルールに従って使ってきました。\n
アカウントが突然凍結されて困っています。\n
番号: ${phone}\n
メール: ${email}\n
どうかよろしくお願いします。🙏`,

`Bonjour l'équipe WhatsApp 🇫🇷,\n
Je suis un utilisateur régulier 📱.\n
Mon compte a été suspendu sans avertissement 😞.\n
Mon numéro : ${phone}\n
Email : ${email}. Merci infiniment 🙌`,

`Hallo WhatsApp-Team 🇩🇪,\n
Mein Konto wurde ohne Grund gesperrt ❌.\n
Ich nutze WhatsApp nur privat.\n
Bitte prüfen Sie: ${phone}\n
Kontakt: ${email}. Dankeschön 🙏`,

`Estimado equipo de WhatsApp 🇪🇸,\n
Mi cuenta fue bloqueada sin explicación 😔.\n
Utilizo la app para hablar con familia.\n
Número: ${phone}\n
Correo: ${email}\n
Por favor, ayúdenme 🙏`,

`سلام تیم واتساپ 🇮🇷\n
اکانت من ناگهانی مسدود شده است.\n
لطفاً شماره من را بررسی کنید: ${phone}\n
ایمیل: ${email}.\n
خیلی ممنون 🌹`,

`สวัสดีทีมงาน WhatsApp 🇹🇭\n
บัญชีของฉันถูกบล็อกทันที ❌\n
โปรดตรวจสอบหมายเลข: ${phone}\n
อีเมลของฉันคือ: ${email}\n
ขอบคุณมาก ๆ ค่ะ 🙇‍♀️`,

`WhatsApp Support 🌐,\n
I only use this app for family and school.\n
Please unban my number: ${phone} 🙏\n
You can reach me at: ${email}\n
God bless 🙏`
  ];

  const messagesB = [
`Hi WhatsApp team,\n
I found my account banned this morning 📴.\n
I haven’t done anything wrong.\n
Please check number: ${phone}\n
Email: ${email}\n
Thanks 🙏`,

`Xin chào WhatsApp,\n
Tôi chỉ dùng tài khoản này cho gia đình.\n
Không hề có hành động vi phạm.\n
Số: ${phone}, Email: ${email}\n
Mong được hỗ trợ 🌟`,

`Hola WhatsApp,\n
Nunca violé ninguna norma ❗\n
Por favor desbloqueen mi cuenta: ${phone}\n
Correo: ${email}\n
Gracias 🙇`,

`Halo WhatsApp,\n
Nomor saya diblokir tiba-tiba 🥲\n
Padahal saya tidak melanggar aturan apa pun.\n
Mohon bantuan untuk membuka blokir.\n
Nomor: ${phone}\n
Email: ${email}`,

`Bonjour WhatsApp,\n
Je ne comprends pas pourquoi mon compte est bloqué 😢\n
Mon numéro est: ${phone}\n
Email: ${email}\n
Merci de revoir la situation 🙏`,

`Hello WA Support 📱,\n
This is my only number used for family chat.\n
Please check it again: ${phone}\n
Email: ${email}. Appreciate your help 🙌`,

`Xin chào,\n
Số của tôi đã bị khóa đột ngột 😭\n
Tôi không làm gì sai cả.\n
Xin hãy kiểm tra lại: ${phone}\n
Email: ${email}`,

`WhatsAppサポートへ 📞\n
私の番号は${phone}です。\n
メールは${email}。\n
回復していただけると助かります 🙇‍♂️`,

`Hallo Team WhatsApp,\n
Mein WhatsApp wurde geblockt 🛑\n
Ich brauche es dringend zum Kommunizieren.\n
Nummer: ${phone}, Mail: ${email}`,

`Salam WhatsApp,\n
Saya tidak paham kenapa nomor saya diblokir ❓\n
Tolong tinjau ulang nomor ${phone}.\n
Email saya: ${email}.\n
Terima kasih sebesar-besarnya 🙏`
  ];

  try {
    for (let g = 0; g < gmailList.length; g++) {
      const currentGmail = gmailList[g];
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: currentGmail.user,
          pass: currentGmail.pass
        }
      });

      const currentMessages = g === 0 ? messagesA : messagesB;

      for (let i = 0; i < currentMessages.length; i++) {
        await transporter.sendMail({
          from: `"Unban Appeal" <${currentGmail.user}>`,
          to: "support@support.whatsapp.com",
          subject: `Please unban number ${phone}`,
          text: currentMessages[i]
        });

        console.log(`✅ Gmail ${g + 1} - Email ${i + 1} terkirim`);
        if (i < currentMessages.length - 1) await delay(1500);
      }
    }

    res.status(200).send(`✅ ${gmailList.length * 10} email berhasil dikirim (${gmailList.length} akun Gmail)`);
  } catch (err) {
    console.error("❌ Gagal kirim email:", err);
    res.status(500).send("❌ Gagal mengirim email.");
  }
};
