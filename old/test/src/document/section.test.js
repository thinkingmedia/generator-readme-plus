test(['document/section','core/line'],function(section,line)
{
	beforeEach(function()
			   {
				   this.root = section.create('ROOT',null);
			   });

	it('converts a string to a line',function()
	{
		this.root.append('hello world');
		expect(this.root.content.length).be(1);
		expect(this.root.content[0].getText()).be('hello world');
	});
});