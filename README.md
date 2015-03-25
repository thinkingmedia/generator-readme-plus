# null
## Usage

Run readme on the command line in the working folder where you want to generate a README.md file.

```shell
$ cd /home/user/work
$ readme
```

The default options assume your working folder contains a sub-folder named `src` that contains the source code for your project.

```
Usage: readme [options] <path>

Example: readme --source=./www/js /home/mathew/thinkingmedia/readme

Options:
-v, --version    print version number
-s, --silent     hides copyright message
-d, --debug      send README.md output to console
--verbose        show debug message
--source         path to source folder (default: ./src)
--file           name of output file (default: README.md)
```

## Naming The Sections

Each heading in a readme file is defined by a section of source code comments that use the `@readme` indicator. The
first word after the `@readme` indicator is the name and default title of the section.

```
/**
* @readme Install
*
*  Use `npm` to install the `foobar` module.
*
*  ```shell
*  $ npm install foobar
*  ```
*/
```

In the above example a heading labelled `Installations` will be added under the root section with the markdown text
found in the comment.

## Changing The Section Title

You can customize the heading used for each section by providing title text after declaring the section.

```
/**
* @readme Install Installation Instructions
*
*  Use `npm` to install the `foobar` module.
*
*  ```shell
*  $ npm install foobar
*  ```
*/
```
In the above example the default heading `Install` is replaced with `Installation Instructions`.

## null

This is a test.
