"""Авторизация администратора по паролю."""
import json
import os
import secrets

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

# Пароль администратора — смените на свой
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "Realty2024!")
# Простой токен сессии (генерируется один раз при старте функции)
SESSION_TOKEN = "admin-session-" + secrets.token_hex(16)


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    body = json.loads(event.get("body") or "{}")
    password = body.get("password", "")

    if password == ADMIN_PASSWORD:
        return {
            "statusCode": 200,
            "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
            "body": json.dumps({"ok": True, "token": SESSION_TOKEN}, ensure_ascii=False),
        }

    return {
        "statusCode": 401,
        "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
        "body": json.dumps({"ok": False, "error": "Неверный пароль"}, ensure_ascii=False),
    }
