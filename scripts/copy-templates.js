const fs = require("fs");
const path = require("path");

function copyFolderSync(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const item of fs.readdirSync(from)) {
    const srcPath = path.join(from, item);
    const destPath = path.join(to, item);
    if (fs.lstatSync(srcPath).isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyFolderSync("src/storage/emailTemplates", "build/storage/emailTemplates");
