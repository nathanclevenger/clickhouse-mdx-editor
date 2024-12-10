import { ClickHouseConfig } from '../types'
import { executeQuery } from './client'
import { SCHEMA_SQL } from './schema'

export async function initializeDatabase(config: ClickHouseConfig): Promise<void> {
  try {
    // Test connection first
    await executeQuery(config, 'SELECT 1')

    // Execute schema creation queries
    const queries = SCHEMA_SQL
      .replace(/{database}/g, config.database)
      .split(';')
      .filter(query => query.trim())
      .map(query => query.trim())

    for (const query of queries) {
      if (query) {
        await executeQuery(config, query)
      }
    }
  } catch (error) {
    console.error('Database initialization failed:', error)
    throw error
  }
}

export async function fetchDocuments(config: ClickHouseConfig): Promise<any[]> {
  const query = `
    SELECT 
      id,
      mdx,
      data,
      created,
      updated
    FROM ${config.database}.data
    WHERE id LIKE '${config.namespace}%'
    FINAL
    FORMAT JSONCompact
  `

  const result = await executeQuery(config, query)
  return Array.isArray(result.data) ? result.data : []
}