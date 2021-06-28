const { ChainID, ChainType } = require("@harmony-js/utils");

module.exports = {
  networks: [
    {
      id: 1,
      chainId: ChainID.HmyMainnet,
      name: "Freyala Mainnet",
      apiUrl: "https://ams-hmy-rpc.freyala.com",
      type: ChainType.Harmony,
    },
    {
      id: 2,
      chainId: ChainID.HmyMainnet,
      name: "Harmony Mainnet",
      apiUrl: "https://api.s0.t.hmny.io",
      type: ChainType.Harmony,
    },
    {
      id: 3,  
      chainId: ChainID.HmyTestnet,
      name: "Harmony Testnet",
      apiUrl: "https://api.s0.b.hmny.io",
      type: ChainType.Harmony,
    },
    {
      id: 4,
      chainId: ChainID.HmyPangaea,
      name: "Harmony Pangaea",
      apiUrl: "https://api.s0.pga.hmny.io",
      type: ChainType.Harmony,
    },
    {
      id: 5,
      chainId: ChainID.HmyLocal,
      name: "Harmony Localnet",
      apiUrl: "http://127.0.0.1:9500",
      type: ChainType.Harmony,
    },
  ],
};
