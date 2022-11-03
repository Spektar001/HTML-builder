const fs = require('fs');
const path = require('path');

fs.readdir('./03-files-in-folder/secret-folder/', (err, files) => {
	if (err) {
		console.error(err);
    return;
  }
	files.forEach(el => {
		let filePath = path.resolve('03-files-in-folder/secret-folder', el);
		fs.stat(filePath, (err, stats) => {
			if (err) {
				console.error(err);
				return;
			}
			if (stats.isFile()) {
				console.log(path.basename(filePath, path.extname(filePath)) + ' - '
									+ path.extname(filePath).slice(1) + ' - ' 
									+ (((stats.size / 1024)) +'kb'));
			}
		});
	});
});