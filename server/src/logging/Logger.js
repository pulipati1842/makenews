/* eslint no-sync:0 max-depth:0 */
"use strict";
import EnvironmentConfig from "../config/EnvironmentConfig";
import winston from "winston";
import fs from "fs";
import path from "path";

export const logLevel = { "LOG_INFO": "info", "LOG_DEBUG": "debug", "LOG_ERROR": "error", "LOG_WARN": "warn" },
    logType = { "CONSOLE": 0, "FILE": 1, "CONSOLE_FILE": 2 },
    logCategories = { "DEFAULT": "default", "HTTP": "http", "DATABASE": "database", "AUTHORIZATION": "authorization" };
let defaultCategoryLogger = null, defaultLogger = null, categoriesInitialized = false;
export let LOG_DIR = path.join(__dirname, "../../logs");
let LOG_FILE = "defaultLog.log";

export default class Logger {

    constructor(logger) {
        this.logger = logger;
    }

    static initialize() {
        Logger.createDir(LOG_DIR);
        if(!Logger._getDefaultLogger()) {
            defaultLogger = new winston.Logger({
                "transports": [new (winston.transports.File)({
                    "dirname": LOG_DIR,
                    "filename": LOG_FILE,
                    "level": logLevel.LOG_INFO
                })
                ]
            });
        }
        if(!Logger._isCategoriesInitialized()) {
            Logger._readLogConfig(EnvironmentConfig.files.LOGGING);
        }
    }

    static _getDefaultLogger() {
        return defaultLogger;
    }

    static createDir(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }

    static _isCategoriesInitialized() {
        return categoriesInitialized;
    }

    static instance(categoryName) {
        Logger.initialize();
        if(categoryName) {
            return new Logger(winston.loggers.get(categoryName));
        }
        return new Logger();
    }

    static _getDefaultCategoryLogger() {
        return defaultCategoryLogger;
    }

    static _createCategoryLoggers(logConfigJson = {}) {
        if(logConfigJson !== {}) {
            let environment = EnvironmentConfig.instance(EnvironmentConfig.files.APPLICATION);
            let loggingConfig = logConfigJson[environment.environment];
            if(loggingConfig) {
                let logDir = LOG_DIR;
                if(loggingConfig.dir) {
                    logDir = path.join(__dirname, loggingConfig.dir);
                    try {
                        Logger.createDir(logDir);
                    } catch(error) {
                        Logger._getDefaultLogger().error("Unable to create directory %s. Error: ", logDir, error);
                        logDir = LOG_DIR;
                    }
                }
                for (let loggerName of Object.keys(loggingConfig)) {
                    let categoryConfig = loggingConfig[loggerName];
                    if (categoryConfig.file) {
                        categoryConfig.file.dirname = logDir;
                    }
                    try {
                        winston.loggers.add(loggerName, categoryConfig);
                        if(loggerName === logCategories.DEFAULT) {
                            defaultCategoryLogger = winston.loggers.get(loggerName);
                        }
                    } catch(error) {
                        Logger._getDefaultLogger().log(logLevel.LOG_ERROR, "Creating logger for %s failed with error %s", loggerName, error);
                    }
                }
                categoriesInitialized = true;
            }
        }
    }

    static _getJson(relativefilePath) {
        try {
            return JSON.parse(fs.readFileSync(relativefilePath, "utf8"));
        } catch (err) {
            return {};
        }
    }

    static fileInstance(fileName, level = logLevel.LOG_INFO) {
        Logger.createDir(LOG_DIR);
        let fileOptions = { "filename": fileName, "level": level };
        return Logger.customInstance(fileOptions);
    }

    static customInstance(options = []) {
        return new Logger(this._createLogger(options));
    }

    static _readLogConfig(relativefilePath) {
        let logConfigJSON = Logger._getJson(relativefilePath);
        Logger._createCategoryLoggers(logConfigJSON);
    }

    static _createLogger(options) {
        let transports = Logger._createTransports(options);
        return new winston.Logger({
            "transports": transports
        });
    }

    static _createTransports(options) {
        let transports = [];
        switch (options.logType) {
        case logType.CONSOLE:
            transports.push(Logger._createConsoleTransport(options));
            break;
        case logType.FILE:
            transports.push(Logger._createFileTransport(options));
            break;
        case logType.CONSOLE_FILE:
            transports.push(Logger._createFileTransport(options));
            transports.push(Logger._createConsoleTransport(options));
            break;
        default:
            transports.push(Logger._createFileTransport(options));
        }
        return transports;
    }

    static _createFileTransport(options) {
        return new (winston.transports.File)({
            "dirname": LOG_DIR,
            "filename": options.filename ? options.filename : LOG_FILE,
            "level": options.level ? options.level : logLevel.LOG_INFO,
            "maxsize": 20000,
            "maxFiles": 10,
            "tailable": true,
            "timestamp": function() {
                return Date.now();
            },
            "rotationFormat": this.getFormattedDate
        });
    }

    static _createConsoleTransport(options) {
        return new (winston.transports.Console)({ "level": options.level, "colorize": true });
    }

    getFormattedDate() {
        let currentDate = new Date();
        return this.appendZero(currentDate.getFullYear()) +
            this.appendZero(1 + currentDate.getMonth()) +
            this.appendZero(currentDate.getDate());
    }

    appendZero(value) {
        let maxValue = 10;
        return (value < maxValue) ? "0" + value : String(value);
    }

    getLogger() {
        return this.logger || Logger._getDefaultCategoryLogger() || Logger._getDefaultLogger();
    }

    debug(message, ...insertions) {
        this.getLogger().log(logLevel.LOG_DEBUG, message, insertions);
    }
    info(message, ...insertions) {
        this.getLogger().log(logLevel.LOG_INFO, message, insertions);
    }
    warn(message, ...insertions) {
        this.getLogger().log(logLevel.LOG_WARN, message, insertions);
    }
    error(message, ...insertions) {
        this.getLogger().log(logLevel.LOG_ERROR, message, insertions);
    }

    log(level, message, insertions) {
        this.getLogger().log(level, message, insertions, {});
    }
}
