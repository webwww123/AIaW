module.exports = {
  apps: [{
    name: "alaw",
    cwd: "/home/ubuntu/AIaW/src-backend",
    script: "uvicorn",
    args: "app:app --host 0.0.0.0 --port 3050",
    interpreter: "none",
    env: {
      PORT: "3050",
      DEXIE_DB_URL: "https://zuyvfyv41.dexie.cloud"
    },
    exec_mode: "fork"
  }]
}
