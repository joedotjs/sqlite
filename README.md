# Install nodewebkit (globally):
```bash
sudo npm install -g nodewebkit@0.8.6
```

# Install sqlite3 (local to project)
```bash
npm install sqlite3 --build-from-source --runtime=node-webkit --target_arch=ia32 --target=0.8.6
```

If your sqlite file is gonna be elsewhere, change this path: https://github.com/joedotjs/sqlite/blob/master/index.js#L10