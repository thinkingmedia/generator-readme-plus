test('document/section', function($section)
{
	it('strip @readme from name', function()
	{
		var section = new $section.Detail('@readme House', ["This is a test"]);
		assert.equal(section.name, "House");
	});

	it('trim the lines',function()
	{
		var section = new $section.Detail('@readme',["","","This is a test","",""]);
		assert.deepEqual(section.getLines(),["This is a test"]);
	});
});