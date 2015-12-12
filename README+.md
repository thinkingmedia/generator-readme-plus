# readme-plus 
[![Build Status](https://travis-ci.org/thinkingmedia/readme-plus.svg?branch=master)](https://travis-ci.org/thinkingmedia/readme-plus) [![Core Climate](https://codeclimate.com/github/thinkingmedia/readme-plus/badges/gpa.svg)](https://codeclimate.com/github/thinkingmedia/readme-plus) [![Join the chat at https://gitter.im/thinkingmedia/generator-readme-plus](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/thinkingmedia/generator-readme-plus?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

<div><img title="readme-plus" src="https://raw.githubusercontent.com/thinkingmedia/readme-plus/master/readme-plus.png" style="margin: 0 auto;"></div>

Readme+ uses the contents of the current work folder to generate a `README.md` file for the project. Most of your
time is spent in the source code and this is where you can add notes to be included in the output `README.md`.

Readme+ searches for `@readme` markers in the source code comments.

## Naming The Sections

Each heading in a readme file is defined by a section of source code comments that use the `@readme` indicator. The
first word after the `@readme` indicator is the name and default title of the section.

```
/**
* \@readme Install
*
*  Use `npm` to install the `foobar` module.
*
*  ```shell
*  $ npm install foobar
*  ```
*\/
```

In the above example a heading labelled `Installations` will be added under the root section with the markdown text
found in the comment.

## Changing The Section Title

You can customize the heading used for each section by providing title text after declaring the section.

```
/**
* \@readme Install Installation Instructions
*
*  Use `npm` to install the `foobar` module.
*
*  ```shell
*  $ npm install foobar
*  ```
*\/
```
In the above example the default heading `Install` is replaced with `Installation Instructions`.

## Usage

Run `readme` on the command line in the working folder where you want to generate a README.md file.

```shell
$ cd /home/user/work
$ readme
```

The default options assume your working folder contains a sub-folder named `src` that contains
the source code for your project.

```
Usage: readme [options] <path>

Example: readme --source=./www/js /home/mathew/thinkingmedia/readme

Options:
-h, --help       shows this usage message
-v, --version    print version number
-s, --silent     hides copyright message
-d, --debug      show debug message
-t, --trace      write source code references in README.md
--verbose        send README.md output to console
--source         path to source folder (default: ./src)
--trace          write source code references in README.md
--file           name of output file (default: README.md)
```