import { ClickHouseConfig } from './types';

const SCHEMA_SQL = `
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
`;

export async function initializeDatabase(config: ClickHouseConfig): Promise<void> {
  const response = await fetch(config.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${config.username}:${config.password}`)}`,
    },
    body: JSON.stringify({
      query: SCHEMA_SQL.replace(/{database}/g, config.database),
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to initialize database');
  }
}

export async function fetchDocuments(config: ClickHouseConfig): Promise<any[]> {
  const query = `
    SELECT id, mdx, data, created, updated
    FROM ${config.database}.data
    WHERE id LIKE '${config.namespace}%'
    FINAL;
  `;

  const response = await fetch(config.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${config.username}:${config.password}`)}`,
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch documents');
  }

  const result = await response.json();
  return result.data;
}