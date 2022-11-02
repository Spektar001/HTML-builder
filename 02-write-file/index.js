const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

stdout.write('Введите что-нибудь: ');
stdin.on('data', data => {
	if (data.toString().toLowerCase().trim() === 'exit') {
		process.exit();
	}
	fs.appendFile(
		path.join(__dirname, 'text.txt'),
		data,
		err => {
				if (err) throw err;
		}
	);
	stdout.write('Введите что-нибудь: ');
});
process.on('exit', () => stdout.write('\nУдачи!\n'));
process.on('SIGINT', () => process.exit());
