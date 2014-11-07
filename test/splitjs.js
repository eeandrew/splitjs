var assert = require('assert'),
	splitjs = require('../index'),
	should = require('should'),
	fs = require('fs');

	
	describe('split merge and acquire',function(){	
		describe('1. split',function(){
			it('should split text.txt into 3 parts',function(done){
				fs.writeFile('test.txt','hello world',function(err){
						if(err) throw err;
						splitjs.split('test.txt',3,function(err,list){
							assert(!err);
							list.length.should.equal(3);
							done();
					})
				})
			})
			
			it('should not split text.txt into more than 11 parts',function(done){
				fs.writeFile('test.txt','hello world',function(err){
						if(err) throw err;
						splitjs.split('test.txt',12,function(err,list){
							assert(err);
							done();
					})
				})
			})
			
			it('should not split text.txt into negative parte',function(done){
				fs.writeFile('test.txt','hello world',function(err){
						if(err) throw err;
						splitjs.split('test.txt',-1,function(err,list){
							assert(err);
							done();
					})
				})
			})
			
			it('should not split text.txt into zero parte',function(done){
				fs.writeFile('test.txt','hello world',function(err){
						if(err) throw err;
						splitjs.split('test.txt',0,function(err,list){
							assert(err)
							done()
					})
				})
			})
			
			it('should split bytes into parts',function(done){
				fs.writeFile('test.txt','hello world',function(err){
						if(err) throw err;
						splitjs.split('test.txt',11,function(err,list){
							assert(list.length === 11)
								fs.readFile(list[10],{encoding:'utf8'},function(err,data){
										assert('d' == data);
										done();
								})	
					})
				})
			})
		})
		
		describe('2. merge',function(){
			it('should not pass a non-array',function(done){
				var obj = {};
				splitjs.merge(obj,'shouldnotexist',function(err,data){
					assert(err);
					done();
				})
			})
			
			it('should merge files into one complete file',function(done){
				fs.writeFile('test.txt','hello world',function(err){
						if(err) throw err
						splitjs.split('test.txt',11,function(err,list){
							assert(!err)
							assert(list.length === 11);
							splitjs.merge(list,'test-merge.txt',function(err,data){
								assert(!err)
								assert(data === 'test-merge.txt')
								fs.readFile('test-merge.txt',{encoding:'utf8'},function(err,data){
									assert(!err);									
									assert(data === 'hello world')
									done();
								})
							})
					})
				})
			})
		})
		
		describe('3. acquire',function(){
		
			it('should not pass negative number',function(done){
				fs.writeFile('test.txt','hello world',function(err){
						if(err) throw err
						splitjs.acquire('test.txt',-11,-2,function(err,list){
							assert(err)
							done()
						})
				})
			})
			
			it('should aquire the correct part',function(done){
				fs.writeFile('test.txt','hello world',function(err){
						if(err) throw err
						splitjs.acquire('test.txt',11,2,function(err,file){
							assert(!err)
							fs.readFile(file,{encoding:'utf8'},function(err,data){
								assert(!err)
								assert(data === 'e')
								done();
							})
						})
				})
			})
		})
		
	})
	