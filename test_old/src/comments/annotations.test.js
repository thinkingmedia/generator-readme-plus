throw Error();

test('comments/annotations', function(ann)
{
	it('empty array yields undefined', function()
	{
		var text = ann.getReadme([]);
		expect(text).to.equal(undefined);
	});

	it('without @readme result is undefined', function()
	{
		var text = ann.getReadme(['this is a comment', 'and another line']);
		expect(text).to.equal(undefined);
	});

	it('the comment has @readme', function()
	{
		var text = ann.getReadme(['@readme', 'this line', 'and this line']);
		assert.deepEqual(text, {name: null, title: null, _lines: ['this line', 'and this line']});
	});

	it('ignores text before @readme', function()
	{
		var text = ann.getReadme(['this will be ignored', '@readme', 'this line', 'and this line']);
		assert.deepEqual(text, {name: null, title: null, _lines: ['this line', 'and this line']});
	});

	it('ignores text after @readme', function()
	{
		var text = ann.getReadme([
									 '@readme', 'this line', 'and this line',
									 '@param {string} Name this will be ignored'
								 ]);
		assert.deepEqual(text, {name: null, title: null, _lines: ['this line', 'and this line']});
	});

	it('ignores text around @readme', function()
	{
		var text = ann.getReadme([
									 'this will be ignored', '@readme', 'this line', 'and this line',
									 '@param {string} Name this will be ignored'
								 ]);
		assert.deepEqual(text, {name: null, title: null, _lines: ['this line', 'and this line']});
	});

	it('gets ID from @readme', function()
	{
		expect(ann.getName('')).to.be(null);
		expect(ann.getName('something')).to.be(null);

		expect(ann.getName('@ReadMe smith')).to.be('SMITH');
		expect(ann.getName('@README Smith')).to.be('SMITH');
		expect(ann.getName('@readme    smith   ')).to.be('SMITH');
		expect(ann.getName("@readme\tsmith\t")).to.be('SMITH');
		expect(ann.getName("@readme\t\t \t\t \tsmith\t")).to.be('SMITH');

		expect(ann.getName('@readme one.two.three')).to.be('ONE.TWO.THREE');

		expect(ann.getName('@readme one.two.three "This is a long title"')).to.be('ONE.TWO.THREE');
	});

	it('gets title from @readme', function()
	{
		expect(ann.getTitle('')).to.be(null);
		expect(ann.getTitle('something')).to.be(null);

		expect(ann.getTitle('@readme smith something')).to.be('something');
		expect(ann.getTitle('@readme smith This is a longer title')).to.be('This is a longer title');
		expect(ann.getTitle('@readme   smith \tThis  is   a \t\tlonger title  ')).to.be('This is a longer title');
		expect(ann.getTitle('@readme smith "This is a longer title"')).to.be('This is a longer title');
		expect(ann.getTitle('@readme smith \'This is a longer title\'')).to.be('This is a longer title');
		expect(ann.getTitle('@readme smith "This is a longer title\'')).to.be('"This is a longer title\'');
	});
});
