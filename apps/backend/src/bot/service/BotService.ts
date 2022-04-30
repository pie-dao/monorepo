/**
 * This service implements the logic of the Discord bot.
 */
export abstract class BotService {
  /**
   * Initialized the bot for reciving commands from Discord.
   */
  public abstract initialize();
  /**
   * Updates all the channels handled by the bot.
   */
  public abstract updateNAVChannels(): Promise<void>;
}
