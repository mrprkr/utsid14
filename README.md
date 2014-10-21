# UTS ID14

#### Dependencies

* [node.js](http://nodejs.org/)
* [gulp.js](http://gulpjs.com/)
* [Bower](http://bower.io/)


#### Install dev dependencies

```sh
$ cd 
$ npm install
$ bower install
```

#### Compile and run local server

```sh
$ gulp
```

#### Known Bugs

Issue: When isotope loads layout before images, bricks ovelap
Workaround: Re-load page, re-size page
Solution: use imagesloaded to call isotope to relayout

