test('services/git', function(git)
{
	it('ignores these types of urls',function()
	{
		expect(git.getUserRepo('')).not.ok();
		expect(git.getUserRepo('http://gitbox.com/person/repo')).not.ok();
		expect(git.getUserRepo('file:///person/repo')).not.ok();
		expect(git.getUserRepo('/opt/git/repo.git')).not.ok();
		expect(git.getUserRepo('/home/john/project')).not.ok();
		expect(git.getUserRepo('http://github.com/thinkingmedia')).not.ok();
		expect(git.getUserRepo('http://github.com/thinkingmedia/')).not.ok();
	});

	it('supports these types of urls',function()
	{
		expect(git.getUserRepo('https://github.com/thinkingmedia/readme-plus')).eql({'user':'thinkingmedia','repo':'readme-plus','branch':'master'});
		expect(git.getUserRepo('https://github.com/thinkingmedia/readme-plus.git')).eql({'user':'thinkingmedia','repo':'readme-plus','branch':'master'});
		expect(git.getUserRepo('http://github.com/thinkingmedia/readme-plus')).eql({'user':'thinkingmedia','repo':'readme-plus','branch':'master'});
		expect(git.getUserRepo('http://github.com/thinkingmedia/readme-plus.git')).eql({'user':'thinkingmedia','repo':'readme-plus','branch':'master'});

		expect(git.getUserRepo('https://github.com/thinkingmedia/readme.git')).eql({'user':'thinkingmedia','repo':'readme','branch':'master'});
		expect(git.getUserRepo('http://github.com/thinkingmedia/readme.git')).eql({'user':'thinkingmedia','repo':'readme','branch':'master'});
		expect(git.getUserRepo('http://github.com/thinkingmedia/readme')).eql({'user':'thinkingmedia','repo':'readme','branch':'master'});
		expect(git.getUserRepo('http://github.com/thinkingmedia/readme/tree/trunk')).eql({'user':'thinkingmedia','repo':'readme','branch':'master'});
		expect(git.getUserRepo('http://github.com/thinkingmedia/readme?q=asd')).eql({'user':'thinkingmedia','repo':'readme','branch':'master'});
		expect(git.getUserRepo('http://github.com/thinkingmedia/readme#master')).eql({'user':'thinkingmedia','repo':'readme','branch':'master'});
		expect(git.getUserRepo('git://github.com/thinkingmedia/readme')).eql({'user':'thinkingmedia','repo':'readme','branch':'master'});
		expect(git.getUserRepo('git@github.com/thinkingmedia/readme')).eql({'user':'thinkingmedia','repo':'readme','branch':'master'});
	});
});