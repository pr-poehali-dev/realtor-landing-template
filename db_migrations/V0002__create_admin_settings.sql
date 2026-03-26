CREATE TABLE IF NOT EXISTS admin_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

INSERT INTO admin_settings (key, value) VALUES ('password', 'admin123')
ON CONFLICT (key) DO NOTHING;
