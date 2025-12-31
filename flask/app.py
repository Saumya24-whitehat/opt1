from flask import Flask, request, Response
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 🔹 Ye sab routes ke liye CORS allow karega

# ⚠️ Har API ke liye ye cookies update karni hongi
ICHARTS_COOKIES = {
    "PHPSESSID": "95860qgsllnrdp4ii60mr7lfvq",
    "cf_clearance": "YOUR_CF_CLEARANCE_HERE"
}

@app.route("/<path:path>", methods=["GET", "POST"])
def universal_proxy(path):
    """
    Sab localhost API requests ko icharts par forward karta hai
    """
    # Original URL banaye localhost ko icharts se replace karke
    icharts_url = f"https://www.icharts.in/{path}"

    # Payload / headers
    data = request.form if request.form else request.data
    headers = {key: value for key, value in request.headers if key != "Host"}

    try:
        if request.method == "POST":
            r = requests.post(
                icharts_url,
                headers=headers,
                cookies=ICHARTS_COOKIES,
                data=data,
                timeout=10
            )
        else:
            r = requests.get(
                icharts_url,
                headers=headers,
                cookies=ICHARTS_COOKIES,
                params=request.args,
                timeout=10
            )

        # Original response wapas send karo
        return Response(
            r.content,
            status=r.status_code,
            content_type=r.headers.get("Content-Type", "application/json")
        )

    except Exception as e:
        return Response(f"Proxy error: {str(e)}", status=500)


if __name__ == "__main__":
    app.run(debug=False, port=5000)
