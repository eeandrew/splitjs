/*!
 * splitjs
 * MIT Licensed
 */
 
/**
 * Module dependencies
 */
var fs = require('fs'),
	async = require('async');
	
exports = module.exports = {
	/**
	 * Split files into smaller parts
	 * @param {String} fileName
	 * @param {Number} fileParts
	 * @param {Function} callback
	 * @api public
	 */
	split : function(fileName,fileParts,callback){
		//You split [fileName] into [fileParts] parts
		if(fileParts <= 0) 
			return callback("Error: " + fileParts + ' not acceptable');
		fs.stat(fileName,function(err,data){
			if(err) return callback(err);
			var totalSize = parseInt(data.size);
			if(totalSize === 0){
				return callback('Error: empty file');
			}
			var	partSize =  Math.floor(totalSize / fileParts);
			if(partSize <= 0){
				return callback('Error: too many file parts');
			}
			var lastSize =  partSize + totalSize%fileParts;
			var fileReader = [];
			var partsNames = [];
			for(var i=0;i<fileParts;i++) {
				var obj={};
				obj.startPos = i*partSize;
				obj.sequence = i+1;
				if (i===fileParts-1) {	
					obj.bufLength = lastSize;
				}else {
					obj.bufLength = partSize;
				}
				fileReader.push(obj);
				partsNames.push(fileName + '.part' +obj.sequence);
			}
			async.eachSeries(fileReader,function(obj,callback){
				var readStream = fs.createReadStream(fileName,{flags:'r',encoding:null,start:obj.startPos,end:obj.startPos+obj.bufLength-1});
				var writeStream = fs.createWriteStream(fileName + '.part' + obj.sequence);
				var ps = readStream.pipe(writeStream);
				ps.on('finish',function(){
					ps = null;
					readStream = null;
					writeStream = null;
					callback();
				});
			},function(err){
				callback(null,partsNames);
			});
		});
	
	},
	/**
	 * Merge smaller files into one large file
	 * @param {Array} fileList
	 * @param {String} fileName
	 * @param {Function} callback
	 * @api public
	 */
	merge : function(fileList,fileName,callback) {
		//You merge the files in [fileList] into [fileName]
		if(!(fileList instanceof Array)) 
			return callback('Error: file list should be an array of String');
		var writeStream = fs.createWriteStream(fileName,{encoding:null,flag:'w'});
		async.eachSeries(fileList,function(file,callback){
				var readStream = fs.createReadStream(file,{flags:'r',encoding:null});
				var ps = readStream.pipe(writeStream,{end:false});
				readStream.on('end',callback);
		},function(err){
			if(err) return callback(err);
			callback(null,fileName);
		});
	},
	/**
	 * Get a file parts from a large file
	 * @param {String} fileName
	 * @param {Number} totalPart
	 * @param {Number} partNumber
	 * @param {Function} callback 
	 * @api public
	 */
	acquire : function(fileName,totalPart,partNumber,callback) {
		if(partNumber<=0 || partNumber > totalPart) 
			return callback('Error: part not existed! Part starts from 1');
		if(totalPart < 0)
			return callback('Error: ' + totalPart + ' not acceptable');
		fs.stat(fileName,function(err,data){
				if(err) return callback(err);
				var totalSize = parseInt(data.size);
				if(totalSize === 0){
					return callback('Error: empty file');
				}
				var	partSize =  Math.floor(totalSize / totalPart);
				if(partSize <= 0){
					return callback('Error: too many file parts');
				}
				var lastSize =  partSize + totalSize%totalPart;
				var startPos = partNumber * partSize;
				var	partLength = partNumber === totalPart ? lastSize : partSize;
				var readStream = fs.createReadStream(fileName,{flags:'r',encoding:null,start:(partNumber-1)*partSize,end:(partNumber-1)*partSize+partLength-1});
				var writeStream = fs.createWriteStream(fileName + '.part' + partNumber);
				var ps = readStream.pipe(writeStream);
				ps.on('finish',function(){
					ps = null;
					readStream = null;
					writeStream = null;
					callback(null,fileName + '.part' + partNumber);
				});
			});
	}
}