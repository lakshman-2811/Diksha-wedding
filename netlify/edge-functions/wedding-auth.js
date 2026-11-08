const COOKIE_NAME = "wedding_access";
// const SESSION_SECONDS = 60 * 60 * 24 * 7; // 7 days
const SESSION_SECONDS = 0;
function base64Url(bytes) {
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value) {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
}

async function sign(value, secret) {
    const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign", "verify"]
    );

    return new Uint8Array(
        await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value))
    );
}

async function createSession(secret) {
    const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
    const payload = String(expires);
    const signature = await sign(payload, secret);
    return `${payload}.${base64Url(signature)}`;
}

async function isValidSession(token, secret) {
    if (!token) return false;

    const [payload, signature, extra] = token.split(".");
    if (!payload || !signature || extra) return false;

    const expires = Number(payload);
    if (!Number.isFinite(expires) || expires <= Math.floor(Date.now() / 1000)) {
        return false;
    }

    try {
        const key = await crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(secret),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["verify"]
        );

        return await crypto.subtle.verify(
            "HMAC",
            key,
            fromBase64Url(signature),
            new TextEncoder().encode(payload)
        );
    } catch {
        return false;
    }
}

function getCookie(request, name) {
    const cookies = request.headers.get("cookie") || "";
    const entry = cookies
        .split(";")
        .map((item) => item.trim())
        .find((item) => item.startsWith(`${name}=`));

    return entry ? entry.slice(name.length + 1) : "";
}

function loginPage(error = false) {
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex,nofollow" />
  <title>Wedding Invitation | Private Access</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0; min-height: 100vh; display: grid; place-items: center;
      padding: 24px; background: #f5f0e7; color: #42382e;
      font-family: Georgia, 'Times New Roman', serif;
    }
    .panel {
      width: min(100%, 430px); padding: 48px 32px; text-align: center;
      background: #fffdf8; border: 1px solid #d8c6a0;
      box-shadow: 0 18px 55px rgba(70, 52, 30, .10);
    }
    .eyebrow {
      color: #a48650; letter-spacing: .25em; text-transform: uppercase;
      font: 11px Arial, sans-serif;
    }
    h1 { font-weight: 400; font-size: 34px; margin: 18px 0 12px; }
    p { color: #786d60; font: 14px/1.7 Arial, sans-serif; }
    input {
      width: 100%; padding: 15px; margin: 22px 0 14px;
      border: 1px solid #d8c6a0; background: #fff;
      font-size: 16px; outline-color: #a48650;
    }
    button {
      width: 100%; padding: 15px; border: 0; cursor: pointer;
      background: #a48650; color: white; letter-spacing: .12em;
      text-transform: uppercase; font-size: 12px;
    }
    .error { color: #a33b32; }
  </style>
</head>
<body>
  <main class="panel">
    <div class="eyebrow">You are warmly invited</div>
    <h1>Wedding Invitation</h1>
    <p>This celebration is private. Please enter the password to continue.</p>
    ${error ? '<p class="error">That password is not correct. Please try again.</p>' : ""}
    <form method="POST" action="/__wedding-login">
      <input
        type="password"
        name="password"
        placeholder="Enter invitation password"
        autocomplete="current-password"
        required
        autofocus
      />
      <button type="submit">Enter Invitation</button>
    </form>
  </main>
</body>
</html>`;
}

function htmlResponse(html, status = 200) {
    return new Response(html, {
        status,
        headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff",
            "X-Robots-Tag": "noindex, nofollow",
        },
    });
}

export default async function handler(request, context) {
    const secret = Netlify.env.get("WEDDING_SITE_PASSWORD");

    // Fail closed: never expose the site if the secret is missing.
    if (!secret) {
        return new Response("Site authentication is not configured.", {
            status: 503,
            headers: { "Cache-Control": "no-store" },
        });
    }

    const url = new URL(request.url);

    if (url.pathname === "/__wedding-login") {
        if (request.method === "GET") {
            return htmlResponse(loginPage());
        }

        if (request.method === "POST") {
            let submittedPassword = "";

            try {
                const form = await request.formData();
                submittedPassword = String(form.get("password") || "");
            } catch {
                return htmlResponse(loginPage(true), 400);
            }

            if (submittedPassword !== secret) {
                return htmlResponse(loginPage(true), 401);
            }

            const session = await createSession(secret);

            return new Response(null, {
                status: 303,
                headers: {
                    Location: "/",
                    "Set-Cookie": `${COOKIE_NAME}=${session}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_SECONDS}`,
                    "Cache-Control": "no-store",
                },
            });
        }

        return new Response("Method not allowed", {
            status: 405,
            headers: { Allow: "GET, POST" },
        });
    }

    const token = getCookie(request, COOKIE_NAME);
    if (await isValidSession(token, secret)) {
        return context.next();
    }

    return htmlResponse(loginPage());
}

export const config = {
    path: ["/", "/*"],
};