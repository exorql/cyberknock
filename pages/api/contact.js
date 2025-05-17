// pages/api/contact.js
export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).end();
    }
  
    const { name, email, company, message } = req.body;
  
    // Slack Webhook URL（.env.localに保存推奨）
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  
    // Slackに送るメッセージ
    const slackMessage = {
      text: `*お問い合わせ*\n*氏名:* ${name}\n*メール:* ${email}\n*会社名:* ${company}\n*内容:*\n${message}`,
    };
  
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slackMessage),
      });
      res.status(200).json({ ok: true });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  }
  