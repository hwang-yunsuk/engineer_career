// const.js

export const constObj = {
  businessCategoryPH: '公共　教育　金融など...',
  systemNamePH: '例：官公庁向け　固定資産税家屋評価システム開発および導入',
  workDetailsPH: [
    '【主な内容】',
    '・パッケージ改修に関する顧客折衝',
    '・カスタマイズおよび仕様追加のプログラミング',
    '・導入及び顧客へ操作教育',
    '・システム保守'
  ].join('\n')
}

export const osType = {
  personalComputerOS: {
    type: 'パーソナルコンピュータOS',
    examples: ['Microsoft Windows', 'macOS', 'Linux']
  },
  mobileOS: {
    type: 'モバイルOS',
    examples: ['Android', 'iOS', 'HarmonyOS']
  },
  serverOS: {
    type: 'サーバーOS',
    examples: ['Windows Server', 'Ubuntu Server', 'Red Hat Enterprise Linux (RHEL)', 'CentOS']
  }
}

export const databaseTypes = {
  relationalDatabase: {
    type: 'リレーショナルデータベース管理システム (RDBMS)',
    examples: ['MySQL', 'PostgreSQL', 'Oracle Database', 'Microsoft SQL Server', 'SQLite']
  },
  documentOrientedDatabase: {
    type: 'ドキュメント指向データベース',
    examples: ['MongoDB', 'CouchDB']
  },
  keyValueStore: {
    type: 'キーバリューストア',
    examples: ['Redis', 'Riak', 'Amazon DynamoDB']
  },
  columnOrientedDatabase: {
    type: 'カラム指向データベース',
    examples: ['Apache Cassandra', 'HBase', 'Google Bigtable']
  },
  graphDatabase: {
    type: 'グラフデータベース',
    examples: ['Neo4j', 'Amazon Neptune', 'OrientDB']
  },
  objectDatabase: {
    type: 'オブジェクトデータベース',
    examples: ['ObjectDB', 'db4o']
  },
  timeSeriesDatabase: {
    type: '時系列データベース',
    examples: ['InfluxDB', 'TimescaleDB', 'OpenTSDB']
  },
  multiModelDatabase: {
    type: 'マルチモデルデータベース',
    examples: ['ArangoDB', 'Couchbase', 'MarkLogic']
  },
  distributedDatabase: {
    type: '分散データベース',
    examples: ['CockroachDB', 'Amazon Aurora']
  }
}

export const developmentLanguagesAndTools = {
  programmingLanguages: {
    type: 'プログラミング言語',
    examples: ['JavaScript', 'Python', 'Java', 'C#', 'C++', 'Ruby', 'Go', 'PHP', 'Swift', 'Kotlin']
  },
  frontendFrameworks: {
    type: 'フロントエンドフレームワーク',
    examples: ['React', 'Vue.js', 'Angular', 'Svelte', 'Ember.js', 'Backbone.js']
  },
  backendFrameworks: {
    type: 'バックエンドフレームワーク',
    examples: [
      'Express.js',
      'Django',
      'Flask',
      'Spring Boot',
      'Ruby on Rails',
      'Laravel',
      'ASP.NET Core',
      'Koa.js',
      'FastAPI'
    ]
  },
  mobileDevelopment: {
    type: 'モバイル開発',
    examples: ['Swift (iOS)', 'Kotlin (Android)', 'React Native', 'Flutter', 'Xamarin', 'Ionic']
  },
  ciCdTools: {
    type: 'CI/CDツール',
    examples: ['Jenkins', 'GitLab CI/CD', 'CircleCI', 'Travis CI', 'Bamboo', 'Azure Pipelines']
  },
  containerization: {
    type: 'コンテナ化ツール',
    examples: ['Docker', 'Kubernetes']
  },
  cloudPlatforms: {
    type: 'クラウドプラットフォーム',
    examples: [
      'AWS (Amazon Web Services)',
      'Azure',
      'Google Cloud Platform',
      'IBM Cloud',
      'Oracle Cloud'
    ]
  }
}

export const projectPhase = {
  projectPhase: {
    type: '担当工程',
    examples: [
      '企画',
      '調査分析',
      '基本設計',
      '詳細設計',
      '製造・構築',
      '単体テスト',
      '結合テスト',
      '保守・運用',
      'ユーザ指導'
    ]
  },
  assignee: {
    type: '担当',
    examples: ['リーダー', 'サブリーダー']
  }
}
