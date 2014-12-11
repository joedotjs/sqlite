var sqlite3 = require('sqlite3').verbose();
var BPromise = require('bluebird');
var _ = require('lodash');
var fs = require('fs');

var sequelAight = angular.module('Sequel Aight', []);

sequelAight.service('DB', function () {

    var db = BPromise.promisifyAll(new sqlite3.Database('./testing.sqlite'));

    var dbStarted = (function () {
        return new BPromise(function (resolve, reject) {
            db.on('open', resolve);
        });
    })();

    this.getTables = function () {

        var gotTables = dbStarted.then(function () {
           return db.allAsync('SELECT * FROM sqlite_master WHERE type="table"');
        });

        return gotTables.then(function (tables) {
            return _.pluck(tables, 'tbl_name');
        });

    };

    this.getTableColumns = function (tableName) {

        var gotColumns = dbStarted.then(function () {
           return db.allAsync('PRAGMA table_info(' + tableName + ')');
        });

        return gotColumns.then(function (columns) {
            return _.pluck(columns, 'name');
        });

    };


    this.getTableData = function (tableName) {

        var gotData = dbStarted.then(function () {
           return db.allAsync('SELECT * FROM ' + tableName);
        });

        return gotData;

    };

});

sequelAight.controller('Testing', function ($scope, DB) {

    $scope.tables = [];
    $scope.fields = [];
    $scope.currentTable = null;

    DB.getTables().then(function (tables) {
        $scope.tables = tables;
        $scope.$digest();
    });

    $scope.setCurrentTable = function (tableName) {

        $scope.currentTable = tableName;

        var getColumns = DB.getTableColumns(tableName).then(function (cols) {
            $scope.fields = cols;
        });

        var getData = DB.getTableData(tableName).then(function (data) {
            $scope.results = data;
        });

        BPromise.all([getColumns, getData]).then(function () {
           $scope.$digest();
        });

    };

});
