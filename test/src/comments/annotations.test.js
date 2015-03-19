test('comments/annotations', function($annotations)
{
	it('empty array yields undefined', function()
	{
		var text = $annotations.getReadme([]);
		expect(text).to.equal(undefined);
	});

	it('without @readme result is undefined', function()
	{
		var text = $annotations.getReadme(['this is a comment', 'and another line']);
		expect(text).to.equal(undefined);
	});

	it('the comment has @readme', function()
	{
		var text = $annotations.getReadme(['@readme', 'this line', 'and this line']);
		assert.deepEqual(text, ['@readme', 'this line', 'and this line']);
	});

	it('ignores text before @readme', function()
	{
		var text = $annotations.getReadme(['this will be ignored', '@readme', 'this line', 'and this line']);
		assert.deepEqual(text, ['@readme', 'this line', 'and this line']);
	});

	it('ignores text after @readme', function()
	{
		var text = $annotations.getReadme([
											  '@readme', 'this line', 'and this line',
											  '@param {string} Name this will be ignored'
										  ]);
		assert.deepEqual(text, ['@readme', 'this line', 'and this line']);
	});

	it('ignores text around @readme', function()
	{
		var text = $annotations.getReadme([
											  'this will be ignored', '@readme', 'this line', 'and this line',
											  '@param {string} Name this will be ignored'
										  ]);
		assert.deepEqual(text, ['@readme', 'this line', 'and this line']);
	});
});
