"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PieHistoryStub = void 0;
const pie_history_entity_1 = require("../../entities/pie-history.entity");
const bignumber_js_1 = require("bignumber.js");
const histories = [
    {
        underlyingAssets: [
            { address: "0xba100000625a3754423978a60c9317c58a424e3D", amount: "145232089140239205", usd: "3.6685625716824423183" },
            { address: "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD", amount: "20437259837801076081", usd: "5.22895467854075651963" }
        ],
        timestamp: "1628253732831",
        marketCapUSD: new bignumber_js_1.BigNumber("26.13762717355117514798"),
        totalSupply: new bignumber_js_1.BigNumber("26.13762717355117514798"),
        nav: 0,
        decimals: 18
    },
    {
        underlyingAssets: [
            { address: "0xba100000625a3754423978a60c9317c58a424e3D", amount: "145232089140239205", usd: "3.6685625716824423183" },
            { address: "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD", amount: "20437259837801076081", usd: "5.22895467854075651963" }
        ],
        timestamp: "1628253732831",
        marketCapUSD: new bignumber_js_1.BigNumber("26.13762717355117514798"),
        totalSupply: new bignumber_js_1.BigNumber("26.13762717355117514798"),
        nav: 0,
        decimals: 18
    },
];
const PieHistoryStub = () => {
    return histories;
};
exports.PieHistoryStub = PieHistoryStub;
//# sourceMappingURL=pies-history.stubs.js.map