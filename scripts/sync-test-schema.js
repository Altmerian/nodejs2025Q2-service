#!/usr/bin/env node

/**
 * Script to automatically sync test schema with main schema
 * Converts PostgreSQL schema to SQLite-compatible test schema
 */

const fs = require('fs');
const path = require('path');

const MAIN_SCHEMA_PATH = path.join(__dirname, '../prisma/schema.prisma');
const TEST_SCHEMA_PATH = path.join(__dirname, '../prisma/test/schema.prisma');

function convertPostgresToSQLite(schemaContent) {
  // Convert PostgreSQL schema to SQLite test schema
  let testSchema = schemaContent;
  
  // Replace generator output path - ensure we use the correct path relative to test schema location
  testSchema = testSchema.replace(
    /output\s*=\s*"\.\/node_modules\/@prisma\/client"/,
    'output = "../node_modules/.prisma/client-test"'
  );
  
  // Also handle case where output is not specified (add it)
  if (!testSchema.includes('output =')) {
    testSchema = testSchema.replace(
      /(generator client \{[\s\S]*?provider = "[^"]+")(\s*\})/,
      '$1\n  output = "../node_modules/.prisma/client-test"$2'
    );
  }
  
  // Replace datasource
  testSchema = testSchema.replace(
    /datasource\s+db\s*\{[\s\S]*?\}/,
    `datasource db {
  provider = "sqlite"
  url      = "file::memory:?cache=shared"
}`
  );
  
  // Convert array fields to string fields for SQLite compatibility
  testSchema = testSchema.replace(
    /(\w+)\s+String\[\]/g,
    '$1 String   @default("[]") // JSON array as string for SQLite'
  );
  
  // Add header comment
  const header = `// Test schema for SQLite - Auto-generated from schema.prisma
// DO NOT EDIT MANUALLY - Run npm run schema:sync-test
// Using flexible string fields for entity references (no FK constraints)
// This maintains existing event-driven cascading behavior

`;
  
  return header + testSchema;
}

function generateDDLFromSchema(schemaContent) {
  // Extract model definitions and convert to DDL
  const models = [];
  const modelRegex = /model\s+(\w+)\s*\{([\s\S]*?)\}/g;
  let match;
  
  while ((match = modelRegex.exec(schemaContent)) !== null) {
    const modelName = match[1];
    const modelBody = match[2];
    
    // Extract table name from @@map
    const mapMatch = modelBody.match(/@@map\("([^"]+)"\)/);
    const tableName = mapMatch ? mapMatch[1] : modelName.toLowerCase();
    
    // Extract fields
    const fields = [];
    const fieldRegex = /(\w+)\s+(String|Int|BigInt|Boolean)([^@\n]*?)(@[^@\n]*?)?$/gm;
    let fieldMatch;
    
    while ((fieldMatch = fieldRegex.exec(modelBody)) !== null) {
      const [, fieldName, fieldType, modifiers, decorators] = fieldMatch;
      
      let sqlType;
      switch (fieldType) {
        case 'String': sqlType = 'TEXT'; break;
        case 'Int': sqlType = 'INTEGER'; break;
        case 'BigInt': sqlType = 'BIGINT'; break;
        case 'Boolean': sqlType = 'BOOLEAN'; break;
        default: sqlType = 'TEXT';
      }
      
      let constraints = '';
      if (decorators) {
        if (decorators.includes('@id')) constraints += ' PRIMARY KEY';
        if (decorators.includes('@unique')) constraints += ' UNIQUE';
        if (!modifiers.includes('?') && !decorators.includes('@default')) constraints += ' NOT NULL';
        
        const defaultMatch = decorators.match(/@default\("([^"]+)"\)|@default\(([^)]+)\)/);
        if (defaultMatch) {
          const defaultValue = defaultMatch[1] || defaultMatch[2];
          if (defaultValue === 'uuid()') {
            // Skip uuid() defaults for SQLite
          } else {
            constraints += ` DEFAULT '${defaultValue}'`;
          }
        }
      } else if (!modifiers.includes('?')) {
        constraints += ' NOT NULL';
      }
      
      fields.push(`  "${fieldName}" ${sqlType}${constraints}`);
    }
    
    // Add unique indexes
    const uniqueFields = [];
    const uniqueRegex = /(\w+)\s+String[^@]*@unique/g;
    let uniqueMatch;
    while ((uniqueMatch = uniqueRegex.exec(modelBody)) !== null) {
      uniqueFields.push(uniqueMatch[1]);
    }
    
    models.push({
      tableName,
      ddl: `CREATE TABLE IF NOT EXISTS "${tableName}" (\n${fields.join(',\n')}\n);`,
      uniqueIndexes: uniqueFields.map(field => 
        `CREATE UNIQUE INDEX IF NOT EXISTS "${tableName}_${field}_key" ON "${tableName}"("${field}");`
      )
    });
  }
  
  return models;
}

function updatePrismaTestService(models) {
  const testServicePath = path.join(__dirname, '../src/prisma/prisma-test.service.ts');
  
  // Generate DDL statements
  const ddlStatements = models.map(model => {
    const statements = [model.ddl, ...model.uniqueIndexes];
    return `      await this.$executeRawUnsafe(\`\n        ${statements.join('\n        ')}\n      \`);`;
  }).join('\n\n');
  
  // Read current service file
  let serviceContent = fs.readFileSync(testServicePath, 'utf-8');
  
  // Replace the pushSchema method content
  const pushSchemaRegex = /(private async pushSchema\(\)\s*\{[\s\S]*?try\s*\{[\s\S]*?\/\/ Create all tables from the schema - this will be auto-synced with schema changes)([\s\S]*?)([\s\S]*?catch)/;
  
  const newPushSchemaContent = `$1
${ddlStatements}
    } $3`;
  
  serviceContent = serviceContent.replace(pushSchemaRegex, newPushSchemaContent);
  
  // Write updated service file
  fs.writeFileSync(testServicePath, serviceContent);
  console.log('✅ Updated PrismaTestService with auto-generated DDL');
}

function main() {
  try {
    console.log('🔄 Syncing test schema with main schema...');
    
    // Read main schema
    const mainSchema = fs.readFileSync(MAIN_SCHEMA_PATH, 'utf-8');
    
    // Convert to test schema
    const testSchema = convertPostgresToSQLite(mainSchema);
    
    // Ensure test directory exists
    const testDir = path.dirname(TEST_SCHEMA_PATH);
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    
    // Write test schema
    fs.writeFileSync(TEST_SCHEMA_PATH, testSchema);
    console.log('✅ Generated SQLite test schema');
    
    // Generate DDL and update PrismaTestService
    const models = generateDDLFromSchema(testSchema);
    updatePrismaTestService(models);
    
    console.log('🎉 Schema sync completed successfully!');
    console.log('📝 Run "npm run test:integration" to test with the updated schema');
    
  } catch (error) {
    console.error('❌ Error syncing schemas:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { convertPostgresToSQLite, generateDDLFromSchema };