#!/usr/bin/env bash
# One-shot script that turns the local MongoDB standalone into a
# single-node replica set (rs0) so Prisma transactions work.
#
# Usage:
#   sudo bash scripts/enable-mongo-replica.sh
#
# Idempotent: safe to re-run.

set -euo pipefail

CONF="/etc/mongod.conf"
RS_NAME="rs0"

if [[ $EUID -ne 0 ]]; then
  echo "ERROR: please run with sudo." >&2
  exit 1
fi

if [[ ! -f "$CONF" ]]; then
  echo "ERROR: $CONF not found. Is mongodb-org / mongodb installed?" >&2
  exit 1
fi

echo "==> Backing up $CONF -> $CONF.bak.$(date +%s)"
cp "$CONF" "$CONF.bak.$(date +%s)"

echo "==> Ensuring replication config is present in $CONF"
if grep -qE "^\s*replSetName\s*:\s*$RS_NAME" "$CONF"; then
  echo "    Already configured for replSet=$RS_NAME"
else
  # Remove any existing replication block (commented or active) and append a fresh one
  sed -i -E '/^#?replication:/,/^[^[:space:]#]/{/^[^[:space:]#]/!d}' "$CONF"
  # Trim any trailing blank lines left behind, then append
  printf "\nreplication:\n  replSetName: %s\n" "$RS_NAME" >> "$CONF"
fi

echo "==> Restarting mongod"
systemctl restart mongod
sleep 2

echo "==> Waiting for mongod to accept connections..."
for i in {1..20}; do
  if mongosh --quiet --eval 'db.runCommand({ping:1}).ok' >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

echo "==> Initiating replica set (if not already initiated)"
mongosh --quiet --eval "
  try {
    var s = rs.status();
    print('    Replica set already initiated: ' + s.set);
  } catch (e) {
    var r = rs.initiate({ _id: '$RS_NAME', members: [{ _id: 0, host: '127.0.0.1:27017' }] });
    print('    rs.initiate ok=' + r.ok);
  }
"

echo "==> Waiting for node to become PRIMARY..."
for i in {1..30}; do
  if mongosh --quiet --eval 'db.hello().isWritablePrimary' 2>/dev/null | grep -q true; then
    echo "    PRIMARY is up."
    break
  fi
  sleep 1
done

echo "==> Final status:"
mongosh --quiet --eval "
  var h = db.hello();
  print('    setName:  ' + (h.setName || '<none>'));
  print('    primary:  ' + h.isWritablePrimary);
  print('    me:       ' + h.me);
"

echo
echo "Done. You can now run:  npm run setup && npm run dev"
