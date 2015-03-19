test('comments/search', function($search)
{
	it('a simple comment', function()
	{
		var comments = $search.findComments("/** test **/");
		assert.deepEqual(comments, [['/** test **/']]);
	});

	it('two comments', function()
	{
		var comments = $search.findComments("/** test1 **/\n/** test2 **/");
		assert.deepEqual(comments, [['/** test1 **/'], ['/** test2 **/']]);
	});

	it('a long comment', function()
	{
		var comments = $search.findComments($fs.readFileSync(__data + "long_comment.txt", {'encoding': 'UTF-8'}));
		assert.deepEqual(comments, [
			[
				"/**", "* This is a very long comment.", "*", "* It has many lines and long text and such.", "*/"
			]
		]);
	});
});