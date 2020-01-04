CREATE TABLE history (
    TIMESTAMP TIMESTAMP,
    DEVICE varchar(64),
    TYPE varchar(64),
    EVENT varchar(512),
    READING varchar(64),
    VALUE varchar(255),
    UNIT varchar(32),
    KEY `Search_Idx` (`DEVICE`,`READING`,`TIMESTAMP`,`VALUE`),
    KEY `Device_Idx` (`DEVICE`,`READING`),
    KEY `Report_Idx` (`TIMESTAMP`,`READING`) USING BTREE
);

CREATE TABLE current (
    TIMESTAMP TIMESTAMP,
    DEVICE varchar(64),
    TYPE varchar(64),
    EVENT varchar(512),
    READING varchar(64),
    VALUE varchar(255),
    UNIT varchar(32)
);