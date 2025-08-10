from rq import Worker, Queue, Connection
from redis import Redis
from .utils import REDIS_URL

def run():
    with Connection(Redis.from_url(REDIS_URL)):
        w = Worker([Queue("reelgen")])
        w.work(with_scheduler=True)

if __name__ == "__main__":
    run()
