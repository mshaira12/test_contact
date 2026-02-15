export async function onRequest(context) {
  const { request, env } = context;
  
  if (request.method !== 'POST') {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const formData = await request.formData();
    const name = formData.get('name') || 'No name';
    const email = formData.get('_replyto');
    const message = formData.get('message');

    if (!email || !message) {
      return new Response(JSON.stringify({ status: 'error', message: 'Missing fields' }), { status: 400 });
    }

    const apiResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.re_FpDe4D2P_8imKq1BjNFi2zm4R5aMDjNjU}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Shayra ProTech <onboarding@resend.dev>',
        to: ['m_shaira@yahoo.fr'],
        subject: `Contact form: ${name}`,
        html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`
      })
    });

    const data = await apiResponse.json();
    if (!apiResponse.ok) throw new Error(JSON.stringify(data));

    return new Response(JSON.stringify({ status: 'success', message: 'Email sent' }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ status: 'error', message: err.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}
