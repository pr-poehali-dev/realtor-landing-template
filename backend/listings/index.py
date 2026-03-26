"""Управление объявлениями коммерческой недвижимости: получение, создание, редактирование, удаление."""
import json
import os
import psycopg2

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def check_admin(event: dict, conn) -> bool:
    token = event.get("headers", {}).get("x-admin-token", "")
    cur = conn.cursor()
    cur.execute("SELECT value FROM admin_settings WHERE key = 'password'")
    row = cur.fetchone()
    cur.close()
    stored = row[0] if row else "admin123"
    return token == stored


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    method = event.get("httpMethod", "GET")

    # GET — публичный список
    if method == "GET":
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "SELECT id, title, category, area, price, price_type, address, description, photos, floor, features "
            "FROM listings ORDER BY created_at DESC"
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        listings = []
        for row in rows:
            listings.append({
                "id": row[0], "title": row[1], "category": row[2],
                "area": row[3], "price": row[4], "priceType": row[5],
                "address": row[6], "description": row[7],
                "photos": row[8] or [], "floor": row[9], "features": row[10] or [],
            })
        return {"statusCode": 200, "headers": {**CORS_HEADERS, "Content-Type": "application/json"}, "body": json.dumps(listings, ensure_ascii=False)}

    conn = get_conn()

    # POST — создание
    if method == "POST":
        if not check_admin(event, conn):
            conn.close()
            return {"statusCode": 403, "headers": CORS_HEADERS, "body": json.dumps({"error": "Нет доступа"})}

        body = json.loads(event.get("body") or "{}")
        title = body.get("title", "").strip()
        category = body.get("category", "").strip()
        area = int(body.get("area", 0))
        price = int(body.get("price", 0))
        price_type = body.get("priceType", "month")
        address = body.get("address", "").strip()
        description = body.get("description", "").strip()
        photos = body.get("photos", [])
        floor = body.get("floor") or None
        features = body.get("features", [])

        if not all([title, category, area, price, address, description]):
            conn.close()
            return {"statusCode": 400, "headers": {**CORS_HEADERS, "Content-Type": "application/json"}, "body": json.dumps({"error": "Заполните все обязательные поля"}, ensure_ascii=False)}

        cur = conn.cursor()
        cur.execute(
            "INSERT INTO listings (title, category, area, price, price_type, address, description, photos, floor, features) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
            (title, category, area, price, price_type, address, description, photos, floor, features),
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return {"statusCode": 201, "headers": {**CORS_HEADERS, "Content-Type": "application/json"}, "body": json.dumps({"id": new_id, "ok": True}, ensure_ascii=False)}

    # PUT — редактирование
    if method == "PUT":
        if not check_admin(event, conn):
            conn.close()
            return {"statusCode": 403, "headers": CORS_HEADERS, "body": json.dumps({"error": "Нет доступа"})}

        body = json.loads(event.get("body") or "{}")
        listing_id = int(body.get("id", 0))
        if not listing_id:
            conn.close()
            return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "Не указан id"})}

        title = body.get("title", "").strip()
        category = body.get("category", "").strip()
        area = int(body.get("area", 0))
        price = int(body.get("price", 0))
        price_type = body.get("priceType", "month")
        address = body.get("address", "").strip()
        description = body.get("description", "").strip()
        photos = body.get("photos", [])
        floor = body.get("floor") or None
        features = body.get("features", [])

        cur = conn.cursor()
        cur.execute(
            "UPDATE listings SET title=%s, category=%s, area=%s, price=%s, price_type=%s, "
            "address=%s, description=%s, photos=%s, floor=%s, features=%s WHERE id=%s",
            (title, category, area, price, price_type, address, description, photos, floor, features, listing_id),
        )
        conn.commit()
        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": {**CORS_HEADERS, "Content-Type": "application/json"}, "body": json.dumps({"ok": True}, ensure_ascii=False)}

    # DELETE — удаление
    if method == "DELETE":
        if not check_admin(event, conn):
            conn.close()
            return {"statusCode": 403, "headers": CORS_HEADERS, "body": json.dumps({"error": "Нет доступа"})}

        body = json.loads(event.get("body") or "{}")
        listing_id = int(body.get("id", 0))
        if not listing_id:
            conn.close()
            return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "Не указан id"})}

        cur = conn.cursor()
        cur.execute("DELETE FROM listings WHERE id = %s", (listing_id,))
        conn.commit()
        cur.close()
        conn.close()
        return {"statusCode": 200, "headers": {**CORS_HEADERS, "Content-Type": "application/json"}, "body": json.dumps({"ok": True}, ensure_ascii=False)}

    conn.close()
    return {"statusCode": 405, "headers": CORS_HEADERS, "body": json.dumps({"error": "Method not allowed"})}
