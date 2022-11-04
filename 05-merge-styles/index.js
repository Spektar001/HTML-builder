const fs = require('fs');
const path = require('path');

const bundleWriteStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

fs.readdir('./05-merge-styles/styles/', (err, files) => {
	
	if (err) {
		console.error(err);
    return;
  }
	
	for (const file of files) {
		const filePath = path.resolve('05-merge-styles/styles/', file);
		fs.stat(filePath, (err, stats) => {
			if (err) {
				console.error(err);
				return;
			}
			if (stats.isFile() && path.extname(filePath) == '.css') {
				const styleReadStream = fs.createReadStream(filePath, 'utf8');
				styleReadStream.pipe(bundleWriteStream);
			}
		});
	}
	
});