package stats

import (
	"database/sql"
	"log"
	"os"
	"path/filepath"

	_ "modernc.org/sqlite"
)

var db *sql.DB

func Init(dbPath string) {
	dir := filepath.Dir(dbPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		log.Fatalf("failed to create stats DB directory: %v", err)
	}

	var err error
	db, err = sql.Open("sqlite", dbPath+"?_pragma=journal_mode(WAL)&_pragma=busy_timeout(5000)")
	if err != nil {
		log.Fatalf("failed to open stats DB: %v", err)
	}

	if err := db.Ping(); err != nil {
		log.Fatalf("failed to ping stats DB: %v", err)
	}

	createTable := `
	CREATE TABLE IF NOT EXISTS stats (
		key TEXT PRIMARY KEY,
		value INTEGER NOT NULL DEFAULT 0
	);`
	if _, err := db.Exec(createTable); err != nil {
		log.Fatalf("failed to create stats table: %v", err)
	}

	// Ensure both keys exist
	for _, key := range []string{"visits", "downloads"} {
		_, err := db.Exec(`INSERT OR IGNORE INTO stats (key, value) VALUES (?, 0)`, key)
		if err != nil {
			log.Fatalf("failed to initialize stat key %q: %v", key, err)
		}
	}

	log.Printf("stats DB initialized at %s", dbPath)
}

func Get(key string) (int, error) {
	var value int
	err := db.QueryRow(`SELECT value FROM stats WHERE key = ?`, key).Scan(&value)
	if err != nil {
		return 0, err
	}
	return value, nil
}

func Increment(key string) (int, error) {
	_, err := db.Exec(`UPDATE stats SET value = value + 1 WHERE key = ?`, key)
	if err != nil {
		return 0, err
	}
	return Get(key)
}

func GetAll() (visits, downloads int, err error) {
	visits, err = Get("visits")
	if err != nil {
		return 0, 0, err
	}
	downloads, err = Get("downloads")
	if err != nil {
		return 0, 0, err
	}
	return visits, downloads, nil
}

func Ping() error {
	return db.Ping()
}

func Close() {
	if db != nil {
		db.Close()
	}
}
