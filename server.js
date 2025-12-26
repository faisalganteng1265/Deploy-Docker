const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

const schema = buildSchema(`
  type Query {
    file(size: FileSize!): File
    files: [File!]!
    home: HomeInfo
  }

  enum FileSize {
    KB_100
    MB_1
    MB_10
  }

  type File {
    name: String!
    size: String!
    content: String!
    sizeInBytes: Int!
  }

  type HomeInfo {
    title: String!
    description: String!
    availableFiles: [FileInfo!]!
  }

  type FileInfo {
    name: String!
    size: String!
    endpoint: String!
  }
`);

const fileMapping = {
  KB_100: { filename: '100kb.html', size: '100KB' },
  MB_1: { filename: '1mb.html', size: '1MB' },
  MB_10: { filename: '10mb.html', size: '10MB' }
};

const root = {
  file: async ({ size }) => {
    const fileInfo = fileMapping[size];
    if (!fileInfo) {
      throw new Error(`File size ${size} not found`);
    }

    const filePath = path.join(__dirname, fileInfo.filename);
    const content = await fs.readFile(filePath, 'utf-8');
    const stats = await fs.stat(filePath);

    return {
      name: fileInfo.filename,
      size: fileInfo.size,
      content: content,
      sizeInBytes: stats.size
    };
  },

  files: async () => {
    const allFiles = await Promise.all(
      Object.entries(fileMapping).map(async ([key, fileInfo]) => {
        const filePath = path.join(__dirname, fileInfo.filename);
        const content = await fs.readFile(filePath, 'utf-8');
        const stats = await fs.stat(filePath);

        return {
          name: fileInfo.filename,
          size: fileInfo.size,
          content: content,
          sizeInBytes: stats.size
        };
      })
    );

    return allFiles;
  },

  home: () => {
    return {
      title: 'Server Uji Coba Aktif',
      description: 'Silakan pilih file yang ingin diakses melalui GraphQL',
      availableFiles: [
        { name: '100kb.html', size: '100KB', endpoint: 'KB_100' },
        { name: '1mb.html', size: '1MB', endpoint: 'MB_1' },
        { name: '10mb.html', size: '10MB', endpoint: 'MB_10' }
      ]
    };
  }
};

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: { headerEditorEnabled: true },
}));

app.get('/', (_req, res) => {
  res.send(`
    <h1>GraphQL Server Uji Coba Aktif</h1>
    <p>Server ini menggunakan GraphQL untuk komunikasi API.</p>
    <h2>Endpoint GraphQL:</h2>
    <ul>
      <li><a href="/graphql">GraphQL Playground: /graphql</a></li>
    </ul>
    <h2>Contoh Query:</h2>
    <pre>
query GetFile {
  file(size: KB_100) {
    name
    size
    content
    sizeInBytes
  }
}

query GetAllFiles {
  files {
    name
    size
    sizeInBytes
  }
}

query GetHome {
  home {
    title
    description
    availableFiles {
      name
      size
      endpoint
    }
  }
}
    </pre>
  `);
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});
