"""Авторизация и смена пароля администратора. Пароль хранится в БД."""
import json
import os
import psycopg2

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def get_password(conn) -> str:
    cur = conn.cursor()
    cur.execute("SELECT value FROM admin_settings WHERE key = 'password'")
    row = cur.fetchone()
    cur.close()
    return row[0] if row else "admin123"


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "POST")
    body = json.loads(event.get("body") or "{}")

    conn = get_conn()

    # POST — вход по паролю
    if method == "POST":
        password = body.get("password", "")
        stored = get_password(conn)
        conn.close()

        if password == stored:
            return {
                "statusCode": 200,
                "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
                "body": json.dumps({"ok": True, "token": stored}, ensure_ascii=False),
            }
        return {
            "statusCode": 401,
            "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
            "body": json.dumps({"ok": False, "error": "Неверный пароль"}, ensure_ascii=False),
        }

    # PUT — смена пароля (нужен текущий пароль)
    if method == "PUT":
        current = body.get("current", "")
        new_password = body.get("new", "").strip()
        stored = get_password(conn)

        if current != stored:
            conn.close()
            return {
                "statusCode": 401,
                "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
                "body": json.dumps({"ok": False, "error": "Неверный текущий пароль"}, ensure_ascii=False),
            }

        if len(new_password) < 6:
            conn.close()
            return {
                "statusCode": 400,
                "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
                "body": json.dumps({"ok": False, "error": "Пароль должен быть не менее 6 символов"}, ensure_ascii=False),
            }

        cur = conn.cursor()
        cur.execute("UPDATE admin_settings SET value = %s WHERE key = 'password'", (new_password,))
        conn.commit()
        cur.close()
        conn.close()

        return {
            "statusCode": 200,
            "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
            "body": json.dumps({"ok": True}, ensure_ascii=False),
        }

    conn.close()
    return {"statusCode": 405, "headers": CORS_HEADERS, "body": ""}
