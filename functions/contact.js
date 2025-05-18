export async function onRequestPost(context) {
    const { name, email, company, message } = await context.request.json();
  
    const webhookUrl = context.env.SLACK_WEBHOOK_URL;
  
    const slackMessage = {
      text: `*お問い合わせ*\n*氏名:* ${name}\n*メール:* ${email}\n*会社名:* ${company}\n*内容:*\n${message}`,
    };
  
    try {
      const resp = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slackMessage),
      });
      if (!resp.ok) throw new Error("Slack通知に失敗しました");
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
    }
  }
  