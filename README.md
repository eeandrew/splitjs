splitjs
=======
splitjs can split file into smaller parts. This feature is especially usefull if you need to transfer this file via internet since
you can use multiple threads to transfer the file parts.

## Split File
Here is how you split a file using splitjs

```js
var splitjs = require('splitjs');
splitjs.split('fileToSplit',10,function(err,list){
  //deal with the file parts here
})
```

## Merge File
splitjs also provides a merge function to merge all the parts into one complete file. 

Here is how you use it

```js
var splitjs = require('splitjs');
splitjs.merge(fileList,newFileName,function(err,newFileName){
  //deal with the new file here
})
```

## Acquire File Part
You can also create a specific file part using splitjs. When you transfer the splitted files, it is possible that some
parts will get lost or corrupted. In this case, you can make the specific file part by using acquire.

```js
var splitjs = rquire('splitjs');
splitjs.acquire(fileName,totolPart,partNumber,function(err,partName){
  //deal with the part here
})
```

## Author List
[eeandrew](https://github.com/eeandrew)
[marqing](https://github.com/marching118)
[chad](https://github.com/chadliu23)
