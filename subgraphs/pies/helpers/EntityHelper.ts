import { BigInt, ethereum, Address } from "@graphprotocol/graph-ts"
import { Holder, Token, GlobalStat, HoldersCounter, Position, PieLog, TokenInPieTransaction } from "../generated/schema"
import { ERC20 } from "./ERC20"
const UNIQUE_STAT_ID = "unique_stats_id"
export class EntityHelper {

  constructor() {}

  static loadGlobalStats(): GlobalStat {
    let stats = GlobalStat.load(UNIQUE_STAT_ID);

    if(stats == null) {
      stats = new GlobalStat(UNIQUE_STAT_ID);
      stats.save();
    }
    
    return <GlobalStat>stats;
  }

  static loadHoldersCounter(symbol: string): HoldersCounter {
    let holdersCounter = HoldersCounter.load(symbol);
    let stats = this.loadGlobalStats();

    if(holdersCounter == null) {
      holdersCounter = new HoldersCounter(symbol);
      holdersCounter.count = BigInt.fromI32(0);
      holdersCounter.globalStat = stats.id;
      holdersCounter.save();
    }

    return <HoldersCounter>holdersCounter;
  }

  static incrementHoldersCounter(symbol: string): HoldersCounter {
    let holdersCounter = this.loadHoldersCounter(symbol);

    holdersCounter.count = holdersCounter.count.plus(BigInt.fromI32(1));
    holdersCounter.save();

    return <HoldersCounter>holdersCounter;
  }

  static loadHolder(id: string, tokenContract: ERC20): Holder {
    let holder = Holder.load(id);

    if (holder == null) {
      holder = new Holder(id);
      holder.save();

      this.incrementHoldersCounter(tokenContract.symbol());
    }

    return <Holder>holder;
  }

  static loadToken(tokenContract: ERC20): Token {
    let token = Token.load(tokenContract._address.toHex());

    if (token == null) {
      token = new Token(tokenContract._address.toHex());
      token.name = tokenContract.name();
      token.symbol = tokenContract.symbol();
      token.decimals = BigInt.fromI32(tokenContract.decimals());
      token.save();
    }
    
    return <Token>token;
  }

  static loadPosition(holder: Holder, token: Token): Position {
    let position = Position.load(holder.id + "_" + token.id);

    if (position == null) {
      position = new Position(holder.id + "_" + token.id);
      position.balance = BigInt.fromI32(0).toBigDecimal();
      position.holder = holder.id;
      position.token = token.id;
      position.save();
    }
    
    return <Position>position;
  }  

  static loadPieLog(transaction: string, token: Token, action: string, block: ethereum.Block): PieLog {
    let pieVault = PieLog.load(transaction + "_" + token.id);

    if (pieVault == null) {
      pieVault = new PieLog(transaction + "_" + token.id);
      pieVault.pieAddress = Address.fromString(token.id);
      pieVault.pieSymbol = token.symbol;
      pieVault.action = action;
      pieVault.block = block.number;
      pieVault.timestamp = block.timestamp;
      pieVault.amount = BigInt.fromI32(0).toBigDecimal();
      pieVault.amountUSD = BigInt.fromI32(0).toBigDecimal();
      pieVault.save();
    }
    
    return <PieLog>pieVault;
  }

  static loadTokenInPieTransaction(transaction: string, token: Token, pieLog: PieLog): TokenInPieTransaction {
    let tokenInPieTransaction = TokenInPieTransaction.load(transaction + "_" + token.id);

    if (tokenInPieTransaction == null) {
      tokenInPieTransaction = new TokenInPieTransaction(transaction + "_" + token.id);
      tokenInPieTransaction.price = BigInt.fromI32(0).toBigDecimal();
      tokenInPieTransaction.balance = BigInt.fromI32(0).toBigDecimal();
      tokenInPieTransaction.token = token.id;
      tokenInPieTransaction.pieLog = pieLog.id;
      tokenInPieTransaction.save();
    }
    
    return <TokenInPieTransaction>tokenInPieTransaction;
  }  
}