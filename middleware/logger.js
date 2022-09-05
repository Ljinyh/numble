// 로깅모듈
const winston = require("winston");
const winstonDaily = require("winston-daily-rotate-file");
const process = require("process");

const { combine, timestamp, label, printf } = winston.format;
const logDir = `${process.cwd()}/logs`;
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
    format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
    transports: [
        new winstonDaily({
            level: "info",
            dataPattern: "YYYY-MM-DD",
            dirname: logDir,
            filename: `%DATE%.log`,
            maxFile: "7d",
            zippedArchive: true,
        }),

        new winstonDaily({
            level: "error",
            dataPattern: "YYYY-MM-DD",
            dirname: logDir + "/error",
            filename: `%DATE%.error.log`,
            maxFile: "7d",
            zippedArchive: true,
        }),
    ],
});

logger.add(
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        ),
    })
);

const stream = {
    write: (message) => {
        logger.info(message);
    },
};

module.exports = { logger, stream };