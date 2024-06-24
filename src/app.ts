import {ICache} from "./icache";
import {RedisCache} from "./redis-cache";

class App {
  private cache: ICache;

  constructor(cache: ICache) {
    this.cache = cache;
  }

  async run(): Promise<void> {
    await this.cache.set('myKey', 'myValue', 3600);
    const value = await this.cache.get('myKey');
    console.log('Cached Value:', value);
    await this.cache.delete('myKey');
    const deletedValue = await this.cache.get('myKey');
    console.log('Deleted Value:', deletedValue);
  }
}

// Dependency Injection or Factory Pattern can be used to instantiate the cache
const redisCache = new RedisCache();
const app = new App(redisCache);

app.run().then(() => {
  redisCache.close();
}).catch(err => {
  console.error('Error:', err);
  redisCache.close();
});