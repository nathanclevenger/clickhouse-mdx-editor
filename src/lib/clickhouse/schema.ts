export const SCHEMA_SQL = `
CREATE DATABASE IF NOT EXISTS {database};

CREATE TABLE IF NOT EXISTS {database}.oplog (
    id String,
    mdx String,
    data String,
    timestamp DateTime64(3) DEFAULT now64(3),
    operation Enum('create' = 1, 'update' = 2, 'delete' = 3)
) ENGINE = MergeTree()
ORDER BY (timestamp, id);

CREATE TABLE IF NOT EXISTS {database}.data (
    id String,
    mdx String,
    data String,
    created DateTime64(3),
    updated DateTime64(3),
    sign Int8
) ENGINE = VersionedCollapsingMergeTree(sign, id)
ORDER BY (id);

CREATE MATERIALIZED VIEW IF NOT EXISTS {database}.data_mv TO {database}.data AS
SELECT
    id,
    mdx,
    data,
    if(operation = 'create', timestamp, null) as created,
    timestamp as updated,
    if(operation = 'delete', -1, 1) as sign
FROM {database}.oplog;
`