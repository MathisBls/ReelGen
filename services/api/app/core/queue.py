from redis import Redis
from rq import Queue
from app.core.config import settings

redis = Redis.from_url(settings.redis_url)
queue = Queue("reelgen", connection=redis)
