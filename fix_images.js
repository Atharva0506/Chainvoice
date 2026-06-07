const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('frontend/src');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const regex = /src="\/([^"]+\.(png|svg|gif|jpg|jpeg))"/g;
    content = content.replace(regex, 'src={`\\${import.meta.env.BASE_URL}$1`}');
    fs.writeFileSync(file, content);
});
console.log('Fixed absolute image paths in ' + files.length + ' files');
