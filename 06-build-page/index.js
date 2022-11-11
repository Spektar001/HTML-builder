const fs = require('fs');
const path = require('path');


// создаем папку project-dist
fs.mkdir(path.join(__dirname, 'project-dist'), {recursive: true}, err => {
	if (err) {
		console.error(err);
		return;
	}
});

// создание шаблонного index.html
async function htmlBundler() {
  const pathProjectDist = path.join(__dirname, 'project-dist');// путь к папке project-dist
  const pathComponentsFolder = path.join(__dirname, 'components'); // путь к папке components
  const pathTemplateHtml = path.join(__dirname, 'template.html'); // путь к файлу template.html
  let dataTemplateHtml = await fs.promises.readFile(pathTemplateHtml, 'utf-8'); // содержимое файла template.html
  const arr = await fs.promises.readdir(pathComponentsFolder, { withFileTypes: true }); // массив обьектов из папки components
  for (let i in arr) {
    if (arr[i].isFile() && path.extname(arr[i].name) === '.html') { // проверка что файл является файлом и у него расширение .html
      const pathFile = path.join(pathComponentsFolder, arr[i].name); // путь к текущему файлу
      const data = await fs.promises.readFile(pathFile, 'utf-8'); // содержимое текущего файла
      dataTemplateHtml = dataTemplateHtml.replace(`{{${path.basename(arr[i].name, '.html')}}}`, data); // замена шаблонного тега на содержимое текущего файла
    }
  }
  fs.writeFile(path.join(pathProjectDist, 'index.html'), dataTemplateHtml, err => { if (err) throw err }); // создает html файл с измененным содержимым
}
htmlBundler();

// копируем папку assets и ее содержимое в папку project-dist/assets
function copyAssets() {

	fs.mkdir(path.join(__dirname, 'project-dist', 'assets'), {recursive: true}, err => {
		if (err) {
			console.error(err);
			return;
		}
	});

	fs.readdir('./06-build-page/assets/', (err, files) => {
		if (err) {
			console.error(err);
			return;
		}
		files.forEach(el => {
			fs.mkdir(path.join(__dirname, 'project-dist/assets', el), {recursive: true}, err => {
				if (err) {
					console.error(err);
					return;
				}
			});
			let sourcePath = path.resolve('06-build-page/assets', el); // путь исходных папок assets
			let sourceCopy = path.resolve('06-build-page/project-dist/assets', el); // путь папок которые скопируются в project-dist/assets
			fs.readdir(sourcePath, (err, files) => {
				if (err) {
					console.error(err);
					return;
				}
				for (const file of files) {
					let filePath = path.join(sourcePath, file); // пусть исходных файлов
					let fileCopy = path.join(sourceCopy, file); // путь файлов которые скопируются
					fs.copyFile(filePath, fileCopy, err => {
						if (err) {
							console.error(err);
							return;
						}
					});
				}
			});
		});
	});
}
fs.promises.rm(path.join(__dirname, 'project-dist', 'assets'), { recursive: true, force: true }, err => {
	if (err) {
		console.error(err);
		return;
	}
}).then(copyAssets);

// создание единого style.css в project-dist
const bundleWriteStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));

fs.readdir('./06-build-page/styles/', (err, files) => {
	if (err) {
		console.error(err);
    return;
  }
	for (const file of files) {
		const filePath = path.resolve('06-build-page/styles/', file);
		fs.stat(filePath, (err, stats) => {
			if (err) {
				console.error(err);
				return;
			}
			if (stats.isFile() && path.extname(filePath) == '.css') {
				const styleReadStream = fs.createReadStream(filePath, 'utf-8');
				styleReadStream.pipe(bundleWriteStream);
			}
		});
	}
});