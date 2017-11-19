const {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLFloat,
} = require('graphql');

const GraphQLJSON = require('graphql-type-json');

const CmdName = new GraphQLEnumType({
  name: 'CmdName',
  description: '命令名称',
  values: {
    update: { value: 'update' },
    userDefine: { value: 'userDefine' },
  },
});

const CmdInput = new GraphQLInputObjectType({
  name: 'CmdInput',
  description: '命令结构',
  fields: () => {
    return {
      name: {
        type: CmdName,
      },
      option: {
        type: GraphQLString,
      },
      detail: {
        type: GraphQLString,
      },
    };
  },
});

const executeCmdInput = new GraphQLInputObjectType({
  name: 'executeCmdInput',
  description: '执行命令结构',
  fields: () => {
    return {
      cmds: {
        type: CmdInput,
      },
      isWait: {
        type: GraphQLString,
      },
      email: {
        type: GraphQLString,
      },
    };
  },
});


const VersionType = new GraphQLObjectType({
  name: 'VersionType',
  description: '版本结构',
  fields: () => {
    return {
      env: {
        type: GraphQLString,
      },
      name: {
        type: GraphQLString,
      },
      version: {
        type: GraphQLString,
      },
    };
  },
});

const TokenType = new GraphQLObjectType({
  name: 'TokenType',
  description: 'token',
  fields: () => {
    return {
      token: {
        type: GraphQLString,
      },
      expiresIn: {
        type: GraphQLFloat,
      },
    };
  },
});

const TokenInput = new GraphQLInputObjectType({
  name: 'TokenInput',
  description: '生成token需要的参数',
  fields: () => {
    return {
      id: {
        type: GraphQLString,
      },
    };
  },
});


let query = {
  version: {
    type: VersionType,
    description: '版本',
    resolve() {
      return ExecuteCmdService.getVersion();
    },
  },
  help: {
    type: GraphQLJSON,
    description: '帮助',
    resolve() {
      return ExecuteCmdService.helpInfo;
    },
  },
  wsEndpoint: {
    type: GraphQLString,
    description: '获取HeadlessChrome连接',
    resolve() {
      return HeadlessChromeService.wsEndpoint();
    },
  },
  html: {
    type: GraphQLString,
    description: '获取网页内容',
    args: {
      url: {
        type: new GraphQLNonNull(GraphQLString),
      },
      delay: {
        type: GraphQLFloat,
      },
    },
    resolve(root, args) {
      return HeadlessChromeService.pageContent(args);
    },
  },
};

let mutation = {
  executeCmd: {
    type: GraphQLString,
    description: '执行命令',
    args: {
      cmd: { type: executeCmdInput },
    },
    resolve(root, { cmd }) {
      return ExecuteCmdService.execCmd(cmd);
    },
  },
  generateToken: {
    type: TokenType,
    description: '生成Token',
    args: {
      data: { type: TokenInput },
    },
    resolve(root, { data }) {
      return ExecuteCmdService.generateToken(data);
    },
  },
  reconnect: {
    type: GraphQLString,
    description: '重新连接chrome',
    resolve() {
      return HeadlessChromeService.reconnect();
    },
  },
};

module.exports = {
  query,
  mutation,
};

