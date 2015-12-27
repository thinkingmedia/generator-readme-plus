throw Error();

test('core/line',function(line)
{
	it("creates an array",function()
	{
		var lines = line.create("one\r\ntwo\r\n\r\nthree\r\n");

		assert.equal(lines.length,5);
		assert.equal(lines[0].getText(),"one");
		assert.equal(lines[1].getText(),"two");
		assert.equal(lines[2].getText(),"");
		assert.equal(lines[3].getText(),"three");
		assert.equal(lines[4].getText(),"");

		assert.equal(lines[0].getNum(),1);
		assert.equal(lines[1].getNum(),2);
		assert.equal(lines[2].getNum(),3);
		assert.equal(lines[3].getNum(),4);
		assert.equal(lines[4].getNum(),5);
	});

	it("can read/write text",function()
	{
		var a = new line.Line(10,"Hello World");
		assert.equal(a.getNum(),10);
		assert.equal(a.getText(),"Hello World");
		a.setText("Space");
		assert.equal(a.getText(),"Space");
	});

	it("can be cloned",function()
	{
		var a = new line.Line(10,"Hello World");
		var b = a.clone();
		assert.notStrictEqual(a,b);

		b.setText("Space");
		assert.equal(a.getText(),"Hello World");
		assert.equal(b.getText(),"Space");

		assert.equal(10, a.getNum());
		assert.equal(10, b.getNum());
	});

	it("read as escaped", function()
	{
		var a = new line.Line(1,"\\Hello \\\\World");
		assert.equal(a.unescape(),"Hello \\World");
	});
});