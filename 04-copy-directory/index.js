const fs = require('fs');
const path = require('path');

function copyDir() {
	
	fs.mkdir(path.join(__dirname, 'files-copy'), {recursive: true}, err => {
		if (err) {
			console.error(err);
			return;
		}
	});

	fs.readdir('./04-copy-directory/files/', (err, files) => {
		if (err) {
			console.error(err);
			return;
		}
		files.forEach(el => {
			let filePath = path.resolve('04-copy-directory/files', el);
			let filesCopy = path.resolve('04-copy-directory/files-copy', el);
			fs.copyFile(filePath, filesCopy, err => {
				if (err) {
					console.error(err);
					return;
				}
			});
		});
	});
}
fs.promises.rm(path.join(__dirname, 'files-copy'), { recursive: true, force: true }, err => {
	if (err) {
		console.error(err);
		return;
	}
}).then(copyDir);