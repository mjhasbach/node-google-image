"use strict";

let fs = require('fs'),
    path = require('path'),
    async = require('async'),
    mkDir = require('mkdirp'),
    rmDir = require('rimraf'),
    should = require('chai').should(),
    images,
    googleImage = require('../'),
    tmpDir = path.join(__dirname, '../', 'tmp');

describe('node-google-image', function() {
    before(function(done) {
        mkDir(tmpDir, null, done);
    });
    after(function(done) {
        rmDir(tmpDir, {}, done);
    });
    it('should call back an error if no query is supplied', function(done) {
        new googleImage().search(function(err) {
            should.exist(err);
            done();
        });
    });
    it('should reject the promise if no query is supplied', function(done) {
        new googleImage().search().catch(function(err) {
            should.exist(err);
            done();
        });
    });
    it('should be able to find an image using callbacks', function(done) {
        new googleImage('boat').search(function(err, imgs) {
            should.not.exist(err);
            imgs.should.be.an('array');
            imgs.should.have.length(1);
            done();
        });
    });
    it('should be able to find an image using promises', function(done) {
        new googleImage('car').search().then(function(imgs) {
            imgs.should.be.an('array');
            imgs.should.have.length(1);
            done();
        }).catch(function(err) {
            should.not.exist(err);
            done();
        });
    });
    it('should be able to set the page and quantity using the associated methods', function(done) {
        new googleImage('car')
            .quantity(5)
            .page(1)
            .search()
            .then(function(imgs) {
                imgs.should.be.an('array');
                imgs.should.have.length(5);
                images = imgs;
                done();
            }).catch(function(err) {
                should.not.exist(err);
                done();
            });
    });
    it('should be able to save images using callbacks', function(done) {
        let imgPath = path.join(tmpDir, images[0].fileName);

        images[0].save(imgPath, function(err) {
            should.not.exist(err);

            fs.readFile(imgPath, function(err, data) {
                should.not.exist(err);
                data.should.be.an.instanceOf(Buffer);
                data.length.should.be.above(0);
                done();
            });
        });
    });
    it('should be able to save images using promises', function(done) {
        let imgPath = path.join(tmpDir, images[1].fileName);

        images[1].save(imgPath).then(function() {
            fs.readFile(imgPath, function(err, data) {
                should.not.exist(err);
                data.should.be.an.instanceOf(Buffer);
                data.length.should.be.above(0);
                done();
            });
        }).catch(function(err) {
            should.not.exist(err);
            done();
        });
    });
    it('should be able to supply options using the search method', function(done) {
        new googleImage().search({q: 'bacon', start: 1, rsz: 7}, function(err, imgs) {
            should.not.exist(err);
            imgs.should.be.an('array');
            imgs.should.have.length(7);
            done();
        });
    });
});